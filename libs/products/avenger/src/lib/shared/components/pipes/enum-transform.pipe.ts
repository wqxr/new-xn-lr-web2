/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：EnumTransformPipe
 * @summary：枚举转换为数组对象
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          增加功能1         2019-05-16
 * **********************************************************************
 */

import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'xnEnumTransform'
})
export class EnumTransformPipe implements PipeTransform {
    transform(value: any, args?: any): Array<{ label: string, value: string }> {
        return enumTransformFn(value, args);
    }

}

/**
 *  枚举转数组
 * @param value
 * @param arg
 * @constructor
 */
export function enumTransformFn(value: any, arg?: any): Array<{ label: string, value: string }> {
    return Object.keys(value).map(key => {
        return {label: key, value: value[key]};
    });
}
