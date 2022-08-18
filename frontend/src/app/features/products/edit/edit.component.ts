import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { ProductService } from 'src/app/core/services/product.service';
import { ProductStatusTypes } from 'src/app/shared/models/enums/ProductStatusTypes';
import { ProductWithOwnerViewModel } from 'src/app/shared/models/ProductWithOwnerViewModel';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit {
  productDetails: ProductWithOwnerViewModel;
  productStatusTypes = ProductStatusTypes;
  form = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    imgUrl: new FormControl('', [
      Validators.required,
      Validators.pattern(/^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/),
    ]),
    price: new FormControl(10, Validators.required),
  });
  status: boolean;
  isImgURLValid: boolean;

  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.init(params['id']);
    });
  }

  init(productId: number): void {
    this.productService
      .getProductDetails(productId)
      .subscribe(({ name, description, price, status, imgUrl, owner }) => {
        this.form.setValue({ name, description, price, imgUrl });
        this.status = !!status;
        if (owner.name !== this.authenticationService.getUsername())
          this.router.navigate(['/products/view', productId]);
      });
  }
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

  editProduct(): void {
    if (this.form.valid) {
      console.log(this.form.getRawValue());
    }
  }
}
