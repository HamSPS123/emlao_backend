/* eslint-disable prettier/prettier */
import { BadRequestException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import * as moment from 'moment';
import { dateFormat } from 'src/config/date.config';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from './entities/order.entity';
import mongoose, { isValidObjectId, Model } from 'mongoose';
import { errorMessages } from 'src/config/message.config';
import { User } from 'src/core/users/entities/user.entity';
import { randomNumber } from 'src/common/utils/utils';
import { ReportOrderDetail } from './dto/report-order.dto';

@Injectable()
export class OrdersService {
  constructor(@InjectModel(Order.name) private orderModel: Model<OrderDocument>) { }

  async create(createDto: CreateOrderDto, user: User): Promise<Order> {
    try {
      const now = new Date();
      const fullDate = moment(now).format(dateFormat.format1);
      const orderCode = moment(now).format(dateFormat.format2) + randomNumber(1000, 9999);
      const shopId = new mongoose.Types.ObjectId(createDto?.shop);
      const customerId = new mongoose.Types.ObjectId(user?._id);

      const orderDetail = createDto?.orderDetail;
      const create = {
        shop: shopId,
        customer: customerId,
        orderDetail: orderDetail,
        code: orderCode,
        createdAt: moment.utc(fullDate),
        updatedAt: moment.utc(fullDate)
      };

      const model = new this.orderModel(create);
      const result = await model.save();

      if (result) return result;
    } catch (error) {
      throw new InternalServerErrorException(errorMessages[500]);
    }
  }

  async shopFindAll(shop: any) {
    try {
      const populate = { path: 'shop', select: 'name' };
      const filter = { shop: shop?._id };
      const sortBy: any = { name: 1 };
      const orders = await this.orderModel.find(filter)
        .populate(populate).sort(sortBy).exec();

      return orders;
    } catch (error) {
      throw new InternalServerErrorException(errorMessages[500]);
    }
  }

  async custFindAll(cust: any) {
    try {
      const populate = { path: 'shop', select: 'name' };
      const filter = { customer: cust?._id };
      const sortBy: any = { name: 1 };
      const orders = this.orderModel.find(filter)
        .populate(populate).sort(sortBy).exec();

      return orders;
    } catch (error) {
      throw new InternalServerErrorException(errorMessages[500]);
    }
  }

  async findOne(shop: any, id: string) {
    try {
      if (!isValidObjectId(id)) {
        throw new BadRequestException(errorMessages[400]);
      } else {
        const populate = { path: 'customer', select: 'name' };
        const filter = { shop: shop?._id, _id: id };
        const order = await this.orderModel.findOne(filter)
          .populate(populate).exec();

        if (order) {
          return order;
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

  async bestSale(shop: any) {
    try {
      const result = this.orderModel.aggregate([
        { $match: { shop: shop?._id } },
        { $unwind: '$orderDetail' },
        {
          $lookup: {
            from: "products",
            localField: "orderDetail.product",
            foreignField: "_id",
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
          $group: {
            _id: '$orderDetail.product',
            productName: { $first: '$products.name' },
            categoryName: { $first: '$categories.name' },
            total: { $sum: { $toDouble: '$orderDetail.quantity' } },
          },
        },
        { $sort: { total: -1 } },
        { $limit: 5 }
      ])
      return result;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(errorMessages[500]);
    }
  }

  async reportSales(reportDto: ReportOrderDetail, shop: any) {
    try {
      const result = this.orderModel.aggregate([
        { $unwind: '$orderDetail' },
        {
          $match: {
            'createdAt': { $gte: new Date(reportDto.startDate), $lte: new Date(reportDto.endDate) },
            'shop': shop?._id,
          }
        },
        {
          $lookup: {
            from: "products",
            localField: "orderDetail.product",
            foreignField: "_id",
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
          $group: {
            _id: { $month: "$createdAt" },
            // _id: '$orderDetail.product',
            // productName: { $first: '$products.name' },
            // categoryName: { $first: '$categories.name' },
            // quantity: { $sum: { $toDouble: '$orderDetail.quantity' } },
            total: { $sum: { $toDouble: { $multiply: ['$orderDetail.quantity', '$orderDetail.price'] } } },
          },
        },
        { $sort: { productName: -1 } },
      ])
      return result;
    } catch (error) {
      throw new InternalServerErrorException(errorMessages[500]);
    }
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
