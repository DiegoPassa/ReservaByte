import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Table from "../models/Table";
import Order from "../models/Order";
import Menu from "../models/Menu";

const createTable = (req: Request, res: Response, next: NextFunction) => {
    const { maxSeats, reserved, tableNumber } = req.body;
    const table = new Table({
        _id: new mongoose.Types.ObjectId(),
        maxSeats: maxSeats,
        reserved: reserved,
        tableNumber: tableNumber
    });
    return table
        .save()
        .then(table => {res.status(201).json({table, message: "Item added"})})
        .catch(err => res.status(500).json({err}));
}

const readAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tables = await Table.find();
        return res.status(200).json({ tables });
    } catch (err) {
        return res.status(500).json({ err });
    }
}

const readTable = (req: Request, res: Response, next: NextFunction) => {
    const tableId = req.params.tableId;
    return Table.findById(tableId)
        .then((table) => table ? res.status(200).json({table}) : res.status(404).json({message: "Not found"}))
        .catch(err => res.status(500).json({err}));
}

const updateTable = (req: Request, res: Response, next: NextFunction) => {
    const tableId = req.params.tableId;
    return Table.findById(tableId)
        .then((table) => {
            if(table){
                table.set(req.body);
                return table
                    .save()
                    .then(table => {res.status(200).json({table})})
                    .catch(err => res.status(500).json({err}));
            }else{
                res.status(404).json({message: "Not found"});
            }
        })
        .catch(err => res.status(500).json({err}));
}

const deleteTable = (req: Request, res: Response, next: NextFunction) => {
    const tableId = req.params.tableId;
    return Table.findByIdAndDelete(tableId)
        .then((table) => table ? res.status(200).json({message: "Deleted"}) : res.status(404).json({message: "Not found"}))
        .catch(err => res.status(500).json({err}));
}

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    const { menuId, tableId } = req.params;
    const menu = await Menu.findById(menuId)
    const table = await Table.findById(tableId);
    if(!menu || !table) return res.sendStatus(404);
    const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        menu: menuId,
        table: tableId
    });
    order.estimatedCompletation = new Date(order.timestamp.getTime() + menu.preparationTime*60000);
    menu.totalOrders++;
    try {
        await menu.save();
        await order.save();
        table.queue?.push(order.id);
        await table.save();
        res.status(201).json({ order });
    } catch (err) {
        return res.status(500).json({ err });
    }
}

export default { createTable, readAll, readTable, updateTable, deleteTable, createOrder };