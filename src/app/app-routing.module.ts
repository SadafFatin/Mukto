import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./pages/folder/folder.module').then(m => m.FolderPageModule)
  },
  {
    path: 'impacts',
    loadChildren: () => import('./pages/impacts/impacts.module').then(m => m.ImpactsPageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardPageModule)
  },
  {
    path: 'scorecard',
    loadChildren: () => import('./pages/scorecard/scorecard.module').then(m => m.ScorecardPageModule)
  },
  {
    path: 'sam',
    loadChildren: () => import('./pages/sam/sam.module').then(m => m.SamPageModule)
  },
  {
    path: 'pnri-map',
    loadChildren: () => import('./pages/pnri-map/pnri-map.module').then(m => m.PnriMapPageModule)
  },
  {
    path: 'dli-scorecard',
    loadChildren: () => import('./pages/dli-scorecard/dli-scorecard.module').then(m => m.DliScorecardPageModule)
  },
  {
    path: 'app-qr',
    loadChildren: () => import('./pages/app-qr/app-qr.module').then(m => m.AppQrPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
