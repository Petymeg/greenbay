import { NgModule } from '@angular/core';
import { NotFoundRoutingModule } from './not-found-routing.module';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { NotFoundComponent } from './not-found.component';

@NgModule({
  declarations: [NotFoundComponent],
  imports: [SharedModule, NotFoundRoutingModule],
})
export class NotFoundModule {}
