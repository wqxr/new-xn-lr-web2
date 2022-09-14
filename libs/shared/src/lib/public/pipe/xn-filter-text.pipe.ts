import { Pipe, PipeTransform } from '@angular/core';
import * as lodashall from 'lodash';

@Pipe({ name: 'xnFilterText' })
export class XnFilterTextPipe implements PipeTransform {
  transform(data: string, arr: any): any {
    arr = arr.filter(v => v !== '');
    for (let i = 0; i < arr.length; i++) {
      const specialCode = lodashall.escapeRegExp(arr[i]);
      data = data.replace(new RegExp(specialCode, 'g'), `<span class="red">${arr[i]}</span>`);
    }
    return data;
  }
}
