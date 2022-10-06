/* eslint-disable prettier/prettier */

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type UaccountDocument = Uaccount & Document;

@Schema({ _id: false })
export class Role {
    @Prop()
    code: string;

    @Prop()
    name: string;
}


@Schema({ collection: 'uaccounts', timestamps: false, versionKey: false })
export class Uaccount {
    @Prop({ required: true, trim: true })
    accountNo: string;

    @Prop({ required: true, trim: true })
    pin: string;

    @Prop({ required: true, trim: true})
    username: string;

    @Prop({ required: true, trim: true, select: false })
    password: string;

    @Prop()
    role: Role;

    @Prop({ default: '' })
    lastLogin: Date;

    @Prop({ default: '' })
    lastPasswordUpdate: Date;

    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop({ default: Date.now })
    updatedAt: Date
}


export const UaccountSchema = SchemaFactory.createForClass(Uaccount);