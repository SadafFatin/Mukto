import { parseTime } from './../utils/utility';
import { KeyValueObject } from './../utils/models';
import { Pipe, PipeTransform } from '@angular/core';
import { PercentPipe, DecimalPipe, DatePipe } from '@angular/common';
/*
 If the value is null change it to N/A
*/
@Pipe({ name: 'pnriDecorator' })
export class PnriDecoratorPipe implements PipeTransform {

  constructor(private percentPipe: PercentPipe, private decimalPipe: DecimalPipe, private datePipe: DatePipe) { }


  transform(value: string, keyObj: KeyValueObject): string {

    if (keyObj.key === 'complete_nutrition_indicator' ||
      keyObj.key === 'iycf_counseling_caregivers'
      || keyObj.key === 'pregWomWeighed' || keyObj.key === 'sam_children_screened'
      || keyObj.key === 'admission_rate') {
      return `${(Number(value)).toFixed(2)}%`;
    }
    else if (keyObj.key === 'composite_index') {
      return (Number(value)).toFixed(2);
    }
    else if (keyObj.key === 'sam_screening_status') {
      return this.percentPipe.transform(value);
    }
    else if (keyObj.key === 'division' || keyObj.key === 'district' || keyObj.key === 'upazila') {
      return value;
    }
    else if (keyObj.key === 'period') {
      return this.datePipe.transform(parseTime(value), 'MMM,YYYY');
    }
    else {
      return value;
    }

  }
}
