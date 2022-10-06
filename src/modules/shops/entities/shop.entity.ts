/* eslint-disable prettier/prettier */

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

export type ShopDocument = Shop & Document;

@Schema({ _id: false })
export class Image {
    @Prop({ default: '' })
    profilePhoto: string;

    @Prop({ default: '' })
    coverPhoto: string;
}

@Schema({ _id: false })
export class Contact {
    @Prop({ default: '' })
    address: string;

    @Prop({ default: '' })
    email: string;

    @Prop({ default: '' })
    tel: string;

    @Prop({ default: '' })
    line: string;

    @Prop({ default: '' })
    whatApp: string;

    @Prop({ default: '' })
    website: string;
}


@Schema({ collection: 'shops', timestamps: false, versionKey: false })
export class Shop {
    @Prop({ required: true, ref: 'Aaccount' })
    account: mongoose.Types.ObjectId;

    @Prop({ type: Image, default: () => ({}) })
    images: Image;

    @Prop({ required: true, trim: true })
    name: string;

    @Prop({ default: '' })
    bio: string;

    @Prop({ type: Contact, default: () => ({}) })
    contact: Contact;

    @Prop({ default: '08:00-17:00' })
    openingHours: string;

    @Prop({ default: 'Shop' })
    docModel: string;

    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop({ default: Date.now })
    updatedAt: Date;

    @Prop({ default: 1 })
    isActive: boolean;
}


export const ShopSchema = SchemaFactory.createForClass(Shop);