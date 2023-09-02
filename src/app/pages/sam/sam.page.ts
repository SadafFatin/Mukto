/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable space-before-function-paren */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
/* eslint-disable max-len */
/* eslint-disable arrow-body-style */

import { getWidth, initTimeOut, pathAnimation } from './../../utils/utility';
import { barTransitionTime, districtDropDown, divisionDropDown, drawLegendBelowGraph, upazilaDropDown } from './../../utils/utility';
import { SamData, SamCum } from './../../models/sam';
import { SamAPIService } from './../../services/sam_api.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { lineCircleTransition, graphHeight, LineChartModel, margin, getTooltip, strokeWidth, circleRadius, getColorFromLabel, generateSVGContainer, legendHeight } from 'src/app/utils/utility';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-sam',
  templateUrl: './sam.page.html',
  styleUrls: ['./sam.page.scss'],
})

export class SamPage implements OnInit {
  @ViewChild('total_child_admittedLineChartCanvas', { read: ElementRef }) samAdmittedLineChartCanvas: ElementRef;
  @ViewChild('sam_cum_admittedBarChartCanvas', { read: ElementRef }) samAdmittedCumBarChartCanvas: ElementRef;

  month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  samData: SamData;
  //period
  periodStarting: string;
  periodEnding: string;
  //dropdown
  divisionDropDown = divisionDropDown;
  upazilaDropDown = upazilaDropDown;
  districtDropDown = districtDropDown;
  isDataLoading = true;

  // Mousemove event must be at this level to listen to mousing over rect#overlay
  isHovering = false;


  constructor(private api: SamAPIService, private platform: Platform) {
  }
  async ngOnInit() {
    const val = await this.api.load(null, null);
    if (val.ok) {
      this.samData = val.data;
      this.createGraph();
    }
  }

  createGraph() {
    setTimeout(() => {
      this.initSamLineChart('total_child_admitted', 'Total Child Admitted');
      this.initSamLineChart('total_child_screened', 'Total Child Screened');
      this.initSamCumulative('sam_cum_admitted', 'Child Admitted');
      this.initSamCumulative('sam_cum_screened', 'Child Screened');
      this.isDataLoading = false;
    }, initTimeOut);
  }

