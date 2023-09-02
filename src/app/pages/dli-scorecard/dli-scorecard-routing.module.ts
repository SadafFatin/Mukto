import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DliScorecardPage } from './dli-scorecard.page';

const routes: Routes = [
  {
    path: '',
    component: DliScorecardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DliScorecardPageRoutingModule {}
