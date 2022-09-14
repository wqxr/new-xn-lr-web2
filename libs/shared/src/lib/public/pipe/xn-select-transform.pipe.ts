/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：XnSelectTransformPipe
 * @summary：鍵值對匹配，将 [{label:'是',value:'1'}]枚举转换根据值value值显示鍵名label
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          重構                2019-05-19
 * **********************************************************************
 */
import { Pipe, PipeTransform } from '@angular/core';
import { SelectOptions } from '../../config/select-options';
import { isArray } from 'util';

/**
 *  将 [{label:'是',value:'1'}]枚举转换根据value 值显示label 标签 或者 string : ref 键值对在select-options 中的配置属性名
 */
@Pipe({ name: 'xnSelectTransform' })
export class XnSelectTransformPipe implements PipeTransform {
    /**
     * @param value 需要查找的值
     * @param param 为数列时，直接匹配对应的值，字符串时，在select-options 匹配对应的名稱
     */
    transform(value: any, param: any): string {
        return fnTransform(value, param);
    }
}

export function fnTransform(value: any, param: any): string {
    if (!param) {
        return '';
    }

    // 匹配對應鍵值
    const find: Option = (isArray(param) ? param : SelectOptions.get(param))
        .find((item: Option) =>
            Number(item.value) === Number(value) || (value && (item.value).toString() === value.toString()));
    return !!find ? find.label : '';
}

interface Option {
  label: string;
  value: any;
}
