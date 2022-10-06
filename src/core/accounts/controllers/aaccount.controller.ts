/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from '@nestjs/common';
import { CreateAccountDto } from '../dto/create-account.dto';
import { AaccountService } from '../services/aaccount.service';

@Controller('aaccount')
export class AaccountController {
    constructor(private readonly aaccountService: AaccountService) { }

    @Post()
    async create(@Body() createDto: CreateAccountDto): Promise<any> {
        return await this.aaccountService.create(createDto);
    }
}
