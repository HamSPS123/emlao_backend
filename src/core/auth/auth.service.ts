/* eslint-disable prettier/prettier */
import { errorMessages } from 'src/config/message.config';
import { InternalServerErrorException } from '@nestjs/common';
import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { AuthDto } from './dto/auth.dto';
import * as argon2 from 'argon2';
import { AaccountService } from '../accounts/services/aaccount.service';
import { UaccountService } from '../accounts/services/uaccount.service';

@Injectable()
export class AuthService {
  constructor(
    private aaccountService: AaccountService,
    private uaccountService: UaccountService,
    private jwtService: JwtService
  ) { }


  async userSignIn(authDto: AuthDto) {
    try {
      const account: any = await this.uaccountService.findOne(authDto.username);

      if (!account) {
        throw new UnauthorizedException('ບໍ່ພົບທີ່ຢູ່ອີເມລຜູ້ໃຊ້ນີ້!');
      }

      const isValidPassword = await argon2.verify(account.password, authDto.password);
      if (!isValidPassword) {
        throw new UnauthorizedException('ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ!');
      }

      await this.uaccountService.setLoginTime(account?._id);

      const payload = { id: account?._id, role: account?.role?.code };
      const options: JwtSignOptions = { secret: process.env.JWT_SECRET, expiresIn: '1d' };
      const token = await this.jwtService.signAsync(payload, options);

      return Object.assign({
        tokenType: 'Bearer',
        accessToken: token
      });


    } catch (error) {
      if (error.status) {
        throw new HttpException(error.message, error.status);
      }

      throw new InternalServerErrorException(errorMessages[500]);
    }
  }

  async adminSignIn(authDto: AuthDto) {
    try {
      const account: any = await this.aaccountService.findOne(authDto.username);

      if (!account) {
        throw new UnauthorizedException('ບໍ່ພົບທີ່ຢູ່ອີເມລຜູ້ໃຊ້ນີ້!');
      }

      const isValidPassword = await argon2.verify(account.password, authDto.password);
      if (!isValidPassword) {
        throw new UnauthorizedException('ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ!');
      }

      await this.aaccountService.setLoginTime(account?._id);

      const payload = { id: account?._id, role: account?.role?.code };
      const options: JwtSignOptions = { secret: process.env.JWT_SECRET, expiresIn: '1d' };
      const token = await this.jwtService.signAsync(payload, options);

      return Object.assign({
        tokenType: 'Bearer',
        accessToken: token
      });


    } catch (error) {
      if (error.status === 401) {
        throw new HttpException(error.message, error.status);
      }

      throw new InternalServerErrorException(errorMessages[500]);
    }
  }

}
