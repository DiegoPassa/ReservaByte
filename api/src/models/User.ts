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
    password: string
}

export interface ICook extends IUser{
    statistics: {
        dishesPrepared: number
    }
}
export interface IWaiter extends IUser{
    statistics: {
        tablesServed: number,
        customersServed: number,
        // ordersDispached: number
    }
}
export interface IBartender extends IUser {
    statistics: {
        drinksServed: number
    }
}
export interface ICashier extends IUser{
    statistics: {
        billsPrepared: number
    }
}

/** MONGO MODEL */

export interface IUserModel extends IUser, Document {};

export const UserSchema: Schema = new Schema<IUser>({
    username: { type: String, unique: true, required: true},
    firstName: { type: String, required: true},
    lastName: { type: String, required: true},
    role: { type: String, enum: UserRole, required: true},
    email: { type: String, unique: true, lowercase: true, required: true},
    password: { type: String, min: 8, required: true}
}, { 
    versionKey: false,
    discriminatorKey: 'role'
});

export const User = mongoose.model<IUserModel>('User', UserSchema);

// TODO Add some other data to role stats

export const Cook = User.discriminator(
    UserRole.Cook,
    new Schema<ICook>({
        statistics: {
            dishesPrepared: {type: Number, default: 0, required: true},
        }
    })
);

export const Waiter = User.discriminator(
    UserRole.Waiter,
    new Schema<IWaiter>({
        statistics: {
            tablesServed: {type: Number, default: 0, required: true},
            customersServed: {type: Number, default: 0, required: true}
        }
    })
);

export const Bartender = User.discriminator(
    UserRole.Bartender,
    new Schema<IBartender>({
        statistics: {
            drinksServed: {type: Number, default: 0, required: true},
        }
    })
);

export const Cashier = User.discriminator(
    UserRole.Cashier,
    new Schema<ICashier>({
        statistics: {
            billsPrepared: {type: Number, default: 0, required: true},
        }
    })
);