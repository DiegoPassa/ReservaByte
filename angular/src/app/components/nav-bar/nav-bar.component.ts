import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { StorageService } from 'src/app/auth/storage.service';
import { UserRole } from 'src/app/models/User';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent {
  appName = 'ReservaByte';
  routes = [
    { name: 'Tavoli', route: '/tables', roles: [UserRole.Admin, UserRole.Waiter] },
    { name: 'Ordini', route: '/orders', roles: [UserRole.Admin, UserRole.Cook, UserRole.Bartender] },
    { name: 'Profilo', route: '/profile', roles: [UserRole.Admin, UserRole.Cashier, UserRole.Waiter, UserRole.Bartender, UserRole.Cook] },
    { name: 'Dashboard', route: '/admin', roles: [UserRole.Admin, UserRole.Cashier] },
  ];

  constructor(
    public auth: AuthService,
    public storage: StorageService,
    public router: Router
  ) {}
}
