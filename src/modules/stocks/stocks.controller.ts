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
import { StocksService } from './stocks.service';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { JwtAuthGuard } from 'src/core/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('stocks')
export class StocksController {
  constructor(private readonly stocksService: StocksService) { }

  @Post()
  async create(@Req() req, @Body() createStockDto: CreateStockDto) {
    const shop = req.user;
    return await this.stocksService.create(shop, createStockDto);
  }

  @Get()
  findAll(@Req() req) {
    const shop = req.user;
    return this.stocksService.findAll(shop);
  }

  @Get(':id')
  findOne(@Req() req, @Param('id') id: string) {
    const shop = req.user;
    return this.stocksService.findOne(shop, id);
  }

  @Patch(':id')
  update(@Req() req, @Param('id') id: string, @Body() updateStockDto: UpdateStockDto) {
    const shop = req.user;
    return this.stocksService.update(shop, id, updateStockDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stocksService.remove(+id);
  }
}
