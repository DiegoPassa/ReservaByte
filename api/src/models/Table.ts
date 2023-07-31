import mongoose, { Document, Schema, SchemaTypes } from "mongoose"
import { IOrder } from "./Order";
import { IUser } from "./User";

export interface ITable{
    maxSeats: number,
    reserved: {status: boolean, reservedTime?: Date, reservedBy?: string},
    cover: boolean,
    seatsOccupied: number | 0,
    tableNumber: number,
    waiters?: IUser[],
    queue?: IOrder[]
};

export interface ITableModel extends ITable, Document {};

const TableSchema: Schema = new Schema<ITable>({
    maxSeats: { type: Number, required: true },
    reserved: { status: {type: Boolean, default: false, required: true}, reservedTime: {type: Date}, reservedBy: {type: String} },
    cover: { type: Boolean, required: true },
    seatsOccupied: { type: Number, default: 0, required: true },
    tableNumber: { type: Number, unique: true, required: true },
    waiters: { type: [SchemaTypes.ObjectId], ref: 'User' },
    queue: { type: [SchemaTypes.ObjectId], ref: 'Order' }
}, { versionKey: false });

export default mongoose.model<ITableModel>('Table', TableSchema);