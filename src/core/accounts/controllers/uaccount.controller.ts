/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from '@nestjs/common';
import { CreateAccountDto } from '../dto/create-account.dto';
import { UaccountService } from '../services/uaccount.service';

@Controller('uaccount')
export class UaccountController {
    constructor(private readonly uaccountService: UaccountService) { }

    @Post()
    async create(@Body() createDto: CreateAccountDto): Promise<any> {
        return await this.uaccountService.create(createDto);
    }
}
