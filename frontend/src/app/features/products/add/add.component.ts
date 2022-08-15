import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ProductService } from 'src/app/core/services/product.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddComponent {
  form = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    imgUrl: new FormControl('', [
      Validators.required,
      Validators.pattern(/^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/),
    ]),
    price: new FormControl(10, Validators.required),
  });
  isImgURLValid: boolean;

  constructor(private productService: ProductService) {}

  get name(): AbstractControl {
    return this.form.get('name') as AbstractControl;
  }

  get description(): AbstractControl {
    return this.form.get('description') as AbstractControl;
  }

  get imgUrl(): AbstractControl {
    return this.form.get('imgUrl') as AbstractControl;
  }

  get price(): AbstractControl {
    return this.form.get('price') as AbstractControl;
  }

  addProduct(): void {
    if (this.form.valid) {
      this.productService.addProduct(this.form.getRawValue()).subscribe();
    }
  }
}
