import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { UserService } from 'src/app/core/services/user.service';
import { UserInfoViewModel } from '../models/UserInfoViewModel';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  userInfoSubscription: Subscription;
  userInfo: UserInfoViewModel;
  userName: string;

  constructor(
    private userService: UserService,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.userInfoSubscription = this.userService.mainInfo$.subscribe(
      (x) => (this.userInfo = x)
    );
    this.userName = this.authenticationService.getUsername();
  }

  ngOnDestroy(): void {
    this.userInfoSubscription.unsubscribe();
  }
}
