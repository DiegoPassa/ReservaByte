import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './auth/auth.guard';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { roleGuard } from './auth/role.guard';
import { UserRole } from './models/User';
import { TablesComponent } from './components/tables/tables.component';
import { OrdersQueueComponent } from './components/orders-queue/orders-queue.component';
import { TableInfoComponent } from './components/table-info/table-info.component';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { TablesDashboardComponent } from './components/admin/tables-dashboard/tables-dashboard.component';
import { MenusDashboardComponent } from './components/admin/menus-dashboard/menus-dashboard.component';
import { UsersDashboardComponent } from './components/admin/users-dashboard/users-dashboard.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: HomeComponent, title: 'ReservaByte' },
  { path: 'login', component: LoginComponent, title: 'Login' },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard],
    title: 'Profilo',
  },
  {
    path: 'tables',
    canActivate: [authGuard, roleGuard],
    data: { roles: [UserRole.Waiter] },
    children: [
      { path: '', component: TablesComponent },
      { path: ':id', component: TableInfoComponent },
    ],
    title: 'Tavoli',
  },
  {
    path: 'orders',
    component: OrdersQueueComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: [UserRole.Cook, UserRole.Bartender] },
    title: 'Ordini',
  },
  {
    path: 'admin',
    component: DashboardComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: [UserRole.Admin, UserRole.Cashier] },
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'tables' },
      { path: 'tables', component: TablesDashboardComponent },
      { path: 'users', component: UsersDashboardComponent },
      { path: 'menus', component: MenusDashboardComponent },
    ],
    title: 'Admin Dashboard',
  },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
