import { Component, OnInit } from '@angular/core';

interface routeInterface{
  name: string,
  path: string
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {

  opened: boolean = true

  routes: routeInterface[] = [
    { name: 'Tavoli', path: 'tables' },
    { name: 'Utenti', path: 'users' },
    { name: 'Menu', path: 'menus' },
  ];

  ngOnInit(): void {}
}
