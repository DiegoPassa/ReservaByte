import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/models/User';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  user = {}
  isAuthenticated = false;

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.user = this.authService.user!;
  }


}
