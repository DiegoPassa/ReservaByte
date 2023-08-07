import { ITable } from "./Table";

export interface IReceipt{
    table: ITable,
    items: {name: string, price: number}[],
    total: number,
    timestamp: Date
};
