import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersQueueComponent } from './orders-queue.component';

describe('OrdersQueueComponent', () => {
  let component: OrdersQueueComponent;
  let fixture: ComponentFixture<OrdersQueueComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrdersQueueComponent]
    });
    fixture = TestBed.createComponent(OrdersQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
