/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
import mongoose from "mongoose";

export const stringToObject = (value: any) => {
    const newObjectId = new mongoose.Types.ObjectId(value)
    return newObjectId;
}