import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Dashboard', url: '/dashboard', icon: 'apps' },
    { title: 'Impacts', url: '/impacts', icon: 'bar-chart' },
  ];
  public outputMenu = [
    { title: 'Maternal', url: '/folder/Maternal', icon: 'woman' },
    { title: 'Child', url: '/folder/Child', icon: 'body' },
    { title: 'SAM', url: '/sam', icon: 'walk' },
    // { title: 'Scorecard', url: 'scorecard/national', icon: 'pie-chart' },
    { title: 'Scorecard', url: 'scorecard', icon: 'pie-chart' },
    { title: 'Pnri Map', url: 'pnri-map', icon: 'map' },
    { title: 'Dli Scorecard', url: 'dli-scorecard', icon: 'pie-chart' },

  ];


  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor() {}
}
