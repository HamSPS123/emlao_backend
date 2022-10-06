/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UnitsService } from './units.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { JwtAuthGuard } from 'src/core/auth/jwt-auth.guard';
import { Unit } from './entities/unit.entity';

@UseGuards(JwtAuthGuard)
@Controller('units')
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) { }

  @Post()
  async create(@Body() createDto: CreateUnitDto): Promise<Unit> {
    return await this.unitsService.create(createDto);
  }

  @Get()
  async findAll(): Promise<Unit[]> {
    return await this.unitsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Unit> {
    return await this.unitsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateUnitDto,
  ): Promise<Unit> {
    return await this.unitsService.update(id, updateDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<boolean> {
    return await this.unitsService.remove(id);
  }
}
