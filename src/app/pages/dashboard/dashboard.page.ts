import { Platform } from '@ionic/angular';
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable max-len */
/* eslint-disable space-before-function-paren */
/* eslint-disable max-len */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable eqeqeq */

import { DashboardAPIService } from './../../services/dashboard_api.service';
import { DashboardApiData } from './../../models/dashborad';
import { getWidth, initTimeOut, radialHeight } from './../../utils/utility';
import { drawLegendBelowGraph, graphHeight, legendHGroupMarginTop, legendHeight } from './../../utils/utility';
import * as d3 from 'd3';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { radialChart } from './index';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  @ViewChild('maternalNutrition', { read: ElementRef }) maternalNutrition: ElementRef;
  @ViewChild('childNutrition', { read: ElementRef }) childNutrition: ElementRef;


  isDataLoading = true;
  dashboardData: DashboardApiData;


  constructor(private api: DashboardAPIService, private platform: Platform) { }

  async load() {
    const val = await this.api.load();
    if (val.ok) {
      this.dashboardData = val.data;
      this.createGraph();
    }
  }

  ngOnInit() {
    this.load();
  }
  createGraph() {
    setTimeout(() => {
      this.initMaternalChart();
      this.initChildGraph();
      this.isDataLoading = false;
    }, initTimeOut);
  }




  initMaternalChart() {
    let width = this.maternalNutrition.nativeElement.offsetWidth;
    const height = radialHeight;
    if (width == 0) {
      width = getWidth(4, 12, this.platform.width());
    }

    // try in Git
    const totalLegendHeight = this.dashboardData.maternalNutrition.length * legendHeight + legendHGroupMarginTop;

    const chart = radialChart(width, height, totalLegendHeight, { key: 'maternal', value: `Maternal<br>Nutrition` })
      .data(this.dashboardData.maternalNutrition)
      .arcPadding(10)
      .max(100)
      .cornerRadius(20);

    d3.select('#maternalNutrition').call(chart);
    const svg = d3.select('#maternalNutrition').select('svg');


    const legendGroup = svg.append('g');
    drawLegendBelowGraph(legendGroup, 'rect', width, 300, this.dashboardData.maternalNutrition, 'key', 0);
  }

  initChildGraph() {
    let width = this.childNutrition.nativeElement.offsetWidth;
    const height = radialHeight;
    const platformWidth = this.platform.width();
    if (width == 0) {
      if (platformWidth >= 990) {
        width = platformWidth * 4 / 12;
      }
      else if (platformWidth < 990) {
        width = platformWidth;
      }
    }
    // try in Git
    const totalLegendHeight = this.dashboardData.childNutrition.length * legendHeight + legendHGroupMarginTop;
    const chart = radialChart(width, height, totalLegendHeight, { key: 'children', value: `Child<br>Nutrition` })
      .data(this.dashboardData.childNutrition)
      .arcPadding(10)
      .max(100)
      .cornerRadius(20);

    d3.select('#childNutrition').call(chart);

    const svg = d3.select('#childNutrition').select('svg');
    const legendGroup = svg.append('g');
    drawLegendBelowGraph(legendGroup, 'rect', width / 2, 300, this.dashboardData.childNutrition, 'key', 0);
  }

}


