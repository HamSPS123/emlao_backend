/* eslint-disable prettier/prettier */

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

export type CustomerDocument = Customer & Document;

@Schema({ _id: false })
export class Image {
    @Prop({ default: '' })
    profilePhoto: string;

    @Prop({ default: '' })
    coverPhoto: string;
}

@Schema({ _id: false })
export class Contact {
    @Prop({ required: true })
    address: string;

    @Prop({ default: '' })
    email: string;

    @Prop({ required: true })
    tel: string;

    @Prop({ default: '' })
    line: string;

    @Prop({ default: '' })
    whatApp: string;
}


@Schema({ collection: 'customers', timestamps: false, versionKey: false })
export class Customer {
    @Prop({ required: true, ref: 'Uaccount' })
    account: mongoose.Types.ObjectId;

    @Prop({ type: Image, default: () => ({}) })
    images: Image;

    @Prop({ required: true, trim: true })
    name: string;

    @Prop()
    contact: Contact;

    @Prop({ default: 'Customer' })
    docModel: string;

    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop({ default: Date.now })
    updatedAt: Date;

    @Prop({ default: 1 })
    isActive: boolean;
}


export const CustomerSchema = SchemaFactory.createForClass(Customer);