import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Table from "../models/Table";

const CreateTable = (req: Request, res: Response, next: NextFunction) => {
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

const readAll = (req: Request, res: Response, next: NextFunction) => {
    return Table.find()
        .then((tables) => res.status(200).json({tables}))
        .catch(err => res.status(500).json({err}));
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

export default { CreateTable, readAll, readTable, updateTable, deleteTable };