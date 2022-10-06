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
import { isValidObjectId, Model } from 'mongoose';
import { errorMessages } from 'src/config/message.config';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { Unit, UnitDocument } from './entities/unit.entity';
import * as moment from 'moment';
import { dateFormat } from 'src/config/date.config';

@Injectable()
export class UnitsService {
  constructor(
    @InjectModel(Unit.name)
    private unitModel: Model<UnitDocument>,
  ) { }
  async create(createDto: CreateUnitDto): Promise<Unit> {
    try {
      const now = new Date();
      const fullDate = moment(now).format(dateFormat.format1);

      const create = {
        ...createDto,
        createdAt: moment.utc(fullDate),
        updatedAt: moment.utc(fullDate),
      };

      const model = new this.unitModel(create);
      const result = await model.save();

      if (result) {
        const unitId = result._id.toString();
        const unit = this.findOne(unitId);

        if (unit) return unit;

        throw new NotFoundException(errorMessages[404]);
      }
    } catch (error) {
      if (error.status) throw new HttpException(error.message, error.status);

      if (error.code === 11000)
        throw new ConflictException(
          errorMessages[409] + ', code: ' + createDto.code,
        );
      throw new InternalServerErrorException(errorMessages[500]);
    }
  }

  async findAll(): Promise<Unit[]> {
    try {
      const units = await this.unitModel.find().exec();

      if (units) return units;
      throw new NotFoundException(errorMessages[404]);
    } catch (error) {
      if (error.status) throw new HttpException(error.message, error.status);
      throw new InternalServerErrorException(errorMessages[500]);
    }
  }

  async findOne(id: string): Promise<Unit> {
    try {
      if (!isValidObjectId(id)) {
        throw new BadRequestException(errorMessages[400]);
      } else {
        const filter = { _id: id };
        const unit = await this.unitModel.findOne(filter).exec();

        if (unit) return unit;

        throw new NotFoundException(errorMessages[404]);
      }
    } catch (error) {
      if (error.status) throw new HttpException(error.message, error.status);

      throw new InternalServerErrorException(errorMessages[500]);
    }
  }

  async update(id: string, updateDto: UpdateUnitDto): Promise<Unit> {
    try {
      const now = new Date();
      const fullDate = moment(now).format(dateFormat.format1);

      const update = {
        ...updateDto,
        updatedAt: moment.utc(fullDate),
      };

      const filter = { _id: id };
      const result = await this.unitModel.updateOne(filter, update).exec();

      if (result.modifiedCount) {
        const unit = await this.findOne(id);
        if (unit) return unit;

        throw new NotFoundException(errorMessages[404]);
      }
    } catch (error) {
      if (error.status) throw new HttpException(error.message, error.status);
      throw new InternalServerErrorException(errorMessages[500]);
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      const filter = { _id: id };
      const result = await this.unitModel.deleteOne(filter).exec();

      if (result.deletedCount) return true;

      return false;
    } catch (error) {
      throw new InternalServerErrorException(errorMessages[500]);
    }
  }
}
