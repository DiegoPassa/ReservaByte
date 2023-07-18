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
    roles: UserRole[],
    email: string,
    password: string,
    refreshToken?: string
}

export interface IUserModel extends IUser, Document {};

const UserSchema: Schema = new Schema({
    username: { type: String, unique: true, required: true},
    firstName: { type: String, required: true},
    lastName: { type: String, required: true},
    roles: { type: [String], required: true},
    email: { type: String, unique: true, required: true},
    password: { type: String, required: true},
    refreshToken: { type: String, required: false},
}, { versionKey: false });

export default mongoose.model<IUserModel>('User', UserSchema);

// export const UserModel = mongoose.model('User', UserSchema);

// export const GetUsers = () => UserModel.find();
// export const GetUsersByUsername = (username: String) => UserModel.findOne({ username });
// export const CreateUser = (values: Record<string, any> ) => new UserModel(values).save().then((user) => user.toObject());
// export const DeleteUserById = (id: String) => UserModel.findByIdAndDelete({_id: id});
// export const UpdateUserById = (id: String, values: Record<string, any>) => UserModel.findByIdAndUpdate(id, values);