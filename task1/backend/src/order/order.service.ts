import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument } from './Schemas/order.schema';
import { CreateOrderDto } from './dto/order.dto';
import { UsersService } from '../users/users.service';
import axios from 'axios';
import twilio from 'twilio';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);
  private readonly twilioClient: twilio.Twilio;

  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    private readonly usersService: UsersService,
  ) {
    this.twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID!,
      process.env.TWILIO_AUTH_TOKEN!,
    );
  }

  /**
   * ✅ Create new order + send SMS confirmation
   */
  async create(data: CreateOrderDto & { userId: string }) {
    // Ensure `userId` is an ObjectId in DB
    const order = new this.orderModel({
      ...data,
      userId: new Types.ObjectId(data.userId),
      discount: data.discount || 0,
      paymentStatus: data.paymentStatus || 'Pending Verification',
      paymentMethod: data.paymentMethod || 'UPI',
      status: 'Processing',
    });

    const savedOrder = await order.save();

    // ✅ Fetch user details safely (convert ObjectId → string)
    try {
      const user = await this.usersService.findById(String(data.userId));

      if (!user) {
        this.logger.warn(`⚠️ User ${data.userId} not found.`);
        return savedOrder;
      }

      if (!user.mobile) {
        this.logger.warn(`⚠️ User ${user._id} has no mobile number.`);
        return savedOrder;
      }

      const userPhone = user.mobile.startsWith('+')
        ? user.mobile
        : `+91${user.mobile}`;

      const orderId = (savedOrder._id as Types.ObjectId).toString();
      await this.sendSmsNotification(user.name, userPhone, orderId);
    } catch (err: any) {
      this.logger.error(`❌ Failed to send SMS: ${err.message}`);
    }

    return savedOrder;
  }

  /**
   * ✅ Find all orders (Admin use)
   */
  async findAll() {
    return this.orderModel.find().populate('userId').sort({ createdAt: -1 });
  }

  /**
   * ✅ Get all orders for a specific user
   */
  async findAllByUser(userId: string) {
    const orders = await this.orderModel
      .find({ userId })
      .populate('userId', 'name email mobile')
      .sort({ createdAt: -1 })
      .lean<{
        _id: Types.ObjectId;
        userId: { name: string; email: string; mobile: string };
        deliveryAddress: any;
        subtotal: number;
        discount?: number;
        total: number;
        status: string;
        paymentStatus: string;
        deliveryDate: Date;
        createdAt: Date;
        items: { name: string; qty: number; price: number; productId: string }[];
      }[]>();

    return orders.map((order) => ({
      _id: order._id,
      deliveryAddress: order.deliveryAddress,
      orderNotes: (order as any).orderNotes || '',
      subtotal: order.subtotal,
      discount: order.discount || 0,
      total: order.total,
      status: order.status || 'Processing',
      paymentStatus: order.paymentStatus || 'Pending Verification',
      deliveryDate: order.deliveryDate,
      createdAt: order.createdAt,
      user: order.userId,
      items: order.items.map((item) => ({
        name: item.name,
        qty: item.qty,
        price: item.price,
        productId: item.productId,
        total: item.qty * item.price,
      })),
    }));
  }

  /**
   * ✅ Find single order (for invoice)
   */
  async findById(id: string) {
    return this.orderModel
      .findById(id)
      .populate('userId', 'name email mobile')
      .lean<{
        tax: number;
        paymentMethod: string;
        paymentStatus: string;
        _id: Types.ObjectId;
        userId: { name: string; email: string; mobile: string };
        createdAt: Date;
        deliveryAddress: any;
        subtotal: number;
        discount: number;
        total: number;
        items: { name: string; qty: number; price: number }[];
      }>();
  }

  /**
   * ✅ Send SMS notification (Twilio → Fast2SMS fallback)
   */
  private async sendSmsNotification(name: string, phone: string, orderId: string) {
    const message = `✅ Hi ${name}, your order #${orderId} has been placed successfully! Thank you for shopping with us.`;

    try {
      await this.twilioClient.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER!,
        to: phone,
      });
      this.logger.log(`📩 SMS sent to ${phone} via Twilio`);
    } catch (err: any) {
      this.logger.warn(`⚠️ Twilio failed: ${err.message}. Trying Fast2SMS...`);

      try {
        await axios.post(
          'https://www.fast2sms.com/dev/bulkV2',
          {
            route: 'v3',
            sender_id: 'TXTIND',
            message,
            language: 'english',
            flash: 0,
            numbers: phone.replace('+91', ''),
          },
          { headers: { authorization: process.env.FAST2SMS_API_KEY! } },
        );
        this.logger.log(`📩 SMS sent to ${phone} via Fast2SMS`);
      } catch (fallbackErr: any) {
        this.logger.error(`🚫 Both Twilio & Fast2SMS failed: ${fallbackErr.message}`);
      }
    }
  }
}
