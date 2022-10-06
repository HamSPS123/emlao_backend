/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import mongoose from "mongoose";

export class CreateUserDto {
    @IsNotEmpty()
    @ApiProperty()
    account: mongoose.Types.ObjectId;

    @IsNotEmpty()
    @ApiProperty()
    name: string;
}
