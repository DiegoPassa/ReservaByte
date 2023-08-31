import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { append, insertItem, patch, removeItem, updateItem } from "@ngxs/store/operators";
import { IOrder } from "src/app/models/Order";
import { ITable } from "src/app/models/Table";

export class GetTables {
    static readonly type = '[Tables] GetTables';
    constructor(public tables: ITable[]) {}
}
  
export class AddTable {
    static readonly type = '[Tables] AddTables';
    constructor(public table: ITable) {}
}

export class UpdateTable {
    static readonly type = '[Tables] UpdateTable';
    constructor(public table: ITable) {}
}

export class RemoveTable {
    static readonly type = '[Tables] RemoveTable';
    constructor(public tableId: string) {}
}

export class AddOrder {
    static readonly type = '[Tables] AddOrder';
    constructor(public order: IOrder) {}
}

export class UpdateOrder {
    static readonly type = '[Tables] UpdateOrder';
    constructor(public order: IOrder) {}
}

export class RemoveOrder {
    static readonly type = '[Tables] RemoveOrder';
    constructor(public order: {tableId: string, orderId: string}) {}
}

@State<ITable[]>({
    name: 'tables',
    defaults: []
})
@Injectable()
export class TablesState{

    @Action(GetTables)
    getTables({setState}: StateContext<ITable[]>, {tables}: GetTables){
        setState(tables)
    }

    @Action(AddTable)
    addTable({setState}: StateContext<ITable[]>, {table}: AddTable) {
      setState(
          append<ITable>([table])
      );
    }

    @Action(UpdateTable)
    updateTable({setState}: StateContext<ITable[]>, {table}: UpdateTable){
        setState(
            updateItem<ITable>(
                e => e._id === table._id,
                table
            )
        )
    }

    @Action(RemoveTable)
    removeTable({setState}: StateContext<ITable[]>, {tableId}: RemoveTable) {
      setState(
        removeItem<ITable>(e => e._id === tableId)
      );
    }

    @Action(UpdateOrder)
    updateOrder({setState}: StateContext<ITable[]>, {order}: UpdateOrder) {
      setState(
        updateItem(e => e._id === order.table, patch({
            queue: updateItem<IOrder>(e => e._id === order._id, order)
        }))
      );
    }

    @Action(AddOrder)
    addOrder({setState}: StateContext<ITable[]>, {order}: AddOrder) {
      setState(
        updateItem(e => e._id === order.table, patch({
            queue: insertItem<IOrder>(order)
        }))
      );
    }

    @Action(RemoveOrder)
    removeOrder({setState}: StateContext<ITable[]>, {order}: RemoveOrder) {
      setState(
        updateItem(e => e._id === order.tableId, patch({
            queue: removeItem<IOrder>(e => e._id === order.orderId)
        }))
      );
    }

}

export class TablesSelectors{

    @Selector([TablesState])
    static getTables(state: ITable[]): ITable[]{
        return state;
    }

}