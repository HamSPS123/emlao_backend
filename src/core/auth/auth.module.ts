/* eslint-disable prettier/prettier */
import { JwtStrategy } from './jwt.strategy';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt/dist';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { AdminsModule } from '../admins/admins.module';
import { AccountsModule } from '../accounts/accounts.module';


@Module({
  imports: [
    JwtModule.register({ signOptions: { expiresIn: '10h' } }),
    AccountsModule, UsersModule, AdminsModule
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController]
})
export class AuthModule { }
