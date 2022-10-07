/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from 'src/core/auth/jwt-auth.guard';
import { Order } from './entities/order.entity';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Post()
  async create(@Req() req, @Body() createOrderDto: CreateOrderDto): Promise<Order> {
    const user = req.user;
    return await this.ordersService.create(createOrderDto, user);
  }

  @Get('shop')
  async shopFindAll(@Req() req): Promise<Order[]> {
    const shop = req.user;
    return await this.ordersService.shopFindAll(shop);
  }

  @Get('customer')
  async custFindAll(@Req() req): Promise<Order[]> {
    const cust = req.user;
    return await this.ordersService.custFindAll(cust);
  }

  @Get('sales')
  async test(@Req() req): Promise<Order[]> {
    const shop = req.user;
    return await this.ordersService.test(shop);
  }

  @Get(':id')
  async findOne(@Req() req, @Param('id') id: string): Promise<Order> {
    const shop = req.user;
    return await this.ordersService.findOne(shop, id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
