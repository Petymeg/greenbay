import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of } from 'rxjs';
import { UserRegistrationRequestViewModel } from 'src/app/shared/models/UserRegistrationRequestViewModel';
import { UserRegistrationViewModel } from 'src/app/shared/models/UserRegistrationViewModel';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private http: HttpClient, private router: Router) {}

  registerUser(
    userdata: UserRegistrationRequestViewModel
  ): Observable<UserRegistrationViewModel> {
    return this.http
      .post<UserRegistrationViewModel>(
        `${environment.apiUrl}/user/register`,
        userdata
      )
      .pipe(
        tap(() => {
          this.router.navigate(['/login']);
        })
      );
  }
}
