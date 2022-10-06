/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type MethodDocument = Method & Document;

@Schema({ collection: 'methods', timestamps: false, versionKey: false })
export class Method {
    @Prop({ required: true, ref: 'Shop' })
    shop: mongoose.Types.ObjectId;

    @Prop({ required: true, trim: true })
    name: string;

    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop({ default: Date.now })
    updatedAt: Date;
}
export const MethodSchema = SchemaFactory.createForClass(Method);