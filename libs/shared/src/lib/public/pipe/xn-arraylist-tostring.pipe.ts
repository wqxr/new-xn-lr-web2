import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'xnArrayListToString',
})
export class ArrayListToStringPipe implements PipeTransform {
  transform(value: any, key?: string) {
    if (!value) {
      return '';
    }

    const obj =
      typeof value === 'string' ? value : JSON.parse(JSON.stringify(value));
    if (Array.isArray(obj)) {
      if (!!key) {
        if (key === 'index_value') {
          return obj.length > 0
            ? obj
                .map(
                  (obj, index) =>
                    `${index + 1}.${obj['index_name']}: <b>${
                      obj['index_value']
                    }</b>`
                )
                .join('<br/>')
            : '';
        } else {
          return obj.length > 0 ? obj.map((obj) => obj[key]).join('<br/>') : '';
        }
      } else {
        return obj.length > 0 ? obj.join('<br/>') : '';
      }
    }

    if (typeof value === 'string') {
      return obj.replace(/[\r\n\t\、]/g, '<br/>');
    }

    return '';
  }
}
