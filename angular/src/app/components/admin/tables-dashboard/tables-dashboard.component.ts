import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { ITable } from 'src/app/models/Table';
import { LoadingService } from 'src/app/services/loading.service';
import { SocketIoService } from 'src/app/services/socket-io.service';
import { TablesService } from 'src/app/services/tables.service';

@Component({
  selector: 'app-tables-dashboard',
  templateUrl: './tables-dashboard.component.html',
  styleUrls: ['./tables-dashboard.component.css'],
})
export class TablesDashboardComponent implements OnInit, OnDestroy {
  constructor(
    private tablesService: TablesService,
    private dialog: MatDialog,
    private socket: SocketIoService,
    private loading: LoadingService,
  ) {}

  dataSource!: ITable[];
  displayedColumns: string[] = [
    'tableNumber',
    'onUse',
    'maxSeats',
    'cover',
    'reserved',
    'actions',
  ];

  @ViewChild(MatTable) table!: MatTable<ITable>;

  ngOnInit(): void {
    this.loading.loadingOn()
    this.tablesService.getTables().subscribe((tables: ITable[]) => {
      this.dataSource = tables;
      this.loading.loadingOff()
    });

    this.socket.listen('table:new').subscribe((newTable: any) => {
      this.dataSource.push(newTable);
      this.dataSource.sort((t1: ITable, t2: ITable) =>
        t1.tableNumber! > t2.tableNumber! ? 1 : -1
      );
      this.table.renderRows();
    });
    
    this.socket.listen('table:delete').subscribe((tableId: any) => {
      const i = this.dataSource.findIndex((el) => el._id === tableId);
      this.dataSource.splice(i, 1);
      this.table.renderRows();
    });
    
    this.socket.listen('table:update').subscribe((updatedTable: any) => {
      const i = this.dataSource.findIndex((el) => el._id === updatedTable?._id);
      this.dataSource[i] = updatedTable;
      this.table.renderRows();
    });
  }

  ngOnDestroy(): void {
    this.socket.socket.off('table:new');
    this.socket.socket.off('table:delete');
    this.socket.socket.off('table:update');
  }

  addData() {
    this.dialog.open(NewTableDialog, {
      disableClose: true,
    });
  }

  editData(table: ITable) {
    this.dialog.open(EditTableDialog, {
      data: table,
      disableClose: true,
    });
  }

  removeData(tableId: string, tableNumber: string) {
    this.dialog.open(DeleteTableDialog, {
      data: {tableId, tableNumber},
      disableClose: true,
    });
  }
}

interface deleteInterface{
  tableId: string,
  tableNumber: string
}

@Component({
  selector: 'new-table-dialog',
  templateUrl: 'new-table-dialog.html',
})
export class NewTableDialog {
  constructor(private tableService: TablesService, private fb: FormBuilder) {}

  newTableForm: FormGroup = this.fb.group({
    tableNumber: ['', Validators.required],
    maxSeats: [1, [Validators.required, Validators.min(1)]],
    isCovered: [false, Validators.required],
  });

  onSubmit() {
    if (this.newTableForm.valid) {
      this.tableService.newTable({
          tableNumber: this.newTableForm.value.tableNumber,
          maxSeats: this.newTableForm.value.maxSeats,
          cover: this.newTableForm.value.isCovered,
        }).subscribe();
    }
  }
}

@Component({
  selector: 'edit-table-dialog',
  templateUrl: 'edit-table-dialog.html',
})
export class EditTableDialog implements OnInit{
  constructor(private tableService: TablesService, private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: ITable) {}
    
  editTableForm: FormGroup = this.fb.group({
    tableNumber: [this.data.tableNumber, Validators.required],
    maxSeats: [this.data.maxSeats, [Validators.required, Validators.min(1)]],
    isCovered: [this.data.cover, Validators.required],
    reserved: this.fb.group({
      status: [this.data.reserved?.status],
      reservedBy: [{value: this.data.reserved?.reservedBy, disabled: !this.data.reserved?.status}, (this.data.reserved?.status) ? Validators.required : ''],
      reservedTime: [{value: this.data.reserved?.reservedTime?.toLocaleString(), disabled: !this.data.reserved?.status}, (this.data.reserved?.status) ? Validators.required : '']
    })
  });

  ngOnInit(): void {
    this.editTableForm.get('reserved.status')?.valueChanges.subscribe( newValue => {
      if(newValue){
        this.editTableForm.get('reserved.reservedBy')?.enable();
        this.editTableForm.get('reserved.reservedBy')?.addValidators(Validators.required);
        this.editTableForm.get('reserved.reservedTime')?.enable();
        this.editTableForm.get('reserved.reservedTime')?.addValidators(Validators.required);
      }else{
        this.editTableForm.get('reserved.reservedBy')?.disable();
        this.editTableForm.get('reserved.reservedBy')?.setValue('');
        this.editTableForm.get('reserved.reservedTime')?.disable();
        this.editTableForm.get('reserved.reservedTime')?.setValue('');
      }
    })
  }

  onSubmit() {
    if (this.editTableForm.valid) {
      console.log(this.editTableForm.value.reserved);
      this.tableService.updateTableById(this.data._id!, {
        tableNumber: this.editTableForm.value.tableNumber,
        maxSeats: this.editTableForm.value.maxSeats,
        cover: this.editTableForm.value.isCovered,
        reserved: this.editTableForm.value.reserved
      }).subscribe();
    }
  }
}

@Component({
  template: `
  <div matDialogTitle class="px-4 pb-2 font-bold text-xl">Eliminazione tavolo</div>
  <div matDialogContent class="p-4">
      <p>Sei sicuro di voler eliminare il tavolo <b>{{data.tableNumber}}</b>?</p>
  </div>
  <div mat-dialog-actions class="px-4 pb-4 py-0">
      <button mat-flat-button matDialogClose color="warn">Annulla</button>
      <button mat-stroked-button matDialogClose color="primary" (click)="deleteTable()" >Conferma</button>
  </div>`,
})
export class DeleteTableDialog {
  constructor(private tableService: TablesService, @Inject(MAT_DIALOG_DATA) public data: deleteInterface) {}

  deleteTable(){
    this.tableService.deleteTableById(this.data.tableId).subscribe();
  }
}