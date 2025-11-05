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
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto } from './dto/product,dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';

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
    return this.productService.create(data);
  }

  /**
   * 📦 Get all products (Public, supports pagination & search)
   */
  @Get()
  async findAll(
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 20,
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('brand') brand?: string,
  ) {
    return this.productService.findAll({ page, limit, search, category, brand });
    }


  /**
   * 🔍 Get a single product by ID (Public)
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  /**
   * ✏️ Update a product (Admin only)
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async update(@Param('id') id: string, @Body() data: UpdateProductDto) {
    return this.productService.update(id, data);
  }

  /**
   * 🗑️ Delete a product (Admin only)
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async delete(@Param('id') id: string) {
    return this.productService.delete(id);
  }
}
