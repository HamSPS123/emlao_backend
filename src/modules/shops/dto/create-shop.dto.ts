/* eslint-disable prettier/prettier */
import { IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class CreateShopDto {
    @IsNotEmpty()
    account: mongoose.Types.ObjectId;

    @IsNotEmpty()
    name: string;
}
