import { NgModule } from '@angular/core';
import { ListRoutingModule } from './list-routing.module';
import { ListComponent } from './list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ListItemComponent } from './list-item/list-item.component';

@NgModule({
  declarations: [ListComponent, ListItemComponent],
  imports: [SharedModule, ListRoutingModule],
})
export class ListModule {}
