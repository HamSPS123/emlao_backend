/* eslint-disable prettier/prettier */
import { UsersModule } from './../users/users.module';
import { UaccountService } from './services/uaccount.service';
import { UaccountController } from './controllers/uaccount.controller';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AaccountController } from './controllers/aaccount.controller';
import { Aaccount, AaccountSchema } from './entities/aaccount.entity';
import { Uaccount, UaccountSchema } from './entities/uaccount.entity';
import { AaccountService } from './services/aaccount.service';
import { AdminsModule } from '../admins/admins.module';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Uaccount.name, schema: UaccountSchema },
      { name: Aaccount.name, schema: AaccountSchema }
    ]),
    UsersModule, AdminsModule
  ],
  controllers: [AaccountController, UaccountController],
  providers: [AaccountService, UaccountService],
  exports: [AaccountService, UaccountService]
})
export class AccountsModule { }
