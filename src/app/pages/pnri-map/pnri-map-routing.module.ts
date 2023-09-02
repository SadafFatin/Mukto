import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PnriMapPage } from './pnri-map.page';

const routes: Routes = [
  {
    path: '',
    component: PnriMapPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PnriMapPageRoutingModule {}
