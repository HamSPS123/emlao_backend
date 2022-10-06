/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { decimalToJson } from 'src/common/utils/mongo-getter';

export type StockDocument = Stock & Document;

@Schema({
    collection: 'stocks',
    timestamps: false,
    versionKey: false,
    toJSON: { getters: true },
})
export class Stock {
    @Prop({ required: true, ref: 'Product' })
    product: mongoose.Types.ObjectId;

    @Prop({ required: true, ref: 'Unit' })
    unit: mongoose.Types.ObjectId;

    @Prop({ required: true, get: decimalToJson })
    quantity: mongoose.Schema.Types.Decimal128;

    @Prop({ required: true })
    alert: number;

    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop({ default: Date.now })
    updatedAt: Date;
}

export const StockSchema = SchemaFactory.createForClass(Stock);
