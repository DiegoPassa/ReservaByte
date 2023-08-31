import { Injectable } from "@angular/core";
import { Action, NgxsOnInit, Selector, State, StateContext } from "@ngxs/store";
import { IUser } from "src/app/models/User";
import { AuthService } from "src/app/auth/auth.service";
import { tap } from "rxjs";

export class Refresh {
    static readonly type = '[Auth] Refresh';
    constructor(public payload: string) {}
}
  
export class Login {
    static readonly type = '[Auth] Login';
    constructor(public payload: { username: string; password: string }) {}
}
  
export class Logout {
    static readonly type = '[Auth] Logout';
}

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
            })
        )
    }

}

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
