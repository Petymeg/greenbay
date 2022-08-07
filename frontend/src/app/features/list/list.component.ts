import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/core/services/product.service';
import { ProductWithOwnerViewModel } from 'src/app/shared/models/ProductWithOwnerViewModel';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  products: ProductWithOwnerViewModel[];

  constructor(private producService: ProductService) {}

  ngOnInit(): void {
    this.producService.getSellableItems().subscribe((x) => {
      this.products = x;
    });
  }
}
