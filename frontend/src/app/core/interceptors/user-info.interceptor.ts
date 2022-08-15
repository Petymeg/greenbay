import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';
import { AuthenticationService } from '../services/authentication.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class UserInfoInterceptor implements HttpInterceptor {
  constructor(
    private userService: UserService,
    private authenticationService: AuthenticationService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (
      this.authenticationService.getToken() &&
      request.url !== `${environment.apiUrl}/user-info`
    ) {
      this.userService.getMainInfo();
    }
    return next.handle(request);
  }
}
