import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TestComponent } from './components/test/test.component';
import { TableComponent } from './components/table/table.component';
import { OrdersQueueComponent } from './components/orders-queue/orders-queue.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    OrdersQueueComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NavBarComponent,
    TestComponent,
    TableComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
