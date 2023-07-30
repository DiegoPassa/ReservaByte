import mongoose, { Document, Schema, SchemaTypes } from "mongoose"
import { ITable } from "./Table";

export interface IReceipt{
    table: ITable,
    items: {name: string, price: number}[],
    total: number,
    timestamp: Date
};

export interface IReceiptModel extends IReceipt, Document {};

const ReceiptSchema: Schema = new Schema({
    table: { type: SchemaTypes.ObjectId, ref: 'Table', required: true },
    items: { type: [SchemaTypes.Mixed], required: true },
    total: { type: Number, min: 0, default: 0, required: true },
    timestamp: { type: Date, default: new Date(), required: true }
}, { versionKey: false });

export default mongoose.model<IReceiptModel>('Receipt', ReceiptSchema);