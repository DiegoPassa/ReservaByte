import { Request, Response, NextFunction } from "express";
import Order from "../models/Order";
import Table from "../models/Table";

const readAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orders = await Order.find();
        return res.status(200).json({ orders });
    } catch (err) {
        return res.status(500).json({ err });
    }
}

const readOrder = async (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params.orderId;
    try {
        const order = await Order.findById(orderId);
        return order ? res.status(200).json({ order }) : res.status(404).json({ message: "Not found" });
    } catch (err) {
        return res.status(500).json({ err });
    }
}

const updateOrder = async (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params.orderId;
    try {
        const order = await Order.findById(orderId);
        if (!order) return res.sendStatus(404);
        order.set(req.body);
        await order.save();
        return res.status(200).json({order});
    } catch (error) {
        return res.status(500).json({error});
    }
}

const deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params.orderId;
    try {
        const order = await Order.findByIdAndDelete(orderId);
        const table = await Table.findOneAndUpdate({queue: orderId}, {
            $pull: {
                queue: orderId
            }
        });
        return (order && table) ? res.status(200).json({ message: "Deleted" }) : res.status(404).json({ message: "Not found" });
    } catch (err) {
        return res.status(500).json({ err });
    }
}

export default { readAll, readOrder, updateOrder, deleteOrder };