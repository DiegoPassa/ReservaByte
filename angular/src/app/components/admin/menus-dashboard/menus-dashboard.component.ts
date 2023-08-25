import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { IMenu, MenuType } from 'src/app/models/Menu';
import { LoadingService } from 'src/app/services/loading.service';
import { MenusService } from 'src/app/services/menus.service';
import { SocketIoService } from 'src/app/services/socket-io.service';

@Component({
  selector: 'app-menus-dashboard',
  templateUrl: './menus-dashboard.component.html',
  styleUrls: ['./menus-dashboard.component.css'],
})
export class MenusDashboardComponent implements OnInit, OnDestroy{
  dataSource!: IMenu[];
  displayedColumns: string[] = [
    'name',
    'price',
    'type',
    'ingredients',
    'portionSize',
    'preparationTime',
    'totalOrders',
    'actions',
  ];

  constructor(
    private menusService: MenusService,
    private dialog: MatDialog,
    private socket: SocketIoService,
    private loading: LoadingService
  ) {}

  @ViewChild(MatTable) table!: MatTable<IMenu>;

  ngOnInit(): void {
    this.loading.loadingOn();
    this.menusService.getMenus().subscribe((menus: IMenu[]) => {
      this.dataSource = menus;
      this.loading.loadingOff();
    });

    this.socket.listen('menu:new').subscribe((newMenu: any) => {
      this.dataSource.push(newMenu);
      this.table.renderRows();
    });
    
    this.socket.listen('menu:delete').subscribe((menuId: any) => {
      const i = this.dataSource.findIndex((el) => el._id === menuId);
      this.dataSource.splice(i, 1);
      this.table.renderRows();
    });
    
    this.socket.listen('menu:update').subscribe((updatedMenu: any) => {
      const i = this.dataSource.findIndex((el) => el._id === updatedMenu?._id);
      this.dataSource[i] = updatedMenu;
      this.table.renderRows();
    });
  }

  ngOnDestroy(): void {
    this.socket.socket.off('menu:new');
    this.socket.socket.off('menu:delete');
    this.socket.socket.off('menu:update');
  }

  addData() {
    this.dialog.open(NewMenuDialog, {
      disableClose: true,
    });
  }

  editData(menu: IMenu) {
    this.dialog.open(EditMenuDialog, {
      data: menu,
      disableClose: true,
    });
  }

  removeData(menuId: string, menuName: string) {
    this.dialog.open(DeleteMenuDialog, {
      data: { menuId, menuName },
      disableClose: true,
    });
  }
}

@Component({
  selector: 'edit-menu-dialog',
  templateUrl: 'edit-menu-dialog.html',
})
export class EditMenuDialog {
  constructor(
    private menusService: MenusService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: IMenu
  ) {}

  editMenuForm: FormGroup = this.fb.group({
    price: [this.data.price, [Validators.required, Validators.min(0)]],
    ingredients: [this.data.ingredients.toString(), Validators.required],
    portionSize: [
      this.data.portionSize,
      [Validators.required, Validators.min(0)],
    ],
    preparationTime: [
      this.data.preparationTime,
      [Validators.required, Validators.min(0)],
    ],
  });

  onSubmit() {
    if (this.editMenuForm.valid) {
      this.menusService
        .updateMenuById(this.data._id, {
          price: this.editMenuForm.value.price,
          portionSize: this.editMenuForm.value.portionSize,
          preparationTime: this.editMenuForm.value.preparationTime,
          ingredients: this.editMenuForm.value.ingredients
            .split(',')
            .map((e: string) => e.trimStart().trimEnd()),
        })
        .subscribe();
    }
  }
}

@Component({
  selector: 'new-menu-dialog',
  templateUrl: 'new-menu-dialog.html',
})
export class NewMenuDialog {
  constructor(private menusService: MenusService, private fb: FormBuilder) {}

  menuTypes = [
    { name: 'Piatto', value: MenuType.Dish },
    { name: 'Bevanda', value: MenuType.Drink },
  ];

  newMenuForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    type: [MenuType.Dish, Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    ingredients: ['', Validators.required],
    portionSize: [0, [Validators.required, Validators.min(0)]],
    preparationTime: [0, [Validators.required, Validators.min(0)]],
  });

  onSubmit() {
    if (this.newMenuForm.valid) {
      this.menusService
        .newMenu({
          name: this.newMenuForm.value.name,
          type: this.newMenuForm.value.type,
          price: this.newMenuForm.value.price,
          portionSize: this.newMenuForm.value.portionSize,
          preparationTime: this.newMenuForm.value.preparationTime,
          ingredients: this.newMenuForm.value.ingredients
            .split(',')
            .map((e: string) => e.trimStart().trimEnd()),
        })
        .subscribe();
    }
  }
}

interface deleteInterface {
  menuId: string;
  menuName: string;
}

@Component({
  template: ` <div matDialogTitle class="px-4 pb-2 font-bold text-xl">
      Eliminazione menù
    </div>
    <div matDialogContent class="p-4">
      <p>
        Sei sicuro di voler eliminare il menù <b>{{ data.menuName }}</b>?
      </p>
    </div>
    <div mat-dialog-actions class="px-4 pb-4 py-0">
      <button mat-flat-button matDialogClose color="warn">Annulla</button>
      <button
        mat-stroked-button
        matDialogClose
        color="primary"
        (click)="deleteMenu()">
        Conferma
      </button>
    </div>`,
})
export class DeleteMenuDialog {
  constructor(
    private menuService: MenusService,
    @Inject(MAT_DIALOG_DATA) public data: deleteInterface
  ) {}

  deleteMenu() {
    this.menuService.deleteMenuById(this.data.menuId).subscribe();
  }
}
