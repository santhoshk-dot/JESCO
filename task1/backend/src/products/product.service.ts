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
      // Auto-generate id + slug if missing
      const id = data.id || uuidv4();
      const slug = data.slug || slugify(data.name);

      // Check for duplicate name or SKU
      const existing = await this.productModel.findOne({
        $or: [{ name: data.name }, { sku: data.sku }],
      });
      if (existing) {
        throw new BadRequestException(
          `Product with same name or SKU already exists.`,
        );
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
   * 📦 Get all products (public - supports pagination, filters, search)
   */
  async findAll(options: ProductQueryOptions) {
    const { page = 1, limit = 20, search, category, brand } = options;
    const filters: Record<string, any> = {};

    // 🔹 Search filter (case-insensitive)
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

    // Fetch paginated results
    const [data, total] = await Promise.all([
      this.productModel
        .find(filters)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),
      this.productModel.countDocuments(filters),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
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

    // Auto-update slug if name changes
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
