/* eslint-disable prettier/prettier */
import { HttpException, NotFoundException } from '@nestjs/common/exceptions';
import { errorMessages } from 'src/config/message.config';
import { randomNumber } from 'src/common/utils/utils';
import { dateFormat } from 'src/config/date.config';
import { Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { isValidObjectId, Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductDocument } from './entities/product.entity';
import * as moment from 'moment';
import { User } from 'src/core/users/entities/user.entity';

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>) { }

  async create(createDto: CreateProductDto, user: User): Promise<Product> {
    try {
      const now = new Date();
      const fullDate = moment(now).format(dateFormat.format1);

      const categoryId = new mongoose.Types.ObjectId(createDto.category);
      const prodCode = 'P' + randomNumber(1000, 9999);

      const create = {
        shop: user?._id,
        category: categoryId,
        code: prodCode,
        name: createDto.name,
        description: createDto.description,
        price: createDto.price,
        createdAt: moment.utc(fullDate),
        updatedAt: moment.utc(fullDate)
      };

      const model = new this.productModel(create);
      const result = await model.save();

      if (result) {
        const prodId = (result?._id).toString();
        const product = await this.findOne(prodId);

        if (!product) {
          throw new NotFoundException(errorMessages[404]);
        }

        return product;
      }
    } catch (error) {
      if (error.status) {
        throw new HttpException(error.message, error.status);
      }

      throw new InternalServerErrorException(errorMessages[500]);
    }
  }

  async findAll(user: User): Promise<Product[]> {
    try {
      const populate = { path: 'category', select: '-_id name description', model: 'Category' };
      const shopId = new mongoose.Types.ObjectId(user?._id);
      const filter = { shop: shopId };
      const products = await this.productModel.find(filter).populate(populate).exec();

      return products;
    } catch (error) {
      throw new InternalServerErrorException(errorMessages[500]);
    }
  }

  async findOne(id: string): Promise<Product> {
    try {
      if (!isValidObjectId(id)) {
        throw new BadRequestException(errorMessages[400]);
      } else {
        const populate = { path: 'category', select: '_id name description', model: 'Category' };
        const product = await this.productModel.findById(id).populate(populate).exec();

        if (!product) {
          throw new NotFoundException(errorMessages[404]);
        }

        return product;
      }
    } catch (error) {
      if (error.status) {
        throw new HttpException(error.message, error.status);
      }

      throw new InternalServerErrorException(errorMessages[500]);
    }
  }

  async update(id: string, updateDto: UpdateProductDto): Promise<Product> {
    try {
      if (!isValidObjectId(id)) {
        throw new BadRequestException(errorMessages[400]);
      } else {
        const now = new Date();
        const fullDate = moment(now).format(dateFormat.format1);
        const update = { ...updateDto, updatedAt: moment.utc(fullDate) };
        const filter = { _id: id };
        const result = await this.productModel.updateOne(filter, update).exec();

        if (result.modifiedCount) {
          const product = await this.findOne(id);

          if (!product) {
            throw new NotFoundException(errorMessages[404]);
          }

          return product;
        }
      }
    } catch (error) {
      if (error.status) {
        throw new HttpException(error.message, error.status);
      }

      throw new InternalServerErrorException(errorMessages[500]);
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      if (!isValidObjectId(id)) {
        throw new BadRequestException(errorMessages[400]);
      } else {
        const filter = { _id: id };
        const result = await this.productModel.deleteOne(filter).exec();

        if (result.deletedCount) {
          return true;
        }

        return false;
      }
    } catch (error) {
      throw new InternalServerErrorException(errorMessages[500]);
    }
  }
}
