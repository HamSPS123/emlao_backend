/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
export type EmployeeDocument = Employee & Document;


@Schema({
    collection: 'employees', timestamps: false, versionKey: false
})


@Schema({ _id: false })
export class Contact {
    @Prop({ required: true })
    address: string;

    @Prop({ required: true })
    tel: string;

    @Prop({ default: '' })
    email: string;

    @Prop({ default: '' })
    line: string;

    @Prop({ default: '' })
    whatApp: string;
}

export class Employee {
    @Prop({ required: true, ref: 'Account' })
    account: mongoose.Types.ObjectId;

    @Prop({ required: true, ref: 'Shop' })
    shop: mongoose.Types.ObjectId;

    @Prop({ default: '' })
    profilePhoto: string;

    @Prop({ required: true, trim: true })
    name: string;

    @Prop({ type: Contact })
    contact: Contact;

    @Prop({ default: 'Employee' })
    docModel: string;

    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop({ default: Date.now })
    updatedAt: Date;

    @Prop({ default: 1 })
    isActive: boolean;
}


export const EmployeeSchema = SchemaFactory.createForClass(Employee);