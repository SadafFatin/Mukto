import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScorecardPage } from './scorecard.page';

const routes: Routes = [
  {
    path: '',
    component: ScorecardPage,
    children:[
      {
        path: 'national',
        loadChildren: () => import('../national/national.module').then( m => m.NationalPageModule)
      },
      {
        path: 'division',
        loadChildren: () => import('../division/division.module').then( m => m.DivisionPageModule)
      },
      {
        path: 'district',
        loadChildren: () => import('../district/district.module').then( m => m.DistrictPageModule)
      },
      {
        path: 'upazila',
        loadChildren: () => import('../upazila/upazila.module').then( m => m.UpazilaPageModule)
      }
    ]
  }
];






@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScorecardPageRoutingModule {}



