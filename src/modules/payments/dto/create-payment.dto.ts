/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber } from "class-validator";
import mongoose from "mongoose";

export class CreatePaymentDto {
    @IsNotEmpty()
    product: mongoose.Types.ObjectId;

    @IsNotEmpty()
    method: mongoose.Types.ObjectId;

    @IsNumber()
    price: number;
}
