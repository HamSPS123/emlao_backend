/* eslint-disable prettier/prettier */
import { NotFoundException } from '@nestjs/common/exceptions';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ShopsService } from 'src/modules/shops/shops.service';
import { CustomersService } from 'src/modules/customers/customers.service';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private shopService: ShopsService,
        private customerService: CustomersService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
        });
    }

    async validate(payload: any) {
        const role = payload?.role;
        let profile: any;

        if (role === 'SHOP') {
            profile = await this.shopService.findOne(payload?.id);
        } else if (role === 'CUST') {
            profile = await this.customerService.findOne(payload?.id);
        } else {
            // console.log('get shop emp');
        }

        if (profile) {
            return profile;
        }

        throw new NotFoundException('ບໍ່ພົບບັນຊີຜູ້ໃຊ້ນີ້!');
    }
}