import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { OrdersQueueComponent } from './components/orders-queue/orders-queue.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AuthProvider } from './utils/auth.interceptor';
import { AddOrderDialog, SeatsDialog, TablesComponent } from './components/tables/tables.component';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/material.module';
import { TableInfoComponent } from './components/table-info/table-info.component';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { LoadingComponent } from './components/loading/loading.component';
import { DeleteTableDialog, EditTableDialog, NewTableDialog, TablesDashboardComponent } from './components/admin/tables-dashboard/tables-dashboard.component';
import { MenusDashboardComponent, DeleteMenuDialog, NewMenuDialog, EditMenuDialog } from './components/admin/menus-dashboard/menus-dashboard.component';
import { DeleteUserDialog, EditUserDialog, NewUserDialog, UsersDashboardComponent } from './components/admin/users-dashboard/users-dashboard.component';


@NgModule({
  declarations: [
    AppComponent,
    OrdersQueueComponent,
    NotFoundComponent,
    HomeComponent,
    ProfileComponent,
    TablesComponent,
    LoginComponent,
    SeatsDialog,
    AddOrderDialog,
    NewTableDialog,
    EditTableDialog,
    DeleteTableDialog,
    DeleteMenuDialog,
    NewMenuDialog,
    TableInfoComponent,
    DashboardComponent,
    LoadingComponent,
    NavBarComponent,
    TablesDashboardComponent,
    MenusDashboardComponent,
    UsersDashboardComponent,
    EditMenuDialog,
    DeleteUserDialog,
    NewUserDialog,
    EditUserDialog,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    MaterialModule
  ],
  providers: [AuthProvider],
  bootstrap: [AppComponent],
})
export class AppModule {}
