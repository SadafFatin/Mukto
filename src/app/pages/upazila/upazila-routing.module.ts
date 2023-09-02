import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UpazilaPage } from './upazila.page';

const routes: Routes = [
  {
    path: '',
    component: UpazilaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpazilaPageRoutingModule {}
