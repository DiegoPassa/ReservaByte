import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { append, patch, removeItem, updateItem } from "@ngxs/store/operators";
import { IUser } from "src/app/models/User";

export class GetUsers {
    static readonly type = '[Users] GetUsers';
    constructor(public users: IUser[]) {}
}
  
export class AddUser {
    static readonly type = '[Users] AddUsers';
    constructor(public user: IUser) {}
}

export class UpdateUser {
    static readonly type = '[Users] UpdateUser';
    constructor(public user: IUser) {}
}

export class RemoveUser {
    static readonly type = '[Users] RemoveUser';
    constructor(public userId: string) {}
}

@State<IUser[]>({
    name: 'users',
    defaults: []
})
@Injectable()
export class UsersState{

    @Action(GetUsers)
    getUsers({setState}: StateContext<IUser[]>, {users}: GetUsers){
        setState(users)
    }

    @Action(AddUser)
    addUser({setState}: StateContext<IUser[]>, {user}: AddUser) {
      setState(
          append<IUser>([user])
      );
    }

    @Action(UpdateUser)
    updateUser({setState}: StateContext<IUser[]>, {user}: UpdateUser){
        setState(
            updateItem<IUser>(
                e => e._id === user._id,
                user
            )
        )
    }

    @Action(RemoveUser)
    removeUser({setState}: StateContext<IUser[]>, {userId}: RemoveUser) {
      setState(
        removeItem<IUser>(e => e._id === userId)
      );
    }

}

export class UsersSelectors{

    @Selector([UsersState])
    static getUsers(state: IUser[]): IUser[]{
        return state;
    }

}