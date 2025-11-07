import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ type: String, default: () => uuidv4() })
  _id: string;

  @Prop({ type: String, unique: true })
  id: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true })
  slug: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  brand: string;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ type: Number, required: true })
  originalPrice: number;

  @Prop({ type: Number, default: 0 })
  stock: number;

  @Prop({ type: String, enum: ['active', 'inactive'], default: 'active' })
  status: 'active' | 'inactive';

  @Prop({ type: String, default: '' })
  image: string;

  @Prop({ type: String, unique: true })
  sku: string;

  @Prop({ type: String, default: '' })
  description: string;

  @Prop({ type: [String], default: [] })
  medias: string[];

  @Prop({ type: String, default: 'PER 100 PKT' })
  packageType: string;

  @Prop({ type: Number, default: 0 })
  piecesPerBox: number;

  @Prop({ type: Boolean, default: true })
  inStock: boolean;

  @Prop({
    type: Object,
    default: {},
  })
  dimensions: Record<string, any>;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: Number, default: 0 })
  views: number;

  @Prop({ type: Number, default: 0 })
  salesCount: number;

  @Prop({ type: Number, default: 0 })
  defaultRating: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

// ✅ Optional: Add indexes for performance
ProductSchema.index({ name: 'text', brand: 'text', category: 'text' });
ProductSchema.index({ slug: 1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ brand: 1 });
