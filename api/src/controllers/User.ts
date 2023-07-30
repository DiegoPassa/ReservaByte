import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import bcrypt from 'bcrypt'

const createUser = async (req: Request, res: Response, next: NextFunction) => {
    const { username, firstName, lastName, roles , email, password} = req.body;
    try {
        const hash = await bcrypt.hash(password, 10);
        const user = new User({
            username, 
            firstName, 
            lastName, 
            roles, 
            email, 
            password: hash
        });
        await user.save();
        res.status(201).json({ user });
    } catch (error) {
        res.status(500).json({ error });
    }
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

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;
    try {
        const user = await User.findByIdAndUpdate({_id: userId}, req.body, {new: true});
        return res.status(200).json({user});
    } catch (error) {
        return res.status(500).json({error});
    }
}

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;
    try {
        const user = await User.findByIdAndDelete(userId);
        return user ? res.status(200).json({ message: "Deleted" }) : res.status(404).json({ message: "Not found" });
    } catch (err) {
        return res.status(500).json({ err });
    }
}

export default { createUser, readAll, readUser, updateUser, deleteUser};