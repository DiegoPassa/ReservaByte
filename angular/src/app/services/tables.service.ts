import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ITable } from '../models/Table';
import { config } from '../config/config';

const url = `${config.backendUrl}/tables`

@Injectable({
  providedIn: 'root'
})
export class TablesService {

  // tables: Observable<ITable[]> = new Observable;

  constructor(private httpClient: HttpClient) {}

  // ngOnInit(): void {
  //   this.tables = this.getTables();
  // }

  newTable(body: {}): Observable<ITable>{
    return this.httpClient.post<ITable>(`${url}`, body);
  }

  getTables(filter: string = ''): Observable<ITable[]>{
    return this.httpClient.get<ITable[]>(`${url}${filter}`);
  }

  getTableById(tableId: string): Observable<ITable>{
    return this.httpClient.get<ITable>(`${url}/${tableId}`);
  }

  updateTableById(tableId: string, body: {}): Observable<ITable>{
    return this.httpClient.patch<ITable>(`${url}/${tableId}`, body);
  }

  deleteTableById(tableId: string): Observable<ITable>{
    return this.httpClient.delete<ITable>(`${url}/${tableId}`);
  }

  addOrderToQueue(tableId: string, menuId: string): Observable<ITable>{
    return this.httpClient.post<ITable>(`${url}/${tableId}/queue/${menuId}`, {});
  }
}
