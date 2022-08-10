import { Component, Input } from '@angular/core';
import { ProductWithOwnerViewModel } from 'src/app/shared/models/ProductWithOwnerViewModel';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss'],
})
export class ListItemComponent {
  @Input() productDetails: ProductWithOwnerViewModel;
}
