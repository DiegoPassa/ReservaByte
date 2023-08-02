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

export interface IDish extends IMenu {};
export interface IDrink extends IMenu {};

interface IMenuModel extends IMenu, Document {};

export const MenuSchema: Schema = new Schema<IMenu>({
    name: { type: String, lowercase: true, required: true},
    price: { type: Number,  required: true},
    ingredients: { type: [String], lowercase: true, required: true},
    portionSize: { type: Number, required: true},
    preparationTime: { type: Number, required: true},
    totalOrders: { type: Number, default: 0, required: true},
    type: { type: String, enum: MenuType, required: true},
}, { versionKey: false, discriminatorKey: 'type' });

export const Menu = mongoose.model<IMenuModel>('Menu', MenuSchema);

export const Dish = Menu.discriminator(
    MenuType.Dish,
    new Schema<IMenu>({})
);
    
export const Drink = Menu.discriminator(
    MenuType.Drink,
    new Schema<IMenu>({})
);