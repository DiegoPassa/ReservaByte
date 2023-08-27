import { Selector } from "@ngxs/store";
import { IUser } from "src/app/models/User";
import { AuthState, AuthStateModel } from "./auth-state";

export class AuthSelectors{

    @Selector([AuthState])
    static getUser(state: AuthStateModel): IUser | null{
        return state.user;
    }

    @Selector([AuthState])
    static getToken(state: AuthStateModel): string | null{
        return state.token;
    }

    @Selector([AuthState])
    static isAuthenticated(state: AuthStateModel): boolean{
        return !!state.token;
    }

}