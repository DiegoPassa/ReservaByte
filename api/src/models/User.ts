import mongoose, { Document, Schema } from "mongoose";

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
    password: string,
    refreshToken?: string
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

/** MONGO MODEL */

export interface IUserModel extends IUser, Document {};

const UserSchema: Schema = new Schema<IUser>({
    username: { type: String, unique: true, required: true},
    firstName: { type: String, required: true},
    lastName: { type: String, required: true},
    role: { type: String, enum: UserRole, required: true},
    email: { type: String, unique: true, lowercase: true, required: true},
    password: { type: String, min: 8, required: true},
    refreshToken: { type: String, required: false},
}, { 
    versionKey: false,
    discriminatorKey: 'role'
});

export const User = mongoose.model<IUserModel>('User', UserSchema);

// TODO Add some other data to role stats

export const Cook = User.discriminator(
    UserRole.Cook,
    new Schema<ICook>({
        dishesPrepared: {type: Number, default: 0, required: true},
    })
);

export const Waiter = User.discriminator(
    UserRole.Waiter,
    new Schema<IWaiter>({
        tablesServed: {type: Number, default: 0, required: true},
        customersServed: {type: Number, default: 0, required: true}
    })
);

export const Bartender = User.discriminator(
    UserRole.Bartender,
    new Schema<IBartender>({
        drinksServed: {type: Number, default: 0, required: true},
    })
);

export const Cashier = User.discriminator(
    UserRole.Cashier,
    new Schema<ICashier>({
        billsPrepared: {type: Number, default: 0, required: true},
    })
);