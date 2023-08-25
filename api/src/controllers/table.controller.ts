import { Request, Response, NextFunction } from "express";
import Table from "../models/Table";
import Order from "../models/Order";
import { Menu, MenuType } from "../models/Menu";
import { parseQuerySort } from "../libraries/parseQuerySort";
import { SocketIOService } from "../libraries/socket.io";
import { UserRole } from "../models/User";

const createTable = async (req: Request, res: Response, next: NextFunction) => {
    const { maxSeats, reserved, tableNumber, cover } = req.body;
    const table = new Table({
        maxSeats: maxSeats,
        reserved: reserved,
        tableNumber: tableNumber,
        cover: cover
    });
    // const queue = new Queue({
    //     table: table._id
    // })
    try {
        await table.save();
        // await queue.save();
        SocketIOService.instance().emitAll('table:new', table);
        return res.status(201).json({ table, message: "Item added" });
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
        return res.status(200).send(tables);
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
        SocketIOService.instance().emitAll('table:update', table);
        return res.status(200).send(table);
    } catch (error) {
        return res.status(500).json({error});
    }
}

const deleteTable = async (req: Request, res: Response, next: NextFunction) => {
    const tableId = req.params.tableId;
    try {
        const table = await Table.findByIdAndDelete(tableId);
        if(table){
            SocketIOService.instance().getServer().emit('table:delete', tableId);
            return res.status(200).json({ message: "Deleted" })
        }
        return res.status(404).json({ message: "Not found" });
    } catch (err) {
        return res.status(500).json({ err });
    }
}

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    const { menuId, tableId } = req.params;
    try {
        const order = new Order({
            menu: await Menu.findById(menuId),
            table: tableId,
            createdAt: new Date()
        });
        order.estimatedCompletation = new Date(order.createdAt.getTime() + order.menu.preparationTime*60000);
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
        SocketIOService.instance().getServer().emit('order:new', {order: order, role: order.menu.type === MenuType.Dish ? UserRole.Cook : UserRole.Bartender});
        res.status(201).send(order);
    } catch (err) {
        return res.status(500).json({ err });
    }
}

// const createOrder = async (req: Request, res: Response, next: NextFunction) => {
//     const { menuId, tableId } = req.params;
//     try {
//         const tableQueue = await Queue.find({table: tableId});
//         const newOrder: IOrder = {
//             menu: await Menu.findById(menuId)
//         }
        
//         const order = new Order({
//             menu: await Menu.findById(menuId),
//             table: tableId
//         });

//         order.estimatedCompletation = new Date(order.createdAt.getTime() + order.menu.preparationTime*60000);
//         await Menu.findByIdAndUpdate({_id: menuId}, {
//             $inc: {
//                 totalOrders: 1
//             }
//         });
//         await Table.findByIdAndUpdate({_id: tableId}, {
//             $push: {
//                 queue: order._id
//             }
//         });
//         await order.save();
//         res.status(201).json({ order });
//     } catch (err) {
//         return res.status(500).json({ err });
//     }
// }

export default { createTable, readAll, readTable, updateTable, deleteTable, createOrder };