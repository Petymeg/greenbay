import { NgModule } from '@angular/core';
import { ProductsComponent } from './products.component';
import { ProductsRoutingModule } from './products-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ListComponent } from './list/list.component';
import { ListItemComponent } from './list/list-item/list-item.component';

@NgModule({
  declarations: [ProductsComponent, ListComponent, ListItemComponent],
  imports: [SharedModule, ProductsRoutingModule],
})
export class ProductsModule {}
