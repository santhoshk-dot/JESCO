import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './Schemas/user.Schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  /** 👤 Create a new user (supports role & verification) */
  async create(data: {
    name: string;
    email: string;
    password: string;
    mobile: string;
    isVerified?: boolean;
    role?: 'user' | 'admin';
  }): Promise<User> {
    const newUser = new this.userModel({
      ...data,
      role: data.role || 'user', // fallback to 'user' if undefined
    });
    return await newUser.save();
  }

    async findAll() {
    return this.userModel.find().select('-password').sort({ createdAt: -1 });
  }


  /** 🔍 Find user by email */
  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  /** 🔍 Find user by ID */
  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  /** 🔐 Set reset token with expiry (for password reset) */
  async setResetToken(email: string, token: string, expiry: Date): Promise<void> {
    await this.userModel.findOneAndUpdate(
      { email },
      { resetToken: token, resetTokenExpiry: expiry },
      { new: true },
    );
  }

  /** 🧾 Find user by reset token */
  async findByResetToken(token: string): Promise<User | null> {
    const user = await this.userModel.findOne({ resetToken: token }).exec();
    if (!user || (user.resetTokenExpiry && user.resetTokenExpiry < new Date())) {
      return null;
    }
    return user;
  }

  /** 🔁 Update password & clear reset token */
  async updatePassword(email: string, hashedPassword: string): Promise<void> {
    await this.userModel.updateOne(
      { email },
      {
        $set: {
          password: hashedPassword,
          resetToken: null,
          resetTokenExpiry: null,
        },
      },
    );
  }

  /** 🧹 Optional cleanup: clear expired reset tokens */
  async clearExpiredTokens(): Promise<void> {
    await this.userModel.updateMany(
      { resetTokenExpiry: { $lt: new Date() } },
      { $set: { resetToken: null, resetTokenExpiry: null } },
    );
  }
}
