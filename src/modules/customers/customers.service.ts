/* eslint-disable prettier/prettier */
import { errorMessages } from 'src/config/message.config';
import { HttpException, NotFoundException } from '@nestjs/common/exceptions';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { isValidObjectId, Model } from 'mongoose';
import * as moment from 'moment';
import { dateFormat } from 'src/config/date.config';
import { Customer, CustomerDocument } from './entities/customer.entity';
import { CreateUserDto } from 'src/core/users/dto/create-user.dto';

@Injectable()
export class CustomersService {
  constructor(@InjectModel(Customer.name) private customerModel: Model<CustomerDocument>) { }

  async create(createDto: CreateUserDto): Promise<Customer> {
    try {
      const now = new Date();
      const fullDate = moment(now).format(dateFormat.format1);

      const create = Object.assign({
        ...createDto,
        createdAt: moment.utc(fullDate),
        updatedAt: moment.utc(fullDate)
      });

      const model = new this.customerModel(create);
      const result = await model.save();

      return result;
    } catch (error) {
      throw new InternalServerErrorException(errorMessages[500]);
    }
  }

  async findOne(id: string): Promise<Customer> {
    try {
      if (!isValidObjectId(id)) {
        throw new BadRequestException('Invalid ObjectId ' + id);
      } else {
        const accountId = new mongoose.Types.ObjectId(id);
        const select = 'accountNo pin username role';
        const populate = { path: 'account', select: select, model: "Uaccount" };
        const filter = { account: accountId };
        const customer = await this.customerModel.findOne(filter)
          .populate(populate).exec();

        if (customer) {
          return customer;
        }

        throw new NotFoundException(errorMessages[404]);
      }

    } catch (error) {
      if (error.status) {
        throw new HttpException(error.message, error.status);
      }

      console.log(error);


      throw new InternalServerErrorException(errorMessages[500]);
    }
  }
}
