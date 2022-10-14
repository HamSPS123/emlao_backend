/* eslint-disable prettier/prettier */
import { BadRequestException } from '@nestjs/common';
import { ConflictException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import * as moment from 'moment';
import * as argon2 from 'argon2';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Aaccount, AaccountDocument } from '../entities/aaccount.entity';
import { ShopsService } from 'src/modules/shops/shops.service';
import { CreateAccountDto } from '../dto/create-account.dto';
import { errorMessages } from 'src/config/message.config';
import { randomNumber } from 'src/common/utils/utils';
import { CreateUserDto } from 'src/core/users/dto/create-user.dto';
import { EmployeesService } from 'src/modules/employees/employees.service';

@Injectable()
export class AaccountService {
    constructor(
        @InjectModel(Aaccount.name) private aaccountModel: Model<AaccountDocument>,
        private shopService: ShopsService,
        private employeeService: EmployeesService,
    ) { }

    async create(createDto: CreateAccountDto): Promise<any> {
        try {

            const isExist = await this.checkAccount(createDto.username);
            const checkRole = createDto.role.code;
            if (checkRole === 'SHOP' || checkRole === 'EMP') {
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

                    const model = new this.aaccountModel(create);
                    const result = await model.save();

                    if (result) {
                        let user: any;
                        const role = (createDto?.role?.code).toUpperCase();
                        const userDto: CreateUserDto = { account: result?._id, name: createDto?.name };

                        if (role === 'SHOP') {
                            user = await this.shopService.create(userDto);
                        } else if (role === 'EMP') {
                            user = await this.employeeService.create(userDto);
                        } else {
                            throw new BadRequestException(errorMessages[500]);
                        }

                        if (user) {
                            return user;
                        }
                    }
                }
            } else {
                throw new BadRequestException(errorMessages[400])

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
            await this.aaccountModel.updateOne(filter, update);
        } catch (error) {
            throw new InternalServerErrorException(errorMessages[500]);
        }
    }

    async findOne(username: string): Promise<Aaccount> {
        try {
            const filter = { username: username };
            const account = await this.aaccountModel.findOne(filter).select('+password').exec();

            if (account) {
                return account;
            }

            throw new NotFoundException(errorMessages[400]);
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
            const count = await this.aaccountModel.countDocuments(filter).exec();
            return count;
        } catch (error) {
            throw new InternalServerErrorException(errorMessages[500]);
        }
    }

}
