/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { decimalToJson } from "src/common/utils/mongo-getter";
import { stringToObject } from "src/common/utils/mongo-setter";

export type OrderDocument = Order & Document;

@Schema({ _id: false })
export class OrderDetail {
    @Prop({ required: true, ref: 'Product', set: stringToObject })
    product: mongoose.Types.ObjectId;

    @Prop({ required: true, trim: true })
    name: string;

    @Prop({ required: true, get: decimalToJson })
    quantity: mongoose.Schema.Types.Decimal128;

    @Prop({ required: true, get: decimalToJson })
    price: mongoose.Schema.Types.Decimal128;
}

@Schema({
    collection: 'orders', timestamps: false, versionKey: false,
    toJSON: { getters: true }
})
export class Order {
    @Prop({ required: true, ref: 'Shop' })
    shop: mongoose.Types.ObjectId;

    @Prop({ required: true, ref: 'Customer' })
    customer: mongoose.Types.ObjectId;

    @Prop({ required: true, trim: true })
    code: string;

    @Prop([OrderDetail])
    orderDetail: OrderDetail[];

    @Prop({ default: "Preparing" })
    status: string;

    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop({ default: '' })
    datePay: Date;

    @Prop({ default: '' })
    dateDelivered: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
