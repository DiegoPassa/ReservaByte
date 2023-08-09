import { IToken } from "./DecodedJWT"

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
    _accessToken: string

    getAccessToken(): string | null;
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

export class User{

    user: IUser
    tokenDecoded: IToken

    constructor(user: IUser, tokenDecoded: IToken, accessToken: string){
        this.user = user;
        this.tokenDecoded = tokenDecoded;
        this.user._accessToken = accessToken;
    }

    getAccessToken() {
        if(new Date().getTime() > this.tokenDecoded.exp){
            return null
        }else{
            return this.user._accessToken;
        }
    }

}