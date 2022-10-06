/* eslint-disable prettier/prettier */
import { EmployeesModule } from './../../modules/employees/employees.module';
import { ShopsModule } from 'src/modules/shops/shops.module';
import { ShopsService } from './../../modules/shops/shops.service';
import { AdminsService } from './admins.service';
import { AdminsController } from './admins.controller';
import { Module } from '@nestjs/common';
import { EmployeesService } from 'src/modules/employees/employees.service';

@Module({
  imports: [ShopsModule, EmployeesModule],
  controllers: [AdminsController],
  providers: [AdminsService, ShopsService, EmployeesService],
  exports: [ShopsService, EmployeesService]
})
export class AdminsModule { }
