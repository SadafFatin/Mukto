import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ImpactsPage } from './impacts.page';

const routes: Routes = [
  {
    path: '',
    component: ImpactsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ImpactsPageRoutingModule {}
