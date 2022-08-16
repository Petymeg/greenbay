import { Component, Input, OnInit } from '@angular/core';
import { ProductStatusTypes } from 'src/app/shared/models/enums/ProductStatusTypes';
import { UserProductStatusCategoryViewModel } from 'src/app/shared/models/UserProductStatusCategoryViewModel';

@Component({
  selector: 'app-own-product-category-list',
  templateUrl: './own-product-category-list.component.html',
  styleUrls: ['./own-product-category-list.component.scss'],
})
export class OwnProductCategoryListComponent implements OnInit {
  @Input() productList: UserProductStatusCategoryViewModel;
  ProductStatusTypes = ProductStatusTypes;
  editable: boolean;

  ngOnInit(): void {
    this.editable = !(this.productList.statusCode === ProductStatusTypes.Sold);
  }
}
