import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './Schemas/user.Schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  // Create a new user
  async create(data: {
    name: string;
    email: string;
    password: string;
    mobile: string;
    isVerified: boolean
  }): Promise<User> {
    const newUser = new this.userModel(data);
    return newUser.save();
  }

  // Find user by email
  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  // Find user by ID
  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  // Set reset token with expiry (for password reset)
  async setResetToken(email: string, token: string, expiry: Date): Promise<void> {
    await this.userModel.findOneAndUpdate(
      { email },
      { resetToken: token, resetTokenExpiry: expiry },
      { new: true }
    );
  }

  // Find user by reset token (and check expiry)
  async findByResetToken(token: string): Promise<User | null> {
    const user = await this.userModel.findOne({ resetToken: token }).exec();
    if (!user || (user.resetTokenExpiry && user.resetTokenExpiry < new Date())) {
      return null; // token expired or invalid
    }
    return user;
  }

  //Update password & clear token
  async updatePassword(email: string, hashedPassword: string): Promise<void> {
    await this.userModel.updateOne(
      { email },
      {
        $set: {
          password: hashedPassword,
          resetToken: null,
          resetTokenExpiry: null,
        },
      }
    );
  }

  // Optional helper to clear expired tokens
  async clearExpiredTokens(): Promise<void> {
    await this.userModel.updateMany(
      { resetTokenExpiry: { $lt: new Date() } },
      { $set: { resetToken: null, resetTokenExpiry: null } }
    );
  }
}