  initSamLineChart(lineKey: string, label: string) {
    let maxY = 0;
    const legends: LineChartModel[] = [];
    // Reformat the data: we need an array of arrays of {x, y} tuples
    const samGroupData = this.samData.distinct_years.map((grpName) => {
      const group = {
        key: grpName,
        values: this.samData.sam_values[grpName].values.map(d => {
          d.time = this.month.indexOf(d.month);
          if (maxY < +d[lineKey]) {
            maxY = +d[lineKey];
          }
          return d;
        })
      };
      legends.push({
        key: grpName.toString(), value: grpName.toString(),
        path: undefined
      });
      return group;
    });
    // A color scale: one color for each group
    let width = this.samAdmittedLineChartCanvas.nativeElement.offsetWidth;
    if (width === 0) {
      width = getWidth(12, 12, this.platform.width());
    }

    const height = graphHeight;
    const totalLegendHeight = legends.length * legendHeight;
    const svg: d3.Selection<d3.BaseType, unknown, HTMLElement, any>
      = generateSVGContainer(`#${lineKey}LineChartCanvas`, height, totalLegendHeight);
    const chart = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
    const tooltip = getTooltip(`#${lineKey}LineChartCanvas`);



    // Add X axis --> it is a date format
    //scales
    // Add X axis
    const x = d3.scaleLinear()
      .domain([0, 11])
      .range([0, width - (margin.left + strokeWidth)]);

    const xAxisGenerator = d3.axisBottom(x);
    xAxisGenerator.tickSize(-height).ticks(12).tickFormat((d, i) => this.month[i]);
    chart.append('g')
      .attr('class', 'axisX')
      .attr('transform', `translate(${0},${height})`)
      .call(xAxisGenerator)
      .selectAll('text')
      .attr('class', 'graph-tick-text');

    // Add Y axis
    const y = d3.scaleLinear()
      .range([height, 0])
      .domain([0, maxY]);
    chart.append('g')
      .attr('class', 'axisY')
      .attr('transform', `translate(${0},${0})`)
      .call(d3.axisLeft(y).tickSize(-width + margin.left + strokeWidth).ticks(10, 's'));

    // Add the lines
    const line = d3.line()
      .x((d: any) => x(+d.time))
      .y((d: any) => y(+d[lineKey]));

    const linePath = chart.selectAll(lineKey + 'Lines')
      .data(samGroupData)
      .enter()
      .append('path')
      .attr('class', (d) => '_' + d.key)
      .attr('d', (d: any) => line(d.values))
      .attr('stroke', (d) => getColorFromLabel(d.key.toString()))
      .style('stroke-width', 4)
      .style('fill', 'none');


    // Add the points
    chart
      // First we need to enter in a group
      .selectAll(lineKey + 'Dots')
      .data(samGroupData)
      .enter()
      .append('g')
      .style('fill', (d) => getColorFromLabel(d.key.toString()))
      .attr('class', (d) => d.key)
      // Second we need to enter in the 'values' part of this group
      .selectAll('myPoints')
      .data((d) => d.values)
      .enter()
      .append('circle')
      .attr('cx', (d) => x(d.time))
      .attr('cy', (d) => y(+d[lineKey]))
      .attr('r', circleRadius);
    // .on('mouseover', () => this.circleMouseover(tooltip))
    // .on('mousemove', (event: any, d: Value) => this.circleMouseMove(event, d, tooltip, lineKey, label))
    // .on('click', (event: any, d: Value) => this.circleMouseMove(event, d, tooltip, lineKey, label))
    // .on('mouseout', (event: any) => this.circleMouseOut(event, tooltip));

    // Add a label at the end of each line
    chart
      .selectAll(lineKey + 'Labels')
      .data(samGroupData)
      .enter()
      .append('g')
      .append('text')
      .attr('class', (d) => d.key)
      .datum((d) => ({ key: d.key, value: d.values[d.values.length - 1] })) // keep only the last value of each time series
      .attr('transform', (d) => 'translate(' + x(d.value.time) + ',' + y(+d.value[lineKey]) + ')') // Put the text at the position of the last point
      .attr('x', -10) // shift the text a bit more right
      .text((d) => d.key)
      .attr('class', 'map-label')
      .style('fill', (d) => getColorFromLabel(d.key.toString()));

    // Add a legend (interactive)
    chart
      .selectAll(lineKey + 'Legends')
      .data(samGroupData)
      .enter()
      .append('g')
      .append('text')
      .attr('x', (d, i) => margin.left + strokeWidth)
      .attr('y', (d, i) => 30 + i * 30)
      .text((d) => d.key.toString())
      .style('fill', (d) => getColorFromLabel(d.key.toString()))
      .attr('class', 'legend')
      .attr('id', (d) => '_' + d.key);
    // .on('click', (event, d) => {
    //   this.legendClick(event, d.key);
    // });
    pathAnimation(linePath);
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
      .on('mousemove', (event) => this.drawCircleTooltip(event, tooltip, tooltipLine, x, samGroupData, lineKey, label))
      .on('mouseout', (event) => this.mouseOut(event, tooltip, tooltipLine))
      .on('click', (event) => this.drawCircleTooltip(event, tooltip, tooltipLine, x, samGroupData, lineKey, label))
      .on('touchmove', (event) => {
        this.drawCircleTooltip(event, tooltip, tooltipLine, x, samGroupData, lineKey, label);
      })
      .on('touchend', (event) => {
        this.mouseOut(event, tooltip, tooltipLine);

      });
  }


