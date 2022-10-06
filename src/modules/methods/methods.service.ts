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
      const isExist = await this.checkMethod(createDto.name, shop);

      if (isExist) {
        throw new ConflictException('ອີເມລນີ້ຖືກນຳໃຊ້ແລ້ວ, ກະລຸນາລອງອີເມລອື່ນ');
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
      throw new InternalServerErrorException(errorMessages[500]);
    }
  }
  async findAll(shop: any): Promise<Method[]> {
    try {
      const populate = { path: 'shop', select: 'name' };
      const filter = { shop: shop?._id };
      const sortBy: any = { name: 1 };
      const method = this.methodModel
        .find(filter)
        .populate(populate)
        .sort(sortBy)
        .exec();

      return method;
    } catch (error) {
      throw new InternalServerErrorException(errorMessages[500]);
    }
  }

  async findOne(id: string): Promise<Method> {
    try {
      if (!isValidObjectId(id)) {
        throw new BadRequestException(errorMessages[400]);
      } else {
        const populate = { path: 'shop', select: 'name' };
        const method = await this.methodModel
          .findById(id)
          .populate(populate)
          .exec();

        if (method) {
          return method;
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

  async update(id: string, updateDto: UpdateMethodDto, shop: any) {
    try {
      const isExist = await this.checkMethod(updateDto.name, shop);

      if (isExist) {
        throw new ConflictException('ອີເມລນີ້ຖືກນຳໃຊ້ແລ້ວ, ກະລຸນາລອງອີເມລອື່ນ');
      } else {
        if (!isValidObjectId(id)) {
          throw new BadRequestException(errorMessages[400]);
        } else {
          const now = new Date();
          const fullDate = moment(now).format(dateFormat.format1);
          const update = { ...updateDto, updatedAt: moment.utc(fullDate) };
          const filter = { _id: id };
          const resutl = await this.methodModel
            .updateOne(filter, update)
            .exec();

          if (resutl.modifiedCount) {
            const method = await this.findOne(id);

            if (method) {
              return method;
            }

            throw new NotFoundException(errorMessages[400]);
          }
        }
      }
    } catch (error) {
      if (error.status) throw new HttpException(error.message, error.status);
      throw new InternalServerErrorException(errorMessages[500]);
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      if (!isValidObjectId(id)) {
        throw new BadRequestException(errorMessages[400]);
      } else {
        const filter = { _id: id };
        const resutl = await this.methodModel.deleteOne(filter).exec();

        if (resutl.deletedCount) {
          return true;
        }

        return false;
      }
    } catch (error) {
      throw new InternalServerErrorException(errorMessages[500]);
    }
  }

  /// error
  async checkMethod(name: string, shop: any): Promise<number> {
    try {
      const filter = { name: name, shop: shop?._id };
      const count = await this.methodModel.countDocuments(filter).exec();
      return count;
    } catch (error) {
      throw new InternalServerErrorException('ບໍ່ສາມາດດຳເນີນການໄດ້!');
    }

  }
}
