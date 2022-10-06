import { CustomersModule } from './../../modules/customers/customers.module';
import { CustomersService } from './../../modules/customers/customers.service';
/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';


@Module({
  imports: [CustomersModule],
  controllers: [UsersController],
  providers: [UsersService, CustomersService],
  exports: [CustomersService]
})
export class UsersModule { }
