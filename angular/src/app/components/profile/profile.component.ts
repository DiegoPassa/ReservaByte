import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/auth/storage.service';
import { IUser } from 'src/app/models/User';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: any;

  constructor(private userService: UsersService, private storage: StorageService) {}

  ngOnInit(): void {
    this.userService.getUserById(this.storage.getUser().id).subscribe(
      {
        next: (data: IUser) => {
          this.user = data
        },
        error: (e) => console.error(e)
      });
  }

}
