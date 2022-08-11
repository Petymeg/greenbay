import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
    imgUrl: new FormControl('', Validators.required),
    price: new FormControl(0, Validators.required),
  });
  constructor(private productService: ProductService) {}

  addProduct(): void {
    if (this.form.valid) {
      this.productService.addProduct(this.form.getRawValue()).subscribe();
    }
  }
}
