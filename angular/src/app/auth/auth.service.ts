import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit, inject } from '@angular/core';
import { User, UserRole } from '../models/User';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  backendURL = 'http://localhost:3080'
  user?: User

  private _isAuthenticated$ = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this._isAuthenticated$.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    if (localStorage.getItem('user')) {
      this.createUser(JSON.parse(localStorage.getItem('user')!));
    }
  }

  // isAuthenticated(): boolean{
  //   return this.user ? true : false;
  // }

  getUserRole() {
    return this.user?.tokenDecoded.role;
  }

  getUser() {
    return this.user?.user
  }

  createUser(user: User) {
    this.user = user;
    this._isAuthenticated$.next(true);
    return user;
  }

  loginUser(body: { username: string, password: string }) {
    return this.http.post(`${this.backendURL}/login`, body).pipe(
      tap((res: any) => {
        console.log(res);
      })
    );
  }

  logout() {
    this.user = undefined;
    localStorage.removeItem('user');
    this._isAuthenticated$.next(false);
    this.router.navigate(['home']);
  }
}
