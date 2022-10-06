/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UtilsModule } from './modules/utils/utils.module';
import { CoreModule } from './core/core.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ProductsModule } from './modules/products/products.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { MethodsModule } from './modules/methods/methods.module';
import { UnitsModule } from './modules/units/units.module';
import { StocksModule } from './modules/stocks/stocks.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      inject: [ConfigService],
    }),
    CoreModule,
    UtilsModule,
    CategoriesModule,
    ProductsModule,
    OrdersModule,
    PaymentsModule,
    MethodsModule,
    UnitsModule,
    StocksModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
