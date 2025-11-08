import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  Query,
  HttpCode,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { slugify } from '../utils/slugify';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt.guard';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  /**
   * 🧩 Create a new product (Admin only)
   */
  @Post()
  @HttpCode(201)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async create(@Body() data: CreateProductDto) {
    // ✅ Generate slug automatically if not provided
    if (!data.slug && data.name) {
      data.slug = slugify(data.name);
    }

    return await this.productService.create(data);
  }

  /**
   * 📦 Get all products (Public)
   * Supports pagination, filters, search, and sorting
   */
  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('brand') brand?: string,
    @Query('sort') sort?: string, // optional sorting key
  ) {
    return await this.productService.findAll({
      page,
      limit,
      search,
      category,
      brand,
      sort,
    });
  }

  /**
   * 🔍 Get a single product by ID (Public)
   */
  @UseGuards(OptionalJwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.productService.findOne(id);
  }

  /**
   * ✏️ Update product (Admin only)
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async update(@Param('id') id: string, @Body() data: UpdateProductDto) {
    // ✅ Auto-slugify if name changes
    if (data.name && !data.slug) {
      data.slug = slugify(data.name);
    }

    return await this.productService.update(id, data);
  }

  /**
   * 🗑️ Delete product (Admin only)
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async delete(@Param('id') id: string) {
    return await this.productService.delete(id);
  }
}
