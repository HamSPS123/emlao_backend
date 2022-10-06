/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from 'src/core/auth/jwt-auth.guard';
import { Product } from './entities/product.entity';


@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Post()
  async create(@Req() req, @Body() createDto: CreateProductDto): Promise<Product> {
    const user = req.user;
    return await this.productsService.create(createDto, user);
  }

  @Get()
  async findAll(@Req() req) {
    const user = req.user;
    return await this.productsService.findAll(user);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Product> {
    return await this.productsService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateDto: UpdateProductDto): Promise<Product> {
    return await this.productsService.update(id, updateDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<boolean> {
    return await this.productsService.remove(id);
  }
}
