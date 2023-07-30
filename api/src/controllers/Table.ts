import { Request, Response, NextFunction } from "express";
import Table from "../models/Table";
import Order from "../models/Order";
import Menu from "../models/Menu";
import { parseQuerySort } from "../libraries/parseQuerySort";

const createTable = async (req: Request, res: Response, next: NextFunction) => {
    const { maxSeats, reserved, tableNumber, cover } = req.body;
    const table = new Table({
        maxSeats: maxSeats,
        reserved: reserved,
        tableNumber: tableNumber,
        cover: cover
    });
    try {
        await table.save();
        res.status(201).json({ table, message: "Item added" });
    } catch (err) {
        return res.status(500).json({ err });
    }
}

const readAll = async (req: Request, res: Response, next: NextFunction) => {

    let filter: {[key: string]: any} = {};

    const { maxSeats, reserved, seatsOccupied, tableNumber, cover, waiters, queue, sort} = req.query;

    if (maxSeats) filter.maxSeats = maxSeats;
    if (reserved) filter.reserved = reserved;
    if (seatsOccupied) filter.seatsOccupied = seatsOccupied;
    if (tableNumber) filter.tableNumber = tableNumber;
    if (cover) filter.cover = cover;
    // if (waiters) filter.waiters = {$all: waiters.toString().split(',')};
    // if (queue) filter.queue = {$all: {completed: true}};

    const skip: number = parseInt(req.query?.skip as string) || 0;
    const limit: number = parseInt(req.query?.limit as string) || 20;

    const sortObj = (sort) ? parseQuerySort(sort.toString()) : {};

    try {
        const tables = await Table.find({$and: [filter]}).skip(skip).limit(limit).sort(sortObj).populate({path: 'queue', select: '-table', populate: { path: 'menu' }}).populate({path: 'waiters'});
        return res.status(200).json({ tables });
    } catch (err) {
        return res.status(500).json({ err });
    }
}

const readTable = async (req: Request, res: Response, next: NextFunction) => {
    const tableId = req.params.tableId;
    try {
        const table = await Table.findById(tableId);
        return table ? res.status(200).json({ table }) : res.status(404).json({ message: "Not found" });
    } catch (err) {
        return res.status(500).json({ err });
    }
}

const updateTable = async (req: Request, res: Response, next: NextFunction) => {
    const tableId = req.params.tableId;
    try {
        const table = await Table.findByIdAndUpdate({_id: tableId}, req.body, {new: true});
        return res.status(200).json({table});
    } catch (error) {
        return res.status(500).json({error});
    }
}

const deleteTable = async (req: Request, res: Response, next: NextFunction) => {
    const tableId = req.params.tableId;
    try {
        const table = await Table.findByIdAndDelete(tableId);
        return table ? res.status(200).json({ message: "Deleted" }) : res.status(404).json({ message: "Not found" });
    } catch (err) {
        return res.status(500).json({ err });
    }
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