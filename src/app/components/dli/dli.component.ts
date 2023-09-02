/* eslint-disable @typescript-eslint/member-ordering */
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { PnriCIMeasureStandards } from 'src/app/models/pnri_model';
import { DliScorecard } from 'src/app/pages/dli-scorecard/dli';
import { KeyValueObject } from 'src/app/utils/models';
import { getColorForPercentage, getCILabel, dliDataColumns } from 'src/app/utils/utility';

@Component({
  selector: 'app-dli',
  templateUrl: './dli.component.html',
  styleUrls: ['./dli.component.scss'],
})
export class DliComponent implements OnInit, OnChanges {

  @Input() scoreCard: DliScorecard[];
  @Input() pnriCIStandardColumn: PnriCIMeasureStandards[] = [];
  @Input() identifierColumn;
  @Input() current: number;

  public count = 0;
  public itemsPerPage = 12;
  public currentPage = 1;

  getColorForPercentage = getColorForPercentage;
  getCILabel = getCILabel;
  displayedColumns: KeyValueObject[];

  constructor() { }
  ngOnInit(): void {
    // this.store
    //   .select(retrieveDliLeadingColSelector)
    //   .subscribe(async (stateData: AppState) => {
    //     console.log('retrieveDliLeadingColSelector', stateData);
    //     this.identifierColumn = stateData.dlicol.name;
    //     this.displayedColumns = dliDataColumns[stateData.dlicol.name];
    //   });
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes.identifierColumn);
    if (changes.identifierColumn) {
      this.identifierColumn = changes.identifierColumn.currentValue;
      this.displayedColumns = dliDataColumns[this.identifierColumn];
    }
  }

  public onChange(event): void {
    this.currentPage = event;
  }

}
