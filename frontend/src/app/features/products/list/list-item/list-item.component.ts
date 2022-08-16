import { Component, Input, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { ProductWithOwnerViewModel } from 'src/app/shared/models/ProductWithOwnerViewModel';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss'],
})
export class ListItemComponent implements OnInit {
  @Input() productDetails: ProductWithOwnerViewModel;
  isOwnProduct: boolean;

  constructor(private authenticationService: AuthenticationService) {}

  ngOnInit(): void {
    this.isOwnProduct =
      this.productDetails.owner.name ===
      this.authenticationService.getUsername();
  }
}
