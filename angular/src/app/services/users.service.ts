import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUser } from '../models/User';

const backendURL = 'http://localhost:3080/users'

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  
  constructor(private httpClient: HttpClient) { }

  getUserById(id: string): Observable<any>{
    return this.httpClient.get<IUser>(`${backendURL}/${id}`);
  }

}