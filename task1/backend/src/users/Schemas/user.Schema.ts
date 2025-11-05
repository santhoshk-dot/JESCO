import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  _id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, unique: true })
  mobile: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ type: String, default: null })
  resetToken: string | null;

  @Prop({ type: Date, default: null })
  resetTokenExpiry?: Date | null;

  // New fields for admin dashboard
  @Prop({
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  })
  role: 'user' | 'admin';

  @Prop({ default: true })
  isActive: boolean;

}

export const UserSchema = SchemaFactory.createForClass(User);
