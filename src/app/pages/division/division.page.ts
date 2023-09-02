import { setPnriLeadingCol, PnriLeadingColumn } from './../../state/actions/pnri-col.action';
/* eslint-disable @typescript-eslint/semi */

import {
  OnInit
} from '@angular/core';
/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable max-len */
import {
  Feature,
  FeatureCollection,
  Legend
} from './../../utils/models';
import {
  Scorecard
} from './../../models/pnri_model';
import {
  Component,
  ElementRef,
  ViewChild
} from '@angular/core';
import {
  AlertController,
  IonSelect
} from '@ionic/angular';
import {
  PnriData
} from 'src/app/models/pnri_model';
import {
  PnriAPIService
} from 'src/app/services/pnri_api.service';
import {
  KeyValueObject
} from 'src/app/utils/models';
import {
  legendHeight,
  mapHeight,
  margin,
  pnriDataColumns,
  areaWiseCIColor,
  getCILabel,
  getColorForPercentage,
  geoCodeAdminCodeKeyMap,
  GeoCodeAdminCode,
  graphHeight,
  strokeWidth,
  pathAnimation,
  drawLegendBelowGraph,
  getColorFromLabel,
  getTooltip,
  legendHGroupMarginTop,
  lineCircleTransition,
  rectTransition,
  subGroupLabel
} from 'src/app/utils/utility';
import * as d3 from 'd3';
import {
  PieArcDatum
} from 'd3';
import { Store } from '@ngrx/store';

const pnricol: PnriLeadingColumn = {
  name: 'division',
  label: 'Area'
}
@Component({
  selector: 'app-division',
  templateUrl: './division.page.html',
  styleUrls: ['./division.page.scss'],
})
export class DivisionPage implements OnInit {

  @ViewChild('performanceMapCanvas', {
    read: ElementRef
  }) performanceMapCanvas: ElementRef;
  @ViewChild('divisionRankingGraphCanvas', {
    read: ElementRef
  }) divisionRankingGraphCanvas: ElementRef;
  @ViewChild('divisionSAMAdmittedGraphCanvas', {
    read: ElementRef
  }) divisionSAMAdmittedGraphCanvas: ElementRef;

  @ViewChild('district') districtSelection!: IonSelect;
  @ViewChild('popover') popover;
  getColorForPercentage = getColorForPercentage;
  getCILabel = getCILabel;
  svgMapCanvas: any;
  displayedColumns: KeyValueObject[] = pnriDataColumns;
  mapFeatures: any[] = [];
  pnriData: PnriData;
  identifierColumn = 'division';
  districtScoreCards: Scorecard[] = [];
  currentScoreCards: Scorecard[] = [];
  hoverScoreCard: Scorecard;
  periodStarting: string;
  periodEnding: string;
  viewType = 'table';
  isOpen = false;

  constructor(private store: Store, private api: PnriAPIService, public alertController: AlertController) { }

  async ngOnInit() {
    const val = await this.api.load(this.periodStarting, this.periodEnding);
    if (val.ok) {
      this.pnriData = val.data;
      this.currentScoreCards = this.pnriData.division_scorecards.scorecards;
      this.sortData();
    }

  }

  ionViewDidEnter() {
    this.store.dispatch(setPnriLeadingCol({ pnricol }));
  }

  sortData() {
    this.currentScoreCards = this.currentScoreCards.sort(({
      composite_index: a
    }, {
      composite_index: b
    }) => b - a);
    this.currentScoreCards.map((item, index) => item.rank = index + 1);
  }

  async resetState(area: string) {
    this.sortData();
    this.identifierColumn = area;
    this.displayedColumns[0].key = this.identifierColumn;
    if (area === 'district') {
      this.districtSelection.value = '';
      this.districtSelection.selectedText = '';
    }
    if (this.viewType === 'map') {
      this.createMap();
    } else if (this.viewType === 'graph') {
      this.createGraph();
    }
    console.log(pnricol);
    //pnricol.name = area;
    this.store.dispatch(setPnriLeadingCol({
      pnricol:
      {
        name: area,
        label: 'Area'
      }
    }
    ));
  }
  createMap() {
    const map: GeoCodeAdminCode = geoCodeAdminCodeKeyMap[this.identifierColumn];
    this.mapFeatures =
      map.areas.features.filter((feature: Feature) =>
        feature.properties[map.adminCodeKey] === this.currentScoreCards[0][map.geoCodeKey] ||
        this.identifierColumn === 'division'
      );
    setTimeout(() => {
      this.initPerformanceMap();
    }, 200);
  }
  createGraph() {
    setTimeout(() => {
      this.initSamAdmissionGraph();
      this.initDivisionRankingGraph();
    }, 200);
  }

