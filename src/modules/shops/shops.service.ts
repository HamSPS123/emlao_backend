/* eslint-disable prettier/prettier */
import { HttpException, NotFoundException } from '@nestjs/common/exceptions';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { isValidObjectId, Model } from 'mongoose';
import * as moment from 'moment';
import { dateFormat } from 'src/config/date.config';
import { errorMessages } from 'src/config/message.config';
import { Shop, ShopDocument } from './entities/shop.entity';
import { CreateUserDto } from 'src/core/users/dto/create-user.dto';

@Injectable()
export class ShopsService {
  constructor(@InjectModel(Shop.name) private shopModel: Model<ShopDocument>) { }

  async create(createDto: CreateUserDto): Promise<Shop> {
    try {
      const now = new Date()
      const fullDate = moment(now).format(dateFormat.format1);

      const create = Object.assign({
        ...createDto,
        createdAt: moment.utc(fullDate),
        updatedAt: moment.utc(fullDate)
      });

      const model = new this.shopModel(create);
      const result = await model.save();

      return result;
    } catch (error) {
      throw new InternalServerErrorException(errorMessages[500]);
    }
  }

  async findAll(): Promise<Shop[]> {
    try {
      const populate = {path: 'account', select: 'accountNo pin username role'}
      const shops = await this.shopModel.find().populate(populate).exec();

      if(!shops){
        throw new NotFoundException(errorMessages[404]);
      }

      return shops;
    } catch (error) {
      if(error.status) throw new HttpException(error.message, error.status);
      
      throw new InternalServerErrorException(errorMessages[500])
    }
  }

  async findOne(id: string): Promise<Shop> {
    try {
      if (!isValidObjectId(id)) {
        throw new BadRequestException(errorMessages[400]);
      } else {
        const accountId = new mongoose.Types.ObjectId(id);
        const select = 'accountNo pin username role';
        const populate = { path: 'account', select: select };
        const filter = { account: accountId };
        const customer = await this.shopModel.findOne(filter)
          .populate(populate).exec();

        if (!customer) {
          throw new NotFoundException(errorMessages[404]);
        }

        return customer;
      }

    } catch (error) {
      console.log(error);

      if (error.status) {
        throw new HttpException(error.message, error.status);
      }

      throw new InternalServerErrorException(errorMessages[500]);
    }
  }

  async searchOne(query: string) {
    try {
      const search = query
      const rgx = (pattern) => new RegExp(`.*${pattern}.*`);
      const searchRgx = rgx(search);
      const result = await this.shopModel.aggregate([
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "shop",
            as: "products",
          }
        },
        { $unwind: '$products' },
        {
          $lookup: {
            from: "categories",
            localField: "products.category",
            foreignField: "_id",
            as: "categories"
          }
        },
        { $unwind: '$categories' },
        {
          $match: {
            $or: [
              {
                'name': { $regex: searchRgx, $options: "i" },
              },
              {
                'products.name': { $regex: searchRgx, $options: "i" },
              },
              {
                'products.name': { $regex: searchRgx, $options: "i" },
              }
            ]
          }
        },
        {
          $project: {
            'name': 1,
            productName: '$products.name',
            categoryName: '$categories.name'
          }
        }
      ])



      if (!result) {
        throw new NotFoundException(errorMessages[404]);
      }
      return result;

    } catch (error) {
      console.log(error);

      if (error.status) {
        throw new HttpException(error.message, error.status);
      }
      throw new InternalServerErrorException(errorMessages[500]);
    }
  }
}
