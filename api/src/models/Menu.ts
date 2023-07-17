import mongoose, { Document, Schema } from "mongoose"

export enum MenuType{
    Dish = 'dish',
    Drink = 'drink'
}

export interface IMenu{
    name: string,
    price: number,
    ingredients: string[],
    portionSize: number,
    preparationTime: number,
    totalOrders: number | 0,
    type: MenuType
};

export interface IMenuModel extends IMenu, Document {};

const MenuSchema: Schema = new Schema({
    name: { type: String, unique: true, require: true},
    price: { type: Number,  require: true},
    ingredients: { type: [String], require: true},
    portionSize: { type: Number, require: true},
    preparationTime: { type: Number, require: true},
    totalOrders: { type: Number, default: 0, require: true},
    type: { type: String, enum: MenuType, require: true},
});

export default mongoose.model<IMenuModel>('Menu', MenuSchema);