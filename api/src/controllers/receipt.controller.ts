import { Request, Response, NextFunction } from "express";
import Receipt from "../models/Receipt";
import Table from "../models/Table";
import Order from "../models/Order";
import { SocketIOService } from "../libraries/socket.io";

const createReceipt = async (req: Request, res: Response, next: NextFunction) => {
    const tableId = req.body.tableId;

    // Create new bill entity
    const receipt = new Receipt({
        table: tableId
    });

    try {
        // populate receipt object with the necessary informations
        await receipt.populate({path: 'table', select: 'queue cover seatsOccupied'});
        await receipt.populate({path: 'table.queue', select: 'menu _id'});
        await receipt.populate({path: 'table.queue.menu', select: 'name price'});

        // add cover if present
        if (receipt.table.cover) receipt.items.push({name: 'cover', price: 2*receipt.table.seatsOccupied });

        // populate receipt items[], totalPrice and lastly delete order from collection
        receipt.table.queue?.forEach( async (e: any) => {
            receipt.items.push({name: e.menu.name, price: e.menu.price});
            await Order.findByIdAndDelete(e._id);
            // SocketIOService.instance().emitAll('order:delete', e._id);
        });

        // calculate final price
        receipt.items.forEach( e => receipt.total += e.price);

        // clean Table
        const table = await Table.findByIdAndUpdate(tableId, {
            $unset: { reserved: '', waiters: [], queue: [] },
            $set: { seatsOccupied: 0 }
        }, {new: true})
        await receipt.save();
        SocketIOService.instance().emitAll('table:update', table);
        return res.status(201).send(receipt);
    } catch (error) {
        return res.status(500).json({error });
    }
}

const readAll = async (req: Request, res: Response, next: NextFunction) => {
    // TODO Add query string to filter

    try {
        const receipts = await Receipt.find();
        return res.status(200).json({ receipts });
    } catch (err) {
        return res.status(500).json({ err });
    }
}

const readReceipt = async (req: Request, res: Response, next: NextFunction) => {
    const receiptId = req.params.receiptId;
    try {
        const receipt = await Receipt.findById(receiptId);
        return receipt ? res.status(200).json({ receipt }) : res.status(404).json({ message: "Not found" });
    } catch (err) {
        return res.status(500).json({ err });
    }
}

const updateReceipt = async (req: Request, res: Response, next: NextFunction) => {
        const receiptId = req.params.receiptId;
        try {
            const receipt = await Receipt.findByIdAndUpdate(receiptId, req.body, {new: true});
            return res.status(200).json({receipt});
        } catch (error) {
            return res.status(500).json({error});
        }
}

const deleteReceipt = async (req: Request, res: Response, next: NextFunction) => {
    const receiptId = req.params.receiptId;
    try {
        const receipt = await Receipt.findByIdAndDelete(receiptId);
        return receipt ? res.status(200).json({ message: "Deleted" }) : res.status(404).json({ message: "Not found" });
    } catch (err) {
        return res.status(500).json({ err });
    }
}

export default { createReceipt, readAll, readReceipt, updateReceipt, deleteReceipt };