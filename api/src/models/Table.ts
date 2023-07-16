import mongoose, { Document, Schema } from "mongoose"

export interface ITable{
    maxSeats: number,
    reserved: boolean,
    seatsOccupied: number | 0,
    tableNumber: number
};

export interface ITableModel extends ITable, Document {};

const TableSchema: Schema = new Schema({
    maxSeats: { type: Number, require: true },
    reserved: { type: Boolean, require: true },
    seatsOccupied: { type: Number, default: 0, require: true },
    tableNumber: { type: Number, unique: true, require: true }
});

export default mongoose.model<ITableModel>('Table', TableSchema);