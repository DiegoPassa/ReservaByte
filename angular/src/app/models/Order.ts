import { IDish, IDrink, IMenu } from "./Menu";
import { ITable } from "./Table";

export interface IOrder{
    menu: IDish | IDrink | IMenu,
    table: ITable,
    createdAt: Date,
    estimatedCompletation: Date,
    completed: boolean
};