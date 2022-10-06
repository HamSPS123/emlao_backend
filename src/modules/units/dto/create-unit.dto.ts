/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUnitDto {
    @IsNotEmpty()
    code: string;

    @IsNotEmpty()
    name: string;

    @IsOptional()
    description: string;
}
