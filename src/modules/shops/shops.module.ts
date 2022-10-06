/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ShopsService } from './shops.service';
import { ShopsController } from './shops.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Shop, ShopSchema } from './entities/shop.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: Shop.name, schema: ShopSchema }])],
  controllers: [ShopsController],
  providers: [ShopsService],
  exports: [
    MongooseModule.forFeature([{ name: Shop.name, schema: ShopSchema }]),
    ShopsService
  ]
})
export class ShopsModule { }
