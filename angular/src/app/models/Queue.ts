import { IOrder } from "./Order";
import { ITable } from "./Table";

export interface IQueue{
    orders: IOrder[]
    table: ITable
}