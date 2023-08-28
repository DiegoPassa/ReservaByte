import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, map, switchMap, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { AuthSelectors } from 'src/shared/authState/auth-selectors';
import { Store } from '@ngxs/store';
import { Logout, Refresh } from 'src/shared/authState/auth-actions';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private store: Store, private auth: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    // if user is not authenticated send the request as it is
    if (!this.store.selectSnapshot(AuthSelectors.isAuthenticated)) return next.handle(request);

    // else add the bearer header to the request
    const authReq = this.setBearer(request);

    // send the new request
    return next.handle(authReq).pipe(
      catchError((err: HttpErrorResponse) => {

        // if the request return error 401 'Unauthorized'
        if (err.status === 401) {

          // call the refresh function
          return this.auth.refreshToken().pipe(
            switchMap((res: any) => {

              // update the localstorage
              this.store.dispatch(new Refresh(res.accessToken));

              // prepare the request with the new refreshed token
              const refreshedAuthReq = this.setBearer(request);

              // handle refreshToken expired
              return next.handle(refreshedAuthReq).pipe(
                catchError((err: HttpErrorResponse) => {
                    if (err.status === 401) {

                      // session is expired, log out the user
                      this.store.dispatch(new Logout());
                    }
                    return throwError(() => err);
                  })
              );
            })
          );
        }
        return throwError(() => err);
      })
    );
    
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
