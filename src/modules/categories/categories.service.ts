/* eslint-disable prettier/prettier */
import { ConflictException, HttpException, NotFoundException } from '@nestjs/common/exceptions';
import { dateFormat } from './../../config/date.config';
import { Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { isValidObjectId, Model } from 'mongoose';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category, CategoryDocument } from './entities/category.entity';
import * as moment from 'moment';
import { errorMessages } from 'src/config/message.config';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>
  ) { }

  async create(shop: any, createDto: CreateCategoryDto): Promise<Category> {
    try {
      const isExist = await this.checkName(createDto.name, shop);
      if (isExist) {
        throw new ConflictException(errorMessages[409]);
      } else {
        const now = new Date();
        const fullDate = moment(now).format(dateFormat.format1);
        const shopId = new mongoose.Types.ObjectId(shop?._id);

        const create = {
          ...createDto,
          shop: shopId,
          createdAt: moment.utc(fullDate),
          updatedAt: moment.utc(fullDate)
        }
        const model = new this.categoryModel(create);
        const result = await model.save();
        return result;
      }
    } catch (error) {
      if (error.status) {
        throw new HttpException(error.message, error.status);
      }
      throw new InternalServerErrorException(errorMessages[500]);
    }
  }

  async findAll(shop: any): Promise<Category[]> {
    try {
      const populate = { path: 'shop', select: 'name' };
      const filter = { shop: shop?._id };
      const sortBy: any = { name: 1 };
      const categories = this.categoryModel.find(filter)
        .populate(populate).sort(sortBy).exec();

      return categories;
    } catch (error) {
      throw new InternalServerErrorException(errorMessages[500]);
    }
  }

  async findOne(id: string): Promise<Category> {
    try {
      if (!isValidObjectId(id)) {
        throw new BadRequestException(errorMessages[400]);
      } else {
        const populate = { path: 'shop', select: 'name' };
        const category = await this.categoryModel.findById(id)
          .populate(populate).exec();
        if (category) {
          return category;
        }
        throw new NotFoundException(errorMessages[404]);
      }
    } catch (error) {
      if (error.status) {
        throw new HttpException(error.message, error.status);
      }

      throw new InternalServerErrorException(errorMessages[500]);
    }
  }

  async update(shop: any, id: string, updateDto: UpdateCategoryDto) {
    try {
      const isExist = await this.checkName(updateDto.name, shop);
      if (!isValidObjectId(id)) {
        throw new BadRequestException(errorMessages[400]);
      } else if (isExist) {
        throw new ConflictException(errorMessages[409]);
      } else {
        const now = new Date();
        const fullDate = moment(now).format(dateFormat.format1);
        const update = { ...updateDto, updatedAt: moment.utc(fullDate) };
        const filter = { _id: id };
        const result = await this.categoryModel.updateOne(filter, update).exec();

        if (result.modifiedCount) {
          const category = await this.findOne(id);

          if (category) {
            return category;
          }

          throw new NotFoundException(errorMessages[400]);
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
        const resutl = await this.categoryModel.deleteOne(filter).exec();

        if (resutl.deletedCount) {
          return true;
        }

        return false;
      }
    } catch (error) {
      throw new InternalServerErrorException(errorMessages[500]);
    }
  }

  async checkName(name: string, shop: any): Promise<number> {
    try {
      const filter = { name: name, shop: shop?._id };
      const count = await this.categoryModel.countDocuments(filter).exec();
      return count;
    } catch (error) {
      throw new InternalServerErrorException(errorMessages[500]);
    }
  }
}
