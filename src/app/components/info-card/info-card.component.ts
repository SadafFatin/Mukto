import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-info-card',
  templateUrl: './info-card.component.html',
  styleUrls: ['./info-card.component.scss'],
})
export class InfoCardComponent implements OnInit {



  @Input() title: string;
  @Input() statSub: any;
  @Input() iconName: string;
  @Input() iconSrc: string;


  constructor() { }

  ngOnInit() {}

}
