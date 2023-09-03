import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Store, ofActionCompleted, ofActionDispatched } from '@ngxs/store';
import { TablesService } from './services/tables.service';
import { AuthSelectors, Login, Logout } from 'src/shared/auth-state';
import { AddOrder, AddTable, GetTables, RemoveOrder, RemoveTable, UpdateOrder, UpdateTable } from 'src/shared/tables-state';
import { MenusService } from './services/menus.service';
import { AddMenu, GetMenus, RemoveMenu, UpdateMenu } from 'src/shared/menus-state';
import { SocketIoService } from './services/socket-io.service';
import { UsersService } from './services/users.service';
import { AddUser, GetUsers, UpdateUser } from 'src/shared/users-state';
import { UserRole } from './models/User';
import { MenuType } from './models/Menu';
import { ITable } from './models/Table';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'ReservaByte';

  constructor(
    private actions: Actions,
    private router: Router,
    private store: Store,
    private tablesService: TablesService,
    private menusService: MenusService,
    private usersService: UsersService,
    private socket: SocketIoService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {

    if(this.store.selectSnapshot(AuthSelectors.isAuthenticated)){
      this.fetchData();
    }

    this.actions.pipe(ofActionCompleted(Login)).subscribe(() => {
      this.fetchData();
      this.routeLoginUser();
    });
    
    this.actions.pipe(ofActionDispatched(Logout)).subscribe(() => {
      this.store.reset({});
      this.router.navigate(['/login']);
    });
  }

  fetchData(){
    switch (this.store.selectSnapshot(AuthSelectors.getUser)?.role) {

      case UserRole.Admin:
        this.fetchTables();
        this.fetchMenus();
        this.fetchUsers();
        break;

      case UserRole.Waiter:
        this.fetchTables();
        this.fetchMenus();
        break;

      case UserRole.Cook:
        this.fetchTables();
        break;

      case UserRole.Bartender:
        this.fetchTables();
        break;

      case UserRole.Cashier:
        this.fetchTables();
        this.fetchMenus();
        this.fetchUsers();
        break;
    }
  }

  routeLoginUser(){
    switch (this.store.selectSnapshot(AuthSelectors.getUser)?.role) {

      case UserRole.Admin:
        this.router.navigate(['/admin'])
        break;

      case UserRole.Waiter:
        this.router.navigate(['/tables'])
        break;

      case UserRole.Cook:
        this.router.navigate(['/orders'])
        break;

      case UserRole.Bartender:
        this.router.navigate(['/orders'])
        break;

      case UserRole.Cashier:
        this.router.navigate(['/receipts'])
        break;
    }
  }

  filterTable(table: ITable, role: UserRole){
    switch (role) {
      case UserRole.Cook:
        table.queue = table.queue?.filter((order) => order.menu.type === MenuType.Dish)
        break;

      case UserRole.Bartender:
        table.queue = table.queue?.filter((order) => order.menu.type === MenuType.Drink)
        break;
    }
    return table;
  }

  fetchTables(){
    const role = this.store.selectSnapshot(AuthSelectors.getUser)?.role;

    this.tablesService.getTables().subscribe((data) => {
      data.map(table => table = this.filterTable(table, role!))
      this.store.dispatch(new GetTables(data));
    });

    this.socket.listen('table:new').subscribe((newTable: any) => {
      this.store.dispatch(new AddTable(newTable));
    });
    this.socket.listen('table:update').subscribe((updatedTable: any) => {
      this.store.dispatch(new UpdateTable(updatedTable));
    });
    this.socket.listen('table:delete').subscribe((tableId: any) => {
      this.store.dispatch(new RemoveTable(tableId));
    });
    
    this.socket.listen('order:new').subscribe((newOrder: any) => {
      if(role === UserRole.Bartender || role === UserRole.Cook){
        if(newOrder.role === role){
          this.store.dispatch(new AddOrder(newOrder.order));
          this.toastr.info(`Un nuovo ordine è stato inserito!`, 'Nuovo ordine')
        }
      }else{
        this.store.dispatch(new AddOrder(newOrder.order));
      }
    });
    this.socket.listen('order:update').subscribe((updatedOrder: any) => {
      const {order, tableNumber} = updatedOrder;
      this.store.dispatch(new UpdateOrder(order));
      this.toastr.info(`Il piatto <b>${order.menu.name}</b> è stato completato per il tavolo <b>${tableNumber.tableNumber}</b>`, 'Piatto completato')
    });
    this.socket.listen('order:delete').subscribe((payload: any) => {
      this.store.dispatch(new RemoveOrder(payload));
    });

  }

  fetchMenus(){
    this.menusService.getMenus().subscribe((data) => {
      this.store.dispatch(new GetMenus(data));
    });

    this.socket.listen('menu:new').subscribe((newMenu: any) => {
      this.store.dispatch(new AddMenu(newMenu));
    });
    this.socket.listen('menu:update').subscribe((menu: any) => {
      this.store.dispatch(new UpdateMenu(menu));
    });
    this.socket.listen('menu:delete').subscribe((menuId: any) => {
      this.store.dispatch(new RemoveMenu(menuId));
    });

  }

  fetchUsers(){
    this.usersService.getUsers().subscribe((data) => {
      this.store.dispatch(new GetUsers(data));
    });
  
    this.socket.listen('user:new').subscribe((newUser: any) => {
      this.store.dispatch(new AddUser(newUser));
    });
    this.socket.listen('user:update').subscribe((user: any) => {
      this.store.dispatch(new UpdateUser(user));
    });
    this.socket.listen('user:delete').subscribe((userId: any) => {
      this.store.dispatch(new RemoveMenu(userId));
    });
  }
}