  initPerformanceMap() {
    if (this.svgMapCanvas) {
      this.svgMapCanvas.remove();
    }
    const width = this.performanceMapCanvas ? this.performanceMapCanvas.nativeElement.
      offsetWidth : 600;
    const height = mapHeight;
    const featureCollection: FeatureCollection = {
      type: 'FeatureCollection',
      features: this.mapFeatures
    };
    this.svgMapCanvas = d3.select('#performanceMapCanvas')
      .append('svg')
      .attr('width', '100%')
      .attr('height', height + legendHeight + margin.top);
    const map = this.svgMapCanvas.append('g').attr('transform', `translate(0,0)`);
    const projection = d3.geoMercator().fitSize([width, height], {
      type: 'FeatureCollection',
      features: this.mapFeatures
    });
    const path = d3.geoPath().projection(projection);
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
      .attr('x', (d: d3.GeoPermissibleObjects) => path.centroid(d)[0] - 10)
      .attr('y', (d: d3.GeoPermissibleObjects) => path.centroid(d)[1])
      .attr('class', 'district-label')
      .text((d: any) => d.properties[geoCodeAdminCodeKeyMap[this.identifierColumn].adminName])
      .on('click', (event: any, d: any) => this.handleClick(allMapPaths, event, d));


    const allMapPaths = map.selectAll('path');
    pathAnimation(allMapPaths);

  }



  initDivisionRankingGraph() {
    const width = this.divisionRankingGraphCanvas.nativeElement.offsetWidth;
    const height = graphHeight;

    const legends: Legend[] = this.pnriData.division_scorecards.divisionRankingGraphPnriColumn;
    const totalLegendHeight = legends.length * legendHeight;

    const svg = d3.select('#divisionRankingGraphCanvas')
      .append('svg')
      .attr('width', '100%')
      .attr('height', height + legendHGroupMarginTop + totalLegendHeight + margin.vertical);

    const chart = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
    const tooltip = getTooltip('#divisionRankingGraphCanvas');

    //create x-axis append x-axis
    const xScale = d3.scaleBand()
      .range([0, width - (margin.left + margin.right)])
      .domain(this.pnriData.division_scorecards.scorecards.map((s) => s.division_name))
      .padding(0.05);


    chart.append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .attr('class', 'graph-label')
      .attr('alignment-baseline', 'middle');


    // Add Y axis
    const yScale = d3.scaleLinear()
      .range([height, 0])
      .domain([0, 100]);
    chart.append('g')
      .call(d3.axisLeft(yScale));


    //Another scale for subgroup position?
    const xSubgroup = d3.scaleBand()
      .domain(legends.map((item) => item.key))
      .range([0, xScale.bandwidth()])
      .padding(0);

    // Show the bars
    const bar = chart.append('g')
      .selectAll('g')
      .data(this.pnriData.division_scorecards.scorecards);

    const groupBar = bar.enter()
      .append('g')
      .attr('transform', (d: Scorecard) => 'translate(' + xScale(d.division_name) + ',0)')
      .selectAll('g')
      .data((d: Scorecard) => legends.map((keyObj: KeyValueObject): KeyValueObject => ({
        key: keyObj.key,
        value: d[keyObj.key]
      })

      ));

    groupBar.join('rect')
      .attr('x', ((d: KeyValueObject) => xSubgroup(d.key)))
      .attr('y', (d: KeyValueObject) => yScale(Number(d.value)))
      .attr('width', xSubgroup.bandwidth())
      .attr('fill', (d: KeyValueObject, i) => getColorFromLabel(d.key))
      .attr(subGroupLabel, (d: KeyValueObject, i) => legends[i].value)
      .on('mouseover', () => this.rectMouseOver(tooltip))
      .on('mousemove', (event: any, d: any) => this.rectMouseMove(tooltip, event, d))
      .on('mouseout', (event: any, d: any) => this.rectMouseOut(tooltip))
      .attr('height', height)
      .transition()
      .duration(rectTransition)
      .attr('height', (d: KeyValueObject) => height - yScale(Number(d.value)));

    // Handmade legend
    const legendGroup = svg.append('g');
    drawLegendBelowGraph(legendGroup, 'rect', width, height, legends);

  }

