import {Pipe, PipeTransform} from '@angular/core';
import {isNullOrUndefined} from 'util';
import {SelectOptions} from '../../config/select-options';

@Pipe({name: 'xnInputShow'})
export class XnInputShowPipe implements PipeTransform {
    transform(data: any, row: any): string {
        console.log('xnInputShow', row);

        if (isNullOrUndefined(row) || isNullOrUndefined(row.data)) {
            return '未填写';
        } else {
            const data = row.data;
            if (row.type === 'radio') {
                if (data === '0' || data === 'false') {
                    return '否';
                } else if (data === '1' || data === 'true') {
                    return '是';
                } else {
                    return data;
                }
            } else if (row.type === 'select') { // select
                return SelectOptions.getLabel(row.selectOptions, row.data);
            } else if (row.type === 'picker') { // data picker
                const json = JSON.parse(data);
                return `${json.label || json}`;
            } else if (row.type === 'textarea') { // textarea
                return data;
            } else if (row.type === 'text') { // text
                return data;
            } else if (row.type === 'password') {
                return '********'; // 密码不显示
            } else {
                return data;
            }
        }
    }
}
