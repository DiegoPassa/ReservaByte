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
import { StorageService } from 'src/app/auth/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  // standalone: true,
  // imports: [MatFormFieldModule, MatInputModule, MatSelectModule, ReactiveFormsModule, MatButtonModule, MatCardModule, MatIconModule],
})
export class LoginComponent {

  hide = true;

  constructor(private auth: AuthService, private storage: StorageService, private router: Router) { }

  loginForm = new FormGroup({
    username: new FormControl('SpacePassino', [Validators.required, Validators.minLength(1)]),
    password: new FormControl('password', [Validators.required, Validators.minLength(8)]),
  });

  onSubmit() {
    if (this.loginForm.valid) {
      const username = this.loginForm.value.username!;
      const password = this.loginForm.value.password!;
      this.auth.login({username: username, password: password}).subscribe({
        next: data => {
          this.storage.saveUser(data);
          this.router.navigate(['home']);
        },
        error: err => {
          console.log(err);
        }
      });
    }
  }

}
