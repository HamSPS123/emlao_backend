/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { MethodsService } from './methods.service';
import { CreateMethodDto } from './dto/create-method.dto';
import { UpdateMethodDto } from './dto/update-method.dto';
import { JwtAuthGuard } from 'src/core/auth/jwt-auth.guard';
import { Method } from './entities/method.entity';

@UseGuards(JwtAuthGuard)
@Controller('methods')
export class MethodsController {
  constructor(private readonly methodsService: MethodsService) { }

  @Post()
  async create(@Req() req, @Body() createDto: CreateMethodDto): Promise<Method> {
    const shop = req.user;
    return await this.methodsService.create(shop, createDto);
  }

  @Get()
  async findAll(@Req() req): Promise<Method[]> {
    const shop = req.user;
    return await this.methodsService.findAll(shop);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Method> {
    return await this.methodsService.findOne(id);
  }

  @Patch(':id')
  async update(@Req() req, @Param('id') id: string, @Body() updateMethodDto: UpdateMethodDto) {
    const shop = req.user; /// error  sevice
    return await this.methodsService.update(id, updateMethodDto, shop);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<boolean> {
    return await this.methodsService.remove(id);
  }
}
