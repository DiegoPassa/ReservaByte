import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { config } from '../config/config';
import { IMenu } from '../models/Menu';

const url = `${config.backendUrl}/menu`

@Injectable({
  providedIn: 'root'
})
export class MenusService {

  constructor(private httpClient: HttpClient) { }

  newMenu(body: {}): Observable<IMenu>{
    return this.httpClient.post<IMenu>(`${url}`, body);
  }

  getMenus(filter: string = ''): Observable<IMenu[]>{
    return this.httpClient.get<IMenu[]>(`${url}${filter}`);
  }

  getMenuById(menuId: string): Observable<IMenu>{
    return this.httpClient.get<IMenu>(`${url}/${menuId}`);
  }

  updateMenuById(menuId: string, body: {}): Observable<IMenu>{
    return this.httpClient.patch<IMenu>(`${url}/${menuId}`, body);
  }

  deleteMenuById(menuId: string): Observable<IMenu>{
    return this.httpClient.delete<IMenu>(`${url}/${menuId}`);
  }
}
