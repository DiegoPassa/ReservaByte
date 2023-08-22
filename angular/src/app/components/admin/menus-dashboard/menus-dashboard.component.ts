import { Component, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { IMenu } from 'src/app/models/Menu';
import { MenusService } from 'src/app/services/menus.service';

@Component({
  selector: 'app-menus-dashboard',
  templateUrl: './menus-dashboard.component.html',
  styleUrls: ['./menus-dashboard.component.css']
})
export class MenusDashboardComponent {
  dataSource!: IMenu[];
  displayedColumns: string[] = ['name', 'price', 'type', 'ingredients', 'portionSize', 'preparationTime', 'totalOrders', 'actions'];

  constructor(private menusService: MenusService){}

  @ViewChild(MatTable) table!: MatTable<IMenu>;

  ngOnInit(): void {
    this.menusService.getMenus().subscribe( (menus: IMenu[]) => {
      this.dataSource = menus;
    })
  }

  addData() {
  }

  removeData() {

  }
}
