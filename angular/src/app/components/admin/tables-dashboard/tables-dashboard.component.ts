import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { ITable } from 'src/app/models/Table';
import { TablesService } from 'src/app/services/tables.service';

@Component({
  selector: 'app-tables-dashboard',
  templateUrl: './tables-dashboard.component.html',
  styleUrls: ['./tables-dashboard.component.css']
})
export class TablesDashboardComponent implements OnInit {

  constructor(private tablesService: TablesService){}

  dataSource!: ITable[];
  displayedColumns: string[] = ['tableNumber', 'onUse', 'maxSeats', 'cover', 'reserved', 'actions'];

  @ViewChild(MatTable) table!: MatTable<ITable>;

  ngOnInit(): void {
    this.tablesService.getTables().subscribe( (tables: ITable[]) => {
      this.dataSource = tables;
    })
  }

  addData() {
  }

  removeData() {

  }
}
