import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddComponent } from './add/add.component';
import { ListComponent } from './list/list.component';
import { ProductsComponent } from './products.component';
import { ViewComponent } from './view/view.component';

const routes: Routes = [
  {
    path: '',
    component: ProductsComponent,
    children: [
      { path: 'list', component: ListComponent },
      { path: 'view', component: ViewComponent },
      { path: 'add', component: AddComponent },
      { path: '', redirectTo: 'list', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsRoutingModule {}
