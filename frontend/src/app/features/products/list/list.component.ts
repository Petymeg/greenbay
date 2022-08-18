import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { ProductService } from 'src/app/core/services/product.service';
import { ProductWithOwnerViewModel } from 'src/app/shared/models/ProductWithOwnerViewModel';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  products: ProductWithOwnerViewModel[];
  viewableProducts: ProductWithOwnerViewModel[];
  viewOwnProducts: boolean;

  constructor(
    private productService: ProductService,
    private athenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.productService.getSellableItems();
    this.productService.sellableItems$.subscribe((x) => {
      this.products = x;
      this.setViewableProducts();
    });
  }

  setViewableProducts(): void {
    this.viewOwnProducts
      ? (this.viewableProducts = this.products)
      : (this.viewableProducts = this.products.filter(
          (x) => x.owner.name !== this.athenticationService.getUsername()
        ));
  }
}
