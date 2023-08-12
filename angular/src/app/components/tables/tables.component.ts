import { Component, OnInit } from '@angular/core';
import { ITable } from 'src/app/models/Table';
import { TablesService } from 'src/app/services/tables.service';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.css'],
})
export class TablesComponent implements OnInit {
  tables: ITable[] = [];

  constructor(private tablesService: TablesService) {}

  ngOnInit(): void {
    this.tablesService.getTables().subscribe({
      next: (data) => {
        this.tables = data;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
