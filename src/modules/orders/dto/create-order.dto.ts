/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber, IsObject } from 'class-validator';
import mongoose from 'mongoose';

export class OrderDetail {
    @IsNotEmpty()
    product: mongoose.Types.ObjectId;

    @IsNotEmpty()
    name: string;

    @IsNumber()
    @IsNotEmpty()
    quantity: number;

    @IsNumber()
    @IsNotEmpty()
    price: number;
}

export class CreateOrderDto {
    @IsNotEmpty()
    shop: mongoose.Types.ObjectId;

    // @IsObject()
    @IsNotEmpty()
    orderDetail: OrderDetail;

}
