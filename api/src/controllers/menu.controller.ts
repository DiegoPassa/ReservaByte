import { Request, Response, NextFunction } from "express";
import Menu from "../models/Menu";
import { parseQuerySort } from "../libraries/parseQuerySort";

const createMenu = async (req: Request, res: Response, next: NextFunction) => {
    const { name, price, ingredients, portionSize, preparationTime, type } = req.body;
    const menu = new Menu({
        name,
        price,
        ingredients,
        portionSize,
        preparationTime,
        type
    });
    try {
        await menu.save();
        res.status(201).json({ menu, message: "Item added" });
    } catch (err) {
        return res.status(500).json({ err });
    }
}

const readAll = async (req: Request, res: Response, next: NextFunction) => {
    let filter: {[key: string]: any} = {};

    const { name, price, ingredients, portionSize, preparationTime, totalOrders, type, sort} = req.query;

    if (name) filter.name = name;
    if (price) filter.price = price;
    if (ingredients) filter.ingredients = {$all: ingredients.toString().split(',')}
    if (portionSize) filter.portionSize = portionSize;
    if (preparationTime) filter.preparationTime = preparationTime;
    if (totalOrders) filter.totalOrders = totalOrders;
    if (type) filter.type = type;

    const skip: number = parseInt(req.query?.skip as string) || 0;
    const limit: number = parseInt(req.query?.limit as string) || 20;

    const sortObj = (sort) ? parseQuerySort(sort.toString()) : {};

    try {
        const menus = await Menu.find({$and: [filter]}).skip(skip).limit(limit).sort(sortObj);
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

const updateMenu = async (req: Request, res: Response, next: NextFunction) => {
        const menuId = req.params.menuId;
        try {
            const menu = await Menu.findByIdAndUpdate(menuId, req.body, {new: true});
            return res.status(200).json({menu});
        } catch (error) {
            return res.status(500).json({error});
        }
}

const deleteMenu = async (req: Request, res: Response, next: NextFunction) => {
    const menuId = req.params.menuId;
    try {
        const menu = await Menu.findByIdAndDelete(menuId);
        return menu ? res.status(200).json({ message: "Deleted" }) : res.status(404).json({ message: "Not found" });
    } catch (err) {
        return res.status(500).json({ err });
    }
}

export default { createMenu, readAll, readMenu, updateMenu, deleteMenu };