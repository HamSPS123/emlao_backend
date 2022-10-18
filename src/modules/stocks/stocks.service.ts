/* eslint-disable prettier/prettier */
import {
  BadRequestException,
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

  async create(shop: any, createDto: CreateStockDto): Promise<Stock> {
    try {
      const now = new Date();
      const fullDate = moment(now).format(dateFormat.format1);
      const productId = new mongoose.Types.ObjectId(createDto.product);
      const unitId = new mongoose.Types.ObjectId(createDto.unit);
      const shopId = new mongoose.Types.ObjectId(shop?._id);

      const create = {
        ...createDto,
        shop: shopId,
        product: productId,
        unit: unitId,
        createdAt: moment.utc(fullDate),
        updatedAt: moment.utc(fullDate),
      };

      const model = new this.stockModel(create);
      const result = await model.save();
      return result;
    } catch (error) {
      if (error.status) throw new HttpException(error.message, error.status);
      throw new InternalServerErrorException(errorMessages[500]);
    }
  }

  async findAll(shop: any): Promise<Stock[]> {
    try {
      const filter = { shop: shop?._id };
      const sortBy: any = { name: 1 };
      const product = {
        path: 'product',
        select: '_id code qrcode name description price',
        model: 'Product',
      };
      const unit = {
        path: 'unit',
        select: '_id code name',
        model: 'Unit',
      };
      const stock = await this.stockModel
        .find(filter)
        .populate(product)
        .populate(unit)
        .sort(sortBy)
        .exec();

      if (stock) return stock;
      throw new NotFoundException(errorMessages[404]);
    } catch (error) {
      if (error.status) throw new HttpException(error.message, error.status);
      throw new InternalServerErrorException(errorMessages[500]);
    }
  }

  async findOne(shop: any, id: string): Promise<Stock> {
    try {
      if (!isValidObjectId(id)) {
        throw new BadRequestException(errorMessages[400]);
      } else {
        const filter = { shop: shop?._id, _id: id };
        const sortBy: any = { name: 1 };
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
          .findById(filter)
          .populate(product)
          .populate(unit)
          .sort(sortBy)
          .exec();

        if (stock) return stock;
        throw new NotFoundException(errorMessages[404]);
      }
    } catch (error) {
      if (error.status) throw new HttpException(error.message, error.status);
      throw new InternalServerErrorException(errorMessages[500]);
    }
  }

  async update(shop: any, id: string, updateDto: UpdateStockDto) {
    try {
      if (!isValidObjectId(id)) {
        throw new BadRequestException(errorMessages[400]);
      } else {
        const now = new Date();
        const fullDate = moment(now).format(dateFormat.format1);
        const filter = { shop: shop?._id, _id: id };
        const update = { ...updateDto, updatedAt: moment.utc(fullDate) };
        const stock = await this.stockModel.updateOne(filter, update).exec();

        if (stock.modifiedCount) {
          const stock = await this.findOne(shop, id);

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
