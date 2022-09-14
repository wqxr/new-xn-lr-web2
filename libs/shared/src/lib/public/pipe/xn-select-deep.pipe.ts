/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：XnSelectTransformPipe
 * @summary：鍵值對匹配，将 [{label:'是',value:'1',children:[{...}]}]枚举转换根据值value值显示鍵名label
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          重構                2019-05-19
 * **********************************************************************
 */
import { Pipe, PipeTransform } from '@angular/core';
import { SelectOptions } from '../../config/select-options';

/**
 *  将 [{label:'是',value:'1',children:[{...}]}]枚举转换根据value 值显示label 标签 或者 string : ref 键值对在select-options 中的配置属性名
 */
@Pipe({ name: 'xnSelectDeepTransform' })
export class XnSelectDeepTransformPipe implements PipeTransform {
  /**
   *  param 为数列时，直接匹配对应的值，字符串时，在select-options 匹配对应的名稱
   * @param value  |前传值
   * @param param  |后传值
   */
  transform(value: any, param: any): string {
    return fnTransform(value, param);
  }
}

export function fnTransform(value: any, param: any): string {
  if (!param || !value) {
    return '';
  }
  const obj = $.extend(true, {}, value);
  /** 如果param传入了option直接取param，没有则去SelectOptions匹配 */
  const options: any[] = Array.isArray(param) ? param : SelectOptions.get(param);
  // 渠道
  const currentLabel = options.find((item: any) =>
    Number(item.value) === Number(obj.type) || (obj.type && (item.value).toString() === obj.type.toString()))?.label || '';
  // chilren options
  const children = options.find((pro: any) =>
    Number(pro.value) === Number(obj.type) || (obj.type && (pro.value).toString() === obj.type.toString()))?.children || [];
  // 资金方
  const chidLabel = children.find((child: any) =>
    Number(child.value) === Number(obj.selectBank) || (obj.selectBank && (child.value).toString() === obj.selectBank.toString()))?.label || '';

  return chidLabel ? (currentLabel + '-' + chidLabel) : currentLabel;
}
