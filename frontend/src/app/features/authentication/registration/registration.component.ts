import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { UserRegistrationRequestViewModel } from 'src/app/shared/models/UserRegistrationRequestViewModel';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent {
  form = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  constructor(private authenticationService: AuthenticationService) {}

  get username(): AbstractControl {
    return this.form.get('username') as AbstractControl;
  }

  get password(): AbstractControl {
    return this.form.get('password') as AbstractControl;
  }

  signUp(): void {
    if (this.form.valid) {
      const user = this.form.getRawValue();
      this.authenticationService
        .registerUser(user as UserRegistrationRequestViewModel)
        .subscribe();
    }
  }
}
