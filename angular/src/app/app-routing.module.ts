import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrdersQueueComponent } from './components/orders-queue/orders-queue.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { TableComponent } from './components/table/table.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'tables'},
  { path: 'tables', component: TableComponent},
  { path: '404', component: NotFoundComponent},
  { path: '**', redirectTo: '/404'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
