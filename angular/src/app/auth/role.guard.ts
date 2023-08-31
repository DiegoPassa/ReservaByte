import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { UserRole } from '../models/User';
import { Store } from '@ngxs/store';
import { AuthSelectors } from 'src/shared/auth-state';

export const roleGuard: CanActivateFn = (route, state) => {
  const userRole: UserRole = inject(Store).selectSnapshot(AuthSelectors.getUser)?.role!;
  // TODO: remove admin permission
  if (userRole === UserRole.Admin) return true;
  const permitted: UserRole[] = route.data['roles'];
  if (permitted.includes(userRole)){
    return true;
  }
  alert('not authorized!');
  return false;
}