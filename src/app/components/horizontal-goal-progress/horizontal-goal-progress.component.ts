import { Component, Input, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { GoalProgress } from 'src/app/pages/impacts/impacts.model';

@Component({
  selector: 'app-horizontal-goal-progress',
  templateUrl: './horizontal-goal-progress.component.html',
  styleUrls: ['./horizontal-goal-progress.component.scss'],
})
export class HorizontalGoalProgressComponent implements OnInit {


  @Input() progressValue: number;
  @Input() goalValue: number;
  @Input() goalProgress: GoalProgress;
  barStyle: any;
  constructor() { }

  ngOnInit() { }


}
