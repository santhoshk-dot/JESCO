import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ default: 0, min: 0 })
  stock: number;

  @Prop({ default: 'active', enum: ['active', 'inactive'] })
  status: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ type: String, trim: true })
  category?: string;

  @Prop({ type: String, trim: true })
  brand?: string;

  @Prop({ type: Number, default: 0, min: 0, max: 5 })
  rating?: number;

  @Prop({ type: Boolean, default: false })
  featured?: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy?: Types.ObjectId;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
