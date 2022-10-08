/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ShopsService } from './shops.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { Shop } from './entities/shop.entity';

@Controller('shops')
export class ShopsController {
  constructor(private readonly shopsService: ShopsService) { }

  @Post()
  async create(@Body() createDto: CreateShopDto) {
    return this.shopsService.create(createDto);
  }

  @Get()
  async findAll(): Promise<Shop[]> {
    return await this.shopsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.shopsService.findOne(id);
  }

}
