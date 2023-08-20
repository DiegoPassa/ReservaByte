import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ITable } from 'src/app/models/Table';
import { SocketIoService } from 'src/app/services/socket-io.service';
import { TablesService } from 'src/app/services/tables.service';
import {
  FormArray,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { MenusService } from 'src/app/services/menus.service';
import { IMenu } from 'src/app/models/Menu';
import { Observable, map, startWith } from 'rxjs';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.css'],
})
export class TablesComponent implements OnInit {
  tables: ITable[] = [];
  menus: IMenu[] = [];

  constructor(
    private tablesService: TablesService,
    private menuService: MenusService,
    private socket: SocketIoService,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchData();

    this.socket.listen('table:new').subscribe((newTable: any) => {
      this.buildSeats(newTable);
      this.tables.push(newTable);
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

    this.socket.listen('table:update').subscribe((updatedTable: any) => {
      const i = this.tables.findIndex((el) => el._id === updatedTable?._id);
      this.tables[i] = updatedTable;
      this.buildSeats(this.tables[i]);
      this.openSnackBar(`Table ${this.tables[i].tableNumber} updated`);
    });
  }

  fetchData() {
    this.tablesService.getTables('?sort=tableNumber').subscribe({
      next: (tables: ITable[]) => {
        this.tables = tables;
        this.tables.forEach((e) => {
          this.buildSeats(e);
        });
      },
      error: (err) => {
        console.error(err);
      },
    });
    this.menuService.getMenus().subscribe({
      next: (menus: IMenu[]) => {
        this.menus = menus;
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

  openSeatsDialog(table: ITable): void {
    this.dialog.open(SeatsDialog, {
      data: table,
      disableClose: true,
      autoFocus: true,
    });
  }

  openNewOrderDialog(tableId: string): void {
    this.dialog.open(AddOrderDialog, {
      data: { menus: this.menus, tableId },
      disableClose: true,
    });
  }
}

@Component({
  templateUrl: 'seats-dialog.html',
})
export class SeatsDialog {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ITable,
    private tableService: TablesService
  ) {}
  min = 0;
  max = this.data.maxSeats;
  showTicks = true;
  step = 1;
  thumbLabel = false;
  value = 1;

  occupySeats(seats: number) {
    this.data.seatsOccupied = seats;
    this.tableService
      .updateTableById(this.data._id!, { seatsOccupied: seats })
      .subscribe();
  }
}

interface optionInterface {
  id: string;
  name: string;
}

@Component({
  templateUrl: 'add-order-dialog.html',
})
export class AddOrderDialog implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<AddOrderDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { menus: IMenu[]; tableId: string },
    private fb: FormBuilder,
    private tablesService: TablesService
  ) {}

  myControl = new FormControl('');
  options: optionInterface[] = [];
  filteredOptions!: Observable<optionInterface[]>;

  form = this.fb.group({
    newOrders: this.fb.array([]),
  });

  get newOrders(): FormArray {
    return this.form.controls['newOrders'] as FormArray;
  }

  ngOnInit(): void {
    this.data.menus.forEach((e) =>
      this.options.push({ id: e._id, name: e.name })
    );
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );
    this.addOrder();
  }

  private _filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.options.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }

  addOrder() {
    const newOrderForm = this.fb.group({
      menu: ['', Validators.required],
      nItems: [1, [Validators.required, Validators.min(1)]],
    });
    this.newOrders.push(newOrderForm);
  }

  remove(index: number) {
    this.newOrders.removeAt(index);
    if (this.newOrders.length === 0) {
      this.addOrder();
    }
  }

  removeFromOptions() {}

  displayFn(option: optionInterface): string {
    return option.name;
  }

  onSubmit() {
    if (this.form.valid) {
      this.newOrders.value.forEach((e: any) => {
        this.dialogRef.close();
        for (let index = 0; index < e.nItems; index++) {
          this.tablesService
            .addOrderToQueue(this.data.tableId, e.menu.id)
            .subscribe();
        }
      });
    }
  }
}
