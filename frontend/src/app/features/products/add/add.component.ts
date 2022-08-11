import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddComponent {
  form = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    imgUrl: new FormControl('', Validators.required),
    price: new FormControl('', Validators.required),
  });
  constructor() {}
}
