import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { append, removeItem, updateItem } from "@ngxs/store/operators";
import { IMenu } from "src/app/models/Menu";

export interface MenusStateModel {
    menus: IMenu[]
}

export class GetMenus {
    static readonly type = '[Menus] GetMenus';
    constructor(public menus: IMenu[]) {}
}
  
export class AddMenu {
    static readonly type = '[Menus] AddMenus';
    constructor(public menu: IMenu) {}
}

export class UpdateMenu {
    static readonly type = '[Menus] UpdateMenu';
    constructor(public menu: IMenu) {}
}

export class RemoveMenu {
    static readonly type = '[Menus] RemoveMenu';
    constructor(public menuId: string) {}
}

@State<IMenu[]>({
    name: 'menus',
    defaults: []
})
@Injectable()
export class MenusState{

    @Action(GetMenus)
    getMenus({setState}: StateContext<IMenu[]>, {menus}: GetMenus){
        setState(menus)
    }

    @Action(AddMenu)
    addMenu({setState}: StateContext<IMenu[]>, {menu}: AddMenu) {
      setState(
          append<IMenu>([menu])
      );
    }

    @Action(UpdateMenu)
    updateMenu({setState}: StateContext<IMenu[]>, {menu}: UpdateMenu){
        setState(
            updateItem<IMenu>(
                e => e._id === menu._id,
                menu
            )
        )
    }

    @Action(RemoveMenu)
    removeMenu(ctx: StateContext<IMenu[]>, {menuId}: RemoveMenu) {
      ctx.setState(
        removeItem<IMenu>(e => e._id === menuId)
      );
    }

}

export class MenusSelectors{

    @Selector([MenusState])
    static getMenus(state: IMenu[]): IMenu[]{
        return state;
    }

}