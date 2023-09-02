/* eslint-disable @typescript-eslint/member-ordering */
import { Component, Input, OnInit } from '@angular/core';
import { Scorecard, PnriCIMeasureStandards } from 'src/app/models/pnri_model';
import { CommunityClinicData, CommunityClinicValue } from 'src/app/pages/scorecard/scorecard';
import { KeyValueObject } from 'src/app/utils/models';
import { getColorForPercentage, getCILabel, communityClinicDataColumns } from 'src/app/utils/utility';

@Component({
  selector: 'app-community-clinic',
  templateUrl: './community-clinic.component.html',
  styleUrls: ['./community-clinic.component.scss'],
})
export class CommunityClinicComponent implements OnInit {

  @Input() scoreCard: CommunityClinicData[];
  @Input() current: number;

  public count = 0;
  public itemsPerPage = 12;
  public currentPage = 1;


  getColorForPercentage = getColorForPercentage;
  getCILabel = getCILabel;
  displayedColumns: KeyValueObject[] = communityClinicDataColumns;

  constructor() { }
  ngOnInit(): void {

  }
  public onChange(event): void {
    console.dir(event);
    this.currentPage = event;
  }
}
