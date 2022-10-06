/* eslint-disable prettier/prettier */
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import * as moment from 'moment';
import { dateFormat } from 'src/config/date.config';
import { InjectModel } from '@nestjs/mongoose';
import { Employee, EmployeeDocument } from './entities/employee.entity';
import { Model } from 'mongoose';
import { errorMessages } from 'src/config/message.config';

@Injectable()
export class EmployeesService {
  constructor(@InjectModel(Employee.name) private employeeModel: Model<EmployeeDocument>) { }

  async create(createDto: CreateEmployeeDto) {
    try {
      const now = new Date();
      const fullDate = moment(now).format(dateFormat.format1);

      const create = Object.assign({
        ...createDto,
        createdAt: moment.utc(fullDate),
        updatedAt: moment.utc(fullDate)
      });

      const model = new this.employeeModel(create);
      const result = await model.save();

      return result;
    } catch (error) {
      throw new InternalServerErrorException(errorMessages[500]);
    }
  }

  findAll() {
    return `This action returns all employees`;
  }

  findOne(id: number) {
    return `This action returns a #${id} employee`;
  }

  update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    return `This action updates a #${id} employee`;
  }

  remove(id: number) {
    return `This action removes a #${id} employee`;
  }
}
