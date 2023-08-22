import { Component, Input, OnInit } from '@angular/core';
import { UrlSegment } from '@angular/router';
import { ITable } from 'src/app/models/Table';
import { StateService } from 'src/app/services/state.service';
import { TablesService } from 'src/app/services/tables.service';

@Component({
  selector: 'app-table-info',
  templateUrl: './table-info.component.html',
  styleUrls: ['./table-info.component.css']
})
export class TableInfoComponent implements OnInit{

  constructor(private stateService: StateService, private tableService: TablesService){}

  table: ITable = {}

  ngOnInit(): void {
    if(this.stateService.data){
      this.table = this.stateService.data;
      this.stateService.data = undefined;
    }else{
      this.tableService.getTables(`?tableNumber=${window.location.href.split('/')[4]}`).subscribe(
        table => this.table = table[0]
      )
    }
  }

}
