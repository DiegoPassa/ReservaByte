export enum UserRole{
    Admin = 'admin',
    Cashier = 'cashier',
    Bartender = 'bartender',
    Cook = 'cook',
    Waiter = 'waiter'
}

export interface IUser {
    _id: string,
    username: string,
    firstName: string,
    lastName: string
    email: string
    role: UserRole
    statistics?: any
}

export interface ICook extends IUser{
    statistics: {
        dishesPrepared: number
    }
}
export interface IWaiter extends IUser{
    statistics: {
        tablesServed: number,
        customersServed: number
    }
}
export interface IBartender extends IUser {
    statistics:{
        drinksServed: number
    }
}
export interface ICashier extends IUser{
    statistics: {
        billsPrepared: number
    }
}