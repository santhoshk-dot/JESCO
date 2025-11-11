import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true }) // auto adds createdAt & updatedAt
export class Order {
  // 🔗 Linked user
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  // 🧾 Tax
  @Prop({ type: Number, default: 0 })
  tax: number;

  // 📦 Delivery Address
  @Prop({
    type: {
      label: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zip: { type: String, required: true },
      country: { type: String, required: true },
      default: { type: Boolean, default: false },
    },
    required: true,
  })
  deliveryAddress: {
    label: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    default?: boolean;
  };

  // 🛍️ Items
  @Prop({
    type: [
      {
        productId: { type: String, ref: 'Product', required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        qty: { type: Number, required: true },
      },
    ],
    required: true,
  })
  items: {
    productId: Types.ObjectId;
    name: string;
    price: number;
    qty: number;
  }[];

  // 📝 Notes
  @Prop({ type: String })
  orderNotes?: string;

  // 💰 Amount details
  @Prop({ type: Number, required: true })
  subtotal: number;

  @Prop({ type: Number, default: 0 })
  discount: number;

  @Prop({ type: Number, required: true })
  total: number;

  // 🚚 Delivery
  @Prop({ type: Date, required: true })
  deliveryDate: Date;

  // 📦 Order status
  @Prop({
    type: String,
    enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Processing',
  })
  status: string;

  // 💳 Payment method
  @Prop({
    type: String,
    enum: ['COD', 'Card', 'UPI', 'NetBanking'],
    default: 'UPI',
  })
  paymentMethod: string;

  // 💸 Payment status
  @Prop({
    type: String,
    enum: ['Pending', 'Pending Verification', 'Verified', 'Failed'],
    default: 'Pending Verification',
  })
  paymentStatus: string;

  // 📷 Proof of payment (image path or URL)
  @Prop({ type: String, default: null })
  paymentProof?: string | null;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
