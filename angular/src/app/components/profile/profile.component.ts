import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { IUser } from 'src/app/models/User';
import { UsersService } from 'src/app/services/users.service';
import { AuthSelectors } from 'src/shared/auth-state';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent{
  
  @Select(AuthSelectors.getUser) user$!: Observable<IUser>;

  constructor(private dialog: MatDialog) {}

  changePassword(userId: string){
    this.dialog.open(ChangePasswordDialog, {
      data: userId,
      disableClose: true,
    });
  }
}

@Component({
  selector: 'change-password-dialog',
  templateUrl: 'change-password-dialog.html',
})
export class ChangePasswordDialog {
  constructor(private usersService: UsersService, private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: string, public dialogRef: MatDialogRef<ChangePasswordDialog>) {}

  passwordForm: {label: string, hide: boolean, formValue: string}[] = [
    {label: 'Vecchia password', hide: true, formValue: 'oldPassword'},
    {label: 'Nuova password', hide: true, formValue: 'newPassword'},
    {label: 'Ripeti nuova password', hide: true, formValue: 'newPasswordCheck'},
  ]

  changePasswordForm: FormGroup = this.fb.group({
    oldPassword: ['', [Validators.required, Validators.minLength(8)]],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    newPasswordCheck: ['', [Validators.required, Validators.minLength(8)]],
  });

  onSubmit() {
    if (this.changePasswordForm.valid && this.changePasswordForm.value.newPassword === this.changePasswordForm.value.newPasswordCheck) {
      this.usersService
        .updatePassword(this.data!, {
          oldPassword: this.changePasswordForm.value.oldPassword,
          newPassword: this.changePasswordForm.value.newPassword
        })
        .subscribe(
           () => this.dialogRef.close()
        );
    }
  }
}
