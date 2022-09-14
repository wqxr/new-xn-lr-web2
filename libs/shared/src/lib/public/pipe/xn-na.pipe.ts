import { Pipe, PipeTransform } from '@angular/core';

/** 空值过滤展示 */
@Pipe({ name: 'xnNA' })
export class XnNAPipe implements PipeTransform {
  transform(value: any): string {

    if (!value) {
      return '--'
    } else {
      return value
    }
  }
}
