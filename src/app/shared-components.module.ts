import { CommunityClinicComponent } from './components/community-clinic/community-clinic.component';
import { DliComponent } from './components/dli/dli.component';
import { PnriDecoratorPipe } from './pipe/pnri_data_decorator';
import { CommonModule, DatePipe, DecimalPipe, PercentPipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { GoalProgressComponent } from './components/goal-progress/goal-progress.component';
import { InfoCardComponent } from './components/info-card/info-card.component';
import { PnriComponent } from './components/pnri/pnri.component';
import { SkeletonComponent } from './components/skeleton/skeleton.component';
import { NullDecoratorPipe } from './pipe/null_decorator';
import { NgxPaginationModule } from 'ngx-pagination';
import { HorizontalGoalProgressComponent } from './components/horizontal-goal-progress/horizontal-goal-progress.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxPaginationModule,

  ],
  declarations: [
    PnriComponent,
    DliComponent,
    InfoCardComponent,
    SkeletonComponent,
    GoalProgressComponent,
    HorizontalGoalProgressComponent,
    CommunityClinicComponent,
    NullDecoratorPipe,
    PnriDecoratorPipe],

  entryComponents: [InfoCardComponent, SkeletonComponent],

  exports: [
    InfoCardComponent,
    SkeletonComponent,
    PnriComponent,
    CommunityClinicComponent,
    GoalProgressComponent,
    HorizontalGoalProgressComponent,
    PnriDecoratorPipe,
    DliComponent],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [PercentPipe, DecimalPipe, DatePipe]

})
export class SharedComponentsModule { }
