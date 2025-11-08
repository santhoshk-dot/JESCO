import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  /** Internal Mongo ID (UUID) */
  @Prop({ type: String, default: () => uuidv4() })
  _id: string;

  /** Public product ID — also UUID */
  @Prop({ type: String, unique: true, default: () => uuidv4() })
  id: string;

  /** Product name */
  @Prop({ required: true, trim: true })
  name: string;

  /** SEO-friendly slug */
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  slug: string;

  /** Category name */
  @Prop({ required: true, trim: true })
  category: string;

  /** Brand name */
  @Prop({ required: true, trim: true })
  brand: string;

  /** Selling price */
  @Prop({ type: Number, required: true, min: 0 })
  price: number;

  /** Original / MRP price */
  @Prop({ type: Number, required: true, min: 0 })
  originalPrice: number;

  /** Current stock count */
  @Prop({ type: Number, default: 0, min: 0 })
  stock: number;

  /** Product status */
  @Prop({ type: String, enum: ['active', 'inactive'], default: 'active' })
  status: 'active' | 'inactive';

  /** Thumbnail image */
  @Prop({ type: String, default: '' })
  image: string;

  /** SKU (must be unique for inventory tracking) */
  @Prop({ type: String, unique: true, sparse: true }) // ✅ sparse avoids index conflicts on empty SKUs
  sku: string;

  /** Description text (HTML or plain) */
  @Prop({ type: String, default: '' })
  description: string;

  /** Gallery or extra media URLs */
  @Prop({ type: [String], default: [] })
  medias: string[];

  /** Package type label (e.g. "PER 100 PKT") */
  @Prop({ type: String, default: 'PER 100 PKT' })
  packageType: string;

  /** Pieces per box or pack */
  @Prop({ type: Number, default: 0, min: 0 })
  piecesPerBox: number;

  /** Whether the product is in stock */
  @Prop({ type: Boolean, default: true })
  inStock: boolean;

  /** Optional dimensional data */
  @Prop({ type: Object, default: {} })
  dimensions: Record<string, any>;

  /** Search tags */
  @Prop({ type: [String], default: [] })
  tags: string[];

  /** Analytics fields */
  @Prop({ type: Number, default: 0, min: 0 })
  views: number;

  @Prop({ type: Number, default: 0, min: 0 })
  salesCount: number;

  @Prop({ type: Number, default: 0, min: 0, max: 5 })
  defaultRating: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

// ✅ Indexes for search & filtering performance
ProductSchema.index({ name: 'text', brand: 'text', category: 'text' });
ProductSchema.index({ slug: 1 }, { unique: true });
ProductSchema.index({ category: 1 });
ProductSchema.index({ brand: 1 });
ProductSchema.index({ price: 1 });
