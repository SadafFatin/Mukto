/* eslint-disable guard-for-in */
/* eslint-disable eqeqeq */
/* eslint-disable max-len */

import { BaseHelper } from './../../utils/baseHelper';
import { ScorecardAPIService } from './../../services/scorecard_api.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Scorecard } from 'src/app/models/pnri_model';
import { LineChartModel, addGraphNameLeftAxis, circleOpacity, circleRadius, circleRadiusHover, districtDropDown, divisionDropDown, drawLegendBelowGraph, generateSVGContainer, getColorFromLabel, getShortPeriod, getTooltip, graphHeight, initTimeOut, legendHGroupMarginTop, legendHeight, lineCircleTransition, lineOpacity, lineOpacityHover, lineStroke, lineStrokeHover, margin, otherLinesOpacityHover, parseTime, pathAnimation, rectTransition, standardPerformanceBasedOnCIColumn, strokeWidth, subGroupKey, subGroupLabel, upazilaDropDown } from 'src/app/utils/utility';
import { CommunityClinicData, ScorecardData } from './scorecard';
import { AlertController, IonSelect } from '@ionic/angular';
import * as d3 from 'd3';
import { KeyValueObject, Legend } from 'src/app/utils/models';
import { DatePipe } from '@angular/common';
import { PieArcDatum } from 'd3';

@Component({
  selector: 'app-scorecard',
  templateUrl: './scorecard.page.html',
  styleUrls: ['./scorecard.page.scss'],
})
export class ScorecardPage implements OnInit {

  @ViewChild('division') divisionSelection!: IonSelect;
  @ViewChild('district') districtSelection!: IonSelect;
  @ViewChild('upazila') upazilaSelection!: IonSelect;

  @ViewChild('compositeIndexGraphCanvas', { read: ElementRef }) compositeIndexGraphCanvas: ElementRef;
  @ViewChild('serviceDataGraphCanvas', { read: ElementRef }) serviceDataGraphCanvas: ElementRef;
  @ViewChild('performanceNationalBasedOnCICanvas', { read: ElementRef }) performanceNationalBasedOnCICanvas: ElementRef;
  @ViewChild('divisionRankingGraphCanvas', { read: ElementRef }) divisionRankingGraphCanvas: ElementRef;
  @ViewChild('divisionSAMAdmittedGraphCanvas', { read: ElementRef }) divisionSAMAdmittedGraphCanvas: ElementRef;

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
  scorecardData: ScorecardData;
  nationalScoreCards = [];
  divisionScoreCards = [];
  districtScoreCards = [];
  upazilaScoreCards = [];
  currentScorecards: Scorecard[] = [];
  ccData: CommunityClinicData[] = [];

  constructor(
    private b: BaseHelper,
    private api: ScorecardAPIService, public alertController: AlertController,
    private datePipe: DatePipe) { }


  async ngOnInit() {
    this.loadData();
  }

