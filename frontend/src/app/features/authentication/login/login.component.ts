import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { UserLoginRequestViewModel } from 'src/app/shared/models/UserLoginRequestViewModel';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  form = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', [Validators.required]),
  });

  constructor(private authenticationService: AuthenticationService) {}

  get username(): AbstractControl {
    return this.form.get('username') as AbstractControl;
  }

  get password(): AbstractControl {
    return this.form.get('password') as AbstractControl;
  }

  login(): void {
    if (this.form.valid) {
      const user = this.form.getRawValue();
      this.authenticationService
        .login(user as UserLoginRequestViewModel)
        .subscribe();
    }
  }
}
