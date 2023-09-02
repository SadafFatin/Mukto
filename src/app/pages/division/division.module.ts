import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DivisionPageRoutingModule } from './division-routing.module';
import { DivisionPage } from './division.page';
import { SharedComponentsModule } from 'src/app/shared-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedComponentsModule,
    DivisionPageRoutingModule
  ],
  declarations: [DivisionPage],
})
export class DivisionPageModule { }
