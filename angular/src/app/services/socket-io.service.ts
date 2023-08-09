import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Socket, io } from 'socket.io-client';

@Injectable({
    providedIn: 'root'
})
export class SocketIoService {
    socket: Socket;

    constructor() {
        this.socket = io('ws://localhost:3080');
    }

    listen(eventName: string) {
        return new Observable((subscriber) => {
            this.socket.on(eventName, (data: any) => {
                subscriber.next(data);
            })
        })
    }

    emit(eventName: string, data: any){
        this.socket.emit(eventName, data);
    }

}
