import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Address, AddressDocument } from './Schemas/address.schema';
import { CreateAddressDto } from './dto/create-address.dto';

@Injectable()
export class AddressService {
  findOne(id: string): Address | PromiseLike<Address> {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectModel(Address.name) private addressModel: Model<AddressDocument>,
  ) {}

  async create(createAddressDto: CreateAddressDto): Promise<Address> {
    const newAddress = new this.addressModel(createAddressDto);
    return newAddress.save();
  }

  async findAll(): Promise<Address[]> {
    return this.addressModel.find().exec();
  }

  async findById(id: string): Promise<Address> {
    const address = await this.addressModel.findById(id).exec();
    if (!address) throw new NotFoundException('Address not found');
    return address;
  }

  async delete(id: string): Promise<void> {
    const result = await this.addressModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Address not found');
  }
}
