/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { JwtAuthGuard } from 'src/core/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) { }

  @Post()
  create(@Req() req, @Body() createDto: CreatePaymentDto) {
    const shop = req.user;
    return this.paymentsService.create(shop, createDto);
  }

  @Get()
  findAll(@Req() req) {
    const shop = req.user;
    return this.paymentsService.findAll(shop);
  }

  @Get(':id')
  findOne(@Req() req, @Param('id') id: string) {
    const shop = req.user;
    return this.paymentsService.findOne(shop, id);
  }

  @Patch(':id')
  update(@Req() req, @Param('id') id: string, @Body() updateDto: UpdatePaymentDto) {
    const shop = req.user;
    return this.paymentsService.update(shop, id, updateDto);
  }

  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    const shop = req.user;
    return this.paymentsService.remove(shop, id);
  }
}
