import { IOrder } from "./Order";
import { IUser } from "./User";

export interface ITable{
    maxSeats?: number,
    reserved?: {status?: boolean, reservedTime?: Date, reservedBy?: string},
    cover?: boolean,
    seatsOccupied?: number | 0,
    tableNumber?: number,
    waiters?: IUser[],
    queue?: IOrder[],
    seats?: boolean[],
    _id?: string,
};