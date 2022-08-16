import { Component, Input, OnInit } from '@angular/core';
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

  ngOnInit(): void {
    this.statusClass =
      ProductStatusTypes[this.productData.status].toLowerCase();
  }
}
