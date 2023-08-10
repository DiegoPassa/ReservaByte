import { Injectable } from '@angular/core';

const KEY = 'auth-user';

@Injectable({
  providedIn: 'root',
})

export class StorageService {
  constructor() {}

  public clean() {
    localStorage.clear();
  }

  public saveUser(user: any): void {
    localStorage.removeItem(KEY);
    localStorage.setItem(KEY, JSON.stringify(user));
  }

  public getAccessToken(): any{
    const storage = localStorage.getItem(KEY);
    if(storage){
      return JSON.parse(storage).accessToken
    }
  }

  public getUser(): any {
    const storage = localStorage.getItem(KEY);
    if (storage) {
      return JSON.parse(storage).user;
    }
    return {};
  }

  public isLoggedIn(): boolean {
    return !!localStorage.getItem(KEY);
  }
}
