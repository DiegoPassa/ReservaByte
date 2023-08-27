import { IUser } from 'src/app/models/User';

// export class setUser{
//     static readonly type = '[Auth] Set user'
//     constructor(public payload: IUser){}
// }

// export class updateUserAction{
//     static readonly type = '[Auth] Update user'
//     constructor(public payload: IUser){}
// }

export class Refresh {
  static readonly type = '[Auth] Refresh';
  constructor(public payload: { accessToken: string, user: IUser }) {}
}

export class Login {
  static readonly type = '[Auth] Login';
  constructor(public payload: { username: string; password: string }) {}
}

export class Logout {
  static readonly type = '[Auth] Logout';
}
