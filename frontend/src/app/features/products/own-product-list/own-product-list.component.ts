import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/core/services/product.service';
import { ProductStatusTypes } from 'src/app/shared/models/enums/ProductStatusTypes';
import { UserProductStatusCategoryViewModel } from 'src/app/shared/models/UserProductStatusCategoryViewModel';
import { getEnumValues } from 'src/app/shared/utilities/enumData';

@Component({
  selector: 'app-own-product-list',
  templateUrl: './own-product-list.component.html',
  styleUrls: ['./own-product-list.component.scss'],
})
export class OwnProductListComponent implements OnInit {
  productList: UserProductStatusCategoryViewModel[] = [];
  ProductStatusTypes = ProductStatusTypes;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getOwnProducts().subscribe((x) => {
      getEnumValues(ProductStatusTypes).forEach((statusCode) => {
        const newStatusCategory: UserProductStatusCategoryViewModel = {
          statusCode,
          products: x.filter((p) => p.status === statusCode),
        };
        this.productList.push(newStatusCategory);
      });
    });
  }
}
