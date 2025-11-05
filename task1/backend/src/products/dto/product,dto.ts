import { IsString, IsNumber, IsOptional, IsArray, IsBoolean } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsBoolean()
  inStock?: boolean;
}

export class UpdateProductDto extends CreateProductDto {}
