import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { Observable, tap, map } from 'rxjs';
import { UserRegistrationRequestViewModel } from 'src/app/shared/models/UserRegistrationRequestViewModel';
import { UserRegistrationViewModel } from 'src/app/shared/models/UserRegistrationViewModel';
import { UserLoginRequestViewModel } from 'src/app/shared/models/UserLoginRequestViewModel';
import { UserLoginViewModel } from 'src/app/shared/models/UserLoginViewModel';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private http: HttpClient, private router: Router) {}

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string {
    return localStorage.getItem('token');
  }

  setUsername(username: string): void {
    localStorage.setItem('username', username);
  }

  getUsername(): string {
    return localStorage.getItem('username');
  }

  setMoney(money: string): void {
    localStorage.setItem('money', money);
  }

  getMoney(): string {
    return localStorage.getItem('money');
  }

  clearLocalStorage(): void {
    localStorage.clear();
  }

  registerUser(userdata: UserRegistrationRequestViewModel): Observable<void> {
    return this.http
      .post<UserRegistrationViewModel>(
        `${environment.apiUrl}/user/register`,
        userdata
      )
      .pipe(
        tap((x) => {
          this.setToken(x.token);
          this.setUsername(x.username);
          this.setMoney(`${x.money}`);
          this.router.navigate(['/products']);
        }),
        map(() => undefined)
      );
  }

  login(loginData: UserLoginRequestViewModel): Observable<void> {
    return this.http
      .post<UserLoginViewModel>(`${environment.apiUrl}/user/login`, loginData)
      .pipe(
        tap((x) => {
          this.setToken(x.token);
          this.setUsername(x.username);
          this.setMoney(`${x.money}`);
          this.router.navigate(['/products']);
        }),
        map(() => undefined)
      );
  }

  logout(): void {
    this.clearLocalStorage();
    this.router.navigate(['/login']);
  }
}
