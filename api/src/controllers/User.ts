import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import bcrypt from 'bcrypt'

const createUser = (req: Request, res: Response, next: NextFunction) => {
    const { username, firstName, lastName, roles , email, password} = req.body;
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) return res.status(500).json({ message: err.message, error: err });
        const user = new User({
            username, firstName, lastName, roles, email, password: hash
        });
        return user
            .save()
            .then(user => { res.status(201).json({ user }); })
            .catch(err => res.status(500).json({ err }));
    });
}

const readAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await User.find({}, '-password -refreshToken');
        return res.status(200).json({users})
    } catch (error) {
        return res.status(500).json({error});
    }
}

const readUser = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;
    try {
        const user = await User.findById(userId).select("-password").select("-refreshToken");
        return user ? res.status(200).json({ user }) : res.status(404).json({ message: "Not found" });
    } catch (err) {
        return res.status(500).json({ err });
    }
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

export default { createUser, readAll, readUser, updateUser, deleteUser};