import mongoose, { Document, Schema, SchemaTypes } from "mongoose"
import { IDish, IDrink, IMenu, MenuSchema } from "./Menu";
import { ITable } from "./Table";

export interface IOrder{
    menu: IDish | IDrink | IMenu,
    table: ITable,
    createdAt: Date,
    estimatedCompletation: Date,
    completed: boolean
};

export interface IOrderModel extends IOrder, Document {};

const OrderSchema: Schema = new Schema<IOrder>({
    menu: { type: MenuSchema, immutable: true, required: true },
    table: { type: SchemaTypes.ObjectId, ref: 'Table', required: true },
    createdAt: { type: Date, required: true },
    estimatedCompletation: { type: Date, required: true },
    completed: { type: Boolean, default: false, required: true }
}, { versionKey: false });

OrderSchema.pre('findOneAndDelete', async function (next){
    const orderId = this.getQuery()['_id'];
    await mongoose.model('Table').findOneAndUpdate({queue: orderId}, {
        $pull: {
            queue: orderId
        }
    });
    console.log('%s has been removed', orderId);
    next();
});

export default mongoose.model<IOrderModel>('Order', OrderSchema);