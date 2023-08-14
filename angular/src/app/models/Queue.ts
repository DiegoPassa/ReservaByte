import { IOrder } from "./Order";

export interface IQueue{
    _id: string,
    orders: IOrder[]
}