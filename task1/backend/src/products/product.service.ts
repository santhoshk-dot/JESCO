import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Product, ProductDocument } from './Schemas/product.schema';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { slugify } from '../utils/slugify';

interface ProductQueryOptions {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  brand?: string;
  sort?: string;
}

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  /**
   * 🆕 Create a new product (Admin only)
   */
  async create(data: CreateProductDto) {
    const id = data.id || uuidv4();
    const slug = data.slug || slugify(data.name);

    // 🧠 Duplicate check (by name or SKU)
    const existing = await this.productModel.findOne({
      $or: [{ name: data.name }, { sku: data.sku }],
    });
    if (existing) {
      throw new BadRequestException('A product with the same name or SKU already exists.');
    }

    const product = new this.productModel({
      ...data,
      id,
      slug,
      status: data.status || 'active',
      inStock: data.inStock ?? true,
      views: 0,
      salesCount: 0,
      defaultRating: data.defaultRating || 0,
    });

    try {
      return await product.save();
    } catch (err) {
      console.error('❌ Error creating product:', err);
      throw new BadRequestException('Failed to create product.');
    }
  }

  /**
   * 📦 Get all products (public - supports pagination, filters, search & sorting)
   */
  async findAll(options: ProductQueryOptions) {
    const {
      page = 1,
      limit = 20,
      search,
      category,
      brand,
      sort = 'newest',
    } = options;

    const filters: Record<string, any> = {};

    // 🔍 Text-based search (case-insensitive)
    if (search) {
      filters.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) filters.category = category;
    if (brand) filters.brand = brand;

    const skip = (page - 1) * limit;

    // 🔽 Dynamic sorting options
    const sortOption: Record<string, 1 | -1> = this.getSortOption(sort);

    // 🚀 Fetch paginated data efficiently
    const [data, total] = await Promise.all([
      this.productModel
        .find(filters)
        .skip(skip)
        .limit(limit)
        .sort(sortOption)
        .lean(), // improves performance (no mongoose overhead)
      this.productModel.countDocuments(filters),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      sort,
      filters: { category, brand, search },
    };
  }

  /**
   * 🔍 Fetch one product by ID
   */
  async findOne(id: string) {
    const product = await this.productModel.findById(id).lean();
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  /**
   * ✏️ Update an existing product (Admin only)
   */
  async update(id: string, data: UpdateProductDto) {
    const product = await this.productModel.findById(id);
    if (!product) throw new NotFoundException('Product not found');

    if (data.name && !data.slug) {
      data.slug = slugify(data.name);
    }

    Object.assign(product, data);
    try {
      await product.save();
      return product;
    } catch (err) {
      console.error('❌ Error updating product:', err);
      throw new BadRequestException('Failed to update product.');
    }
  }

  /**
   * 🗑️ Delete a product (Admin only)
   */
  async delete(id: string) {
    const product = await this.productModel.findByIdAndDelete(id);
    if (!product) throw new NotFoundException('Product not found');
    return { message: '✅ Product deleted successfully' };
  }

  /**
   * ⚙️ Private helper: map sort query to Mongoose field
   */
  private getSortOption(sort: string): Record<string, 1 | -1> {
    switch (sort) {
      case 'priceLowHigh':
        return { price: 1 };
      case 'priceHighLow':
        return { price: -1 };
      case 'stockLowHigh':
        return { stock: 1 };
      case 'stockHighLow':
        return { stock: -1 };
      case 'oldest':
        return { createdAt: 1 };
      default:
        return { createdAt: -1 }; // newest first
    }
  }
}
