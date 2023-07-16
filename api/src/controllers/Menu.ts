import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Menu from "../models/Menu";

const CreateMenu = (req: Request, res: Response, next: NextFunction) => {
    const { name, price, ing, portion, prep, totalOrders, type } = req.body;
    const menu = new Menu({
        _id: new mongoose.Types.ObjectId(),
        name, price, ing, portion, prep, totalOrders, type 
    });
    return menu
        .save()
        .then(menu => {res.status(200).json({menu, message: "Item added"})})
        .catch(err => res.status(500).json({err}));
}

const readAll = (req: Request, res: Response, next: NextFunction) => {
    return Menu.find()
        .then((menus) => res.status(200).json({menus}))
        .catch(err => res.status(500).json({err}));
}

const readDishes = (req: Request, res: Response, next: NextFunction) => {
    return Menu.find({type: 'dish'})
        .then((menus) => res.status(200).json({menus}))
        .catch(err => res.status(500).json({err}));
}

const readDrinks = (req: Request, res: Response, next: NextFunction) => {
    return Menu.find({type: 'drink'})
        .then((menus) => res.status(200).json({menus}))
        .catch(err => res.status(500).json({err}));
}

const readMenu = (req: Request, res: Response, next: NextFunction) => {
    const menuId = req.params.menuId;
    return Menu.findById(menuId)
        .then((menu) => menu ? res.status(200).json({menu}) : res.status(404).json({message: "Not found"}))
        .catch(err => res.status(500).json({err}));
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

export default { CreateMenu, readAll, readDishes, readDrinks, readMenu, updateMenu, deleteMenu };