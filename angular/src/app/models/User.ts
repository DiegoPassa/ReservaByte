export enum UserRole{
    Admin = 'admin',
    Cashier = 'cashier',
    Bartender = 'bartender',
    Cook = 'cook',
    Waiter = 'waiter'
}

export interface IUser {
    _id?: string,
    username?: string,
    firstName?: string,
    lastName?: string
    email?: string
    role?: UserRole
}

export interface ICook extends IUser{
    dishesPrepared: number
}
export interface IWaiter extends IUser{
    tablesServed: number,
    customersServed: number
}
export interface IBartender extends IUser {
    drinksServed: number
}
export interface ICashier extends IUser{
    billsPrepared: number
}