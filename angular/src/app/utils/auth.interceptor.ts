import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { AuthSelectors } from 'src/shared/authState/auth-selectors';
import { Store } from '@ngxs/store';
import { Refresh } from 'src/shared/authState/auth-actions';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  refreshed = false;

  constructor(private store: Store, private auth: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // if user has token
    if (this.store.selectSnapshot(AuthSelectors.isAuthenticated)) {
      const authReq = this.setBearer(request);
      return next.handle(authReq).pipe(catchError((err: HttpErrorResponse) => {
          if (err.status === 401 && !this.refreshed) {
            this.refreshed = true;
            return this.auth.refreshToken().pipe(
              switchMap((res: any) => {
                // this.storage.saveUser(res);
                this.store.dispatch(new Refresh(res))
                const newAuthReq = this.setBearer(request)
                this.refreshed = false;
                return next.handle(newAuthReq);
              })
            );
          }
          return throwError(() => err);
        })
      );
    }
    return next.handle(request);
  }

  setBearer(request: HttpRequest<unknown>): HttpRequest<unknown> {
    const token = this.store.selectSnapshot(AuthSelectors.getToken);
    return request.clone({
      setHeaders: {
        Authorization: `bearer ${token}`
      },
    });
  }
}

export const AuthProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: AuthInterceptor,
  multi: true,
};
