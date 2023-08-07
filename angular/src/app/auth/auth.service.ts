import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLogged = false;

  constructor() { }

  isAuthenticated(){
    return this.isLogged;
  }
}
