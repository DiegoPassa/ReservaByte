export enum UserRole{
    Admin = 'admin',
    Cashier = 'cashier',
    Bartender = 'bartender',
    Cook = 'cook',
    Waiter = 'waiter'
}

export interface IUser {
    username: string,
    firstName: string,
    lastName: string,
    role: UserRole,
    email: string,
    password: string
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