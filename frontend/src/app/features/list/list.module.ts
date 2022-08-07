import { NgModule } from '@angular/core';
import { ListRoutingModule } from './list-routing.module';
import { ListComponent } from './list.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [ListComponent],
  imports: [SharedModule, ListRoutingModule],
})
export class ListModule {}
