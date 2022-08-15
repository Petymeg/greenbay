import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { UserInfoViewModel } from 'src/app/shared/models/UserInfoViewModel';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private mainInfo = new Subject<UserInfoViewModel>();
  mainInfo$ = this.mainInfo.asObservable();

  constructor(private http: HttpClient) {}

  getMainInfo(): void {
    this.http
      .get<UserInfoViewModel>(`${environment.apiUrl}/user-info`)
      .subscribe((x) => this.mainInfo.next(x));
  }
}
