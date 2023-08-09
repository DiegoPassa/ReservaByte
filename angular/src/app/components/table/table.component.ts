import { CdkDrag } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ITable } from 'src/app/models/Table';
import { HttpServiceService } from 'src/app/services/http-service.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { SocketIoService } from 'src/app/services/socket-io.service';

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.css'],
    standalone: true,
    imports: [
        CdkDrag,
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatGridListModule,
        MatSnackBarModule,
    ]
})
export class TableComponent implements OnInit {
    panelOpenState = false;
    tables: ITable[] = [];

    constructor(private httpService: HttpServiceService, private _snackBar: MatSnackBar, private socket: SocketIoService) { }

    ngOnInit(): void {
        // this.webSocket.connect().subscribe((data) => {
        //   console.log(data);
        // });
        this.httpService
            .getTables()
            .subscribe((res: ITable[]) => (this.tables = res));
            
        this.socket.listen('test').subscribe( (data: any) => this.openSnackBar(data))
    }

    openSnackBar(message: string, action: string = 'OK') {
        this._snackBar.open(message, action, {
            duration: 3 * 1000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom'
        });
    }
}
