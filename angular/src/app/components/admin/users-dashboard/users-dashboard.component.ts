import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { IUser, UserRole } from 'src/app/models/User';
import { LoadingService } from 'src/app/services/loading.service';
import { SocketIoService } from 'src/app/services/socket-io.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-users-dashboard',
  templateUrl: './users-dashboard.component.html',
  styleUrls: ['./users-dashboard.component.css']
})
export class UsersDashboardComponent implements OnInit, OnDestroy{

  userRoles = UserRole

  dataSource!: IUser[];
  displayedColumns: string[] = [
    'name',
    'role',
    'username',
    'email',
    'actions',
  ];

  constructor(private usersService: UsersService, private dialog: MatDialog, private socket: SocketIoService, private loading: LoadingService) {}

  @ViewChild(MatTable) table!: MatTable<IUser>;

  ngOnInit(): void {
    this.loading.loadingOn();
    this.usersService.getUsers().subscribe((users: IUser[]) => {
      this.dataSource = users;
      this.loading.loadingOff();
    });

    this.socket.listen('user:new').subscribe((newUser: any) => {
      this.dataSource.push(newUser);
      this.table.renderRows();
    });
    
    this.socket.listen('user:delete').subscribe((userId: any) => {
      const i = this.dataSource.findIndex((el) => el._id === userId);
      this.dataSource.splice(i, 1);
      this.table.renderRows();
    });
    
    this.socket.listen('user:update').subscribe((updatedUser: any) => {
      const i = this.dataSource.findIndex((el) => el._id === updatedUser?._id);
      this.dataSource[i] = updatedUser;
      this.table.renderRows();
    });
  }

  ngOnDestroy(): void {
    this.socket.socket.off('user:new');
    this.socket.socket.off('user:delete');
    this.socket.socket.off('user:update');
  }

  addData() {
    this.dialog.open(NewUserDialog, {
      disableClose: true,
    });
  }

  editData(user: IUser) {
    this.dialog.open(EditUserDialog, {
      data: user,
      disableClose: true,
    });
  }

  removeData(userId: string, username: string) {
    this.dialog.open(DeleteUserDialog, {
      data: { userId, username },
      disableClose: true,
    });
  }
}

@Component({
  selector: 'edit-user-dialog',
  templateUrl: 'edit-user-dialog.html',
})
export class EditUserDialog {
  constructor(private usersService: UsersService, private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: IUser) {}

  hide = true;

  editUserForm: FormGroup = this.fb.group({
    firstName: [this.data.firstName, Validators.required],
    lastName: [this.data.lastName, Validators.required],
    email: [this.data.email, [Validators.required, Validators.email]],
    username: [this.data.username, Validators.required]
  });

  onSubmit() {
    if (this.editUserForm.valid) {
      this.usersService
        .updateUserById(this.data._id, {
          firstName: this.editUserForm.value.firstName,
          lastName: this.editUserForm.value.lastName,
          email: this.editUserForm.value.email,
          username: this.editUserForm.value.username,
        })
        .subscribe();
    }
  }
}

@Component({
  selector: 'new-user-dialog',
  templateUrl: 'new-user-dialog.html',
})
export class NewUserDialog {
  constructor(private usersService: UsersService, private fb: FormBuilder) {}

  hide = true;

  userRoles = [
    { name: 'Cameriere', value: UserRole.Waiter },
    { name: 'Cuoco', value: UserRole.Cook },
    { name: 'Barista', value: UserRole.Bartender },
    { name: 'Cassiere', value: UserRole.Cashier },
  ];

  newUserForm: FormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    role: [UserRole.Waiter, Validators.required],
    email: ['', [Validators.required, Validators.email]],
    username: ['', Validators.required],
    password: ['', [Validators.required, Validators.min(8)]],
  });

  onSubmit() {
    if (this.newUserForm.valid) {
      this.usersService
        .newUser({
          firstName: this.newUserForm.value.firstName,
          lastName: this.newUserForm.value.lastName,
          role: this.newUserForm.value.role,
          email: this.newUserForm.value.email,
          username: this.newUserForm.value.username,
          password: this.newUserForm.value.password
        })
        .subscribe();
    }
  }
}

interface deleteInterface{
  userId: string,
  username: string
}

@Component({
  template: `
  <div matDialogTitle class="px-4 pb-2 font-bold text-xl">Eliminazione utente</div>
  <div matDialogContent class="p-4">
      <p>Sei sicuro di voler eliminare l'utente <b>{{data.username}}</b>?</p>
  </div>
  <div mat-dialog-actions class="px-4 pb-4 py-0">
      <button mat-flat-button matDialogClose color="warn">Annulla</button>
      <button mat-stroked-button matDialogClose color="primary" (click)="deleteUser()" >Conferma</button>
  </div>`,
})
export class DeleteUserDialog {
  constructor(private usersService: UsersService, @Inject(MAT_DIALOG_DATA) public data: deleteInterface) {}

  deleteUser(){
    this.usersService.deleteUserById(this.data.userId).subscribe();
  }
}