  initSamCumulative(barKey: string, label: string) {
    let maxY = 3000;
    let legends: LineChartModel[] = [];
    // Reformat the data: we need an array of arrays of {x, y} tuples
    const samGroupData = d3.group(this.samData[barKey], (d: SamCum) => d.month);
    //get legends and max
    legends = this.samData.distinct_years.map(d => {
      this.samData[barKey].map((grp: SamCum) => {
        if (maxY < +grp[d]) {
          maxY = +grp[d];
        }
      });
      return {
        key: d, value: d,
        path: undefined
      };
    });
    // A color scale: one color for each group
    let width = this.samAdmittedLineChartCanvas.nativeElement.offsetWidth;
    if (width === 0) {
      width = getWidth(12, 12, this.platform.width());
    }
    const height = graphHeight;
    const totalLegendHeight = legends.length * legendHeight;
    const svg: d3.Selection<d3.BaseType, unknown, HTMLElement, any>
      = generateSVGContainer(`#${barKey}BarChartCanvas`, height, totalLegendHeight);
    const chart = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
    const tooltip = getTooltip(`#${barKey}BarChartCanvas`);

    // Add X axis --> it is a date format
    //scales
    // Add X axis
    const x = d3.scaleBand()
      .domain(this.month)
      .range([0, width - (margin.left + strokeWidth)]).padding(.05);

    const xAxisGenerator = d3.axisBottom(x);
    xAxisGenerator.tickSize(-height).ticks(12).tickFormat((d, i) => this.month[i]);
    chart.append('g')
      .attr('class', 'axisX')
      .attr('transform', `translate(${0},${height})`)
      .call(xAxisGenerator)
      .selectAll('text')
      .attr('class', 'graph-tick-text');

    // Add Y axis
    const y = d3.scaleLinear()
      .range([height, 0])
      .domain([0, maxY]);
    chart.append('g')
      .attr('class', 'axisY')
      .attr('transform', `translate(${0},${0})`)
      .call(d3.axisLeft(y).tickSize(-width + margin.left + strokeWidth).ticks(10, 's'));

    //Another scale for subgroup position?
    const xSubgroup = d3.scaleBand()
      .domain(this.samData.distinct_years)
      .range([0, x.bandwidth()]);

    // Show the bars
    const bar = chart.append('g')
      .selectAll('g')
      .data(samGroupData);

    const groupBar = bar.enter()
      .append('g')
      .attr('transform', (d) => 'translate(' + x(d[0]) + ',0)')
      .selectAll('g')
      .data((d) => this.samData.distinct_years.map((key, index: number) => ({ key, value: d[1][index][key] })));

    groupBar.enter()
      .append('rect')
      .attr('x', (d) => {
        return xSubgroup(d.key);
      })
      .attr('width', xSubgroup.bandwidth())
      .attr('y', y(0))
      .attr('height', 0)
      .transition()
      .duration(barTransitionTime)
      .attr('y', (d) => y(d.value ? d.value : 0))
      .attr('height', (d) => height - y(d.value ? d.value : 0))
      .attr('fill', (d: any): any => getColorFromLabel(d.key))
      .attr('class', barKey + 'bar');

    //events
    // groupBar.enter()
    //   .selectAll('rect')
    //   .on('mouseover', () => this.rectMouseover(tooltip))
    //   .on('mousemove', (event: any, d) => this.rectMouseMove(event, d, tooltip, barKey, label))
    //   .on('click', (event: any, d) => this.rectMouseMove(event, d, tooltip, barKey, label))
    //   .on('mouseout', (event: any) => this.circleMouseOut(event, tooltip));

    const legendGroup = svg.append('g');
    drawLegendBelowGraph(legendGroup, 'rect', width, height, legends);

    //new code
    const tooltipLine = chart.append('line')
      .attr('stroke', 'black');

    chart.append('rect')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('fill', 'transparent')
      .on('mousemove', (event) => this.drawRectTooltip(event, tooltip, tooltipLine, x, samGroupData, barKey, label))
      .on('mouseout', (event) => this.mouseOut(event, tooltip, tooltipLine))
      .on('click', (event) => this.drawRectTooltip(event, tooltip, tooltipLine, x, samGroupData, barKey, label))
      .on('touchmove', (event) => {
        this.drawRectTooltip(event, tooltip, tooltipLine, x, samGroupData, barKey, label);
      })
      .on('touchend', (event) => {
        this.mouseOut(event, tooltip, tooltipLine);
      });

  }

