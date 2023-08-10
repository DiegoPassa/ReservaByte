import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/User';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

import { StorageService } from './storage.service';

const backendURL = 'http://localhost:3080';

// const httpOptions = {
//   headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
// };

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private storage: StorageService, private router: Router) {}

  login(body: { username: string; password: string }): Observable<any> {
    return this.http.post(`${backendURL}/login`, body, { withCredentials: true });
  }

  refreshToken() {
    return this.http.get(`${backendURL}/refresh`, { withCredentials: true });
  }

  logout(){
    this.http.get(`${backendURL}/logout`, { withCredentials: true }).subscribe({
      next: res => {
        this.storage.clean();
        this.router.navigate(['home']);
      },
      error: err => {
        console.log(err);
      }
    });
  }
}