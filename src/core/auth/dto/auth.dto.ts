/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class AuthDto {
    @IsNotEmpty()
    @IsEmail()
    username: string;

    @IsNotEmpty()
    @MinLength(6)
    password: string;
}
