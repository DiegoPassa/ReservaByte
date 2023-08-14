import { CDK_DRAG_HANDLE } from '@angular/cdk/drag-drop';
import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ITable } from 'src/app/models/Table';
import { SocketIoService } from 'src/app/services/socket-io.service';
import { TablesService } from 'src/app/services/tables.service';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.css'],
})
export class TablesComponent implements OnInit {
  tables: ITable[] = [];

  constructor(
    private tablesService: TablesService,
    private socket: SocketIoService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchData();

    this.socket.listen('table:new').subscribe((data: any) => {
      this.buildSeats(data);
      this.tables.push(data);
      this.tables.sort((t1: ITable, t2: ITable) =>
        t1.tableNumber! > t2.tableNumber! ? 1 : -1
      );
      this.openSnackBar('New table added!');
    });

    this.socket.listen('table:delete').subscribe((tableId: any) => {
      const i = this.tables.findIndex((el) => el._id === tableId);
      this.tables.splice(i, 1);
      this.openSnackBar('A table has been deleted!');
    });

    this.socket.listen('table:update').subscribe((data: any) => {
      const i = this.tables.findIndex((el) => el._id === data?._id);
      this.tables[i] = data;
      this.buildSeats(this.tables[i]);
      this.openSnackBar(`Table ${this.tables[i].tableNumber} updated`);
    });
  }

  fetchData() {
    this.tablesService.getTables('?sort=tableNumber').subscribe({
      next: (data) => {
        this.tables = data;
        this.tables.forEach((e) => {
          this.buildSeats(e);
        });
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  buildSeats(table: ITable): void {
    table.seats = Array(table.seatsOccupied)
      .fill(true)
      .concat(Array(table.maxSeats! - table.seatsOccupied!).fill(false));
  }

  openSnackBar(message: string, action: string = 'OK') {
    this._snackBar.open(message, action, {
      duration: 3 * 1000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
    });
  }

  openDialog(table: ITable): void {
    this.dialog.open(SeatsDialog, {
      data: table 
    });
  }
}

@Component({
  selector: 'dialog-animations-example-dialog',
  templateUrl: 'seats-dialog.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatSliderModule, FormsModule],
})
export class SeatsDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: ITable, private tableService: TablesService) {}
  min = 1;
  max = this.data.maxSeats;
  showTicks = true;
  step = 1;
  thumbLabel = false;
  value = 1;

  occupySeats(seats: number){
    this.data.seatsOccupied = seats;
    this.tableService.updateTableById(this.data._id!, {seatsOccupied: seats}).subscribe()
  }
}
