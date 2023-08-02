import { Request, Response, NextFunction } from "express";
import Order from "../models/Order";
import { UserRole } from "../models/User";
import { MenuType } from "../models/Menu";

const readAll = async (req: Request, res: Response, next: NextFunction) => {
    // TODO Add query string to filter
    try {
        let orders;
        switch (res.locals.jwtRole) {

            case UserRole.Cook:
                orders = await Order.find({'menu.type': MenuType.Dish});
                break;

            case UserRole.Bartender:
                orders = await Order.find({'menu.type': MenuType.Drink});
                break;
        
            default:
                orders = await Order.find();
                break;
        }
        return res.status(200).json({ orders });
    } catch (err) {
        return res.status(500).json({ err });
    }
}

const readOrder = async (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params.orderId;
    try {
        let order;
        switch (res.locals.jwtRole) {

            case UserRole.Cook:
                order = await Order.findOne({_id: orderId, 'menu.type': MenuType.Dish});
                break;

            case UserRole.Bartender:
                order = await Order.findOne({_id: orderId, 'menu.type': MenuType.Drink});
                break;
        
            default:
                order = await Order.findById(orderId);
                break;
        }
        return order ? res.status(200).json({ order }) : res.status(404).json({ message: "Not found" });
    } catch (err) {
        return res.status(500).json({ err });
    }
}

const updateOrder = async (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params.orderId;
    try {
        let order;
        switch (res.locals.jwtRole) {

            case UserRole.Cook:
                order = await Order.findOneAndUpdate({_id: orderId, 'menu.type': MenuType.Dish}, req.body, {new: true});
                break;

            case UserRole.Bartender:
                order = await Order.findOneAndUpdate({_id: orderId, 'menu.type': MenuType.Drink}, req.body, {new: true});
                break;
        
            default:
                order = await Order.findByIdAndUpdate(orderId, req.body, {new: true});
                break;
        }
        return res.status(200).json({order});
    } catch (error) {
        return res.status(500).json({error});
    }
}

const deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params.orderId;
    try {
        const order = await Order.findByIdAndDelete(orderId);
        return order ? res.status(200).json({ message: "Deleted" }) : res.status(404).json({ message: "Not found" });
    } catch (err) {
        return res.status(500).json({ err });
    }
}

export default { readAll, readOrder, updateOrder, deleteOrder };