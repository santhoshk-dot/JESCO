import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './Schemas/product.schema';

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

  // 🆕 Create a new product (Admin only)
  async create(data: any) {
    const product = new this.productModel(data);
    return await product.save();
  }

  // 🔍 Get all products (public - supports pagination, filters, search)
  async findAll(options: ProductQueryOptions) {
    const { page = 1, limit = 20, search, category, brand } = options;
    const filters: Record<string, any> = {};

    // 🔹 Full-text search by name, category, or brand
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

  // 🔎 Get a single product by ID
  async findById(id: string) {
    const product = await this.productModel.findById(id).lean();
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  // ✏️ Update an existing product (Admin only)
  async update(id: string, data: any) {
    const product = await this.productModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  // 🗑️ Delete product (Admin only)
  async remove(id: string) {
    const product = await this.productModel.findByIdAndDelete(id);
    if (!product) throw new NotFoundException('Product not found');
    return { message: 'Product deleted successfully' };
  }
}
