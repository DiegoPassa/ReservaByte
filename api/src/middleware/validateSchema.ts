import Joi, {ObjectSchema} from "joi";
import { Request, Response, NextFunction } from "express";
import log from "../libraries/Logger";
import { IBartender, ICashier, ICook, IUser, IWaiter, UserRole } from "../models/User";
import { IMenu, MenuType } from "../models/Menu";
import { ITable } from "../models/Table";

export const ValidateSchema = (schema: ObjectSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.validateAsync(req.body, {convert: false});
            next();
        } catch (error) {
            log.error(error);
            return res.status(422).json({error});
        }
    };
};

// TODO Finish to implement schema validators
export const Schemas = {
    user: {
        create: Joi.object<IUser>({
            username: Joi.string().required(),
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            // roles: Joi.array().items(Joi.string().valid(UserRole.Admin, UserRole.Bartender, UserRole.Cashier, UserRole.Cook, UserRole.Waiter)).required(),
            role: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(8).required()
        }),
        update: Joi.object<IUser & ICashier & ICook & IWaiter & IBartender>({
            username: Joi.string(),
            // role: Joi.string().valid(UserRole.Admin, UserRole.Bartender, UserRole.Cashier, UserRole.Cook, UserRole.Waiter),
            email: Joi.string().email(),
            firstName: Joi.string(),
            lastName: Joi.string(),
            password: Joi.string(),

            billsPrepared: Joi.number(),
            customersServed: Joi.number(),
            dishesPrepared: Joi.number(),
            drinksServed: Joi.number(),
            tablesServed: Joi.number()
            // role: Joi.array().items(Joi.string().valid(UserRole.Admin, UserRole.Bartender, UserRole.Cashier, UserRole.Cook, UserRole.Waiter))
        })
    },
    menu: {
        create: Joi.object<IMenu>({
            name: Joi.string().required(),
            price: Joi.number().precision(2).min(0).required(),
            ingredients: Joi.array().items(Joi.string()).required(),
            portionSize: Joi.number().min(0).required(),
            preparationTime: Joi.number().min(0),
            totalOrders: Joi.number().equal(0),
            type: Joi.string().valid(MenuType.Dish, MenuType.Drink).required()
        })
    },
    table: {
        create: Joi.object<ITable>({
            maxSeats: Joi.number().min(1).required(),
            seatsOccupied: Joi.number().equal(0),
            tableNumber: Joi.number().required(),
            cover: Joi.boolean().required()
        })
    }
}