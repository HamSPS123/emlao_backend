/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { decimalToJson } from "src/common/utils/mongo-getter";

export type PaymentDocument = Payment & Document;

@Schema({
    collection: 'payments', timestamps: false, versionKey: false,
    toJSON: { getters: true }
})
export class Payment {
    @Prop({ required: true, ref: 'Order' })
    order: mongoose.Types.ObjectId;

    @Prop({ required: true, ref: 'Method' })
    method: mongoose.Types.ObjectId;

    @Prop({ default: 0, get: decimalToJson })
    amountPaid: mongoose.Schema.Types.Decimal128;

}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
