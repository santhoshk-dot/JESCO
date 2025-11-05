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

  // 🆕 Create product
  async create(data: any) {
    const product = new this.productModel(data);
    return await product.save();
  }

  // 🔍 Get all products (with pagination, filtering, search)
  async findAll(options: ProductQueryOptions) {
    const { page = 1, limit = 20, search, category, brand } = options;

    const filters: Record<string, any> = {};

    if (search) {
      filters.name = { $regex: search, $options: 'i' }; // case-insensitive search
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
        .lean(), // better performance, returns plain JS objects
      this.productModel.countDocuments(filters),
    ]);

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  // 🔎 Find single product
  async findOne(id: string) {
    const product = await this.productModel.findById(id).lean();
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  // ✏️ Update product
  async update(id: string, data: any) {
    const product = await this.productModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  // 🗑️ Delete product
  async delete(id: string) {
    const product = await this.productModel.findByIdAndDelete(id);
    if (!product) throw new NotFoundException('Product not found');
    return { message: 'Product deleted successfully' };
  }
}
