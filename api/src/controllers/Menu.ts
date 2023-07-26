import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Menu from "../models/Menu";

const createMenu = async (req: Request, res: Response, next: NextFunction) => {
    const { name, price, ingredients, portionSize, preparationTime, type } = req.body;
    const menu = new Menu({
        _id: new mongoose.Types.ObjectId(),
        name, price, ingredients, portionSize, preparationTime, type
    });
    try {
        const menu_1 = await menu
            .save();
        res.status(201).json({ menu, message: "Item added" });
    } catch (err) {
        return res.status(500).json({ err });
    }
}

const readAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const menus = await Menu.find(req.query);
        return res.status(200).json({ menus });
    } catch (err) {
        return res.status(500).json({ err });
    }
}

const readMenu = async (req: Request, res: Response, next: NextFunction) => {
    const menuId = req.params.menuId;
    try {
        const menu = await Menu.findById(menuId);
        return menu ? res.status(200).json({ menu }) : res.status(404).json({ message: "Not found" });
    } catch (err) {
        return res.status(500).json({ err });
    }
}

const updateMenu = (req: Request, res: Response, next: NextFunction) => {
    const menuId = req.params.menuId;
    return Menu.findById(menuId)
        .then((menu) => {
            if(menu){
                menu.set(req.body);
                return menu
                    .save()
                    .then(menu => {res.status(200).json({menu})})
                    .catch(err => res.status(500).json({err}));
            }else{
                res.status(404).json({message: "Not found"});
            }
        })
        .catch(err => res.status(500).json({err}));
}

const deleteMenu = (req: Request, res: Response, next: NextFunction) => {
    const menuId = req.params.menuId;
    return Menu.findByIdAndDelete(menuId)
        .then((menu) => menu ? res.status(200).json({message: "Deleted"}) : res.status(404).json({message: "Not found"}))
        .catch(err => res.status(500).json({err}));
}

export default { createMenu, readAll, readMenu, updateMenu, deleteMenu };