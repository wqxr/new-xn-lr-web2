import {Pipe, PipeTransform} from '@angular/core';

/**
 *  将枚举类型转换为[{label:string,value:string}];
 */
@Pipe({name: 'xnSelectItem'})
export class XnEnumSelectItemPipe implements PipeTransform {
    transform(obj: any, item?: any): any[] {
        const selectItem = [];
        const newMap = new Map();
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                newMap.set(key, obj[key]);
            }
        }
        newMap.forEach((key, value) => {
            if (typeof key !== 'number') {
                selectItem.push({label: key, value});
            }
        });
        return selectItem;
    }
}