  async loadData() {
    const val = await this.api.load(this.periodStarting, this.periodEnding);
    console.log('Api called for scorecard with id:' + this.identifierColumn);
    if (val.ok) {
      this.scorecardData = val.data;
      this.currentScorecards = this.scorecardData.national_scorecards;
      this.sortData();
    }
  }
  async loadCCData(upazilaId: any) {
    await this.b.loadLoading(true);
    const val = await this.api.loadCC(upazilaId);
    if (val.ok) {
      this.ccData = val.data;
    }
    await this.b.loadLoading(false);
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
  onViewModeSegmentChanged(e: any) {
    if (this.viewType === 'graph') {
      this.createGraph();
    }
    else if (e.detail.value === 'division-graph') {
      this.createDivisionGraph();
    }
  }
  async onSegmentChanged(e: any) {
    if (e.detail.value) {
      await this.b.loadLoading(true);
      setTimeout(async () => {
        this.currentScorecards = this.scorecardData[e.detail.value];
        this.resetState(e.detail.value);
        this.b.loadLoading(false);
      }, initTimeOut);
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
      this.upazilaSelection.selectedText = '';
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
    this.ccData = [];
    this.identifierColumn = targetedArea;
  }
  //Graph methods///
  createGraph() {
    setTimeout(() => {
      this.initCompositeIndexLineChart();
      this.initPnriServiceDataLineChart();
      this.initPerformanceBasedOnCIGraph();
    }, lineCircleTransition);
  }
  createDivisionGraph() {
    setTimeout(() => {
      this.initDivisionRankingGraph();
      this.initSamAdmissionGraph();
    }, lineCircleTransition);
  }
  //line
  initCompositeIndexLineChart() {
    const width = this.compositeIndexGraphCanvas.nativeElement.offsetWidth;
    const height = graphHeight;
    const legends: LineChartModel[] = [this.scorecardData.pnriServiceLineCharts[0]];
    const totalLegendHeight = legends.length * legendHeight;
    const svg: d3.Selection<d3.BaseType, unknown, HTMLElement, any>
      = generateSVGContainer(`#compositeIndexGraphCanvas`, height, totalLegendHeight);
    // create a tooltip
    const tooltip = getTooltip('#compositeIndexGraphCanvas');
    const chart = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
    //scales
    const x = d3.scaleTime()
      .domain(
        d3.extent(this.scorecardData.national_scorecards, (item => parseTime(item.period))))
      .range([0, width - (margin.left + strokeWidth)]);

    chart.append('g')
      .call(d3.axisBottom(x).ticks(d3.timeYear))
      .attr('transform', `translate(${0},${height})`)
      .selectAll('text')
      .attr('class', 'graph-tick-text')
      .attr('alignment-baseline', 'middle');

    // Add Y axis
    const y = d3.scaleLinear()
      .domain([0, d3.max(this.scorecardData.national_scorecards, (d: Scorecard) => +d.composite_index)])
      .range([height, 0]);
    chart.append('g')
      .call(d3.axisLeft(y).tickSize(-width + margin.left + strokeWidth).ticks(10, 's'))
      .attr('class', 'axisY');

    //addGraphNameLeftAxis(chart, 'National Composite Index Graph');
    const lines = chart.append('g').attr('class', 'lines');
    this.generateLinePath(tooltip, legends[0], x, y, chart, lines);
    pathAnimation(this.scorecardData.pnriServiceLineCharts[0].path);

    chart.selectAll('myLegend')
      .append('g')
      .append('text')
      .attr('x', 30)
      .attr('y', 30)
      .text('National Composition Index Graph')
      .style('fill', 'red')
      .style('font-size', 14);

    //new code
    const tooltipLine = chart.append('line')
      .attr('stroke', 'black');

    // tooltipLine.call(d3.drag().on('start', (event) => this.drawTooltip(event, tooltip, tooltipLine, x, samGroupData, lineKey, label)));

    // tooltipLine.call(d3.drag().on('end', (event) => this.mouseOut(event, tooltip, tooltipLine)));

    chart.append('rect')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('fill', 'transparent')
      .on('mousemove', (event) => this.drawCircleTooltip(event, tooltip, tooltipLine, x, this.scorecardData.national_scorecards, legends, 'initPnriServiceDataLineChart'))
      .on('mouseout', (event) => this.mouseOut(event, tooltip, tooltipLine))
      .on('click', (event) => this.drawCircleTooltip(event, tooltip, tooltipLine, x, this.scorecardData.national_scorecards, legends, 'initPnriServiceDataLineChart'))
      .on('touchmove', (event) => {
        this.drawCircleTooltip(event, tooltip, tooltipLine, x, this.scorecardData.national_scorecards, legends, 'initPnriServiceDataLineChart');
      })
      .on('touchend', (event) => {
        this.mouseOut(event, tooltip, tooltipLine);
      });

  }
  //multiline
  initPnriServiceDataLineChart() {
    const width = this.serviceDataGraphCanvas.nativeElement.offsetWidth;
    const height = graphHeight;
    const legends: LineChartModel[] = this.scorecardData.pnriServiceLineCharts.slice(1);
    const totalLegendHeight = legends.length * legendHeight;
    const svg: d3.Selection<d3.BaseType, unknown, HTMLElement, any>
      = generateSVGContainer(`#serviceDataGraphCanvas`, height, totalLegendHeight);
    // create a tooltip
    const tooltip = getTooltip('#serviceDataGraphCanvas');
    const chart = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
    //scales
    const x = d3.scaleTime()
      .domain(
        d3.extent(this.scorecardData.national_scorecards, (item => parseTime(item.period))))
      .range([0, width - (margin.left + strokeWidth)]);

    chart.append('g')
      .call(d3.axisBottom(x).ticks(d3.timeYear))
      .attr('transform', `translate(${0},${height})`)
      .selectAll('text')
      .attr('class', 'graph-tick-text')
      .attr('alignment-baseline', 'middle');

    const yMax = [d3.max(this.scorecardData.national_scorecards, d => d.caregiver_receive_counsel_num),
    d3.max(this.scorecardData.national_scorecards, d => d.sam_child_screened_num), d3.max(this.scorecardData.national_scorecards, d => d.sam_child_identified_num), d3.max(this.scorecardData.national_scorecards, d => d.sam_child_admitted_num),
    d3.max(this.scorecardData.national_scorecards, d => d.plw_receive_ifa_num)];
    // Add Y axis
    const y = d3.scaleLinear()
      .domain([0, d3.max(yMax, (d: number) => +d)])
      .range([height, 0]);
    chart.append('g')
      .call(d3.axisLeft(y).tickSize(-width + (margin.left + strokeWidth)).ticks(20, 's'))
      .attr('class', 'axisY');

    const lines = chart.append('g').attr('class', 'lines');
    for (const line of legends) {
      this.generateLinePath(tooltip, line, x, y, chart, lines);
      pathAnimation(line.path);
    }

    const legendGroup = svg.append('g');
    legendGroup.attr('class', 'legend-line');
    drawLegendBelowGraph(legendGroup, 'rect', width, height, legends);


    //new code
    const tooltipLine = chart.append('line')
      .attr('stroke', 'black');

    // tooltipLine.call(d3.drag().on('start', (event) => this.drawTooltip(event, tooltip, tooltipLine, x, samGroupData, lineKey, label)));

    // tooltipLine.call(d3.drag().on('end', (event) => this.mouseOut(event, tooltip, tooltipLine)));

    chart.append('rect')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('fill', 'transparent')
      .on('mousemove', (event) => this.drawCircleTooltip(event, tooltip, tooltipLine, x, this.scorecardData.national_scorecards, legends, 'initPnriServiceDataLineChart'))
      .on('mouseout', (event) => this.mouseOut(event, tooltip, tooltipLine))
      .on('click', (event) => this.drawCircleTooltip(event, tooltip, tooltipLine, x, this.scorecardData.national_scorecards, legends, 'initPnriServiceDataLineChart'))
      .on('touchmove', (event) => {
        this.drawCircleTooltip(event, tooltip, tooltipLine, x, this.scorecardData.national_scorecards, legends, 'initPnriServiceDataLineChart');
      })
      .on('touchend', (event) => {
        this.mouseOut(event, tooltip, tooltipLine);
      });
  }
  //bar
  initPerformanceBasedOnCIGraph() {
    const width = this.performanceNationalBasedOnCICanvas.nativeElement.offsetWidth;
    const height = graphHeight;
    const legends: Legend[] = this.scorecardData.nationalPerformanceBasedOnCIColumn;
    const totalLegendHeight = legends.length * legendHeight;
    const svg: d3.Selection<d3.BaseType, unknown, HTMLElement, any>
      = generateSVGContainer(`#performanceNationalBasedOnCICanvas`, height, totalLegendHeight);
    const chart = svg.append('g').attr('transform', `translate(${margin.marginHorizontal},${margin.top})`);
    //tooltip
    const tooltip = getTooltip('#performanceNationalBasedOnCICanvas');
    //create x-axis append x-axis
    const xScale = d3.scaleTime()
      .domain(
        d3.extent(this.scorecardData.national_scorecards.map(item => parseTime(item.period))))
      .rangeRound([strokeWidth, width - (margin.marginHorizontal + margin.right + strokeWidth)]);

    chart.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(xScale).ticks(d3.timeYear))

      //.call(d3.axisBottom(xScale).ticks(d3.timeMonth, 1).tickFormat(d3.timeFormat('%s')))
      .selectAll('text')
      .attr('class', 'graph-tick-text')
      .attr('alignment-baseline', 'middle');

    // Add Y axis
    const yScale = d3.scaleLinear()
      .range([height, 0])
      .domain([0, 64]);
    chart.append('g')
      .call(d3.axisLeft(yScale).tickSize(-width).tickSizeOuter(0))
      .attr('class', 'axisY');
    const data: any = this.scorecardData.national_scorecards;
    //stack the data? --> stack per subgroup
    const stackedData = d3.stack()
      .keys(legends.map(item => item.key))
      (data);
    // Show the bars
    const groupBar = chart
      .append('g')
      .selectAll('g')
      // Enter in the stack data = loop key per key = group per group
      .data(stackedData)
      .join('g')
      .attr('fill', d => getColorFromLabel(d.key))
      .attr(subGroupKey, (d, i) => legends[i].key)
      .attr(subGroupLabel, (d, i) => legends[i].value)
      .selectAll('rect')
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data(d => d);
    const subgroup = groupBar.join('rect')
      .attr('x', (d: any) => xScale(parseTime(d.data.period)) - 7)
      .attr('y', (d: any) => yScale(d[1]))
      .attr('height', (d: any) => yScale(d[0]) - yScale(d[1]))
      .attr('width', (d: any) => 14);

    // subgroup.on('mouseover', () => this.rectMouseOver(tooltip))
    //   .on('mousemove', (event: any, d: any) => this.rectMouseMove(tooltip, event, d))
    //   .on('mouseout', (event: any, d: any) => this.rectMouseOut(tooltip));
    // Handmade legend
    const legendGroup = svg.append('g');
    drawLegendBelowGraph(legendGroup, 'rect', width, height, legends);

    //new code
    const tooltipLine = chart.append('line')
      .attr('stroke', 'black');

    // tooltipLine.call(d3.drag().on('start', (event) => this.drawTooltip(event, tooltip, tooltipLine, x, samGroupData, lineKey, label)));

    // tooltipLine.call(d3.drag().on('end', (event) => this.mouseOut(event, tooltip, tooltipLine)));
    chart.append('rect')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('fill', 'transparent')
      .on('mousemove', (event) => this.drawCircleTooltip(event, tooltip, tooltipLine, xScale, this.scorecardData.national_scorecards, legends, 'initPnriServiceDataLineChart'))
      .on('mouseout', (event) => this.mouseOut(event, tooltip, tooltipLine))
      .on('click', (event) => this.drawCircleTooltip(event, tooltip, tooltipLine, xScale, this.scorecardData.national_scorecards, legends, 'initPnriServiceDataLineChart'))
      .on('touchmove', (event) => {
        this.drawCircleTooltip(event, tooltip, tooltipLine, xScale, this.scorecardData.national_scorecards, legends, 'initPnriServiceDataLineChart');
      })
      .on('touchend', (event) => {
        this.mouseOut(event, tooltip, tooltipLine);
      });
  }

  //division ranking graph
  //bar
  initDivisionRankingGraph() {
    const width = this.divisionRankingGraphCanvas.nativeElement.offsetWidth;
    const height = graphHeight;

    const legends: Legend[] = this.scorecardData.divisionRankingGraphPnriColumn;
    const totalLegendHeight = legends.length * legendHeight;

    console.log(legends);

    const svg: d3.Selection<d3.BaseType, unknown, HTMLElement, any>
      = generateSVGContainer(`#divisionRankingGraphCanvas`, height, totalLegendHeight);

    const chart = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
    const tooltip = getTooltip('#divisionRankingGraphCanvas');

    //create x-axis append x-axis
    const xScale = d3.scaleBand()
      .range([0, width - (margin.left + strokeWidth)])
      .domain(this.scorecardData.division_scorecards.map((s) => s.division))
      .padding(0.05);


    chart.append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      //.attr('class', 'graph-tick-text')
      .attr('transform', 'rotate(-85)')
      .attr('text-anchor', 'end')
      .attr('align-items', 'center');


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
      .data(this.scorecardData.division_scorecards);

    const groupBar = bar.enter()
      .append('g')
      .attr('transform', (d: Scorecard) => 'translate(' + xScale(d.division) + ',0)')
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
      // .on('mouseover', () => this.rectMouseOver(tooltip))
      // .on('mousemove', (event: any, d: any) => this.rectMouseMove(tooltip, event, d))
      // .on('mouseout', (event: any, d: any) => this.rectMouseOut(tooltip))
      .attr('height', height)
      .transition()
      .duration(rectTransition)
      .attr('height', (d: KeyValueObject) => height - yScale(Number(d.value)));

    //new code
    const tooltipLine = chart.append('line')
      .attr('stroke', 'black');
    // tooltipLine.call(d3.drag().on('start', (event) => this.drawTooltip(event, tooltip, tooltipLine, x, samGroupData, lineKey, label)));

    // tooltipLine.call(d3.drag().on('end', (event) => this.mouseOut(event, tooltip, tooltipLine)));
    // Handmade legend
    const legendGroup = svg.append('g');
    drawLegendBelowGraph(legendGroup, 'rect', width, height, legends);
    chart.append('rect')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('fill', 'transparent')
      .on('mousemove', (event) => this.drawRectTooltip(event, tooltip, tooltipLine, xScale, this.scorecardData.division_scorecards, legends, 'Division Performance'))
      .on('mouseout', (event) => this.mouseOut(event, tooltip, tooltipLine))
      .on('click', (event) => this.drawRectTooltip(event, tooltip, tooltipLine, xScale, this.scorecardData.division_scorecards, legends, 'Division Performance'))
      .on('touchmove', (event) => {
        this.drawRectTooltip(event, tooltip, tooltipLine, xScale, this.scorecardData.division_scorecards, legends, 'Division Performance');
      })
      .on('touchend', (event) => {
        this.mouseOut(event, tooltip, tooltipLine);
      });

  }

  //pie
  initSamAdmissionGraph() {
    const width = this.divisionSAMAdmittedGraphCanvas.nativeElement.offsetWidth - margin.right - strokeWidth;
    const height = graphHeight;
    const radius = Math.min(width, height) / 2.5;

    const svg: d3.Selection<d3.BaseType, unknown, HTMLElement, any>
      = generateSVGContainer(`#divisionSAMAdmittedGraphCanvas`, height, 0);

    const g = svg.append('g').attr('transform', `translate(${width / 2 + margin.left},${height / 2.5 + margin.top})`);

    // set the color scale
    const color = d3.scaleOrdinal()
      .domain(this.scorecardData.division_scorecards.map(item => item.division))
      .range(d3.schemeTableau10);

    const pie = d3.pie<Scorecard>().value((d: Scorecard) => d[this.scorecardData.divisionStatusPieCartColumn.key]);

    const arc = g.selectAll('arc')
      .data(pie(this.scorecardData.division_scorecards))
      .enter();

    const path: any = d3.arc()
      .outerRadius(radius)
      .innerRadius(0);
    arc.append('path')
      .attr('d', path)
      .attr('fill', (d: PieArcDatum<Scorecard>): any => color(d.data.division));

    arc.append('text')
      .attr('transform', (d: PieArcDatum<Scorecard>) => `translate(${path.centroid(d)})`)
      .text((d: PieArcDatum<Scorecard>) => `${d.data.division}:${d.data.sam_child_admitted_num}`)
      .attr('class', 'graph-value-text');




  }

  generateLinePath(tooltip, lineChart: LineChartModel, x, y, chart, lineSelection) {
    const lineData = d3.line<Scorecard>().x((d: Scorecard) => x(parseTime(d.period))).y((d: Scorecard) => y(d[lineChart.key]));

    lineChart.path = lineSelection
      .append('path')
      .datum(this.scorecardData.national_scorecards)
      .attr('class', lineChart.key)
      .attr(subGroupLabel, lineChart.value)
      .style('fill', 'none')
      .attr('stroke-width', lineStroke)
      .attr('stroke', getColorFromLabel(lineChart.key))
      .style('opacity', +lineOpacity / 2)
      .attr('d', lineData)
      // .on('mouseover', (event, d: Scorecard) => this.lineMouseOver(tooltip, event, lineChart.value, lineChart.key))
      // .on('mouseout', (event, d: Scorecard) => this.lineMouseOut(tooltip, event))
      ;

    lineSelection.append('g').selectAll('circle')
      .data(this.scorecardData.national_scorecards)
      .enter()
      .append('circle')
      .attr('r', circleRadius)
      .style('opacity', circleOpacity)
      .style('cursor', 'pointer')
      .attr('fill', getColorFromLabel(lineChart.key))
      .attr('cx', (d: Scorecard) => x(parseTime(d.period)))
      .attr('cy', (d: Scorecard) => y(d[lineChart.key]))
      // .on('mouseover', (event: any, data: Scorecard) => this.circleMouseover(tooltip))
      // .on('mousemove', (event: any, d: Scorecard) => this.circleMouseMove(tooltip, event, d, lineChart.value, lineChart.key))
      // .on('mouseout', (event: any, d: Scorecard) => this.circleMouseOut(tooltip, event))
      ;

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
  rectMouseMove(tooltip, event: any, d: any) {
    const period = parseTime(d.data.period);
    const subGroupsKey = (d3.select(event.currentTarget.parentNode).attr(subGroupKey));
    const subGroupsLabel = (d3.select(event.currentTarget.parentNode).attr(subGroupLabel));
    const htmlContent = `<p>${subGroupsLabel}:<br> <b>${d[1] - d[0]}</b> <br> Period:<br><b>${getShortPeriod(period, this.datePipe)}</b></p>`;
    tooltip
      .style('background-color', getColorFromLabel(subGroupsKey))
      .style('visibility', 'visible')
      .style('left', (d3.pointer(event)[0] + 10) + 'px')
      .style('top', (d3.pointer(event)[1]) + 'px')
      .html(`${htmlContent}`);
  }



  circleMouseover(tooltip) {
    tooltip
      .transition()
      .duration(lineCircleTransition)
      .style('visibility', 'visible');
  }
  circleMouseMove(tooltip, event, d, subgroupLabel, subGroupsKey) {
    const period = parseTime(d.period);
    console.log(subGroupsKey);
    tooltip
      .transition()
      .duration(lineCircleTransition)
      .style('visibility', 'visible');
    d3.select(event.currentTarget)
      .transition()
      .duration(lineCircleTransition)
      .attr('r', circleRadiusHover);

    const htmlContent = `<p>${subgroupLabel}:<br> <b>${d[subGroupsKey]}</b> <br> Period:${getShortPeriod(period, this.datePipe)}</p>`;
    tooltip
      .style('background-color', getColorFromLabel(subGroupsKey))
      .style('left', (d3.pointer(event)[0] + 10) + 'px')
      .style('top', (d3.pointer(event)[1]) + 'px')
      .html(`${htmlContent}`);

    // tooltip
    //   .style('background-color', getColorFromLabel(subGroupsKey))
    //   .style('top', (event.layerY + 10) + 'px').style('left', (event.clientX >= event.screenX ? event.clientX - 150 : event.layerX) + 'px')
    //   .transition()
    //   .duration(550)
    //   .style('visibility', 'visible')
    //   .text(`${subgroupLabel}:${d[subGroupsKey]} Period: ${getShortPeriod(period, this.datePipe)}`);
  }
  circleMouseOut(tooltip, event) {
    d3.select(event.currentTarget)
      .transition()
      .duration(lineCircleTransition)
      .attr('r', circleRadius);
    tooltip
      .transition()
      .duration(lineCircleTransition)
      .style('visibility', 'hidden');
  }
  lineMouseOver(tooltip, event, subGroupsLabel, subgroupsKey): void {
    console.log(subGroupsLabel, subgroupsKey);
    d3.selectAll('.line')
      .style('opacity', otherLinesOpacityHover);
    d3.select(event.currentTarget)
      .style('fill', 'none')
      .style('opacity', lineOpacityHover)
      .style('stroke-width', lineStrokeHover);
    tooltip
      .style('background-color', getColorFromLabel(subgroupsKey))
      .style('top', (event.layerY + 10) + 'px').style('left', (event.clientX >= event.screenX ? event.clientX - 150 : event.layerX) + 'px')
      .transition()
      .duration(550)
      .style('visibility', 'visible')
      .text(`${subGroupsLabel} Graph`);
  }
  lineMouseOut(tooltip, event) {
    d3.selectAll('.line')
      .style('opacity', lineOpacity);
    d3.select(event.currentTarget)
      .style('fill', 'none')
      .style('stroke-width', lineStroke);
    tooltip
      .transition()
      .duration(lineCircleTransition)
      .style('visibility', 'hidden');
  }


  mouseOut(event: any, tooltip: any, tooltipLine: any): any {
    //console.log(event?.type);
    if (tooltip) {
      tooltip
        .transition()
        .duration(500)
        .style('visibility', 'hidden');
    }
    if (tooltipLine) { tooltipLine.attr('stroke', 'none'); }
  }
  drawCircleTooltip(event, tooltip, tooltipLine, xScale, samGroupData: Scorecard[], lineKey: Legend[], label): any {

    let x; let y;
    if (event?.type.indexOf('touch') < 0) {
      x = d3.pointer(event)[0];
      y = d3.pointer(event)[1];
    }
    else {
      x = event.changedTouches[0].clientX;
      y = 100;
    }
    const mouseDate: any = xScale.invert(x);
    //console.log(x, mouseDate);
    tooltipLine
      .attr('x1', x)
      .attr('x2', x)
      .attr('y1', 0)
      .attr('y2', graphHeight)
      .attr('stroke', 'black');

    // console.log(x + '\n' + mouseDate + '\n');

    let htmlContent = '';
    samGroupData.map((item: Scorecard) => {
      if (item.period == mouseDate.getFullYear() + '_' + (mouseDate.getMonth() + 1)) {
        htmlContent = `<p style="color: ${getColorFromLabel(item.period)}">
        Period:${getShortPeriod(mouseDate, this.datePipe)}</p>`;
        for (const legendItem of lineKey) {
          htmlContent += `<p style="color:${getColorFromLabel(legendItem.key)}">
          ${legendItem.value}</br>
          <b>${item[legendItem.key]}</b>
          </p>`;

        }
      }
    });

    if (htmlContent) {
      tooltip
        .transition()
        .duration(lineCircleTransition)
        .style('visibility', 'visible');

      tooltip
        .style('left', (x) + 'px')
        .style('top', (y) + 'px')
        .html(`${htmlContent}`);
    }

  }
  drawRectTooltip(event, tooltip, tooltipLine, xScale, samGroupData, lineKey: Legend[], label): any {
    let x; let y;
    if (event?.type.indexOf('touch') < 0) {
      x = d3.pointer(event)[0];
      y = d3.pointer(event)[1];
    }
    else {
      x = event.changedTouches[0].clientX;
      y = 100;
    }
    const domain = xScale.domain();
    const range = xScale.range();
    const mouseDate = d3.scaleQuantize().domain(range).range(domain)(x);

    tooltipLine
      .attr('x1', x)
      .attr('x2', x)
      .attr('y1', 0)
      .attr('y2', graphHeight)
      .attr('stroke', 'black');

    let htmlContent = `${label}<br> at ${mouseDate}<br>`;

    samGroupData.forEach((value, key) => {
      if (key === mouseDate) {
        console.log(value);
        value.map((item: any) => {
          const year = Object.keys(item)[0];
          const stat = item[year];
          htmlContent += `<p style="color: ${getColorFromLabel(year)}">
          in <b>${year}</b> </br>
          <b>${stat}</b>
          </p>`;
        });
      }
      else if (value.division === mouseDate) {
        lineKey.map((legend: Legend) => {
          htmlContent += `<p style="color: ${getColorFromLabel(legend.key)}">
          <b>${legend.value}</b> </br>
          <b>${value[legend.key]}</b>
          </p>`;
        });
      }

    });
    if (htmlContent) {
      tooltip
        .transition()
        .duration(lineCircleTransition)
        .style('visibility', 'visible');

      tooltip
        .style('left', (x) + 'px')
        .style('top', (y) + 'px')
        .html(`${htmlContent}`);
    }

  }


}
