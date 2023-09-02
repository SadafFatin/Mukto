/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable max-len */
import { PnriCIMeasureStandards } from './../../models/pnri_model';
import { Scorecard } from 'src/app/models/pnri_model';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { KeyValueObject } from 'src/app/utils/models';
import {
  getCILabel,
  getColorForPercentage,
  pnriScorecardDataColumns,
} from 'src/app/utils/utility';

@Component({
  selector: 'app-pnri',
  templateUrl: './pnri.component.html',
  styleUrls: ['./pnri.component.scss'],
})
export class PnriComponent implements OnInit, OnChanges {
  @Input() scoreCard: Scorecard[];
  @Input() pnriCIStandardColumn: PnriCIMeasureStandards[] = [];
  @Input() identifierColumn;
  @Input() current: number;

  public count = 0;
  public itemsPerPage = 12;
  public currentPage = 1;


  getColorForPercentage = getColorForPercentage;
  getCILabel = getCILabel;
  displayedColumns: KeyValueObject[] = [];


  constructor() { }

  ngOnInit(): void {
    this.displayedColumns = pnriScorecardDataColumns[this.identifierColumn];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.identifierColumn) {
      this.identifierColumn = changes.identifierColumn.currentValue;
      this.displayedColumns = pnriScorecardDataColumns[this.identifierColumn];
    }
  }

  public onChange(event): void {
    this.currentPage = event;
  }

}
