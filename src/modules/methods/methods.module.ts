/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MethodsService } from './methods.service';
import { MethodsController } from './methods.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Method, MethodSchema } from './entities/method.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Method.name, schema: MethodSchema }])
  ],
  controllers: [MethodsController],
  providers: [MethodsService]
})
export class MethodsModule { }
