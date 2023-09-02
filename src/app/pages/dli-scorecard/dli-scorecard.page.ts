/* eslint-disable max-len */
/* eslint-disable eqeqeq */
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSelect, AlertController } from '@ionic/angular';
import { ScorecardAPIService } from 'src/app/services/scorecard_api.service';
import { BaseHelper } from 'src/app/utils/baseHelper';
import { standardPerformanceBasedOnCIColumn, divisionDropDown, upazilaDropDown, districtDropDown } from 'src/app/utils/utility';
import { DliScorecard, DliScorecardData } from 'src/app/pages/dli-scorecard/dli';
import { CommunityClinicData } from '../scorecard/scorecard';

@Component({
  selector: 'app-dli-scorecard',
  templateUrl: './dli-scorecard.page.html',
  styleUrls: ['./dli-scorecard.page.scss'],
})
export class DliScorecardPage implements OnInit {

  @ViewChild('division') divisionSelection!: IonSelect;
  @ViewChild('district') districtSelection!: IonSelect;
  @ViewChild('upazila') upazilaSelection!: IonSelect;


  standardPerformanceBasedOnCIColumn = standardPerformanceBasedOnCIColumn;
  periodStarting: string;
  periodEnding: string;
  identifierColumn = 'national';
  segment = 'national_scorecards';
  viewType = 'table';
  //dropdown
  divisionDropDown = divisionDropDown;
  upazilaDropDown = upazilaDropDown;
  districtDropDown = districtDropDown;
  //scorecards
  scorecardData: DliScorecardData;
  nationalScoreCards = [];
  divisionScoreCards = [];
  districtScoreCards = [];
  upazilaScoreCards = [];
  currentScorecards: DliScorecard[] = [];
  ccData: CommunityClinicData[];

  constructor(
    private b: BaseHelper,
    private api: ScorecardAPIService, public alertController: AlertController) { }

  async ngOnInit() {
    this.loadData();
  }

  async loadData() {
    const val = await this.api.loadDli(this.periodStarting, this.periodEnding);
    console.log('Api called for dli-scorecard with id:' + this.identifierColumn);
    if (val.ok) {
      this.scorecardData = val.data;
      this.currentScorecards = this.scorecardData.national_scorecards;
      this.sortData();
    }
  }
  async loadCCData(upazilaId: any) {
    const val = await this.api.loadCC(upazilaId);
    console.log(val);
    if (val.ok) {
      this.ccData = val.data;
    }

  }
  sortData() {
    // this.currentScorecards = this.currentScorecards.sort(({
    //   composite_index: a
    // }, {
    //   composite_index: b
    // }) => b - a);
    // this.currentScorecards.map((item, index) => item.rank = index + 1);
  }



  //on input change methods
  onStartingPeriodSelected(e) {
    this.periodStarting = e.detail.value.substring(0, 7);
  }
  onEndingPeriodSelected(e) {
    this.periodEnding = e.detail.value.substring(0, 7);
  }
  async onSegmentChanged(e: any) {
    if (e.detail.value) {
      await this.b.loadLoading(true);
      setTimeout(() => {
        this.currentScorecards = this.scorecardData[e.detail.value];
        this.resetState(e.detail.value);
        this.b.loadLoading(false);
      }, 1000);
    }
  }
  onDivisionSelected(e) {
    if (e.detail.value) {
      this.districtScoreCards = this.scorecardData.district_scorecards.filter(district => district.division_id == e.detail.value.division_id);
      this.districtDropDown = districtDropDown.filter(district => district.division_id == e.detail.value.division_id);
      this.currentScorecards = this.districtScoreCards;
      this.resetState('district');
    }
  }
  onDistrictSelected(e) {
    if (e.detail.value) {
      this.upazilaScoreCards = this.scorecardData.upazila_scorecards.filter(upazila => upazila.district_id == e.detail.value.district_id);
      this.upazilaDropDown = upazilaDropDown.filter(upazila => upazila.district_id == e.detail.value.district_id);
      this.currentScorecards = this.upazilaScoreCards;
      this.resetState('upazila');
    }
  }
  async onUpazilaSelected(e) {
    if (e.detail.value) {
      this.upazilaScoreCards = this.scorecardData.upazila_scorecards.filter(upazila => upazila.upazila_id == e.detail.value.upazila_id);
      this.currentScorecards = this.upazilaScoreCards;
      this.resetState('upazila');
      this.loadCCData(e.detail.value.upazila_id);
    }
  }

  async resetState(targetedArea: string) {
    this.sortData();
    if (targetedArea === 'district') {
      this.districtSelection.value = '';
      this.upazilaSelection.value = '';
    }
    else if (targetedArea === 'upazila') {
      //this.upazilaSelection.value = '';
    }
    if (targetedArea.indexOf('scorecards') > 0) {
      targetedArea = targetedArea.split('_')[0];
      this.divisionSelection.value = '';
      this.districtSelection.value = '';
      this.upazilaSelection.value = '';
    }
    else {
      this.segment = '';
    }
    this.ccData = null;
    this.identifierColumn = targetedArea;
  }


}
