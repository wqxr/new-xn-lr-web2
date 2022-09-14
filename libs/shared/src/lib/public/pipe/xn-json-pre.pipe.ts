/*
 * @Description: json代码格式化预览
 * @Version: 1.0
 * @Author: yutianbao
 * @Date: 2020-11-21 14:45:03
 * @LastEditors: yutianbao
 * @LastEditTime: 2020-11-21 14:59:22
 * @FilePath: \xn-lr-web2\libs\shared\src\lib\public\pipe\xn-json-pre.pipe.ts
 * @copyright: Copyright(C) 2017-2020, 深圳市链融科技股份有限公司
 */
import { isArray, isObject, isString } from 'util';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'xnJsonPre' })
export class XnJsonPrePipe implements PipeTransform {
    transform(json: any): any {
        return transFormatJson(json);
    }
}

export function transFormatJson(json: any) {
    // if (!json.match("^\{(.+:.+,*){1,}\}$")) {
    //     return json;  //判断是否是json数据，不是直接返回
    // }
    if (!isObject(json)) {
        return json;  //判断是否是json数据，不是直接返回
    }

    if (typeof json !== 'string') {
        json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    (match: string) => {
        let cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}
