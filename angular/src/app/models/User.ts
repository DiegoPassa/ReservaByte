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
    lastName: string
    email: string
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

export class User implements IUser{
    username: string
    firstName: string
    lastName: string
    email: string

    constructor(username: string, firstName: string, lastName: string, email: string){
        this.username = username
        this.firstName = firstName
        this.lastName = lastName
        this.email = email
    }

}