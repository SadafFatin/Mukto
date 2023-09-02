import { pnriDataColumns } from './../../utils/utility';
/* eslint-disable max-len */
/* eslint-disable eqeqeq */
import { generateSVGContainer, pnriScorecardDataColumns, standardPerformanceBasedOnCIColumn } from './../../utils/utility';
import { PnriMapData } from './pnri-map';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonSelect, ModalController } from '@ionic/angular';
import { PnriData, Scorecard } from 'src/app/models/pnri_model';
import { divisionDropDown, upazilaDropDown, districtDropDown, getCILabel, getColorForPercentage, GeoCodeAdminCode, geoCodeAdminCodeKeyMap, areaWiseCIColor, mapHeight, pathAnimation } from 'src/app/utils/utility';
import { Feature, FeatureCollection, KeyValueObject } from 'src/app/utils/models';
import * as d3 from 'd3';
import { PnriMapAPIService } from 'src/app/services/pnri_map_api.service';
import { ScorecardModalComponent } from 'src/app/components/scorecard-modal/scorecard-modal.component';

@Component({
  selector: 'app-pnri-map',
  templateUrl: './pnri-map.page.html',
  styleUrls: ['./pnri-map.page.scss'],
})
export class PnriMapPage implements OnInit {


  @ViewChild('division') divisionSelection!: IonSelect;
  @ViewChild('district') districtSelection!: IonSelect;
  @ViewChild('upazila') upazilaSelection!: IonSelect;
  @ViewChild('performanceMapCanvas', { read: ElementRef }) performanceMapCanvas: ElementRef;
  @ViewChild('popover') popover;

  //map
  getColorForPercentage = getColorForPercentage;
  getCILabel = getCILabel;
  svgMapCanvas: any;
  mapFeatures: any[] = [];
  pnriData: PnriData;

  standardPerformanceBasedOnCIColumn = standardPerformanceBasedOnCIColumn;
  periodStarting: string;

  divisionDropDown = divisionDropDown;
  upazilaDropDown = upazilaDropDown;
  districtDropDown = districtDropDown;

  //scorecards
  identifierColumn = 'division';
  displayedColumns: KeyValueObject[] = pnriScorecardDataColumns.division;
  divisionScoreCards = [];
  districtScoreCards = [];
  upazilaScoreCards = [];
  hoverScoreCard: Scorecard;
  scorecardData: PnriMapData;
  currentScorecards: Scorecard[] = [];

  viewType = 'table';
  isModalOpen = false;
  isPopOverOpen = false;


  constructor(private api: PnriMapAPIService,
    private modalCtrl: ModalController) { }


  async ngOnInit() {
    this.loadData();
  }

  async loadData() {
    const val = await this.api.load(this.periodStarting);
    if (val.ok) {
      this.scorecardData = val.data;
      this.currentScorecards = this.scorecardData.division_scorecards;
      this.sortData();
      this.createMap();
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
  onUpazilaSelected(e) {
    if (e.detail.value) {
      this.upazilaScoreCards = this.scorecardData.upazila_scorecards.filter(upazila => upazila.upazila_id == e.detail.value.upazila_id);
      this.currentScorecards = this.upazilaScoreCards;
      this.resetState('upazila');
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
    this.identifierColumn = targetedArea;
    this.displayedColumns = pnriScorecardDataColumns[this.identifierColumn];
    this.createMap();
  }

  createMap() {
    const map: GeoCodeAdminCode = geoCodeAdminCodeKeyMap[this.identifierColumn];
    this.mapFeatures =
      map.areas.features.filter((feature: Feature) =>
        feature.properties[map.adminCodeKey] === this.currentScorecards[0][map.geoCodeKey] ||
        this.identifierColumn === 'division'
      );
    setTimeout(() => {
      this.initPerformanceMap();
    }, 200);
  }

  initPerformanceMap() {

    const width = this.performanceMapCanvas ? this.performanceMapCanvas.nativeElement.
      offsetWidth : 600;
    const height = mapHeight;
    const featureCollection: FeatureCollection = {
      type: 'FeatureCollection',
      features: this.mapFeatures
    };
    const svgMapCanvas: d3.Selection<d3.BaseType, unknown, HTMLElement, any> = generateSVGContainer('#performanceMapCanvas', height, 0);
    const map = svgMapCanvas.append('g').attr('transform', `translate(0,0)`);
    const projection = d3.geoMercator().fitSize([width, height], {
      type: 'FeatureCollection',
      features: this.mapFeatures
    });
    const path: any = d3.geoPath().projection(projection);
    map.selectAll('path')
      .data(featureCollection.features)
      .enter()
      .append('path')
      .attr('d', path)
      .attr('class', 'path')
      .attr('fill', (d: Feature, i: string | number): any => areaWiseCIColor(
        this.getScoreCard(d)?.composite_index
      ))
      .on('click', (event: any, d: any) => this.handleClick(allMapPaths, event, d));;

    map.selectAll('text')
      .data(featureCollection.features)
      .enter().append('text')
      .attr('x', (d: any) => path.centroid(d)[0] - 10)
      .attr('y', (d: any) => path.centroid(d)[1])
      .attr('class', 'district-label')
      .text((d: any) => d.properties[geoCodeAdminCodeKeyMap[this.identifierColumn].adminName])
      .on('click', (event: any, d: any) => this.handleClick(allMapPaths, event, d));

    const allMapPaths = map.selectAll('path');
    pathAnimation(allMapPaths);

  }

  handleMouseOver(paths, event, data: Feature) {
    this.hoverScoreCard = data.properties.score;
    this.presentPopover(event);
  }
  handleClick(paths, event, data: Feature) {
    this.hoverScoreCard = this.getScoreCard(data);
    this.presentPopover(event);
  }
  presentPopover(e: Event) {
    setTimeout(() => {
      this.popover.event = e;
      this.isPopOverOpen = true;
    }, 200);
  }
  dismissPopOver(e: Event) {
    setTimeout(() => {
      this.popover.event = e;
      this.isPopOverOpen = false;
    }, 200);
  }

  getScoreCard(data: Feature): Scorecard {
    const geoCode = geoCodeAdminCodeKeyMap[this.identifierColumn].subGeoCodeKey;
    const adminCode = geoCodeAdminCodeKeyMap[this.identifierColumn].subAdminCodeKey;
    return this.currentScorecards.find((item: Scorecard) => item[geoCode] === data.properties[adminCode]);
  }

  async presentFilter(type: Scorecard[]) {
    if (!this.isModalOpen) {
      this.isModalOpen = true;
      const modal = await this.modalCtrl.create({
        component: ScorecardModalComponent,
        canDismiss: true,
        cssClass: 'division-modal',
        componentProps: { feature: type, identifierColumn: this.identifierColumn }
      });
      await modal.present();
      await modal.onWillDismiss();
      this.isModalOpen = false;
    }

  }

  ionViewDidLeave() {
    this.dismiss();
  }


  async dismiss(data?: any) {
    //await this.modalCtrl?.dismiss(data);
  }


}
