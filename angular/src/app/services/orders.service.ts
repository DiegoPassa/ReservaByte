import { Injectable } from '@angular/core';
import { IOrder } from '../models/Order';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { config } from '../config/config';
import { IQueue } from '../models/Queue';

const url = `${config.backendUrl}/orders`

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(private httpClient: HttpClient) { }

  getOrders(filter: string = ''): Observable<IQueue[]>{
    return this.httpClient.get<IQueue[]>(`${url}${filter}`);
  }

  getOrderById(orderId: string): Observable<IOrder>{
    return this.httpClient.get<IOrder>(`${url}/${orderId}`);
  }

  updateOrderById(orderId: string, body: {}): Observable<IOrder>{
    return this.httpClient.patch<IOrder>(`${url}/${orderId}`, body);
  }

  deleteOrderById(orderId: string): Observable<IOrder>{
    return this.httpClient.delete<IOrder>(`${url}/${orderId}`);
  }
}
