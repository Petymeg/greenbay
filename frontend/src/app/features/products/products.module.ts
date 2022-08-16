import { NgModule } from '@angular/core';
import { ProductsComponent } from './products.component';
import { ProductsRoutingModule } from './products-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ListComponent } from './list/list.component';
import { ListItemComponent } from './list/list-item/list-item.component';
import { ViewComponent } from './view/view.component';
import { AddComponent } from './add/add.component';
import { OwnProductListComponent } from './own-product-list/own-product-list.component';

@NgModule({
  declarations: [
    ProductsComponent,
    ListComponent,
    ListItemComponent,
    ViewComponent,
    AddComponent,
    OwnProductListComponent,
  ],
  imports: [SharedModule, ProductsRoutingModule],
})
export class ProductsModule {}
