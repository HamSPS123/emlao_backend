/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { decimalToJson } from "src/common/utils/mongo-getter";

export type ProductDocument = Product & Document;


@Schema({
    collection: 'products', timestamps: false, versionKey: false,
    toJSON: { getters: true }
})
export class Product {
    @Prop({ required: true, ref: 'Shop' })
    shop: mongoose.Types.ObjectId;

    @Prop({ required: true, ref: 'Category' })
    category: mongoose.Types.ObjectId;

    @Prop({ required: true, trim: true })
    code: string;

    @Prop({ trim: true, default: '' })
    qrcode: string;

    @Prop({ required: true, trim: true })
    name: string;

    @Prop({ default: '' })
    description: string;

    @Prop({ default: 0, get: decimalToJson })
    price: mongoose.Schema.Types.Decimal128;

    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop({ default: Date.now })
    updatedAt: Date;

    @Prop({ default: 1 })
    isActive: boolean;
}


export const ProductSchema = SchemaFactory.createForClass(Product);