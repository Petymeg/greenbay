import { Component, Input, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ProductService } from 'src/app/core/services/product.service';
import { ProductStatusTypes } from 'src/app/shared/models/enums/ProductStatusTypes';
import { UserProductViewModel } from 'src/app/shared/models/UserProductViewModel';

@Component({
  selector: 'tr[app-own-product-item]',
  templateUrl: './own-product-item.component.html',
  styleUrls: ['./own-product-item.component.scss'],
})
export class OwnProductItemComponent implements OnInit {
  @Input() productData: UserProductViewModel;
  ProductStatusTypes = ProductStatusTypes;
  statusClass: string;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.statusClass =
      ProductStatusTypes[this.productData.status].toLowerCase();
  }

  toggleStatus(): void {
    this.productData.status = this.productData.status
      ? this.ProductStatusTypes.Active
      : this.ProductStatusTypes.Inactive;
    this.statusClass =
      ProductStatusTypes[this.productData.status].toLowerCase();

    this.productService
      .setProductStatus(this.productData.id, this.productData.status)
      .subscribe();
  }
}
