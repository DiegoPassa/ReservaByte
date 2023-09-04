import { Component } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable} from 'rxjs';
import { ITable } from 'src/app/models/Table';
import { IBartender, ICook, UserRole } from 'src/app/models/User';
import { LoadingService } from 'src/app/services/loading.service';
import { OrdersService } from 'src/app/services/orders.service';
import { SocketIoService } from 'src/app/services/socket-io.service';
import { UsersService } from 'src/app/services/users.service';
import { AuthSelectors, AuthUpdateUser } from 'src/shared/auth-state';
import { TablesSelectors } from 'src/shared/tables-state';
import { GetUsers } from 'src/shared/users-state';

@Component({
  selector: 'app-orders-queue',
  templateUrl: './orders-queue.component.html',
  styleUrls: ['./orders-queue.component.css'],
})
export class OrdersQueueComponent {

  @Select(TablesSelectors.getTables) tables$!: Observable<ITable[]>;

  constructor(
    private ordersService: OrdersService,
    private usersService: UsersService,
    private socket: SocketIoService,
    private store: Store,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
  }

  canRemove(index: number){
    return this.store.selectSnapshot(TablesSelectors.getTables)[index].queue?.every(e => !e.markCompleted)
  }

  removeCompleted(index: number){
    let counter = 0;
    this.store.selectSnapshot(TablesSelectors.getTables)[index].queue?.forEach(
      e => {
        if (e.markCompleted) {
          this.ordersService.updateOrderById(e._id, {completed: true}).subscribe()
          e.markCompleted = false;
          counter++;
        }
      }
    )

    const currentUser = this.store.selectSnapshot(AuthSelectors.getUser)!;

    if(currentUser.role === UserRole.Bartender){
       this.usersService.updateUserById(currentUser._id, <IBartender>{
        statistics: {
          drinksServed: currentUser.statistics.drinksServed + counter
        }
       }).subscribe(data => this.store.dispatch(new AuthUpdateUser(data)))
    }
    if(currentUser.role === UserRole.Cook){
       this.usersService.updateUserById(currentUser._id, <ICook>{
        statistics: {
          dishesPrepared: currentUser.statistics.dishesPrepared + counter
        }
       }).subscribe(data => this.store.dispatch(new AuthUpdateUser(data)))
    }
  }

  hide(index: number){
    const queue = this.store.selectSnapshot(TablesSelectors.getTables)[index].queue;
    return queue?.every(e => e.completed) || queue?.length === 0;
  }

}