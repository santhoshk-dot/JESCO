import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/Schemas/user.Schema';
import { Order, OrderDocument } from '../order/Schemas/order.schema';
import { Product, ProductDocument } from '../products/Schemas/product.schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    @InjectModel(Product.name) private readonly productModel: Model<ProductDocument>,
  ) {}

  /**
   * 📊 Dashboard Analytics
   * Returns total counts and total revenue.
   */
  async getDashboardStats() {
    const [totalUsers, totalOrders, totalProducts, revenueAgg] = await Promise.all([
      this.userModel.countDocuments(),
      this.orderModel.countDocuments(),
      this.productModel.countDocuments(),
      this.orderModel.aggregate([
        { $group: { _id: null, totalRevenue: { $sum: '$total' } } },
      ]),
    ]);

    const totalRevenue = revenueAgg?.[0]?.totalRevenue || 0;

    return {
      totalUsers,
      totalOrders,
      totalProducts,
      totalRevenue,
    };
  }

  /**
   * 👥 Get all users (without passwords)
   */
  async getAllUsers() {
    return await this.userModel
      .find()
      .select('-password -__v')
      .sort({ createdAt: -1 })
      .lean();
  }

  /**
   * 🗑️ Delete a user by ID
   */
  async deleteUser(id: string) {
    const deletedUser = await this.userModel.findByIdAndDelete(id);
    if (!deletedUser) throw new NotFoundException('User not found');
    return { message: '🗑️ User deleted successfully', id };
  }
}
