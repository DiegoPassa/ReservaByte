import { Component, OnInit } from '@angular/core';
import { ITable } from 'src/app/models/Table';
import { ReceiptsService } from 'src/app/services/receipts.service';
import { TablesService } from 'src/app/services/tables.service';

@Component({
  selector: 'app-cashier',
  templateUrl: './cashier.component.html',
  styleUrls: ['./cashier.component.css']
})
export class CashierComponent implements OnInit{

  tables: ITable[] = [];

  constructor(private tablesService: TablesService, private receiptsService: ReceiptsService){}

  ngOnInit(): void {
    this.tablesService.getTables().subscribe({
      next: (tables: ITable[]) => {
        this.tables = tables.filter((e) => e.seatsOccupied! > 0);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  createReceipt(tableId: string){
    this.receiptsService.newReceipt(tableId).subscribe(
      data => console.log(data)
    );
  }

}
