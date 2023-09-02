import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SamPage } from './sam.page';

const routes: Routes = [
  {
    path: '',
    component: SamPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SamPageRoutingModule {}
