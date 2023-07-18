import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import User from "../models/User";
import bcryptjs from 'bcryptjs'

const CreateUser = async (req: Request, res: Response, next: NextFunction) => {
    const { username, firstName, lastName, roles , email, password} = req.body;
    await bcryptjs.hash(password, 10, (hashError, hash) => {
        if (hashError) return res.status(500).json({message: hashError.message, error: hashError});
        const user = new User({
            _id: new mongoose.Types.ObjectId(),
            username, firstName, lastName, roles, email, password: hash
        });
        return user
            .save()
            .then(user => {res.status(201).json({user})})
            .catch(err => res.status(500).json({err}));
    });
}

const readAll = (req: Request, res: Response, next: NextFunction) => {
    return User.find()
        .select("-password").select("-refreshToken")
        .then((users) => res.status(200).json({users}))
        .catch(err => res.status(500).json({err}));
}

const readUser = (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;
    return User.findById(userId).select("-password").select("-refreshToken")
        .then((user) => user ? res.status(200).json({user}) : res.status(404).json({message: "Not found"}))
        .catch(err => res.status(500).json({err}));
}

const updateUser = (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;
    return User.findById(userId)
        .then((user) => {
            if(user){
                user.set(req.body);
                return user
                    .save()
                    .then(user => res.status(200).json({user}))
                    .catch(err => res.status(500).json({err}));
            }else{
                res.status(404).json({message: "Not found"});
            }
        })
        .catch(err => res.status(500).json({err}));
}

const deleteUser = (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;
    return User.findByIdAndDelete(userId)
        .then((user) => user ? res.status(200).json({message: "Deleted"}) : res.status(404).json({message: "Not found"}))
        .catch(err => res.status(500).json({err}));
}

export default { CreateUser, readAll, readUser, updateUser, deleteUser};