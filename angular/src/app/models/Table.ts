import { IOrder } from "./Order";
import { IUser } from "./User";

export interface ITable{
    _id?: string,
    maxSeats?: number,
    reserved?: {status?: boolean, reservedTime?: Date, reservedBy?: string, reservedSeats?: number},
    cover?: boolean,
    seatsOccupied?: number | 0,
    tableNumber?: number,
    waiters?: Set<IUser>,
    queue?: IOrder[]
};