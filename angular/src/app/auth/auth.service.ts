import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { config } from '../config/config';

const url = config.backendUrl;

// const httpOptions = {
//   headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
// };

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  login(body: { username: string; password: string }): Observable<any> {
    return this.http.post(`${url}/login`, body, { withCredentials: true });
  }

  refreshToken() {
    return this.http.get(`${url}/refresh`, { withCredentials: true });
  }

  logout(){
    return this.http.get(`${url}/logout`, { withCredentials: true });
  }
}