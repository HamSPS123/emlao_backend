import { BadRequestException, UnauthorizedException } from '@nestjs/common';
/* eslint-disable prettier/prettier */
import { ConflictException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as moment from 'moment';
import * as argon2 from 'argon2';
import { randomNumber } from 'src/common/utils/utils';
import { CustomersService } from 'src/modules/customers/customers.service';
import { CreateAccountDto } from '../dto/create-account.dto';
import { CreateUserDto } from 'src/core/users/dto/create-user.dto';
import { errorMessages } from 'src/config/message.config';
import mongoose, { Model } from 'mongoose';
import { Uaccount, UaccountDocument } from '../entities/uaccount.entity';

@Injectable()
export class UaccountService {
  constructor(
    @InjectModel(Uaccount.name) private uaccountModel: Model<UaccountDocument>,
    private customerService: CustomersService,
  ) { }


  async create(createDto: CreateAccountDto): Promise<any> {
    try {
      const checkRole = createDto.role.code;
      if (checkRole !== 'CUST') {
        throw new BadRequestException(errorMessages[400]);
      } else {
        const isExist = await this.checkAccount(createDto.username);

        if (isExist) {
          throw new ConflictException(errorMessages[409]);
        } else {
          const now = new Date();
          const fullDate = moment(now).format('YYYY-MM-DD HH:mm:ss');

          const passwordHash = await argon2.hash(createDto.password);
          const accountNo = randomNumber(100000000, 999999999);
          const pin = randomNumber(1000, 9999);

          const create = {
            accountNo: accountNo,
            pin: pin,
            username: createDto.username,
            password: passwordHash,
            role: createDto.role,
            createdAt: moment.utc(fullDate),
            updatedAt: moment.utc(fullDate)
          };

          const model = new this.uaccountModel(create);
          const result = await model.save();

          if (result) {
            let user: any;
            const role = (createDto?.role?.code).toUpperCase();
            const userDto: CreateUserDto = { account: result?._id, name: createDto?.name };

            if (role === 'CUST') {
              user = await this.customerService.create(userDto);
            } else {
              user = 'coming soon'
            }

            if (user) {
              return user;
            }

          }
        }
      }
    } catch (error) {
      if (error.status) {
        throw new HttpException(error.message, error.status);
      }

      throw new InternalServerErrorException(errorMessages[500]);
    }
  }

  async setLoginTime(id: mongoose.Types.ObjectId): Promise<void> {
    try {
      const now = new Date();
      const fullDate = moment(now).format('YYYY-MM-DD HH:mm:ss');

      const update = { lastLogin: moment.utc(fullDate) };
      const filter = { _id: id };
      await this.uaccountModel.updateOne(filter, update);
    } catch (error) {
      throw new InternalServerErrorException(errorMessages[500]);
    }
  }

  async findOne(username: string): Promise<Uaccount> {
    try {
      const filter = { username: username };
      const account = await this.uaccountModel.findOne(filter).select('+password').exec();

      if (account) {
        return account;
      }

      // throw new NotFoundException(errorMessages[404]);
      throw new UnauthorizedException('ບໍ່ພົບທີ່ຢູ່ອີເມລຜູ້ໃຊ້ນີ້!');
    } catch (error) {
      if (error.status) {
        throw new HttpException(error.message, error.status);
      }

      throw new InternalServerErrorException(errorMessages[500]);
    }
  }

  async checkAccount(username: string): Promise<number> {
    try {
      const filter = { username: username };
      const count = await this.uaccountModel.countDocuments(filter).exec();
      return count;
    } catch (error) {
      throw new InternalServerErrorException(errorMessages[500]);
    }
  }
}
