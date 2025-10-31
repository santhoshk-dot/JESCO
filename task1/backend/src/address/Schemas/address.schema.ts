import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AddressDocument = Address & Document;

@Schema({ timestamps: true })
export class Address {
  @Prop({ required: true })
  label: string; // Home / Office / Other

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  zip: string;

  @Prop({ required: true })
  country: string;

  @Prop({ default: false })
  default: boolean;

  @Prop({ type: String, required: false })
  userId?: string; // optional if you want per-user address tracking
}

export const AddressSchema = SchemaFactory.createForClass(Address);
