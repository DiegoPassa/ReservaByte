import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {

  let canAccess!: boolean;

  inject(AuthService).isAuthenticated$.subscribe(
    (val: boolean) => {
      canAccess = val;
    }
  )

  if (!canAccess) inject(Router).navigate(['login'])
  return canAccess
};
