import {
  Controller,
  Get,
  Param,
  Res,
  NotFoundException,
} from '@nestjs/common';
import type { Response } from 'express';
import * as PDFDocument from 'pdfkit';
import moment from 'moment';
import { OrdersService } from './order.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // Download Invoice
  @Get(':id/invoice')
  async downloadInvoice(@Param('id') id: string, @Res() res: Response) {
    const order = await this.ordersService.findById(id);

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const user = order.userId as any; // populated user object

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=invoice-${order._id}.pdf`,
    );

    // Create PDF
    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(res);

    // 🧾 Header
    doc
      .fontSize(20)
      .text('INVOICE', { align: 'center' })
      .moveDown(1);

    doc
      .fontSize(12)
      .text(`Invoice ID: ${order._id}`)
      .text(`Date: ${moment(order.createdAt).format('DD MMM YYYY, h:mm A')}`)
      .moveDown(1);

    // 🧍 Customer info
    doc
      .fontSize(14)
      .text('Customer Details', { underline: true })
      .moveDown(0.5);

    doc
      .fontSize(12)
      .text(`Name: ${user?.name || 'N/A'}`)
      .text(`Email: ${user?.email || 'N/A'}`)
      .text(`Mobile: ${user?.mobile || 'N/A'}`)
      .moveDown(1);

    // 📦 Delivery address
    doc
      .fontSize(14)
      .text('Delivery Address', { underline: true })
      .moveDown(0.5);

    const addr = order.deliveryAddress;
    doc
      .fontSize(12)
      .text(`${addr.label}`)
      .text(`${addr.address}`)
      .text(`${addr.city}, ${addr.state}, ${addr.zip}`)
      .text(`${addr.country}`)
      .moveDown(1);

    // 🛍️ Items
    doc
      .fontSize(14)
      .text('Order Items', { underline: true })
      .moveDown(0.5);

    order.items.forEach((item, index) => {
      doc
        .fontSize(12)
        .text(
          `${index + 1}. ${item.name} (x${item.qty}) - ₹${item.price} each = ₹${
            item.price * item.qty
          }`,
        );
    });

    doc.moveDown(1);

    // 💰 Totals
    doc
      .fontSize(14)
      .text('Payment Summary', { underline: true })
      .moveDown(0.5);

    doc
      .fontSize(12)
      .text(`Subtotal: ₹${order.subtotal}`)
      .text(`Discount: ₹${order.discount}`)
      .text(`Tax: ₹${order.tax || 0}`)
      .text(`Total: ₹${order.total}`)
      .text(`Payment Method: ${order.paymentMethod}`)
      .text(`Payment Status: ${order.paymentStatus}`)
      .moveDown(2);

    doc
      .fontSize(10)
      .text('Thank you for shopping with us!', { align: 'center' });

    doc.end();
  }
}
