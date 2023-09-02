import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ScorecardPageRoutingModule } from './scorecard-routing.module';
import { ScorecardPage } from './scorecard.page';
import { SharedComponentsModule } from 'src/app/shared-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedComponentsModule,
    ScorecardPageRoutingModule
  ],
  declarations: [ScorecardPage]
})
export class ScorecardPageModule { }
