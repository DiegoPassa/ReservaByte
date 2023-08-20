export enum MenuType{
    Dish = 'dish',
    Drink = 'drink'
}

export interface IMenu{
    _id: string
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