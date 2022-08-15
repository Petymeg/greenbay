import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
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

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getMainInfo();
    this.userInfoSubscription = this.userService.mainInfo$.subscribe(
      (x) => (this.userInfo = x)
    );
  }

  ngOnDestroy(): void {
    this.userInfoSubscription.unsubscribe();
  }
}
