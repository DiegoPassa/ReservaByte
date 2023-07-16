import Joi, {ObjectSchema} from "joi";
import { Request, Response, NextFunction } from "express";
import log from "../libraries/Logger";
import { IUser } from "../models/User";
import { IMenu } from "../models/Menu";
import { ITable } from "../models/Table";

export const ValidateSchema = (schema: ObjectSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.validateAsync(req.body);
            next();
        } catch (error) {
            log.error(error);
            return res.status(422).json({error});
        }
    };
};

export const Schemas = {
    user: {
        create: Joi.object<IUser>({
            username: Joi.string().required(),
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            roles: Joi.array().required()
        }),
        update: Joi.object<IUser>({
            username: Joi.string().required()
        })
    },
    menu: {
        create: Joi.object<IMenu>({
            name: Joi.string().required(),
            price: Joi.number().min(0).required(),
            ingredients: Joi.array().items(Joi.string()).required(),
            portionSize: Joi.number().min(0).required(),
            preparationTime: Joi.number().min(0),
            totalOrders: Joi.number().equal(0).required(),
            type: Joi.string().valid('dish', 'drink').required()
        })
    },
    table: {
        create: Joi.object<ITable>({
            maxSeats: Joi.number().min(1).required(),
            reserved: Joi.boolean().required(),
            seatsOccupied: Joi.number().equal(0),
            tableNumber: Joi.number().required()
        })
    }
}