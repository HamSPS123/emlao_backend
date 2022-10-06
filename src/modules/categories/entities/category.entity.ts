/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

export type CategoryDocument = Category & Document;


@Schema({ collection: 'categories', timestamps: false, versionKey: false })
export class Category {
    @Prop({ required: true, ref: 'Shop' })
    shop: mongoose.Types.ObjectId;

    @Prop({ required: true, trim: true })
    name: string;

    @Prop({ default: '' })
    description: string;

    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop({ default: Date.now })
    updatedAt: Date;
}


export const CategorySchema = SchemaFactory.createForClass(Category);