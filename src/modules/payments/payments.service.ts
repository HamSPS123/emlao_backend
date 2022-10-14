/* eslint-disable prettier/prettier */
import { BadRequestException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { isValidObjectId, Model } from 'mongoose';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Payment, PaymentDocument } from './entities/payment.entity';
import * as moment from 'moment';
import { dateFormat } from 'src/config/date.config';
import { errorMessages } from 'src/config/message.config';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
  ) { }
  async create(shop: any, createDto: CreatePaymentDto): Promise<Payment> {
    try {
      const now = new Date();
      const fullDate = moment(now).format(dateFormat.format1);
      const shopId = new mongoose.Types.ObjectId(shop?._id);
      const methodId = new mongoose.Types.ObjectId(createDto.method);

      const create = {
        ...createDto,
        shop: shopId,
        method: methodId,
        createdAt: moment.utc(fullDate),
        updatedAt: moment.utc(fullDate),
      };

      const model = new this.paymentModel(create);
      const result = await model.save();
      return result;
    } catch (error) {
      if (error.status) throw new HttpException(error.message, error.status);
      throw new InternalServerErrorException(errorMessages[500]);
    }
  }

  async findAll(shop: any): Promise<Payment[]> {
    try {
      const populate = { path: 'method', select: 'name description', model: 'Method' };
      const shopId = new mongoose.Types.ObjectId(shop?._id);
      const filter = { shop: shopId };
      const sortBy: any = { name: 1 };
      const payment = await this.paymentModel.find(filter).populate(populate).sort(sortBy).exec();

      return payment;
    } catch (error) {
      throw new InternalServerErrorException(errorMessages[500]);
    }
  }

  async findOne(shop: any, id: string): Promise<Payment> {
    try {
      if (!isValidObjectId(id)) {
        throw new BadRequestException(errorMessages[400]);
      } else {
        const populate = { path: 'method', select: 'name description', model: 'Method' };
        const filter = { shop: shop?._id, _id: id };
        const sortBy: any = { name: 1 };
        const payment = await this.paymentModel.findById(filter).populate(populate).sort(sortBy).exec();

        if (!payment) {
          throw new NotFoundException(errorMessages[404]);
        }

        return payment;
      }
    } catch (error) {
      if (error.status) {
        throw new HttpException(error.message, error.status);
      }

      throw new InternalServerErrorException(errorMessages[500]);
    }
  }

  async update(shop: any, id: string, updateDto: UpdatePaymentDto) {
    try {
      if (!isValidObjectId(id)) {
        throw new BadRequestException(errorMessages[400]);
      } else {
        const now = new Date();
        const fullDate = moment(now).format(dateFormat.format1);
        const update = { ...updateDto, updatedAt: moment.utc(fullDate) };
        const filter = { shop: shop?._id, _id: id };
        const result = await this.paymentModel.updateOne(filter, update).exec();

        if (result.modifiedCount) {
          const payment = await this.findOne(shop, id);

          if (payment) return payment;
          throw new NotFoundException(errorMessages[404]);
        }
      }
    } catch (error) {
      if (error.status) throw new HttpException(error.message, error.status);
      throw new InternalServerErrorException(errorMessages[500]);
    }
  }

  async remove(shop: any, id: string) {
    try {
      if (!isValidObjectId(id)) {
        throw new BadRequestException(errorMessages[400]);
      } else {
        const filter = { shop: shop?._id, _id: id };
        const result = await this.paymentModel.deleteOne(filter).exec();

        if (result.deletedCount) return true;
        return false;

      }
    } catch (error) {
      throw new InternalServerErrorException(errorMessages[500]);
    }
  }
}
