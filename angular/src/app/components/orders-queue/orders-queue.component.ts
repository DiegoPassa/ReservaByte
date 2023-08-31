import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, map, of, tap } from 'rxjs';
import { IOrder } from 'src/app/models/Order';
import { IQueue } from 'src/app/models/Queue';
import { ITable } from 'src/app/models/Table';
import { UserRole } from 'src/app/models/User';
import { LoadingService } from 'src/app/services/loading.service';
import { OrdersService } from 'src/app/services/orders.service';
import { SocketIoService } from 'src/app/services/socket-io.service';
import { AuthSelectors } from 'src/shared/auth-state';
import { TablesSelectors } from 'src/shared/tables-state';

@Component({
  selector: 'app-orders-queue',
  templateUrl: './orders-queue.component.html',
  styleUrls: ['./orders-queue.component.css'],
})
export class OrdersQueueComponent {

  @Select(TablesSelectors.getTables) tables$!: Observable<ITable[]>;

  constructor(
    private ordersService: OrdersService,
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
    this.store.selectSnapshot(TablesSelectors.getTables)[index].queue?.forEach(
      e => {
        if (e.markCompleted) this.ordersService.updateOrderById(e._id, {completed: true}).subscribe()
      }
    )
  }

  hide(index: number){
    const queue = this.store.selectSnapshot(TablesSelectors.getTables)[index].queue;
    return queue?.every(e => e.completed) || queue?.length === 0;
  }

}