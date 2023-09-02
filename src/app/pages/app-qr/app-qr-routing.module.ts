import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppQrPage } from './app-qr.page';

const routes: Routes = [
  {
    path: '',
    component: AppQrPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppQrPageRoutingModule {}
