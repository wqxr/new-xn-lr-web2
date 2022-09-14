/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：NullValueDisplayPipe
 * @summary：值为null || 未定义 显示为空字符
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          增加功能1         2019-05-18
 * **********************************************************************
 */

import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'xnNullValueDisplayPipe'
})

export class NullValueDisplayPipe implements PipeTransform {
    transform(value: any, ...args: any[]): any {
        return value === undefined || value === null ? '' : value;
    }
}
