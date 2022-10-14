/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ShopsService } from './shops.service';
import { CreateShopDto } from './dto/create-shop.dto';


@Controller('shops')
export class ShopsController {
  constructor(private readonly shopsService: ShopsService) { }

  @Post()
  async create(@Body() createDto: CreateShopDto) {
    return this.shopsService.create(createDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.shopsService.findOne(id);
  }

  @Get('test/:query')
  async searchOne(@Param('query') query: string) {
    return await this.shopsService.searchOne(query);
  }

}
