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
import { StorageService } from '../auth/storage.service';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  refreshed = false;

  constructor(private storage: StorageService, private auth: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // if user has token
    if (this.storage.isLoggedIn()) {
      // set bearer
      const authReq = this.setHeader(request);
      return next.handle(authReq).pipe(catchError((err: HttpErrorResponse) => {
        // if token is not valid
          if (err.status === 401 && !this.refreshed) {
            this.refreshed = true;
            return this.auth.refreshToken().pipe(
              switchMap((res: any) => {
                this.storage.saveUser(res);
                const newAuthReq = this.setHeader(request)
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

  setHeader(request: HttpRequest<unknown>, token: string = this.storage.getAccessToken()): HttpRequest<unknown> {
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
