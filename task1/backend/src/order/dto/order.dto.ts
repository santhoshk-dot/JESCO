import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsArray,
  ValidateNested,
  IsObject,
  IsDateString,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';

class DeliveryAddressDto {
  @IsString()
  @IsNotEmpty()
  label: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  zip: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsOptional()
  default?: boolean;
}

class OrderItemDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  price: number;

  @IsNumber()
  qty: number;
}

export class CreateOrderDto {
  // 🏠 Delivery details
  @IsObject()
  @ValidateNested()
  @Type(() => DeliveryAddressDto)
  deliveryAddress: DeliveryAddressDto;

  // 🛍️ Ordered items
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  // 📝 Optional notes
  @IsOptional()
  @IsString()
  orderNotes?: string;

  // 💰 Financial summary
  @IsNumber()
  subtotal: number;

  @IsOptional()
  @IsNumber()
  discount?: number;

  @IsNumber()
  total: number;

  // 🚚 Delivery
  @IsDateString()
  deliveryDate: string;

  // 💳 Payment Details
  @IsOptional()
  @IsString()
  paymentMethod?: 'UPI' | 'COD' | 'Card' | 'NetBanking';

  @IsOptional()
  @IsIn(['Pending', 'Pending Verification', 'Verified', 'Failed'])
  paymentStatus?: string;

  // 📷 Proof of payment (optional path or URL)
  @IsOptional()
  @IsString()
  paymentProof?: string | null;

  //Internal — backend fills this
  @IsOptional()
  @IsString()
  userId?: string;
}
