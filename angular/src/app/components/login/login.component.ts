import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { UserRole } from 'src/app/models/User';
import { Login } from 'src/shared/authState/auth-actions';
import { AuthStateModel } from 'src/shared/authState/auth-state';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {

  hide = true;

  constructor(private store: Store, private router: Router) { }

  loginForm = new FormGroup({
    username: new FormControl('diego.passa', [Validators.required]),
    password: new FormControl('password', [Validators.required, Validators.minLength(8)]),
  });

  onSubmit() {
    if (this.loginForm.valid) {
      const username = this.loginForm.value.username!;
      const password = this.loginForm.value.password!;
      this.store.dispatch(new Login({username, password})).subscribe((data: {auth: AuthStateModel})  => {
        switch (data.auth.user!.role) {
          case UserRole.Admin:
            this.router.navigate(['/admin'])
            break;
          case UserRole.Waiter:
            this.router.navigate(['/tables'])
            break;
          case UserRole.Cook || UserRole.Bartender:
            this.router.navigate(['/orders'])
            break;
          case UserRole.Cashier:
            this.router.navigate(['/receipts'])
            break;
        }
      });
    }
  }

}
