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
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private readonly usersService: UsersService,
  ) {
    this.twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN,
    );
  }

  //Create order + send confirmation SMS dynamically   
  async create(data: CreateOrderDto & { userId: string }) {
    const newOrder = new this.orderModel({
      ...data,
      discount: data.discount || 0,
      userId: new Types.ObjectId(data.userId),
    });

    const savedOrder = (await newOrder.save()) as Order & { _id: string };

    try {

      //Fetch user
      const user = await this.usersService.findById(data.userId);
      if (!user) {
        this.logger.warn(`User ${data.userId} not found.`);
        return savedOrder;
      }

      //Use the correct field (mobile)
      const userPhone = user.mobile?.startsWith('+')
        ? user.mobile
        : `+91${user.mobile}`;

      if (!user.mobile) {
        this.logger.warn(`User ${user._id} has no mobile number.`);
        return savedOrder;
      }

      // Send confirmation SMS
    await this.sendSmsNotification(user.name, userPhone, savedOrder._id);
    } catch (err) {
      this.logger.error(`❌ Failed to send order SMS: ${err.message}`);
    }

    return savedOrder;
  }

  // SMS sender (Twilio → fallback to Fast2SMS)
  private async sendSmsNotification(name: string, phone: string, orderId: string) {
    const message = `✅ Hi ${name}, your order #${orderId} 
    has been placed successfully! Thank you for shopping with us.`;

    try {
      // ---- Twilio ----
      await this.twilioClient.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone,
      });
      this.logger.log(`📩 SMS sent to ${phone} via Twilio`);
    } catch (err) {
      this.logger.warn(`⚠️ Twilio failed: ${err.message}, using Fast2SMS fallback...`);

      try {
        // ---- Fast2SMS fallback ----
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
          {
            headers: { authorization: process.env.FAST2SMS_API_KEY },
          },
        );
        this.logger.log(`📩 SMS sent to ${phone} via Fast2SMS`);
      } catch (fallbackErr) {
        this.logger.error(`🚫 SMS sending failed completely: ${fallbackErr.message}`);
      }
    }
  }

  //  Fetch all orders for a user
  async findAllByUser(userId: string) {
    const orders = await this.orderModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    return orders.map((order) => ({
      _id: order._id,
      deliveryAddress: order.deliveryAddress,
      orderNotes: order.orderNotes || '',
      subtotal: order.subtotal,
      discount: order.discount || 0,
      total: order.total,
      status: order.status || 'Processing',
      deliveryDate: order.deliveryDate,
      createdAt: order.createdAt,
      items: order.items.map((item) => ({
        name: item.name,
        qty: item.qty,
        price: item.price,
        productId: item.productId,
        total: item.qty * item.price,
      })),
    }));
  }
}
