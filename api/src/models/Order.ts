import mongoose, { Document, Schema, SchemaTypes } from "mongoose"
import { IMenu } from "./Menu";
import { ITable } from "./Table";

export interface IOrder{
    menu: IMenu,
    table: ITable,
    timestamp: Date,
    estimatedCompletation: Date,
    completed: boolean
};

export interface IOrderModel extends IOrder, Document {};

const OrderSchema: Schema = new Schema<IOrder>({
    menu: { type: SchemaTypes.ObjectId, ref: 'Menu', required: true },
    table: { type: SchemaTypes.ObjectId, ref: 'Table', required: true },
    timestamp: { type: Date, default: new Date(), required: true },
    estimatedCompletation: { type: Date, required: true },
    completed: { type: Boolean, default: false, required: true }
}, { versionKey: false });

export default mongoose.model<IOrderModel>('Order', OrderSchema);