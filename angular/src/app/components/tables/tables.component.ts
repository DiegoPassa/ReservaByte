import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
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
  FormGroup,
  Validators,
} from '@angular/forms';
import { MenusService } from 'src/app/services/menus.service';
import { IMenu } from 'src/app/models/Menu';
import { Observable, map, startWith } from 'rxjs';
import { StateService } from 'src/app/services/state.service';
import { Select, Store } from '@ngxs/store';
import { AuthSelectors } from 'src/shared/auth-state';
import { TablesSelectors } from 'src/shared/tables-state';
import { MenusSelectors } from 'src/shared/menus-state';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.css'],
  providers: [TablesService, MenusService, StateService]
})
export class TablesComponent implements OnInit {

  @Select(TablesSelectors.getTables) tables$!: Observable<ITable[]>

  constructor(
    private socket: SocketIoService,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {

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
      data: { tableId },
      disableClose: true,
    });
  }

  // goToChild(table: ITable){
  //   this.stateService.data = table;
  //   this.router.navigate([`/tables/${table.tableNumber}`])
  // }
  reserve(table: ITable): void{
    this.dialog.open(ReserveDialog, {
      data: table,
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

@Component({
  templateUrl: 'reserve-dialog.html',
})
export class ReserveDialog {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ITable,
    private tableService: TablesService,
    private fb: FormBuilder,
  ) {}
  
  reserveForm: FormGroup = this.fb.group({
    status: [this.data.reserved?.status],
    reservedBy: [{value: this.data.reserved?.reservedBy, disabled: !this.data.reserved?.status}, (this.data.reserved?.status) ? Validators.required : ''],
    reservedTime: [{value: this.data.reserved?.reservedTime?.toLocaleString(), disabled: !this.data.reserved?.status}, (this.data.reserved?.status) ? Validators.required : '']
  });

  onSubmit(){

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
    @Inject(MAT_DIALOG_DATA) public data: {tableId: string },
    private fb: FormBuilder,
    private tablesService: TablesService,
    private store: Store,
  ) {}

  @Select(MenusSelectors.getMenus) menus$!: Observable<IMenu[]>

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
    this.menus$.subscribe( menus => {
      menus.forEach((e) =>
        this.options.push({ id: e._id, name: e.name })
      );
    })
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
      console.log(this.newOrders.value);
      this.newOrders.value.forEach((e: any) => {
        this.dialogRef.close();
        for (let index = 0; index < e.nItems; index++) {
          this.tablesService
            .addOrderToQueue(this.data.tableId, {userId: this.store.selectSnapshot(AuthSelectors.getUser)?._id!, menuId: e.menu.id})
            .subscribe();
        }
      });
    }
  }
}
