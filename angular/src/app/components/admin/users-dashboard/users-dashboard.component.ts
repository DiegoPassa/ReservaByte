import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Actions, Store, ofActionCompleted, ofActionDispatched } from '@ngxs/store';
import { IUser, UserRole } from 'src/app/models/User';
import { LoadingService } from 'src/app/services/loading.service';
import { UsersService } from 'src/app/services/users.service';
import { AddUser, GetUsers, RemoveUser, UpdateUser, UsersSelectors } from 'src/shared/users-state';

@Component({
  selector: 'app-users-dashboard',
  templateUrl: './users-dashboard.component.html',
  styleUrls: ['./users-dashboard.component.css']
})
export class UsersDashboardComponent implements OnInit{
  
  userRoles = UserRole
  
  roleDistibution: any = []
  
  waitersStatistics: any = []
  cashiersStatistics: any = []
  bartendersStatistics: any = []
  cooksStatistics: any = []
  
  // @Select(UsersSelectors.getUsers) users$!: Observable<IUser[]>
  
  constructor(private dialog: MatDialog, private loading: LoadingService, private actions: Actions, private store: Store) {}
  
  displayedColumns: string[] = [
    'name',
    'role',
    'username',
    'email',
    'actions',
  ];

  // @ViewChild(MatTable) table!: MatTable<IUser>;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource(this.store.selectSnapshot(UsersSelectors.getUsers));

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {

    this.updateChart();

    this.actions.pipe(ofActionDispatched(AddUser)).subscribe(() => {
      this.dataSource.data = this.store.selectSnapshot(UsersSelectors.getUsers);
      // this.table.renderRows();
      this.updateChart();
    });
    this.actions.pipe(ofActionDispatched(RemoveUser)).subscribe(() => {
      this.dataSource.data = this.store.selectSnapshot(UsersSelectors.getUsers);
      // this.table.renderRows();
      this.updateChart();
    });
    this.actions.pipe(ofActionDispatched(UpdateUser)).subscribe(() => {
      // this.table.renderRows();
      this.dataSource.data = this.store.selectSnapshot(UsersSelectors.getUsers);
    });

    this.actions.pipe(ofActionCompleted(GetUsers)).subscribe(() => {
      this.dataSource.data = this.store.selectSnapshot(UsersSelectors.getUsers);
      this.updateChart();
    })
  }

  updateChart(){
    this.roleDistibution = [{
      "name": "Camerieri",
      "value": this.store.selectSnapshot(UsersSelectors.getUsers).filter(e => e.role === UserRole.Waiter).length
    },
    {
      "name": "Cassieri",
      "value": this.store.selectSnapshot(UsersSelectors.getUsers).filter(e => e.role === UserRole.Cashier).length
    },
    {
      "name": "Baristi",
      "value": this.store.selectSnapshot(UsersSelectors.getUsers).filter(e => e.role === UserRole.Bartender).length
    },
    {
      "name": "Cuochi",
      "value": this.store.selectSnapshot(UsersSelectors.getUsers).filter(e => e.role === UserRole.Cook).length
    }]

    const waitersStatistics_tmp: any = []
    this.store.selectSnapshot(UsersSelectors.getUsers).filter(e => e.role === UserRole.Waiter).forEach(
      e => {
        waitersStatistics_tmp.push({
          name: `${e.firstName} ${e.lastName}`, 
          series: [{
            name: "Tavoli servivi", value: e.statistics.tablesServed
          },{
            name: "Clienti serviti", value: e.statistics.customersServed
          }]
        }); 
      }
    )
    this.waitersStatistics = waitersStatistics_tmp;

    const cashiersStatistics_tmp: any = []
    this.store.selectSnapshot(UsersSelectors.getUsers).filter(e => e.role === UserRole.Cashier).forEach(
      e => {
        cashiersStatistics_tmp.push({
          name: `${e.firstName} ${e.lastName}`, 
          value: e.statistics.billsPrepared
        }); 
      }
    )
    this.cashiersStatistics = cashiersStatistics_tmp;

    const bartendersStatistics_tmp: any = []
    this.store.selectSnapshot(UsersSelectors.getUsers).filter(e => e.role === UserRole.Bartender).forEach(
      e => {
        bartendersStatistics_tmp.push({
          name: `${e.firstName} ${e.lastName}`, 
          value: e.statistics.drinksServed
        }); 
      }
    )
    this.bartendersStatistics = bartendersStatistics_tmp;

    const cooksStatistics_tmp: any = []
    this.store.selectSnapshot(UsersSelectors.getUsers).filter(e => e.role === UserRole.Cook).forEach(
      e => {
        cooksStatistics_tmp.push({
          name: `${e.firstName} ${e.lastName}`, 
          value: e.statistics.dishesPrepared
        }); 
      }
    )
    this.cooksStatistics = cooksStatistics_tmp;
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
        .updateUserById(this.data._id!, {
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