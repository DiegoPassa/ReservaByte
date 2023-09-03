import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ITable } from 'src/app/models/Table';
import { ReceiptsService } from 'src/app/services/receipts.service';
import { TablesService } from 'src/app/services/tables.service';
import { TablesSelectors } from 'src/shared/tables-state';

@Component({
  selector: 'app-cashier',
  templateUrl: './cashier.component.html',
  styleUrls: ['./cashier.component.css']
})
export class CashierComponent{

  @Select(TablesSelectors.getTables) tables$!: Observable<ITable[]>

  constructor(private tablesService: TablesService, private receiptsService: ReceiptsService){}

  createReceipt(tableId: string){
    this.receiptsService.newReceipt(tableId).subscribe(
      data => console.log(data)
    );
  }

}
