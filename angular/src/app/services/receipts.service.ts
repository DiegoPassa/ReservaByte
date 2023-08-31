import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';import { IReceipt } from '../models/Receipt';
import { Observable } from 'rxjs';
import { config } from '../config/config';

const url = `${config.backendUrl}/receipts`

@Injectable({
  providedIn: 'root'
})
export class ReceiptsService {

  constructor(private httpClient: HttpClient) { }

  newReceipt(tableId: string): Observable<IReceipt>{
    return this.httpClient.post<IReceipt>(`${url}`, {tableId});
  }

  getReceipts(filter: string = ''): Observable<IReceipt[]>{
    return this.httpClient.get<IReceipt[]>(`${url}${filter}`);
  }

  getReceiptById(receiptId: string): Observable<IReceipt>{
    return this.httpClient.get<IReceipt>(`${url}/${receiptId}`);
  }

  updateOrderById(receiptId: string, body: {}): Observable<IReceipt>{
    return this.httpClient.patch<IReceipt>(`${url}/${receiptId}`, body);
  }

  deleteOrderById(receiptId: string): Observable<IReceipt>{
    return this.httpClient.delete<IReceipt>(`${url}/${receiptId}`);
  }
}
