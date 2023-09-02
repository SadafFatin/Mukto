import { Pipe, PipeTransform } from '@angular/core';
/*
 If the value is null change it to N/A
*/
@Pipe({name: 'nullDecorator'})
export class NullDecoratorPipe implements PipeTransform {
  transform(value: any): string {
    return  value? value : 'N/A';
  }
}
