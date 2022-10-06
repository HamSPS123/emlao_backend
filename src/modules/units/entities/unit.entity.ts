/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UnitDocument = Unit & Document;

@Schema({ collection: 'units', timestamps: false, versionKey: false })
export class Unit {
    @Prop({ required: true, trim: true, unique: true })
    code: string;

    @Prop({ required: true, trim: true })
    name: string;

    @Prop({ default: '' })
    description: string;

    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop({ default: Date.now })
    updatedAt: Date;
}

export const UnitSchema = SchemaFactory.createForClass(Unit);
