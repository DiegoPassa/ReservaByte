import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { IOrder } from 'src/app/models/Order';
import { IQueue } from 'src/app/models/Queue';
import { UserRole } from 'src/app/models/User';
import { LoadingService } from 'src/app/services/loading.service';
import { OrdersService } from 'src/app/services/orders.service';
import { SocketIoService } from 'src/app/services/socket-io.service';
import { AuthSelectors } from 'src/shared/authState/auth-selectors';

@Component({
  selector: 'app-orders-queue',
  templateUrl: './orders-queue.component.html',
  styleUrls: ['./orders-queue.component.css'],
})
export class OrdersQueueComponent implements OnInit {
  queues: IQueue[] = []

  constructor(
    private ordersService: OrdersService,
    private socket: SocketIoService,
    private store: Store,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.fetchData();

    this.socket.listen('order:new').subscribe((newOrder: any) => {
      const userRole = this.store.selectSnapshot(AuthSelectors.getUser)?.role;
      const index = this.queues.findIndex( e => e.table._id === newOrder.order.table._id);
      if (index !== -1){
        this.queues[index].orders.push(newOrder.order);
      }else if(userRole === newOrder.role || userRole === UserRole.Admin){
        this.queues.push({orders: [newOrder.order], table: newOrder.order.table});
      }
    });

    this.socket.listen('order:update').subscribe((updated: any) => {
      const index = this.findIndexByOrderId(updated._id);
      if (index !== -1) this.queues[index.i].orders[index.j] = updated;
    })

    this.socket.listen('order:delete').subscribe((orderId: any) => {
      let index = this.findIndexByOrderId(orderId);
      if (index !== -1) {
        this.queues[index.i].orders.splice(index.j, 1);
        if (this.queues[index.i].orders.length === 0) this.queues.splice(index.i, 1);
      }
    })
  }

  checkboxOnClick(orderId: string, completed: boolean){
    this.ordersService.updateOrderById(orderId, {completed: completed}).subscribe();
  }

  fetchData() {
    this.loadingService.loadingOn()
    this.ordersService.getOrders().subscribe({
      next: (data) => {
        console.log(data);
        this.queues = data;
        this.loadingService.loadingOff();
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  removeCompleted(index: number){
    this.queues[index].orders.forEach((e: IOrder) => {
      if (e.completed) this.ordersService.deleteOrderById(e._id).subscribe();
    })
    this.queues[index].orders = this.queues[index].orders.filter(e => !e.completed);
    if (this.queues[index].orders.length === 0) this.queues.splice(index, 1);
  }

  findIndexByOrderId(orderId: string): {i: number, j: number} | -1{
    for (let i = 0; i < this.queues.length; ++i) {
      for (let j = 0; j < this.queues[i].orders.length; ++j) {
         if (this.queues[i].orders[j]._id === orderId) {
            return {i, j};
         }
      }
    }
    return -1;
  }

  canRemove(index: number): boolean{
    return this.queues[index].orders.every(e => !e.completed)
  }

}