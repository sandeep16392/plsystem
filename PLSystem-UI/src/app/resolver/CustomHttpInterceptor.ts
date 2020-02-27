import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, mergeMap, finalize } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { AppResponse } from '../models/AppResponse';
import { AlertifyService } from '../services/alertify.service';

@Injectable()
export class CustomHttpInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private alertify: AlertifyService) {}

  // Add authozization token to the request
  private setHeaders(request: HttpRequest<any>) {
    const token = localStorage.getItem('token');
    if (token) {
      request = request.clone({
        setHeaders: {
          'content-type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
    }
    return request;
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    request = this.setHeaders(request);
    return next.handle(request).pipe(
      catchError((error: any) => {
        if (error instanceof HttpErrorResponse) {
          switch (error.status) {
            case 0:{
              this.alertify.error('Unable to connect to server, please contact admin');
              return throwError({
                status: error.status,
                message: 'Unable to connect to server, please contact admin'
              } as AppResponse);
            }
            case 400:
            case 401:
            case 403:
            case 404:
            case 500:
            default:
              {
                if (error && error.error) {
                  this.alertify.error(error.error.message);
                } else {
                  this.alertify.error(error.message);
                }
              }
              // return throwError({
              //   status: error.status,
              //   message: error.message
              // } as AppResponse);
          }
        } else if (error.error instanceof ErrorEvent) {
          // Client Side Error
          this.alertify.error(error.error.message);
        } else {
          // Server Side Error
          this.alertify.error(error.error.message);
        }
      }),
      finalize(() => {
        // do something at the end
      })
    );
  }
}
