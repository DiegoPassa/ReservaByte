import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { AuthSelectors } from 'src/shared/auth-state';

export const authGuard: CanActivateFn = (route, state) => {

  if(!inject(Store).selectSnapshot(AuthSelectors.isAuthenticated)){
    inject(Router).navigate(['/login']);
    return false;
  }
  return true;

};
