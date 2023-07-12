import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true}
});

export const UserModel = mongoose.model('User', UserSchema);

export const GetUsers = () => UserModel.find();
export const GetUsersByUsername = (username: String) => UserModel.findOne({ username });
export const CreateUser = (values: Record<string, any> ) => new UserModel(values).save().then((user) => user.toObject());
export const DeleteUserById = (id: String) => UserModel.findByIdAndDelete({_id: id});
export const UpdateUserById = (id: String, values: Record<string, any>) => UserModel.findByIdAndUpdate(id, values);