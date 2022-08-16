import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/core/services/product.service';
import { ProductStatusTypes } from 'src/app/shared/models/enums/ProductStatusTypes';
import { UserProductViewModel } from 'src/app/shared/models/UserProductViewModel';

@Component({
  selector: 'app-own-product-list',
  templateUrl: './own-product-list.component.html',
  styleUrls: ['./own-product-list.component.scss'],
})
export class OwnProductListComponent implements OnInit {
  activeProducts: UserProductViewModel[];
  inactiveProducts: UserProductViewModel[];
  soldProducts: UserProductViewModel[];
  ProductStatusTypes = ProductStatusTypes;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getOwnProducts().subscribe((x) => {
      this.activeProducts = x.filter(
        (p) => p.status === ProductStatusTypes.Active
      );
      this.inactiveProducts = x.filter(
        (p) => p.status === ProductStatusTypes.Inactive
      );
      this.soldProducts = x.filter((p) => p.status === ProductStatusTypes.Sold);
    });
  }
}
