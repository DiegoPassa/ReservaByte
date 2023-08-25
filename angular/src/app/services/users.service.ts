import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUser } from '../models/User';
import { config } from '../config/config';

const url = `${config.backendUrl}/users`

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  
  constructor(private httpClient: HttpClient) { }

  newUser(body: {}): Observable<IUser>{
    return this.httpClient.post<IUser>(`${url}`, body);
  }

  getUsers(filter: string = ''): Observable<IUser[]>{
    return this.httpClient.get<IUser[]>(`${url}${filter}`);
  }

  getUserById(id: string): Observable<IUser>{
    return this.httpClient.get<IUser>(`${url}/${id}`);
  }

  updateUserById(menuId: string, body: {}): Observable<IUser>{
    return this.httpClient.patch<IUser>(`${url}/${menuId}`, body);
  }

  deleteUserById(menuId: string): Observable<IUser>{
    return this.httpClient.delete<IUser>(`${url}/${menuId}`);
  }

}