import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Req,
  Res,
  NotFoundException,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import type { Response } from 'express';
import { OrdersService } from './order.service';
import { CreateOrderDto } from './dto/order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import PDFDocument from 'pdfkit';
import moment from 'moment';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  /**
   * 💰 Create new UPI order (Authenticated users only)
   * Supports optional payment screenshot upload
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('paymentProof', {
      storage: diskStorage({
        destination: './uploads/payment_proofs',
        filename: (req, file, callback) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const ext = path.extname(file.originalname);
          callback(null, `proof-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.startsWith('image/')) {
          return callback(
            new BadRequestException('Only image files are allowed as payment proof!'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async create(
    @UploadedFile() paymentProof: Express.Multer.File,
    @Body('order') orderString: string,
    @Req() req,
  ) {
    const userId = req.user?._id || req.user?.id;
    if (!userId) throw new BadRequestException('Missing user ID');
    if (!orderString) throw new BadRequestException('Missing order data');

    let parsedOrder: CreateOrderDto;
    try {
      parsedOrder = JSON.parse(orderString);
    } catch (err) {
      if (paymentProof && fs.existsSync(paymentProof.path)) fs.unlinkSync(paymentProof.path);
      throw new BadRequestException('Invalid JSON format in order data');
    }

    // ✅ Transform and validate DTO
    const dtoInstance = plainToInstance(CreateOrderDto, parsedOrder);
    const errors = await validate(dtoInstance);
    if (errors.length > 0) {
      if (paymentProof && fs.existsSync(paymentProof.path)) fs.unlinkSync(paymentProof.path);

      const formatted = errors.map((e) => ({
        property: e.property,
        constraints: e.constraints,
      }));
      throw new BadRequestException({
        message: 'Validation failed',
        errors: formatted,
      });
    }

    // ✅ Build final payload for DB
    const proofUrl = paymentProof
      ? `/uploads/payment_proofs/${paymentProof.filename}`
      : null;

    const orderData = {
      ...parsedOrder,
      userId: String(userId),
      paymentMethod: 'UPI' as const,
      paymentStatus: 'Pending Verification' as const,
      paymentProof: proofUrl,
    };

    return await this.ordersService.create(orderData);
  }

  /**
   * 👑 Admin: Get all orders
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  async findAll() {
    return await this.ordersService.findAll();
  }

  /**
   * 👤 Admin: Get all orders by user ID
   */
  @UseGuards(JwtAuthGuard)
  @Get('user/:userId')
  async findAllByUser(@Param('userId') userId: string) {
    return await this.ordersService.findAllByUser(userId);
  }

  /**
   * 👤 Current user: Get their own orders
   */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async findMyOrders(@Req() req) {
    const userId = req.user?._id || req.user?.id;
    return await this.ordersService.findAllByUser(String(userId));
  }

  /**
   * 🧾 Download invoice as PDF
   */
  @Get(':id/invoice')
  async downloadInvoice(@Param('id') id: string, @Res() res: Response) {
    const order = await this.ordersService.findById(id);
    if (!order) throw new NotFoundException('Order not found');

    const user = order.userId as any;
    const doc = new PDFDocument({ margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=invoice-${order._id}.pdf`,
    );
    doc.pipe(res);

    // Header
    doc.fontSize(20).text('INVOICE', { align: 'center' }).moveDown(1);
    doc
      .fontSize(12)
      .text(`Invoice ID: ${order._id}`)
      .text(`Date: ${moment(order.createdAt).format('DD MMM YYYY, h:mm A')}`)
      .moveDown(1);

    // Customer
    doc.fontSize(14).text('Customer Details', { underline: true }).moveDown(0.5);
    doc
      .fontSize(12)
      .text(`Name: ${user?.name || 'N/A'}`)
      .text(`Email: ${user?.email || 'N/A'}`)
      .text(`Mobile: ${user?.mobile || 'N/A'}`)
      .moveDown(1);

    // Address
    const addr = order.deliveryAddress;
    doc.fontSize(14).text('Delivery Address', { underline: true }).moveDown(0.5);
    doc
      .fontSize(12)
      .text(`${addr.label}`)
      .text(`${addr.address}`)
      .text(`${addr.city}, ${addr.state}, ${addr.zip}`)
      .text(`${addr.country}`)
      .moveDown(1);

    // Items
    doc.fontSize(14).text('Order Items', { underline: true }).moveDown(0.5);
    order.items.forEach((item, i) => {
      doc
        .fontSize(12)
        .text(
          `${i + 1}. ${item.name} (x${item.qty}) - ₹${item.price} each = ₹${
            item.price * item.qty
          }`,
        );
    });
    doc.moveDown(1);

    // Totals
    doc.fontSize(14).text('Payment Summary', { underline: true }).moveDown(0.5);
    doc
      .fontSize(12)
      .text(`Subtotal: ₹${order.subtotal}`)
      .text(`Discount: ₹${order.discount}`)
      .text(`Tax: ₹${order.tax || 0}`)
      .text(`Total: ₹${order.total}`)
      .text(`Payment Method: ${order.paymentMethod}`)
      .text(`Payment Status: ${order.paymentStatus}`)
      .moveDown(2);

    doc.fontSize(10).text('Thank you for shopping with us!', { align: 'center' });
    doc.end();
  }
}
