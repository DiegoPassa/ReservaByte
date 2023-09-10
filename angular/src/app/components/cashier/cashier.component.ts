import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ITable } from 'src/app/models/Table';
import { ICashier, UserRole } from 'src/app/models/User';
import { ReceiptsService } from 'src/app/services/receipts.service';
import { UsersService } from 'src/app/services/users.service';
import { AuthSelectors, AuthUpdateUser } from 'src/shared/auth-state';
import { TablesSelectors } from 'src/shared/tables-state';

@Component({
  selector: 'app-cashier',
  templateUrl: './cashier.component.html',
  styleUrls: ['./cashier.component.css']
})
export class CashierComponent{

  @Select(TablesSelectors.getTables) tables$!: Observable<ITable[]>

  constructor(private dialog: MatDialog){}

  isQueueCompleted(table: ITable){
    return table.queue?.every(e => e.completed === true);
  }

  openDialog(table: ITable) {
    this.dialog.open(ConfirmReceiptDialog, {
      data: table,
      disableClose: true,
    });
  }

  trackById(index: number, table: ITable){
    return table._id;
  }
  
}


@Component({
  template: `
  <div matDialogTitle class="px-4 pb-2 font-bold text-xl">Emissione scontrino tavolo {{data.tableNumber}}</div>
  <div matDialogContent class="p-4">
    <p>Conferma emissione scontrino?</p>
  </div>
  <div mat-dialog-actions class="px-4 pb-4 py-0">
    <button mat-flat-button matDialogClose color="warn">Annulla</button>
    <button mat-stroked-button matDialogClose color="primary" (click)="createReceipt()" >Conferma</button>
  </div>`,
})
export class ConfirmReceiptDialog {
  constructor(private receiptsService: ReceiptsService, private usersService: UsersService, private store: Store, @Inject(MAT_DIALOG_DATA) public data: ITable) {}
  
  createReceipt(){
    this.receiptsService.newReceipt(this.data._id!).subscribe(
      data => {
        const currentUser = this.store.selectSnapshot(AuthSelectors.getUser);
        if(currentUser?.role === UserRole.Cashier){
          this.usersService.updateUserById(currentUser._id, <ICashier>{
            statistics: {
              billsPrepared: currentUser.statistics.billsPrepared + 1
            }
          }).subscribe( data => this.store.dispatch(new AuthUpdateUser(data)));
        }
      }
    );
  }
}