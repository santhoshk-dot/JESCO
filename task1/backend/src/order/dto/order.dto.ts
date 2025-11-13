import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsArray,
  ValidateNested,
  IsObject,
  IsDateString,
  IsEnum,
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

  // 🛒 Items
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  // 📝 Optional notes
  @IsOptional()
  @IsString()
  orderNotes?: string;

  // 💰 Prices
  @IsNumber()
  subtotal: number;

  @IsOptional()
  @IsNumber()
  discount?: number;

  @IsNumber()
  total: number;

  // 🚚 Delivery date
  @IsDateString()
  deliveryDate: string;

  // 💳 Payment Details — UPI ONLY
  @IsString()
  @IsIn(['UPI'], {
    message: "paymentMethod must be 'UPI'",
    })
    paymentMethod: 'UPI';

  @IsOptional()
  @IsIn(['Pending', 'Pending Verification', 'Verified', 'Failed'])
  paymentStatus?: 'Pending' | 'Pending Verification' | 'Verified' | 'Failed';

  // 📸 Screenshot path
  @IsOptional()
  @IsString()
  paymentProof?: string | null;

  // 🔐 Filled by backend
  @IsOptional()
  @IsString()
  userId?: string;
}
