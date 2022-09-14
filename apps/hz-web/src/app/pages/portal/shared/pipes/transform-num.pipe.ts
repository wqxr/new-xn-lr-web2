import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'transformNum'
})

// 将数字串转换成带逗号的显示方式
export class TransformNumPipe implements PipeTransform {
  transform(value: number | string, ...args: any[]): string | number {
    if (!value) { return 0; }
    if (+value > Math.pow(10, 10)) { return '99,999,999,999+'; }
    if (!/^([+\-])?(\d+)(\.\d+)?$/.test(`${value}`)){
      return `${value}`;
    }
    const a = RegExp.$1;
    let b = RegExp.$2;
    const c = RegExp.$3;
    // @ts-ignore
    const re = new RegExp().compile('(\\d)(\\d{3})(,|$)');
    while (re.test(b)) {
      b = b.replace(re, '$1,$2$3');
    }
    return `${a}${b}${c}`;
  }
}
