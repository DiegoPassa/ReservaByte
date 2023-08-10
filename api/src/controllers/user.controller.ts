import { Request, Response, NextFunction } from "express";
import { Bartender, Cashier, Cook, User, UserRole, Waiter } from "../models/User";
import bcrypt from 'bcrypt'

const createUser = async (req: Request, res: Response, next: NextFunction) => {
    const { username, firstName, lastName, role , email, password} = req.body;
    try {
        const hash = await bcrypt.hash(password, 10);
        const user = new User({
            username, 
            firstName, 
            lastName, 
            role, 
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
    // TODO Add query string to filter

    try {
        const users = await User.find({}, '-password');
        return res.status(200).json({users})
    } catch (error) {
        return res.status(500).json({error});
    }
}

const readUser = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;
    try {
        const user = await User.findById(userId).select("-password");
        return user ? res.status(200).send(user) : res.status(404).json({ message: "Not found" });
    } catch (err) {
        return res.status(500).json({ err });
    }
}

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;
    try {
        const user = await User.findById(userId);
        if(user){
            await user.set(req.body).save();
            return res.status(200).json({user});
        }
        return res.status(404).json({ message: "Not found" });
    } catch (error) {
        console.log(error);
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

// [POST] /messages?type=ATTACHMENT

// const MessageTypeModels = {
//     'ATTACHMENT': AttachmentMessage,
//     'LIST': ListMessage,
//   };
  
//   function updateMessage(id, type, data) {
//     MessageTypeModels[type].findOneAndUpdate({ _id: id }, data);
//   }