import { SharedComponentsModule } from 'src/app/shared-components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SamPageRoutingModule } from './sam-routing.module';

import { SamPage } from './sam.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedComponentsModule,
    SamPageRoutingModule
  ],
  declarations: [SamPage]
})
export class SamPageModule { }
