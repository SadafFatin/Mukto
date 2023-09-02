import { Legend } from './../../utils/models';
// eslint-disable-next-line max-len
import { legendHGroupMarginTop, getTooltip, lineCircleTransition, subGroupKey, subGroupLabel } from './../../utils/utility';

/* eslint-disable max-len */
import { circleRadius, circleRadiusHover, drawLegendBelowGraph, getColorFromLabel, legendHeight } from './../../utils/utility';
import {
  parseTime, getShortPeriod,
  getDateFromPeriod, addGraphNameLeftAxis,
  circleOpacity, LineChartModel,
  lineOpacity, lineOpacityHover, lineStroke,
  lineStrokeHover, otherLinesOpacityHover
} from './../../utils/utility';
import { Scorecard } from 'src/app/models/pnri_model';
import { NationalPnriData } from './../../models/pnri_model';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { PnriAPIService } from 'src/app/services/pnri_api.service';
import * as d3 from 'd3';
import { margin, graphHeight, pathAnimation, strokeWidth } from 'src/app/utils/utility';
import { DatePipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { PnriLeadingColumn, setPnriLeadingCol } from 'src/app/state/actions/pnri-col.action';

const pnricol: PnriLeadingColumn = {
  name: 'period',
  label: 'Period'
};

@Component({
  selector: 'app-national',
  templateUrl: './national.page.html',
  styleUrls: ['./national.page.scss'],
})
export class NationalPage implements OnInit {

  @ViewChild('compositeIndexGraphCanvas', { read: ElementRef }) compositeIndexGraphCanvas: ElementRef;
  @ViewChild('serviceDataGraphCanvas', { read: ElementRef }) serviceDataGraphCanvas: ElementRef;
  @ViewChild('performanceNationalBasedOnCICanvas', { read: ElementRef }) performanceNationalBasedOnCICanvas: ElementRef;

  pnriData: NationalPnriData;
  identifierColumn = 'national';
  periodStarting: string;
  periodEnding: string;
  viewType = 'table';





  constructor(private store: Store, private datePipe: DatePipe, private api: PnriAPIService, public alertController: AlertController) { }
  async ngOnInit(): Promise<void> {
    const val = await this.api.loadNational('');
    if (val.ok) {
      this.pnriData = val.data;
      this.sortData();
    }
  }

  ionViewDidEnter() {
    this.store.dispatch(setPnriLeadingCol({ pnricol }));
  }

  sortData() {
    this.pnriData.national_scorecards = this.pnriData.national_scorecards.sort(({ composite_index: a }, { composite_index: b }) => b - a);
    this.pnriData.national_scorecards.map((item, index) => item.rank = index + 1);
    this.pnriData.national_scorecards = this.pnriData.national_scorecards.sort(({ period: a }, { period: b }) => getDateFromPeriod(a) - getDateFromPeriod(b));
  }
  onSegmentChanged(e: any) {
    if (this.viewType === 'table') {
    }
    else if (this.viewType === 'graph') {
      this.createGraph();
    }
  }
  createGraph() {
    setTimeout(() => {
      this.initCompositeIndexLineChart();
      this.initPnriServiceDataLineChart();
      this.initPerformanceBasedOnCIGraph();
    }, lineCircleTransition);
  }
  async onStartingPeriodSelected(e) {
    this.periodStarting = e.detail.value.substring(0, 7);
  }
  async onEndingPeriodSelected(e) {
    this.periodEnding = e.detail.value.substring(0, 7);
  }
  initCompositeIndexLineChart() {
    const width = this.compositeIndexGraphCanvas.nativeElement.offsetWidth;
    const height = graphHeight;
    const legend: LineChartModel = this.pnriData.pnriServiceLineCharts[0];
    const svg = d3.select('#compositeIndexGraphCanvas')
      .append('svg')
      .attr('width', '100%')
      .attr('height', height + margin.vertical)
      .attr('preserveAspectRatio', 'xMinYMin meet');
    // create a tooltip
    const tooltip = getTooltip('#compositeIndexGraphCanvas');
    const chart = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
    //scales
    const x = d3.scaleTime()
      .domain(
        d3.extent(this.pnriData.national_scorecards, (item => parseTime(item.period))))
      .range([strokeWidth, width - (margin.right + margin.left)]);

    chart.append('g')
      .call(d3.axisBottom(x).ticks(d3.timeYear))
      .attr('transform', `translate(${0},${height})`)
      .selectAll('text')
      .attr('class', 'graph-label')
      .attr('alignment-baseline', 'middle');

    // Add Y axis
    const y = d3.scaleLinear()
      .domain([0, d3.max(this.pnriData.national_scorecards, (d: Scorecard) => +d.composite_index)])
      .range([height, 0]);
    chart.append('g')
      .call(d3.axisLeft(y).tickSize(-width + strokeWidth))
      .attr('class', 'axisY');

    addGraphNameLeftAxis(chart, 'National Composite Index Graph');
    const lines = chart.append('g').attr('class', 'lines');
    this.generateLinePath(tooltip, legend, x, y, chart, lines);
    pathAnimation(this.pnriData.pnriServiceLineCharts[0].path);

    chart.selectAll('myLegend')
      .append('g')
      .append('text')
      .attr('x', 30)
      .attr('y', 30)
      .text('National Composition Index Graph')
      .style('fill', 'red')
      .style('font-size', 14);

  }
  initPnriServiceDataLineChart() {
    const width = this.serviceDataGraphCanvas.nativeElement.offsetWidth;
    const height = graphHeight;
    const legends: LineChartModel[] = this.pnriData.pnriServiceLineCharts.slice(1);
    const totalLegendHeight = legends.length * legendHeight;
    const svg: d3.Selection<d3.BaseType, unknown, HTMLElement, any> = d3.select('#serviceDataGraphCanvas')
      .append('svg')
      .attr('width', '100%')
      .attr('height', height + legendHGroupMarginTop + totalLegendHeight + margin.vertical)
      .attr('preserveAspectRatio', 'xMinYMin meet');
    // create a tooltip
    const tooltip = getTooltip('#serviceDataGraphCanvas');
    const chart = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
    //scales
    const x = d3.scaleTime()
      .domain(
        d3.extent(this.pnriData.national_scorecards, (item => parseTime(item.period))))
      .range([strokeWidth, width - (margin.right + margin.left)]);

    chart.append('g')
      .call(d3.axisBottom(x).ticks(d3.timeYear))
      .attr('transform', `translate(${0},${height})`)
      .selectAll('text')
      .attr('class', 'graph-label')
      .attr('alignment-baseline', 'middle');
    const yMax = [d3.max(this.pnriData.national_scorecards, d => d.caregiver_receive_counsel_num),
    d3.max(this.pnriData.national_scorecards, d => d.sam_child_screened_num), d3.max(this.pnriData.national_scorecards, d => d.sam_child_identified_num), d3.max(this.pnriData.national_scorecards, d => d.sam_child_admitted_num),
    d3.max(this.pnriData.national_scorecards, d => d.plw_receive_ifa_num)];
    // Add Y axis
    const y = d3.scaleLinear()
      .domain([0, d3.max(yMax, (d: number) => +d)])
      .range([height, 0]);
    chart.append('g')
      .call(d3.axisLeft(y).tickSize(-width))
      .attr('class', 'axisY');

    const lines = chart.append('g').attr('class', 'lines');
    for (const line of legends) {
      this.generateLinePath(tooltip, line, x, y, chart, lines);
      pathAnimation(line.path);
    }

    const legendGroup = svg.append('g');
    legendGroup.attr('class', 'legend-line');
    drawLegendBelowGraph(legendGroup, 'rect', width, height, legends);
  }
  initPerformanceBasedOnCIGraph() {
    const width = this.performanceNationalBasedOnCICanvas.nativeElement.offsetWidth;
    const height = graphHeight;
    const legends: Legend[] = this.pnriData.nationalPerformanceBasedOnCIColumn;
    const totalLegendHeight = legends.length * legendHeight;
    const svg = d3.select('#performanceNationalBasedOnCICanvas')
      .append('svg')
      .attr('width', '100%')
      .attr('height', height + legendHGroupMarginTop + totalLegendHeight + margin.vertical);
    const chart = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
    //tooltip
    const tooltip = getTooltip('#performanceNationalBasedOnCICanvas');
    //create x-axis append x-axis
    const xScale = d3.scaleTime()
      .domain(
        d3.extent(this.pnriData.national_scorecards.map(item => parseTime(item.period))))
      .rangeRound([strokeWidth, width - (margin.left + margin.right)]);

    chart.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(xScale).ticks(d3.timeMonth, 1).tickFormat(d3.timeFormat('%m')))
      .selectAll('text')
      .attr('class', 'graph-label')
      .attr('alignment-baseline', 'middle');

    // Add Y axis
    const yScale = d3.scaleLinear()
      .range([height, 0])
      .domain([0, 64]);
    chart.append('g')
      .call(d3.axisLeft(yScale).tickSize(-width).tickSizeOuter(0))
      .attr('class', 'axisY');
    const data: any = this.pnriData.national_scorecards;
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

    subgroup.on('mouseover', () => this.rectMouseOver(tooltip))
      .on('mousemove', (event: any, d: any) => this.rectMouseMove(tooltip, event, d))
      .on('mouseout', (event: any, d: any) => this.rectMouseOut(tooltip));
    // Handmade legend
    const legendGroup = svg.append('g');
    drawLegendBelowGraph(legendGroup, 'rect', width, height, legends);
  }
  generateLinePath(tooltip, lineChart: LineChartModel, x, y, chart, lineSelection) {
    const lineData = d3.line<Scorecard>().x((d: Scorecard) => x(parseTime(d.period))).y((d: Scorecard) => y(d[lineChart.key])).curve(d3.curveCardinal);

    lineChart.path = lineSelection
      .append('path')
      .datum(this.pnriData.national_scorecards)
      .attr('class', lineChart.key)
      .attr(subGroupLabel, lineChart.value)
      .style('fill', 'none')
      .attr('stroke-width', lineStroke)
      .attr('stroke', getColorFromLabel(lineChart.key))
      .style('opacity', +lineOpacity / 2)
      .attr('d', lineData)
      .on('mouseover', (event, d: Scorecard) => this.lineMouseOver(tooltip, event, lineChart.value, lineChart.key))
      .on('mouseout', (event, d: Scorecard) => this.lineMouseOut(tooltip, event));

    lineSelection.append('g').selectAll('circle')
      .data(this.pnriData.national_scorecards)
      .enter()
      .append('circle')
      .attr('r', circleRadius)
      .style('opacity', circleOpacity)
      .style('cursor', 'pointer')
      .attr('fill', getColorFromLabel(lineChart.key))
      .attr('cx', (d: Scorecard) => x(parseTime(d.period)))
      .attr('cy', (d: Scorecard) => y(d[lineChart.key]))
      .on('mouseover', (event: any, data: Scorecard) => this.circleMouseover(tooltip))
      .on('mousemove', (event: any, d: Scorecard) => this.circleMouseMove(tooltip, event, d, lineChart.value, lineChart.key))
      .on('mouseout', (event: any, d: Scorecard) => this.circleMouseOut(tooltip, event));

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
    const period = parseTime(d.data.period);
    const subGroupsKey = (d3.select(event.currentTarget.parentNode).attr(subGroupKey));
    const subGroupsLabel = (d3.select(event.currentTarget.parentNode).attr(subGroupLabel));
    tooltip
      .transition()
      .duration(lineCircleTransition)
      .style('background-color', getColorFromLabel(subGroupsKey))
      .style('visibility', 'visible')
      .text(`${subGroupsLabel}:${d[1] - d[0]} Period: ${getShortPeriod(period, this.datePipe)}`)
      .style('top', (event.layerY + 10) + 'px')
      .style('left', (event.clientX >= event.screenX ? event.clientX - 150 : event.layerX) + 'px');
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

    tooltip
      .style('background-color', getColorFromLabel(subGroupsKey))
      .style('top', (event.layerY + 10) + 'px').style('left', (event.clientX >= event.screenX ? event.clientX - 150 : event.layerX) + 'px')
      .transition()
      .duration(550)
      .style('visibility', 'visible')
      .text(`${subgroupLabel}:${d[subGroupsKey]} Period: ${getShortPeriod(period, this.datePipe)}`);
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


}
