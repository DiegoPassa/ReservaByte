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
        this.tables.forEach(e => {
          const occupied = Array(e.seatsOccupied).fill(true);
          const remaining = Array(e.maxSeats! - e.seatsOccupied!).fill(false);
          e.seats = occupied.concat(remaining);
          console.log(e.seats);
        })
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
