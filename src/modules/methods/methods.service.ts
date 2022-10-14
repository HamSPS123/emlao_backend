/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as moment from 'moment';
import mongoose, { isValidObjectId, Model } from 'mongoose';
import { dateFormat } from 'src/config/date.config';
import { errorMessages } from 'src/config/message.config';
import { CreateMethodDto } from './dto/create-method.dto';
import { UpdateMethodDto } from './dto/update-method.dto';
import { Method, MethodDocument } from './entities/method.entity';

@Injectable()
export class MethodsService {
  constructor(
    @InjectModel(Method.name) private methodModel: Model<MethodDocument>,
  ) { }

  async create(shop: any, createDto: CreateMethodDto): Promise<Method> {
    try {
      const isExist = await this.checkMethod(shop, createDto.name);
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
          updatedAt: moment.utc(fullDate),
        };

        const model = new this.methodModel(create);
        const result = await model.save();
        return result;
      }
    } catch (error) {
      if (error.status) throw new HttpException(error.message, error.status);
      throw new InternalServerErrorException(errorMessages[500]);
    }
  }

  async findAll(shop: any): Promise<Method[]> {
    try {
      const populate = { path: 'shop', select: 'name' };
      const filter = { shop: shop?._id };
      const sortBy: any = { name: 1 };
      const method = await this.methodModel
        .find(filter)
        .populate(populate)
        .sort(sortBy)
        .exec();

      if (method) return method;
      throw new NotFoundException(errorMessages[404]);
    } catch (error) {
      if (error.status) throw new HttpException(error.message, error.status);
      throw new InternalServerErrorException(errorMessages[500]);
    }
  }

  async findOne(shop: any, id: string): Promise<Method> {
    try {
      if (!isValidObjectId(id)) {
        throw new BadRequestException(errorMessages[400]);
      } else {
        const populate = { path: 'shop', select: 'name' };
        const filter = { shop: shop?._id, _id: id };
        const sortBy: any = { name: 1 };
        const method = await this.methodModel
          .findOne(filter)
          .populate(populate)
          .sort(sortBy)
          .exec();

        if (method) return method;
        throw new NotFoundException(errorMessages[404]);
      }
    } catch (error) {
      if (error.status) throw new HttpException(error.message, error.status);
      throw new InternalServerErrorException(errorMessages[500]);
    }
  }

  async update(shop: any, id: string, updateDto: UpdateMethodDto): Promise<Method> {
    try {
      const isExist = await this.checkMethod(shop, updateDto.name);

      if (isExist) {
        throw new ConflictException(errorMessages[409]);
      } else {
        if (!isValidObjectId(id)) {
          throw new BadRequestException(errorMessages[400]);
        } else {
          const now = new Date();
          const fullDate = moment(now).format(dateFormat.format1);
          const update = { ...updateDto, updatedAt: moment.utc(fullDate) };
          const filter = { shop: shop?._id, _id: id };
          const result = await this.methodModel.updateOne(filter, update).exec();

          if (result.modifiedCount) {
            const method = await this.findOne(shop, id);

            if (method) return method;
            throw new NotFoundException(errorMessages[404]);
          }
        }
      }
    } catch (error) {
      if (error.status) throw new HttpException(error.message, error.status);
      throw new InternalServerErrorException(errorMessages[500]);
    }
  }

  async remove(shop: any, id: string): Promise<boolean> {
    try {
      if (!isValidObjectId(id)) {
        throw new BadRequestException(errorMessages[400]);
      } else {
        const filter = { shop: shop?._id, _id: id };
        const result = await this.methodModel.deleteOne(filter).exec();

        if (result.deletedCount) return true;
        return false;

      }
    } catch (error) {
      throw new InternalServerErrorException(errorMessages[500]);
    }
  }

  async checkMethod(shop: any, name: string): Promise<number> {
    try {
      const filter = { shop: shop?._id, name: name };
      const count = await this.methodModel.countDocuments(filter).exec();
      return count;
    } catch (error) {
      throw new InternalServerErrorException(errorMessages[500]);
    }
  }
}
