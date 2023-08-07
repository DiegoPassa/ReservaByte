import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);

  // const tokenStorage: TokenStorageService = inject(TokenStorageService);

  // if (tokenStorage.isTokenExpired()) {
  //   return router.navigate(['forbidden']);    
  // }
  // else {
  //   const roles = route.data['permittedRoles'] as Array<string>;
  //   const userRole = tokenStorage.getUserToken().role;

  //   if (roles && !roles.includes(userRole)) {
  //     return router.navigate(['login']);
  //   }
  //   else
  //     return true;
  // }
  return true;
};
