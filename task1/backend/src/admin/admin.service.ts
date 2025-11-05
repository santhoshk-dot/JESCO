import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/Schemas/user.Schema';
import { Order, OrderDocument } from '../order/Schemas/order.schema';
import { Product, ProductDocument } from '../products/Schemas/product.schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async getDashboardStats() {
    const [totalUsers, totalOrders, totalProducts, revenue] = await Promise.all([
      this.userModel.countDocuments(),
      this.orderModel.countDocuments(),
      this.productModel.countDocuments(),
      this.orderModel.aggregate([{ $group: { _id: null, total: { $sum: '$total' } } }]),
    ]);

    return {
      totalUsers,
      totalOrders,
      totalProducts,
      totalRevenue: revenue[0]?.total || 0,
    };
  }

  async getAllUsers() {
    return this.userModel.find().select('-password');
  }

  async deleteUser(id: string) {
    const user = await this.userModel.findByIdAndDelete(id);
    if (!user) throw new NotFoundException('User not found');
    return { message: 'User deleted successfully' };
  }
}
