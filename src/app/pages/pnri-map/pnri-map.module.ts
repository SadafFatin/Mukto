import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PnriMapPageRoutingModule } from './pnri-map-routing.module';
import { PnriMapPage } from './pnri-map.page';
import { SharedComponentsModule } from 'src/app/shared-components.module';
import { ScorecardModalComponent } from 'src/app/components/scorecard-modal/scorecard-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedComponentsModule,
    PnriMapPageRoutingModule
  ],
  declarations: [PnriMapPage, ScorecardModalComponent]
})
export class PnriMapPageModule { }
