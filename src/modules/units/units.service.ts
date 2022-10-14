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
import mongoose, { isValidObjectId, Model } from 'mongoose';
import { errorMessages } from 'src/config/message.config';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { Unit, UnitDocument } from './entities/unit.entity';
import * as moment from 'moment';
import { dateFormat } from 'src/config/date.config';

@Injectable()
export class UnitsService {
  constructor(
    @InjectModel(Unit.name)
    private unitModel: Model<UnitDocument>,
  ) { }
  async create(shop: any, createDto: CreateUnitDto,): Promise<Unit> {
    try {
      const isExist = await this.checkUnit(shop, createDto.code);
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

        const model = new this.unitModel(create);
        const result = await model.save();
        return result;
      }
    } catch (error) {
      if (error.status) throw new HttpException(error.message, error.status);
      throw new InternalServerErrorException(errorMessages[500]);
    }
  }

  async findAll(shop: any): Promise<Unit[]> {
    try {
      const populate = { path: 'shop', select: 'name' };
      const filter = { shop: shop?._id };
      const sortBy: any = { name: 1 };
      const units = await this.unitModel
        .find(filter)
        .populate(populate)
        .sort(sortBy)
        .exec();

      if (units) return units;
      throw new NotFoundException(errorMessages[404]);
    } catch (error) {
      if (error.status) throw new HttpException(error.message, error.status);
      throw new InternalServerErrorException(errorMessages[500]);
    }
  }

  async findOne(shop: any, id: string): Promise<Unit> {
    try {
      if (!isValidObjectId(id)) {
        throw new BadRequestException(errorMessages[400]);
      } else {
        const populate = { path: 'shop', select: 'name' };
        const filter = { shop: shop?._id, _id: id };
        const sortBy: any = { name: 1 };
        const unit = await this.unitModel
          .findOne(filter)
          .populate(populate)
          .sort(sortBy)
          .exec();

        if (unit) return unit;
        throw new NotFoundException(errorMessages[404]);
      }
    } catch (error) {
      if (error.status) throw new HttpException(error.message, error.status);
      throw new InternalServerErrorException(errorMessages[500]);
    }
  }

  async update(shop: any, id: string, updateDto: UpdateUnitDto): Promise<Unit> {
    try {
      const isExist = await this.checkUnit(shop, updateDto.code);
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
          const result = await this.unitModel
            .updateOne(filter, update)
            .exec();

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
        const result = await this.unitModel.deleteOne(filter).exec();

        if (result.deletedCount) return true;
        return false;
      }
    } catch (error) {
      throw new InternalServerErrorException(errorMessages[500]);
    }
  }

  async checkUnit(shop: any, code: string,): Promise<number> {
    try {
      const filter = { shop: shop?._id, code: code };
      const count = await this.unitModel.countDocuments(filter).exec();
      return count;
    } catch (error) {
      throw new InternalServerErrorException(errorMessages[500]);
    }
  }
}
