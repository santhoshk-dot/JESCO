import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  // Linked user
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  // Delivery details
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

  // Order items
  @Prop({
    type: [
      {
        // productId: { type: Types.ObjectId, ref: 'Product', required: true },
         productId: { type: String, required: true },
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

  // Optional notes
  @Prop({ type: String })
  orderNotes?: string;

  // Amount details
  @Prop({ type: Number, required: true })
  subtotal: number;

  @Prop({ type: Number, default: 0 })
  discount: number;

  @Prop({ type: Number, required: true })
  total: number;

  // Delivery details
  @Prop({ type: Date, required: true })
  deliveryDate: Date;

  // Order status
  @Prop({
    type: String,
    enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Processing',
  })
  status: string;

  // Optional payment details (for future integration)
  @Prop({
    type: String,
    enum: ['Pending', 'Paid', 'Failed'],
    default: 'Pending',
  })
  paymentStatus: string;

  @Prop({
    type: String,
    enum: ['COD', 'Card', 'UPI', 'NetBanking'],
    default: 'COD',
  })
  paymentMethod: string;

   @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
