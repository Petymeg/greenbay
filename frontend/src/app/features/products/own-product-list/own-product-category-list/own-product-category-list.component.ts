import { Component, Input, OnInit } from '@angular/core';
import { ProductStatusTypes } from 'src/app/shared/models/enums/ProductStatusTypes';
import { UserProductViewModel } from 'src/app/shared/models/UserProductViewModel';

@Component({
  selector: 'app-own-product-category-list',
  templateUrl: './own-product-category-list.component.html',
  styleUrls: ['./own-product-category-list.component.scss'],
})
export class OwnProductCategoryListComponent implements OnInit {
  @Input() productList: UserProductViewModel[];
  @Input() productCategory: string;
  ProductStatusTypes = ProductStatusTypes;

  constructor() {}

  ngOnInit(): void {}
}
