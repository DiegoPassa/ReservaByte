import { Request, Response, NextFunction } from "express";
import Order from "../models/Order";
import { UserRole } from "../models/User";
import { MenuType } from "../models/Menu";
import { SocketIOService } from "../libraries/socket.io";

const readAll = async (req: Request, res: Response, next: NextFunction) => {
    // TODO Add query string to filter
    try {
        let orders;
        console.log(res.locals.jwtRole);
        switch (res.locals.jwtRole) {

            case UserRole.Cook:
                orders = await Order.aggregate(
                    [
                        {$match: {'menu.type': MenuType.Dish}},
                        {
                          $group: {
                            _id: '$table', 
                            'orders': {
                              $push: '$$ROOT'
                            }
                          }
                        }, {
                          $sort: {
                            'orders.createdAt': 1
                          }
                        }, {
                          $lookup: {
                            from: 'tables', 
                            localField: '_id', 
                            foreignField: '_id', 
                            as: 'tableArr'
                          }
                        }, {
                          $project: {
                            _id: 1, 
                            orders: 1, 
                            table: {
                              $arrayElemAt: [
                                '$tableArr', 0
                              ]
                            }
                          }
                        }
                    ]
                );
                break;

            case UserRole.Bartender:
                orders = await Order.aggregate(
                    [
                        {$match: {'menu.type': MenuType.Drink}},
                        {
                          $group: {
                            _id: '$table', 
                            'orders': {
                              $push: '$$ROOT'
                            }
                          }
                        }, {
                          $sort: {
                            'orders.createdAt': 1
                          }
                        }, {
                          $lookup: {
                            from: 'tables', 
                            localField: '_id', 
                            foreignField: '_id', 
                            as: 'tableArr'
                          }
                        }, {
                          $project: {
                            _id: 1, 
                            orders: 1, 
                            table: {
                              $arrayElemAt: [
                                '$tableArr', 0
                              ]
                            }
                          }
                        }
                    ]
                );
                break;
                
            default:
                orders = await Order.aggregate(
                    [
                        {
                          $group: {
                            _id: '$table', 
                            'orders': {
                              $push: '$$ROOT'
                            }
                          }
                        }, {
                          $sort: {
                            'orders.createdAt': 1
                          }
                        }, {
                          $lookup: {
                            from: 'tables', 
                            localField: '_id', 
                            foreignField: '_id', 
                            as: 'tableArr'
                          }
                        }, {
                          $project: {
                            _id: 1, 
                            orders: 1, 
                            table: {
                              $arrayElemAt: [
                                '$tableArr', 0
                              ]
                            }
                          }
                        }
                    ]
                );
                break;
        }
        return res.status(200).send(orders);
    } catch (err) {
        return res.status(500).json({ err });
    }
}

const readOrder = async (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params.orderId;
    try {
        let order;
        switch (res.locals.jwtRole) {

            case UserRole.Cook:
                order = await Order.findOne({_id: orderId, 'menu.type': MenuType.Dish});
                break;

            case UserRole.Bartender:
                order = await Order.findOne({_id: orderId, 'menu.type': MenuType.Drink});
                break;
        
            default:
                order = await Order.findById(orderId);
                break;
        }
        return order ? res.status(200).json({ order }) : res.status(404).json({ message: "Not found" });
    } catch (err) {
        return res.status(500).json({ err });
    }
}

const updateOrder = async (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params.orderId;
    try {
        let order;
        switch (res.locals.jwtRole) {

            case UserRole.Cook:
                order = await Order.findOneAndUpdate({_id: orderId, 'menu.type': MenuType.Dish}, req.body, {new: true});
                break;

            case UserRole.Bartender:
                order = await Order.findOneAndUpdate({_id: orderId, 'menu.type': MenuType.Drink}, req.body, {new: true});
                break;
        
            default:
                order = await Order.findByIdAndUpdate(orderId, req.body, {new: true});
                break;
        }
        SocketIOService.instance().emitAll('order:update', order);
        return res.status(200).json({order});
    } catch (error) {
        return res.status(500).json({error});
    }
}

const deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params.orderId;
    try {
        const order = await Order.findByIdAndDelete(orderId);
        if(order){
            SocketIOService.instance().emitAll('order:delete', {tableId: order.table, orderId});
            return res.status(200).json({ message: "Deleted" })
        }
        return res.status(404).json({ message: "Not found" });
    } catch (err) {
        return res.status(500).json({ err });
    }
}

export default { readAll, readOrder, updateOrder, deleteOrder };