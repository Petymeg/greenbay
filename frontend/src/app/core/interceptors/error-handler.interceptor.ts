import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { SnackbarService } from '../services/snackbar.service';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {
  constructor(
    private snackBarService: SnackbarService,
    private authService: AuthenticationService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      map((event) => {
        if (event instanceof HttpResponse) {
          if (event.statusText !== 'OK') {
            this.snackBarService.showSuccessMessage(event.statusText);
          }
        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        const { message } = error.error;
        const statusCode = error.status;

        if (statusCode === 401 || message === 'Invalid token') {
          this.authService.logout();
        }

        this.snackBarService.showErrorMessage(message, true);

        throw Error(message);
      })
    );
  }
}
