import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AppQrPageRoutingModule } from './app-qr-routing.module';

import { AppQrPage } from './app-qr.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppQrPageRoutingModule
  ],
  declarations: [AppQrPage]
})
export class AppQrPageModule {}
