import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ImpactsPageRoutingModule } from './impacts-routing.module';

import { ImpactsPage } from './impacts.page';
import { SharedComponentsModule } from 'src/app/shared-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ImpactsPageRoutingModule,
    SharedComponentsModule
  ],
  declarations: [ImpactsPage]
})
export class ImpactsPageModule {}
