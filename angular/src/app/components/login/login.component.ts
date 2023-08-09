import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import jwt_decode from 'jwt-decode';
import { IToken } from 'src/app/models/DecodedJWT';
import { IUser, User } from 'src/app/models/User';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, ReactiveFormsModule, MatButtonModule, MatCardModule, MatIconModule],
})
export class LoginComponent {

  hide = true;

  constructor(private auth: AuthService, private router: Router) { }

  loginForm = new FormGroup({
    username: new FormControl('SpacePassino', [Validators.required, Validators.minLength(1)]),
    password: new FormControl('password', [Validators.required, Validators.minLength(8)]),
  });

  onSubmit() {
    if (this.loginForm.valid) {
      const username = this.loginForm.value.username;
      const password = this.loginForm.value.password;
      this.auth.loginUser({ username: username!, password: password! }).subscribe((data: any) => {
        const decodedJWT: IToken = this.getDecodedAccessToken(data.accessToken);
        const user: IUser = data.user;
        localStorage.setItem('user', JSON.stringify(this.auth.createUser(new User(user, decodedJWT, data.accessToken))));
        this.router.navigate(['home']);
      })
    }
  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch (Error) {
      return null;
    }
  }

}
