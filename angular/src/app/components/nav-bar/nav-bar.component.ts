import { Component, OnInit } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { StorageService } from 'src/app/auth/storage.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, CommonModule, RouterModule],
})
export class NavBarComponent{
  appName = "ReservaByte";
  routes = [{name: 'Tavoli', route: '/tables'}, {name: 'Ordini', route:'/orders'}, {name: 'Profilo', route: '/profile'}];

  constructor(public auth: AuthService, public storage: StorageService, public router: Router) {}
}
