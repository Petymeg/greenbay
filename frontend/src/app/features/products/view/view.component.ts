import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { ProductService } from 'src/app/core/services/product.service';
import { ProductWithOwnerViewModel } from 'src/app/shared/models/ProductWithOwnerViewModel';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent implements OnInit {
  productDetails: ProductWithOwnerViewModel;
  isOwnProduct: boolean;

  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.productService.getProductDetails(params['id']).subscribe((x) => {
        this.productDetails = x;

        this.isOwnProduct =
          this.productDetails.owner.name ===
          this.authenticationService.getUsername();
      });
    });
  }
}
