import { Injectable } from "@angular/core";
import { Action, NgxsOnInit, State, StateContext } from "@ngxs/store";
import { IUser } from "src/app/models/User";
import { Login, Logout, Refresh } from "./auth-actions";
import { AuthService } from "src/app/auth/auth.service";
import { tap } from "rxjs";
import { UsersService } from "src/app/services/users.service";

export interface AuthStateModel {
    token: string | null;
    user: IUser | null;
  }

@State<AuthStateModel>({
    name: 'auth',
    defaults: {
        token: null,
        user: null
    }
})
@Injectable()
export class AuthState{

    constructor(private authService: AuthService){}

    @Action(Refresh)
    refresh({patchState}: StateContext<AuthStateModel>, {payload}: Refresh){
        patchState({
            token: payload
        })
    }

    @Action(Login)
    login({setState}: StateContext<AuthStateModel>, {payload}: Login){
        return this.authService.login({username: payload.username, password: payload.password}).pipe(
            tap((result: {accessToken: string, user: IUser}) => {
                setState({
                    token: result.accessToken,
                    user: result.user
                });
            })
        )
    }

    @Action(Logout)
    logout({setState}: StateContext<AuthStateModel>){
        return this.authService.logout().pipe(
            tap(() => {
                setState({
                    token: null,
                    user: null,
                })
                localStorage.clear();
            })
        )
    }

}