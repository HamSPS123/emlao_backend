/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNotEmptyObject } from 'class-validator';

export class Role {
    @IsNotEmpty()
    code: string;

    @IsNotEmpty()
    name: string;
}

export class CreateAccountDto {
    @IsNotEmpty()
    name: string;
    
    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    password: string;

    @IsNotEmptyObject()
    role: Role;
}
