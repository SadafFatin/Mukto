import { SharedComponentsModule } from 'src/app/shared-components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DliScorecardPageRoutingModule } from './dli-scorecard-routing.module';

import { DliScorecardPage } from './dli-scorecard.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedComponentsModule,
    DliScorecardPageRoutingModule
  ],
  declarations: [DliScorecardPage]
})
export class DliScorecardPageModule { }
