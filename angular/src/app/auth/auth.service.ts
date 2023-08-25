import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { StorageService } from './storage.service';
import { config } from '../config/config';

const url = config.backendUrl;

// const httpOptions = {
//   headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
// };

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private storage: StorageService, private router: Router) {}

  login(body: { username: string; password: string }): Observable<any> {
    return this.http.post(`${url}/login`, body, { withCredentials: true });
  }

  refreshToken() {
    return this.http.get(`${url}/refresh`, { withCredentials: true });
  }

  logout(){
    this.http.get(`${url}/logout`, { withCredentials: true }).subscribe({
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