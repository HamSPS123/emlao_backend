/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber } from 'class-validator';
import mongoose from 'mongoose';

export class CreateStockDto {
    @IsNotEmpty()
    shop: mongoose.Types.ObjectId;

    @IsNotEmpty()
    product: mongoose.Types.ObjectId;

    @IsNotEmpty()
    unit: string;

    @IsNotEmpty()
    @IsNumber()
    startQuantity: number;

    @IsNotEmpty()
    @IsNumber()
    minimumRequired: number;
}
