/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AccountsModule } from './accounts/accounts.module';
import { AdminsModule } from './admins/admins.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [AuthModule, AccountsModule, UsersModule, AdminsModule]
})
export class CoreModule { }
