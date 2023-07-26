import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Order from "../models/Order";
import Table from "../models/Table";

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    const order = new Order({
        _id: new mongoose.Types.ObjectId()
    });
    try {
        await order.save();
        const table = await Table.findById(req.params.tableId);
        table?.queue?.push(order.id);
        await table?.save();
        res.status(201).json({ order });
    } catch (err) {
        return res.status(500).json({ err });
    }
}

const readAll = (req: Request, res: Response, next: NextFunction) => {
    return Order.find()
        .then((orders) => res.status(200).json({orders}))
        .catch(err => res.status(500).json({err}));
}

const readOrder = (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params.orderId;
    return Order.findById(orderId)  
        .then((order) => order ? res.status(200).json({order}) : res.status(404).json({message: "Not found"}))
        .catch(err => res.status(500).json({err}));
}

const updateOrder = (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params.orderId;
    return Order.findById(orderId)
        .then((order) => {
            if(order){
                order.set(req.body);
                return order
                    .save()
                    .then(order => {res.status(200).json({order})})
                    .catch(err => res.status(500).json({err}));
            }else{
                res.status(404).json({message: "Not found"});
            }
        })
        .catch(err => res.status(500).json({err}));
}

const deleteOrder = (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params.orderId;
    return Order.findByIdAndDelete(orderId)
        .then((order) => order ? res.status(200).json({message: "Deleted"}) : res.status(404).json({message: "Not found"}))
        .catch(err => res.status(500).json({err}));
}

export default { createOrder, readAll, readOrder, updateOrder, deleteOrder };