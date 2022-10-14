/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from 'src/core/auth/jwt-auth.guard';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Post()
  async create(@Req() req, @Body() createDto: CreateCategoryDto): Promise<Category> {
    const shop = req.user;
    return await this.categoriesService.create(shop, createDto);
  }

  @Get()
  async findAll(@Req() req): Promise<Category[]> {
    const shop = req.user;
    return await this.categoriesService.findAll(shop);
  }

  @Get(':id')
  async findOne(@Req() req, @Param('id') id: string): Promise<Category> {
    const shop = req.user;
    return await this.categoriesService.findOne(shop, id);
  }

  @Patch(':id')
  async update(@Req() req, @Param('id') id: string, @Body() updateDto: UpdateCategoryDto) {
    const shop = req.user;
    return await this.categoriesService.update(shop, id, updateDto);
  }

  @Delete(':id')
  async remove(@Req() req, @Param('id') id: string): Promise<boolean> {
    const shop = req.user;
    return await this.categoriesService.remove(shop, id);
  }
}
