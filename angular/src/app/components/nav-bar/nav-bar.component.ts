import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { IUser, UserRole } from 'src/app/models/User';
import { AuthSelectors, Logout } from 'src/shared/auth-state';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent {

  @Select(AuthSelectors.getUser) user$!: Observable<IUser>
  @Select(AuthSelectors.isAuthenticated) isAuthenticated$!: Observable<boolean>

  appName = 'ReservaByte';
  routes = [
    { name: 'Tavoli', route: '/tables', roles: [UserRole.Admin, UserRole.Waiter] },
    { name: 'Ordini', route: '/orders', roles: [UserRole.Admin, UserRole.Cook, UserRole.Bartender] },
    { name: 'Cassa', route: '/receipts', roles: [UserRole.Admin, UserRole.Cashier] },
    { name: 'Dashboard', route: '/admin', roles: [UserRole.Admin, UserRole.Cashier] },
    { name: 'Profilo', route: '/profile', roles: [UserRole.Admin, UserRole.Cashier, UserRole.Waiter, UserRole.Bartender, UserRole.Cook] },
  ];

  constructor(
    public auth: AuthService,
    public store: Store,
    public router: Router
  ) {}

  logout(){
    this.store.dispatch(new Logout());
  }
}
