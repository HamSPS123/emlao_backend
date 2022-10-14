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
  Req,
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
  async create(@Req() req, @Body() createDto: CreateUnitDto): Promise<Unit> {
    const shop = req.user;
    return await this.unitsService.create(shop, createDto);
  }

  @Get()
  async findAll(@Req() req): Promise<Unit[]> {
    const shop = req.user;
    return await this.unitsService.findAll(shop);
  }

  @Get(':id')
  async findOne(@Req() req, @Param('id') id: string): Promise<Unit> {
    const shop = req.user;
    return await this.unitsService.findOne(shop, id);
  }

  @Patch(':id')
  async update(@Req() req, @Param('id') id: string, @Body() updateDto: UpdateUnitDto,
  ): Promise<Unit> {
    const shop = req.user;
    return await this.unitsService.update(shop, id, updateDto);
  }

  @Delete(':id')
  async remove(@Req() req, @Param('id') id: string): Promise<boolean> {
    const shop = req.user;
    return await this.unitsService.remove(shop, id);
  }
}
