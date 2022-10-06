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
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { Stock, StockDocument } from './entities/stock.entity';
import * as moment from 'moment';
import { dateFormat } from 'src/config/date.config';

@Injectable()
export class StocksService {
  constructor(
    @InjectModel(Stock.name)
    private stockModel: Model<StockDocument>,
  ) { }

  async create(createDto: CreateStockDto) {
    try {
      const isExist = await this.checkProduct(createDto.product);

      if (isExist) {
        throw new ConflictException(errorMessages[409]);
      } else {
        const now = new Date();
        const fullDate = moment(now).format(dateFormat.format1);
        const productId = new mongoose.Types.ObjectId(createDto.product);
        const unitId = new mongoose.Types.ObjectId(createDto.unit);

        const create = {
          product: productId,
          unit: unitId,
          quantity: createDto.quantity,
          alert: createDto.alert,
          createdAt: moment.utc(fullDate),
          updatedAt: moment.utc(fullDate),
        };

        const model = new this.stockModel(create);
        const result = await model.save();

        if (result) {
          const id = result._id.toString();
          const stock = await this.findOne(id);

          if (stock) return stock;

          throw new NotFoundException(errorMessages[404]);
        }
      }
    } catch (error) {
      if (error.status) throw new HttpException(error.message, error.status);
      throw new InternalServerErrorException(errorMessages[500]);
    }
  }

  async findAll() {
    try {
      const product = {
        path: 'product',
        select: '_id code qrcode name description price',
        model: 'Product',
      };
      const unit = {
        path: 'unit',
        select: '_id code name description',
        model: 'Unit',
      };
      const stock = await this.stockModel
        .find()
        .populate(product)
        .populate(unit)
        .exec();

      return stock;
    } catch (error) {
      throw new InternalServerErrorException(errorMessages[500]);
    }
  }

  async findOne(id: string) {
    try {
      const product = {
        path: 'product',
        select: '_id code qrcode name description price',
        model: 'Product',
      };
      const unit = {
        path: 'unit',
        select: '_id code name description',
        model: 'Unit',
      };
      const stock = await this.stockModel
        .findById(id)
        .populate(product)
        .populate(unit)
        .exec();

      return stock;
    } catch (error) {
      console.log(error);

      throw new InternalServerErrorException(errorMessages[500]);
    }
  }

  async update(id: string, updateDto: UpdateStockDto) {
    try {
      if (!isValidObjectId(id)) {
        throw new BadRequestException(errorMessages[400]);
      } else {
        const now = new Date();
        const fullDate = moment(now).format(dateFormat.format1);
        const productId = new mongoose.Types.ObjectId(updateDto.product);
        const unitId = new mongoose.Types.ObjectId(updateDto.unit);

        const load = await this.findOne(id);
        const qty = parseFloat(load.quantity.toString());
        const quantity = qty + updateDto.quantity;

        const filter = { _id: id };
        const update = {
          product: productId,
          unit: unitId,
          quantity: quantity,
          alert: updateDto.alert,
          updatedAt: moment.utc(fullDate),
        };
        const stock = await this.stockModel.updateOne(filter, update).exec();
        if (stock.modifiedCount) {
          const stock = await this.findOne(id);

          if (stock) return stock;
          throw new NotFoundException(errorMessages[404]);
        }
      }
    } catch (error) {
      if (error.status) throw new HttpException(error.message, error.status);
      throw new InternalServerErrorException(errorMessages[500]);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} stock`;
  }

  async checkProduct(product: string): Promise<number> {
    try {
      if (!isValidObjectId(product)) {
        throw new BadRequestException(errorMessages[400]);
      } else {
        const productId = new mongoose.Types.ObjectId(product);
        const filter = { product: productId };
        const stock = await this.stockModel.countDocuments(filter).exec();
        return stock;
      }
    } catch (error) {
      if (error.status) throw new HttpException(error.message, error.status);
      throw new InternalServerErrorException(errorMessages[500]);
    }
  }
}
