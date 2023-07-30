import { Request, Response, NextFunction } from "express";
import Receipt from "../models/Receipt";
import Table from "../models/Table";

const createReceipt = async (req: Request, res: Response, next: NextFunction) => {
    const tableId = req.params.tableId;
    const receipt = new Receipt({
        table: tableId
    });
    try {
        await receipt.populate({path: 'table', select: 'queue cover seatsOccupied'});
        await receipt.populate({path: 'table.queue', select: 'menu'});
        await receipt.populate({path: 'table.queue.menu', select: 'name price'});
        receipt.table.queue?.forEach( e => {
            receipt.items.push({name: e.menu.name, price: e.menu.price});
        });
        if (receipt.table.cover) receipt.items.push({name: 'cover', price: 2*receipt.table.seatsOccupied });
        receipt.items.forEach( e => { receipt.total += e.price});
        await Table.findByIdAndUpdate(tableId, {
            $unset: { queue: [], reserved: '' },
            $set: { seatsOccupied: 0 }
        })
        await receipt.save();
        return res.status(201).json({receipt});
    } catch (error) {
        return res.status(500).json({error });
    }
}

const readAll = async (req: Request, res: Response, next: NextFunction) => {
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