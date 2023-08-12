import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ITable } from '../models/Table';

const backendURL = 'http://localhost:3080/tables'

@Injectable({
  providedIn: 'root'
})
export class TablesService {

  constructor(private httpClient: HttpClient) { }

  newTable(body: {}): Observable<ITable>{
    return this.httpClient.post<ITable>(`${backendURL}`, body);
  }

  getTables(filter: string = ''): Observable<ITable[]>{
    return this.httpClient.get<ITable[]>(`${backendURL}${filter}`);
  }

  getTableById(tableId: string): Observable<ITable>{
    return this.httpClient.get<ITable>(`${backendURL}/${tableId}`);
  }

  updateTableById(tableId: string, body: {}): Observable<ITable>{
    return this.httpClient.patch<ITable>(`${backendURL}/${tableId}`, body);
  }

  deleteTableById(tableId: string): Observable<ITable>{
    return this.httpClient.delete<ITable>(`${backendURL}/${tableId}`);
  }

  addOrderToQueue(tableId: string, menuId: string): Observable<ITable>{
    return this.httpClient.post<ITable>(`${backendURL}/${tableId}/queue/${menuId}`, {});
  }
}
