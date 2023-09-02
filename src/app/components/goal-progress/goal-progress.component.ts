import { GoalProgress } from './../../pages/impacts/impacts.model';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-goal-progress',
  templateUrl: './goal-progress.component.html',
  styleUrls: ['./goal-progress.component.scss'],
})
export class GoalProgressComponent implements OnInit {


  @Input() progressValue: number;
  @Input() goalValue: number;
  @Input() goalProgress: GoalProgress;
  barStyle: any;

  constructor() { }

  ngOnInit() {

  }

}
