import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { StorageService } from './storage.service';
import { UserRole } from '../models/User';

export const roleGuard: CanActivateFn = (route, state) => {
  const userRole: UserRole = inject(StorageService).getUser().role;
  // TODO: remove admin permission
  if (userRole === UserRole.Admin) return true;
  const permitted: UserRole[] = route.data['roles'];
  if (permitted.includes(userRole)){
    return true;
  }
  alert('not authorized!');
  return false;
}