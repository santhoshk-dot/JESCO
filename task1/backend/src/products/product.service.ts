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
    try {
      // Generate IDs and Slugs
      const id = data.id || uuidv4();
      const slug = data.slug || slugify(data.name);

      // Prevent duplicates
      const existing = await this.productModel.findOne({
        $or: [{ name: data.name }, { sku: data.sku }],
      });
      if (existing) {
        throw new BadRequestException('Product with same name or SKU already exists.');
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

      return await product.save();
    } catch (err) {
      console.error('❌ Error creating product:', err.message);
      throw err;
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

    // 🔍 Flexible search (case-insensitive)
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

    // 🔽 Determine sorting dynamically
    let sortOption: Record<string, 1 | -1> = { createdAt: -1 }; // default newest
    switch (sort) {
      case 'priceLowHigh':
        sortOption = { price: 1 };
        break;
      case 'priceHighLow':
        sortOption = { price: -1 };
        break;
      case 'stockLowHigh':
        sortOption = { stock: 1 };
        break;
      case 'stockHighLow':
        sortOption = { stock: -1 };
        break;
      case 'oldest':
        sortOption = { createdAt: 1 };
        break;
      default:
        sortOption = { createdAt: -1 }; // newest
        break;
    }

    // 🔹 Query the database
    const [data, total] = await Promise.all([
      this.productModel
        .find(filters)
        .skip(skip)
        .limit(limit)
        .sort(sortOption)
        .lean(),
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
   * 🔍 Get a single product by ID
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
    await product.save();
    return product;
  }

  /**
   * 🗑️ Delete a product (Admin only)
   */
  async delete(id: string) {
    const product = await this.productModel.findByIdAndDelete(id);
    if (!product) throw new NotFoundException('Product not found');
    return { message: '✅ Product deleted successfully' };
  }
}
