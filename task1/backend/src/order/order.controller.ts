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

  // --------------------------------------------------------
  // 📌 CREATE ORDER (UPI + Payment proof)
  // --------------------------------------------------------
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('paymentProof', {
      storage: diskStorage({
        destination: './uploads/payment_proofs',
        filename: (_, file, callback) => {
          const ext = path.extname(file.originalname);
          callback(
            null,
            `proof-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`,
          );
        },
      }),
      fileFilter: (_, file, callback) => {
        if (!file.mimetype.startsWith('image/')) {
          return callback(
            new BadRequestException('Only image files allowed!'),
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

    if (!userId) throw new BadRequestException('User ID missing');
    if (!orderString) throw new BadRequestException('Order JSON missing');

    // Parse JSON
    let parsed: CreateOrderDto;
    try {
      parsed = JSON.parse(orderString);
    } catch (_) {
      if (paymentProof) fs.unlinkSync(paymentProof.path);
      throw new BadRequestException('Invalid order JSON format');
    }

    // Validate DTO manually (multipart/form-data bypasses pipes)
    const dto = plainToInstance(CreateOrderDto, parsed);
    const errors = await validate(dto);

    if (errors.length > 0) {
      if (paymentProof) fs.unlinkSync(paymentProof.path);

      throw new BadRequestException({
        message: 'Validation failed',
        details: errors.map((e) => ({
          property: e.property,
          constraints: e.constraints,
        })),
      });
    }

    // Payment proof URL (if uploaded)
    const proofUrl = paymentProof
      ? `/uploads/payment_proofs/${paymentProof.filename}`
      : null;

    // FINAL DATA sent to service
    const orderData: CreateOrderDto & {
      userId: string;
      paymentMethod: 'UPI';
      paymentStatus: 'Pending Verification';
      paymentProof: string | null;
    } = {
      ...parsed,
      userId: String(userId),
      paymentMethod: 'UPI',                 // strict literal type
      paymentStatus: 'Pending Verification',
      paymentProof: proofUrl,
    };

    return this.ordersService.create(orderData);
  }

  // --------------------------------------------------------
  // 📌 ADMIN: Get all orders
  // --------------------------------------------------------
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  async findAll() {
    return this.ordersService.findAll();
  }

  // --------------------------------------------------------
  // 📌 USER: Get own orders
  // --------------------------------------------------------
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async findMyOrders(@Req() req) {
    const userId = req.user?._id || req.user?.id;
    return this.ordersService.findAllByUser(String(userId));
  }

  // --------------------------------------------------------
  // 📌 ADMIN: Get orders by user ID
  // --------------------------------------------------------
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('user/:userId')
  async findOrdersByUser(@Param('userId') userId: string) {
    return this.ordersService.findAllByUser(userId);
  }

  // --------------------------------------------------------
  // 📌 DOWNLOAD INVOICE PDF
  // --------------------------------------------------------
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

    // Invoice Header
    doc.fontSize(20).text('INVOICE', { align: 'center' }).moveDown();
    doc
      .fontSize(12)
      .text(`Invoice ID: ${order._id}`)
      .text(`Date: ${moment(order.createdAt).format('DD MMM YYYY, h:mm A')}`)
      .moveDown();

    // Customer details
    doc.fontSize(14).text('Customer Details', { underline: true }).moveDown();
    doc
      .fontSize(12)
      .text(`Name: ${user?.name}`)
      .text(`Email: ${user?.email}`)
      .text(`Mobile: ${user?.mobile}`)
      .moveDown();

    // Delivery address
    const addr = order.deliveryAddress;
    doc.fontSize(14).text('Delivery Address', { underline: true }).moveDown();
    doc
      .fontSize(12)
      .text(addr.label)
      .text(addr.address)
      .text(`${addr.city}, ${addr.state} - ${addr.zip}`)
      .moveDown();

    // Order items
    doc.fontSize(14).text('Order Items', { underline: true }).moveDown();
    order.items.forEach((item, i) => {
      doc.fontSize(12).text(
        `${i + 1}. ${item.name} × ${item.qty} = ₹${item.qty * item.price}`,
      );
    });

    doc.moveDown();

    // Payment Summary
    doc.fontSize(14).text('Payment Summary', { underline: true }).moveDown();
    doc
      .fontSize(12)
      .text(`Subtotal: ₹${order.subtotal}`)
      .text(`Discount: ₹${order.discount}`)
      .text(`Total: ₹${order.total}`)
      .text(`Payment Method: ${order.paymentMethod}`)
      .text(`Payment Status: ${order.paymentStatus}`)
      .moveDown(2);

    doc.text('Thank you for shopping with us!', { align: 'center' });

    doc.end();
  }
}
