import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Receipt from "../models/Receipt";

const createReceipt = (req: Request, res: Response, next: NextFunction) => {
    const { StartName } = req.body;
    const receipt = new Receipt({
        _id: new mongoose.Types.ObjectId(),
        StartName
    });
    return receipt
        .save()
        .then(receipt => {res.status(201).json({receipt})})
        .catch(err => res.status(500).json({err}));
}

const readAll = (req: Request, res: Response, next: NextFunction) => {
    return Receipt.find()
        .then((receipts) => res.status(200).json({receipts}))
        .catch(err => res.status(500).json({err}));
}

const readReceipt = (req: Request, res: Response, next: NextFunction) => {
    const receiptId = req.params.receiptId;
    return Receipt.findById(receiptId)
        .then((receipt) => receipt ? res.status(200).json({receipt}) : res.status(404).json({message: "Not found"}))
        .catch(err => res.status(500).json({err}));
}

const updateReceipt = (req: Request, res: Response, next: NextFunction) => {
    const receiptId = req.params.receiptId;
    return Receipt.findById(receiptId)
        .then((receipt) => {
            if(receipt){
                receipt.set(req.body);
                return receipt
                    .save()
                    .then(receipt => {res.status(200).json({receipt})})
                    .catch(err => res.status(500).json({err}));
            }else{
                res.status(404).json({message: "Not found"});
            }
        })
        .catch(err => res.status(500).json({err}));
}

const deleteReceipt = (req: Request, res: Response, next: NextFunction) => {
    const receiptId = req.params.receiptId;
    return Receipt.findByIdAndDelete(receiptId)
        .then((receipt) => receipt ? res.status(200).json({message: "Deleted"}) : res.status(404).json({message: "Not found"}))
        .catch(err => res.status(500).json({err}));
}

export default { createReceipt, readAll, readReceipt, updateReceipt, deleteReceipt };