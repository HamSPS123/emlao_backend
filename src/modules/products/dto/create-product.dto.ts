/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber } from 'class-validator';
import mongoose from 'mongoose';

export class CreateProductDto {
    @IsNotEmpty()
    category: mongoose.Types.ObjectId;

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    @IsNumber()
    price: number;
}
