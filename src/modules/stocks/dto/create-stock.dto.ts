/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateStockDto {
    @IsNotEmpty()
    product: string;

    @IsNotEmpty()
    unit: string;

    @IsNotEmpty()
    @IsNumber()
    quantity: number;

    @IsNotEmpty()
    @IsNumber()
    alert: number;
}
