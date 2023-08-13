import { NgModule, OnInit } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { TableComponent } from './components/table/table.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './auth/auth.guard';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { roleGuard } from './auth/role.guard';
import { UserRole } from './models/User';
import { TablesComponent } from './components/tables/tables.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home'},
  { path: 'home', component: HomeComponent},
  { path: 'login', component: LoginComponent},
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard]},
  { path: 'tables', component: TablesComponent, canActivate: [authGuard, roleGuard], data: {roles: [UserRole.Waiter]}},
  { path: 'table', component: TableComponent, canActivate: [authGuard, roleGuard], data: {roles: [UserRole.Cook, UserRole.Bartender]}},
  { path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
