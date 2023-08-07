import { CdkDrag } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ITable } from 'src/app/models/Table';
import { HttpServiceService } from 'src/app/services/http-service.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { WebSocketService } from 'src/app/services/web-socket.service';

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
  ],
})
export class TableComponent implements OnInit {
  panelOpenState = false;
  tables: ITable[] = [];

  constructor(
    private httpService: HttpServiceService
  ) {}

  ngOnInit(): void {
    // this.webSocket.connect().subscribe((data) => {
    //   console.log(data);
    // });
    this.httpService
      .getTables()
      .subscribe((res: ITable[]) => (this.tables = res));
  }

}
