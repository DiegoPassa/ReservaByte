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
import { ChangePasswordDialog, ProfileComponent } from './components/profile/profile.component';
import { AuthProvider } from './utils/auth.interceptor';
import { AddOrderDialog, ReserveDialog, SeatsDialog, TablesComponent } from './components/tables/tables.component';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/material.module';
import { TableInfoComponent } from './components/table-info/table-info.component';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { LoadingComponent } from './components/loading/loading.component';
import { DeleteTableDialog, EditTableDialog, NewTableDialog, TablesDashboardComponent } from './components/admin/tables-dashboard/tables-dashboard.component';
import { MenusDashboardComponent, DeleteMenuDialog, NewMenuDialog, EditMenuDialog } from './components/admin/menus-dashboard/menus-dashboard.component';
import { DeleteUserDialog, EditUserDialog, NewUserDialog, UsersDashboardComponent } from './components/admin/users-dashboard/users-dashboard.component';
import { CashierComponent } from './components/cashier/cashier.component';

import { NgxsModule } from '@ngxs/store';
import { NgxsStoragePluginModule, SESSION_STORAGE_ENGINE } from '@ngxs/storage-plugin';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { AuthState } from 'src/shared/auth-state';
import { TablesState } from 'src/shared/tables-state';
import { MenusState } from 'src/shared/menus-state';
import { UsersState } from 'src/shared/users-state';

import { ToastrModule } from 'ngx-toastr';

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
    ChangePasswordDialog,
    CashierComponent,
    ReserveDialog,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    MaterialModule,
    NgxsModule.forRoot([AuthState, TablesState, MenusState, UsersState]),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    NgxsStoragePluginModule.forRoot({
      key: [{
        key: 'auth',
        engine: SESSION_STORAGE_ENGINE
      }]
    }),
    ToastrModule.forRoot({
      timeOut: 15000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
      countDuplicates: true,
      resetTimeoutOnDuplicate: true,
      progressBar: true,
      progressAnimation: 'decreasing',
      enableHtml: true
    })
  ],
  providers: [AuthProvider],
  bootstrap: [AppComponent],
})
export class AppModule {}
