/* eslint-disable max-len */
import { getColorFromLabel, graphColor, inputDebounceTime } from './../../utils/utility';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { PnriData, Scorecard } from 'src/app/models/pnri_model';
import { PnriAPIService } from 'src/app/services/pnri_api.service';
import { KeyValueObject } from 'src/app/utils/models';
import { pnriDataColumns } from 'src/app/utils/utility';
import { debounceTime } from 'rxjs/operators';
import { PnriLeadingColumn, setPnriLeadingCol } from 'src/app/state/actions/pnri-col.action';
import { Store } from '@ngrx/store';

const pnricol: PnriLeadingColumn = {
  name: 'district',
  label: 'Area'
};

@Component({
  selector: 'app-district',
  templateUrl: './district.page.html',
  styleUrls: ['./district.page.scss'],
})


export class DistrictPage implements OnInit {

  periodStarting: string;
  periodEnding: string;
  pnriData: PnriData;
  identifierColumn = 'district';
  displayedColumns: KeyValueObject[] = pnriDataColumns;
  currentScoreCards: Scorecard[] = [];
  getColorFromLabel= getColorFromLabel;

  public searchTerm = '';
  searchControl: FormControl =  new FormControl();;
  searching: any = false;


  constructor(private store: Store,private api: PnriAPIService, public alertController: AlertController) {}
  async ngOnInit() {

    const val = await this.api.load(this.periodStarting, this.periodEnding);
    if (val.ok) {
      this.pnriData = val.data;
      this.currentScoreCards = this.pnriData.district_scorecards.scorecards;
      this.sortData();
      this.searchControl.valueChanges
      .pipe(debounceTime(inputDebounceTime))
      .subscribe(search => {
        this.searchTerm = search;
        this.searching = false;
        this.setFilteredItems();
      });
    }

  }

  ionViewDidEnter(){
    this.store.dispatch(setPnriLeadingCol({ pnricol}));
  }


  sortData() {
    this.currentScoreCards = this.currentScoreCards.sort(({
      composite_index: a
    }, {
      composite_index: b
    }) => b - a);
    this.currentScoreCards.map((item, index) => item.rank = index + 1);
  }

  async onStartingPeriodSelected(e) {
    this.periodStarting = e.detail.value.substring(0, 7);
    console.log(this.periodStarting);
  }
  async onEndingPeriodSelected(e) {
    this.periodEnding = e.detail.value.substring(0, 7);
    console.log(this.periodEnding);

  }

  onSearchInput() {
    this.searching = true;
  }
  setFilteredItems() {
    console.log('term',this.searchTerm);
    this.currentScoreCards = this.filterItems(this.searchTerm);
  }
  filterItems(searchTerm) {
    return this.pnriData.district_scorecards.scorecards.filter(item => item.district_name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
  }


}