  mouseOut(event: any, tooltip: any, tooltipLine: any): any {
    if (tooltip) {
      tooltip
        .transition()
        .duration(1500)
        .style('visibility', 'hidden');
    }
    if (tooltipLine) { tooltipLine.attr('stroke', 'none'); }
  }

  drawCircleTooltip(event, tooltip, tooltipLine, xScale, samGroupData, lineKey, label): any {
    let x; let y;
    if (event?.type.indexOf('touch') < 0) {
      x = d3.pointer(event)[0];
      y = d3.pointer(event)[1];
    }
    else {
      x = event.changedTouches[0].clientX;
      y = 100;
    }
    const mouseDate = xScale.invert(x);
    //console.log(x, mouseDate);
    tooltipLine
      .attr('x1', x)
      .attr('x2', x)
      .attr('y1', 0)
      .attr('y2', graphHeight)
      .attr('stroke', 'black');

    const month = Math.round(mouseDate);
    let htmlContent = `${label}<br>`;
    samGroupData.map(item => {
      if (item.values[month]) {
        htmlContent += `<p style="color: ${getColorFromLabel(item.key + '')}">${item.values[month].month + ',' + item.values[month].year}<br><b>${item.values[month][lineKey]}</b></p>`;
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

  drawRectTooltip(event, tooltip, tooltipLine, xScale, samGroupData, lineKey, label): any {
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
        value.map((item: any) => {
          const year = Object.keys(item)[0];
          const stat = item[year];
          htmlContent += `<p style="color: ${getColorFromLabel(year)}">
          
          in ${year} </br>
          <b>${stat}</b>
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


  // legendClick(event, subgroupsKey) {
  //   // is the element currently visible ?
  //   const currentOpacity = d3.selectAll('._' + subgroupsKey).style('opacity');
  //   // Change the opacity: from 0 to 1 or from 1 to 0
  //   d3.selectAll('._' + subgroupsKey).transition().style('opacity', +currentOpacity === 1 || +currentOpacity ? 0 : 1);

  //   d3.selectAll('._' + subgroupsKey).transition().style('opacity', +currentOpacity === 1 || +currentOpacity ? 0 : 1);
  //   const textDecoration = d3.selectAll('#_' + subgroupsKey).style('text-decoration');
  //   d3.selectAll('#_' + subgroupsKey).transition().style('text-decoration', textDecoration === 'line-through' ? 'none' : 'line-through');

  // }
  // circleMouseover(tooltip) {
  //   tooltip
  //     .transition()
  //     .duration(lineCircleTransition)
  //     .style('visibility', 'visible');
  // }
  // circleMouseMove(event, d: Value, tooltip, key, label) {
  //   tooltip
  //     .transition()
  //     .duration(lineCircleTransition)
  //     .style('visibility', 'visible');
  //   d3.select(event.currentTarget)
  //     .transition()
  //     .duration(lineCircleTransition)
  //     .attr('r', circleRadiusHover);

  //   const htmlContent = `<p><b>${d.month + ',' + d.year}</b><br>${label}<br><b>${d[key]}</b></p>`;
  //   tooltip
  //     .style('background-color', getColorFromLabel(d.year.toString()))
  //     .style('left', (d3.pointer(event)[0] + 70) + 'px')
  //     .style('top', (d3.pointer(event)[1]) + 'px')
  //     .html(`${htmlContent}`);
  // }
  // circleMouseOut(event, tooltip) {
  //   d3.select(event.currentTarget)
  //     .transition()
  //     .duration(lineCircleTransition)
  //     .attr('r', circleRadius);
  //   tooltip
  //     .transition()
  //     .duration(lineCircleTransition)
  //     .style('visibility', 'hidden');
  // }
  // rectMouseover(tooltip) {
  //   tooltip
  //     .transition()
  //     .duration(lineCircleTransition)
  //     .style('visibility', 'visible');
  // }
  // rectMouseMove(event, d, tooltip, key, label) {
  //   tooltip
  //     .transition()
  //     .duration(lineCircleTransition)
  //     .style('visibility', 'visible');
  //   d3.select(event.currentTarget)
  //     .transition()
  //     .duration(lineCircleTransition)
  //     .attr('r', circleRadiusHover);

  //   const htmlContent = `<p>At: ${d.key}<br>${label}<br>${d.value}</p>`;
  //   tooltip
  //     .style('background-color', getColorFromLabel(d.key))
  //     .style('top', (event.layerY + 10) + 'px')
  //     .style('left', (event.clientX >= event.screenX ? event.clientX - 150 : event.layerX) + 'px')
  //     .html(`${htmlContent}`);
  // }
  // lineMouseOver(tooltip, event, subGroupsLabel, subgroupsKey): void {

  //   // d3.select(subgroupsKey)
  //   //   .style('opacity', otherLinesOpacityHover);
  //   // d3.select(subgroupsKey)
  //   //   .style('opacity', lineOpacityHover)
  //   //   .style('stroke-width', lineStrokeHover);
  //   // tooltip
  //   //   .style('background-color', getColorFromGmpConfig(subgroupsKey))
  //   //   .style('top', (event.layerY + 10) + 'px').style('left', (event.clientX >= event.screenX ? event.clientX - 150 : event.layerX) + 'px')
  //   //   .transition()
  //   //   .duration(550)
  //   //   .style('visibility', 'visible')
  //   //   .text(`${subGroupsLabel} Graph`);
  // }
  // lineMouseOut(tooltip, event) {
  //   // d3.selectAll('.line')
  //   //   .style('opacity', lineOpacity);
  //   // d3.select(event.currentTarget)
  //   //   .style('fill', 'none')
  //   //   .style('stroke-width', lineStroke);
  //   // tooltip
  //   //   .transition()
  //   //   .duration(200)
  //   //   .style('visibility', 'hidden');
  // }

  //on input change methods
  onStartingPeriodSelected(e) {
    this.periodStarting = e.detail.value.substring(0, 7);
  }
  onEndingPeriodSelected(e) {
    this.periodEnding = e.detail.value.substring(0, 7);
  }
  onDivisionSelected(e) {
    if (e.detail.value) {
      // this.districtScoreCards = this.scorecardData.district_scorecards.filter(district => district.division_id == e.detail.value.division_id);
      this.districtDropDown = districtDropDown.filter(district => district.division_id == e.detail.value.division_id);
      //this.currentScorecards = this.districtScoreCards;
      this.resetState('district');
    }
  }
  onDistrictSelected(e) {
    if (e.detail.value) {
      // this.upazilaScoreCards = this.scorecardData.upazila_scorecards.filter(upazila => upazila.district_id == e.detail.value.district_id);
      this.upazilaDropDown = upazilaDropDown.filter(upazila => upazila.district_id == e.detail.value.district_id);
      //this.currentScorecards = this.upazilaScoreCards;
      this.resetState('upazila');
    }
  }
  async onUpazilaSelected(e) {
    if (e.detail.value) {
      // this.upazilaScoreCards = this.scorecardData.upazila_scorecards.filter(upazila => upazila.upazila_id == e.detail.value.upazila_id);
      // this.currentScorecards = this.upazilaScoreCards;
      this.resetState('upazila');
    }
  }
  async resetState(targetedArea: string) {
  }


}