  initSamAdmissionGraph() {
    const width = this.divisionSAMAdmittedGraphCanvas.nativeElement.offsetWidth - margin.right - strokeWidth;
    const height = graphHeight;
    const radius = Math.min(width, height) / 2.5;

    const svg = d3.select('#divisionSAMAdmittedGraphCanvas')
      .append('svg')
      .attr('width', '100%')
      .attr('height', height + margin.top);

    const g = svg.append('g').attr('transform', `translate(${width / 2 + margin.left},${height / 2.5 + margin.top})`);

    // set the color scale
    const color = d3.scaleOrdinal()
      .domain(this.pnriData.division_scorecards.scorecards.map(item => item.division_name))
      .range(d3.schemeTableau10);

    const pie = d3.pie<Scorecard>().value((d: Scorecard) => d[this.pnriData.division_scorecards.divisionStatusPieCartColumn.key]);

    const arc = g.selectAll('arc')
      .data(pie(this.pnriData.division_scorecards.scorecards))
      .enter();

    const path: any = d3.arc()
      .outerRadius(radius)
      .innerRadius(0);
    arc.append('path')
      .attr('d', path)
      .attr('fill', (d: PieArcDatum<Scorecard>): any => color(d.data.division_name));

    arc.append('text')
      .attr('transform', (d: PieArcDatum<Scorecard>) => `translate(${path.centroid(d)})`)
      .text((d: PieArcDatum<Scorecard>) => `${d.data.division_name}:${d.data.sam_child_admitted_num}`)
      .attr('class', 'graph-text');
  }

  rectMouseOut(tooltip) {
    tooltip
      .transition()
      .duration(lineCircleTransition)
      .style('visibility', 'hidden');
  }
  rectMouseOver(tooltip) {
    tooltip
      .transition()
      .duration(lineCircleTransition)
      .style('visibility', 'visible');
  }
  rectMouseMove(tooltip: d3.Selection<HTMLDivElement, unknown, null, undefined>, event: any, d: any) {

    const subGroupsKey = d.key;
    const subGroupsLabel = d3.select(event.currentTarget).attr(subGroupLabel);
    const subGroupsValue = Number(d.value).toFixed(0);

    tooltip
      .style('background-color', getColorFromLabel(subGroupsKey))
      .transition()
      .duration(lineCircleTransition * 2)
      .style('visibility', 'visible')
      .text(`${subGroupsLabel}:${subGroupsValue}`)
      .style('top', (event.layerY + 10) + 'px')
      .style('left', (event.clientX >= event.screenX ? event.clientX - 60 : event.layerX) + 'px');
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
      this.isOpen = true;
    }, 200);
  }
  dismissPopOver(e: Event) {
    setTimeout(() => {
      this.popover.event = e;
      this.isOpen = false;
    }, 200);
  }
  onSegmentChanged(e: any) {
    if (this.viewType === 'map') {
      this.createMap();
    } else if (this.viewType === 'graph') {
      this.createGraph();
    }
  }
  onDivisionSelected(e) {
    this.districtScoreCards = this.pnriData.district_scorecards.scorecards.filter(district => district.division === e.detail.value.division);
    this.currentScoreCards = this.districtScoreCards;
    this.resetState('district');
  }
  onDistrictSelected(e) {
    if (e.detail.value) {
      this.currentScoreCards = this.pnriData.upazila_scorecards.scorecards.filter(upazila => upazila.district === e.detail.value.district);
      this.resetState('upazila');
    }
  }
  async onStartingPeriodSelected(e) {
    this.periodStarting = e.detail.value.substring(0, 7);
    console.log(this.periodStarting);
  }
  async onEndingPeriodSelected(e) {
    this.periodEnding = e.detail.value.substring(0, 7);
    console.log(this.periodEnding);

  }
  isMapCanvasReady(): boolean {
    if (this.performanceMapCanvas) {
      return true;
    }
    return false;
  }
  getScoreCard(data: Feature): Scorecard {
    const geoCode = geoCodeAdminCodeKeyMap[this.identifierColumn].subGeoCodeKey;
    console.log(geoCode);
    const adminCode = geoCodeAdminCodeKeyMap[this.identifierColumn].subAdminCodeKey;
    console.log(adminCode);
    return this.currentScoreCards.find((item: Scorecard) => item[geoCode] === data.properties[adminCode]);
  }

}
