/* eslint-disable prettier/prettier */
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { Body, Controller, Get, HttpCode, Post, Req, UseGuards } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('user/sign-in')
  @HttpCode(200)
  async uerSignIn(@Body() body: AuthDto) {
    return await this.authService.userSignIn(body);
  }

  @Post('admin/sign-in')
  @HttpCode(200)
  async adminSignIn(@Body() body: AuthDto) {
    return await this.authService.adminSignIn(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req: any) {
    return req.user;
  }
}
