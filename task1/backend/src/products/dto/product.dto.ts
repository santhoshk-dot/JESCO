import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsArray,
  IsObject,
  IsUUID,
  Min,
  Max,
} from 'class-validator';

export class CreateProductDto {
  @IsOptional()
  @IsUUID()
  _id?: string;

  @IsOptional()
  @IsUUID()
  id?: string;

  @IsString()
  name: string;

  @IsOptional() // ✅ Let backend auto-generate slug
  @IsString()
  slug?: string;

  @IsString()
  category: string;

  @IsString()
  brand: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  originalPrice: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsEnum(['active', 'inactive'])
  status?: 'active' | 'inactive';

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  medias?: string[];

  @IsOptional()
  @IsString()
  packageType?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  piecesPerBox?: number;

  @IsOptional()
  @IsBoolean()
  inStock?: boolean;

  @IsOptional()
  @IsObject()
  dimensions?: Record<string, any>;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  views?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  salesCount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  defaultRating?: number;
}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  originalPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsEnum(['active', 'inactive'])
  status?: 'active' | 'inactive';

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  medias?: string[];

  @IsOptional()
  @IsString()
  packageType?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  piecesPerBox?: number;

  @IsOptional()
  @IsBoolean()
  inStock?: boolean;

  @IsOptional()
  @IsObject()
  dimensions?: Record<string, any>;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  views?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  salesCount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  defaultRating?: number;
}
