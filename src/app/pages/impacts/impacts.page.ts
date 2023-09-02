import { barTransitionTime, getWidth, graphTextCoordinate } from './../../utils/utility';
import { KeyValueObject } from './../../utils/models';
/* eslint-disable max-len */
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ImpactAPIService } from 'src/app/services/impact_api.service';
import { Impact } from './impacts.model';
import { drawLegendBelowGraph, generateSVGContainer, getColorFromLabel, graphHeight, legendHeight, margin, wrap } from 'src/app/utils/utility';
import { Legend } from 'src/app/utils/models';
import * as d3 from 'd3';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-impacts',
  templateUrl: './impacts.page.html',
  styleUrls: ['./impacts.page.scss'],
})
export class ImpactsPage implements OnInit {

  @ViewChild('prevalenceGraphCanvas', { read: ElementRef }) prevalenceGraphCanvas: ElementRef;

  impacts: Impact[];
  currentImpact: Impact;

  constructor(private api: ImpactAPIService, private platform: Platform) {
  }

  ngOnInit() {
    this.load();
  }

  async load() {
    const val = await this.api.load();
    if (val.ok) {
      this.impacts = val.data.impacts;
      this.currentImpact = this.impacts[0];
      setTimeout(() => {
        this.initGraph();
      }, 200);
    }

  }

  onSegmentChanged(event) {
    this.currentImpact = this.impacts[event.detail.value];
    this.initGraph();
  }


  initGraph() {
    let width = this.prevalenceGraphCanvas.nativeElement.offsetWidth;
    if (width === 0) {
      width = getWidth(9, 8, this.platform.width());
    }
    const height = graphHeight;
    // const legends: Legend[] = this.currentImpact.prevalenceGraph.graphValue.map((item) => {
    //   const obj: KeyValueObject = {
    //     key: item.year,
    //     value: item.year
    //   };
    //   return obj;
    // });
    const legends: Legend[] = [];
    const totalLegendHeight = legends.length * legendHeight;

    const svg: d3.Selection<d3.BaseType, unknown, HTMLElement, any>
      = generateSVGContainer('#prevalenceGraphCanvas', height, totalLegendHeight);

    const chart = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    //create x-axis append x-axis
    const xScale = d3.scaleBand()
      .range([0, width - (margin.right + margin.left)])
      .domain(this.currentImpact.prevalenceGraph.graphValue.map((s) => s.year))
      .padding(0.05);

    const x = chart.append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(xScale));

    const text = x.selectAll('text')
      .call(wrap, xScale.bandwidth(), 10, 'horizontal')
      .attr('class', 'graph-tick-text')
      .attr('alignment-baseline', 'middle');


    // Add Y axis
    const yScale = d3.scaleLinear()
      .range([height, 0])
      .domain([0, 100]);
    chart.append('g')
      .call(d3.axisLeft(yScale));


    // Show the bars
    const groupBar = chart.append('g')
      .selectAll('g')
      .data(this.currentImpact.prevalenceGraph.graphValue);


    groupBar.enter()
      .append('rect')
      .attr('x', (d) => xScale(d.year))
      .attr('width', xScale.bandwidth())
      .attr('y', (d) => yScale(0))
      .attr('height', 0)
      .transition()
      .duration(barTransitionTime)
      .attr('y', (d) => yScale(d.value))
      .attr('height', (d: any) => height - yScale(d.value))
      .attr('fill', (d: any): any => getColorFromLabel(d.year));


    groupBar
      .enter()
      .append('text')
      .attr('y', (d) => graphTextCoordinate(d.value, yScale))
      .attr('x', (d) => xScale(d.year) + xScale.bandwidth() / 2)
      .attr('class', 'graph-value-text')
      .text((d) => d.value);


    // Handmade legend
    const legendGroup = svg.append('g');
    drawLegendBelowGraph(legendGroup, 'rect', width, height, legends);


  }

}
