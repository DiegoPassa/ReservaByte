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
        const tables = await Table.find()//.populate({path: 'queue'});
        // tables.forEach((e) => {
        //     console.log(`- Table number: ${e.tableNumber}`);
        //     if (e.queue?.length === 0) console.log(" no orders ");
        //     e.queue?.forEach(m => {
        //         console.log(`|-- ${m.menu.name} - ${m.estimatedCompletation.toLocaleString()} - ${m.completed}`);
        //     })
        // });
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
    const order = new Order({
        menu: menuId,
        table: tableId
    });
    await order.populate({path: 'menu'});
    order.estimatedCompletation = new Date(order.timestamp.getTime() + order.menu.preparationTime*60000);
    try {
        await Menu.findByIdAndUpdate({_id: menuId}, {
            $inc: {
                totalOrders: 1
            }
        });
        await Table.findByIdAndUpdate({_id: tableId}, {
            $push: {
                queue: order._id
            }
        });
        await order.save();
        res.status(201).json({ order });
    } catch (err) {
        return res.status(500).json({ err });
    }
}

export default { createTable, readAll, readTable, updateTable, deleteTable, createOrder };