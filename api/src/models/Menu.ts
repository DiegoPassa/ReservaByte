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

interface IMenuModel extends IMenu, Document {};

export const MenuSchema: Schema = new Schema<IMenu>({
    name: { type: String, lowercase: true, required: true},
    price: { type: Number,  required: true},
    ingredients: { type: [String], lowercase: true, required: true},
    portionSize: { type: Number, required: true},
    preparationTime: { type: Number, required: true},
    totalOrders: { type: Number, default: 0, required: true},
    type: { type: String, enum: MenuType, required: true},
}, { versionKey: false });

export default mongoose.model<IMenuModel>('Menu', MenuSchema);