/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：PdfViewService
 * @summary：table自定义排序
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                    yu        table自定义排序        2019-03-25
 * **********************************************************************
 */

import { Injectable } from '@angular/core';
declare let $: any;

@Injectable({ providedIn: 'root' })
export class DragonTableSortService {
    /**
     *
     * @param arr 排序的table数组
     * @param sortParam  [数组对应对象属性值,asc/desc]
     */
    public tableSort(arr: any[], sortParam: string): any[] {
        const property = sortParam.split(',')[0];
        const sequence = sortParam.split(',')[1];
        for (let j = 0; j < arr.length - 1; j += 1) {
            // 两两比较，如果前一个比后一个大，则交换位置。
            for (let i = 0; i < arr.length - 1 - j; i += 1) {
                // 取出数组对应属性进行排序(升序)
                const code = this.compareString(arr[i][property], arr[i + 1][property]);
                if (code === 1) {
                    const temp = arr[i];
                    arr[i] = arr[i + 1];
                    arr[i + 1] = temp;
                }
            }
        }
        if (sequence === 'desc') {
            arr.reverse();
        }
        return arr;
    }
    // code从-1至1依次是str1排在str2后，相等，前
    private compareString(str1, str2) {
        const str1Length = str1.length;
        const str2Length = str2.length;
        const moneyRep = /^(^[1-9](\d+)?(\.\d{1,2})?$)|(^0$)|(^\d\.\d{1,2}$)$/;
        const StringLength = Math.min(str1Length, str2Length);
        let StringCode: number;
        let code = 0;
        // 字符串长度短的，排序靠前
        if (StringLength > 0) {
            // 金额
            if (moneyRep.test(str1) && moneyRep.test(str2)){
                return (parseFloat(str1) - parseFloat(str2) <= 0) ? -1 : 1;
            }
            for (let i = 0; i < StringLength; i += 1) {
                StringCode = this.compareCharacter(str1[i], str2[i]);
                if (StringCode === -1) {
                    code = -1;
                    break;
                } else if (StringCode === 1) {
                    code = 1;
                    break;
                } else {
                    code = 0;
                }
            }

            if (code === 0 && str1Length !== str2Length) {
                code = str1Length - str2Length <= -1 ? 1 : -1;
            }
        } else {// 对于空字符 串单独处理
            code = 0;
            if (code === 0 && str1Length !== str2Length) {
                code = str1Length - str2Length <= -1 ? 1 : -1;
            }
        }
        return code;
    }
    // 单字符排序，优先级：（特殊字符>数字>英文字母>汉字）
    private compareCharacter(Letter1, Letter2) {
        const Letter1TypeNum = this.DetermineType(Letter1);
        const Letter2TypeNum = this.DetermineType(Letter2);
        let before: any;
        let after: any;
        let flag: boolean;
        let code: number;
        // 不同类型排序
        if (Letter1TypeNum !== Letter2TypeNum) {
            flag = Letter1TypeNum < Letter2TypeNum;
            code = flag ? 1 : -1;
        } else {
            // 同类型对比
            if (Letter1TypeNum === 0) {
                code = Letter1 === Letter2 ? 0 : -1;
            }

            if (Letter1TypeNum === 1) {
                before = Letter1;
                after = Letter2;
            }
            // 不区分大小写，依据英文字母Unicode码大小排序，a-z的Unicode码依次增加
            if (Letter1TypeNum === 2) {
                // before = Letter1.toLocaleLowerCase().charCodeAt(0);
                // after = Letter2.toLocaleLowerCase().charCodeAt(0);
                before = Letter1.charCodeAt(0);
                after = Letter2.charCodeAt(0);

            }
            if (Letter1TypeNum === 3) {
                // 转换成汉字对应拼音的首字母进行比较
                // before = this.getFirstLetter(Letter1).toLocaleLowerCase().charCodeAt(0);
                // after = this.getFirstLetter(Letter2).toLocaleLowerCase().charCodeAt(0);
                return Letter1.localeCompare(Letter2);
            }
            if (before && after) {
                if (before > after) {
                    code = 1;
                } else if (before === after) {
                    code = 0;
                } else {
                    code = -1;
                }
            }
        }
        return code;
    }
    // 判断单字符类型，返回值0到3依次是特殊字符，数字，字母，汉字类型
    private DetermineType(Letter) {
        // 判断类型
        const isNum = !isNaN(Letter);
        const isLetter = /[_a-zA-Z]/.test(Letter);
        const isChinese = !/[^\u4E00-\u9FA5]/.test(Letter);
        let typeNum: number;
        if (isNum) {
            typeNum = 1;
        } else if (isLetter) {
            typeNum = 2;
        } else if (isChinese) {
            typeNum = 3;
        } else {
            typeNum = 0;
        }
        return typeNum;
    }

    // 返回汉字拼音首字母（大写）
    // private getFirstLetter(str) {
    //     let pinyin_dict_firstletter = {} as any;
    //     // 拼音首字母字典文件
    //     pinyin_dict_firstletter['all'] = ""
    //     let dict = {} as any;
    //     if (!str || /^ +$/g.test(str)) return '';
    //     dict['firstletter'] = pinyin_dict_firstletter;
    //     if (dict['firstletter']) // 使用首字母字典文件
    //     {
    //         let result = [];
    //         for (let i = 0; i < str.length; i++) {
    //             let unicode = str.charCodeAt(i);
    //             let ch = str.charAt(i);
    //             if (unicode >= 19968 && unicode <= 40869) {
    //                 ch = dict['firstletter'].all.charAt(unicode - 19968);
    //             }
    //             result.push(ch);
    //         }
    //         return result.join('');
    //     }
    // }


}
