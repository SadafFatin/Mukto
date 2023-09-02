import { SharedComponentsModule } from 'src/app/shared-components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpazilaPageRoutingModule } from './upazila-routing.module';

import { UpazilaPage } from './upazila.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedComponentsModule,
    ReactiveFormsModule,
    UpazilaPageRoutingModule
  ],
  declarations: [UpazilaPage]
})
export class UpazilaPageModule {}
