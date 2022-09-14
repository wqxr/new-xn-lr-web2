import {AbstractControl, ValidatorFn} from '@angular/forms';
import { XnUtils } from '../../common/xn-utils';

export function Money1Validator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        // 匹配[0-100]之间正小数,小数位数最多2位
        const re: RegExp = /^(^[1-9](\d+)?(\.\d{1,2})?$)|(^0$)|(^\d\.\d{1,2}$)$/;
        const filterCommaVal = !XnUtils.isEmptys(control.value, [0]) ? String(control.value).replace(/,/g, '') : '0';
        const isNumber = XnUtils.isNumber(filterCommaVal, true);
        if (!isNumber){
            return { money1: `格式错误，只能包含数字和小数点` };
        }
        const isNumberFixed = re.test(filterCommaVal);
        if (!isNumberFixed){
            return { money1: `请输入正确的金额，支持最多2位小数` };
        }
        // const isCurrency = XnUtils.convertCurrency(filterCommaVal);
        // if (!isCurrency[0]){
        //     return { money1: isCurrency[1] };
        // }
        const s = moneyParse(filterCommaVal);
        if (!!s.errFlag){
            return { money1: s.errMsg };
        }
        return null;
    };
}

/** 货币精度 */
const Precision = 100;
/** 最大值 */
const MAX_VALUE = Number.MAX_SAFE_INTEGER / Precision;
/** 最小值 */
const MIN_VALUE = Number.MIN_SAFE_INTEGER / Precision;

/**
 * 解析货币，只保留两位小数
 * 要求值的范围在[90071992547409.91,-90071992547409.91]，超过该值，则视为出错
 * @param {number|string} paramValue 传入的值，只支持字符串和数字
 * @return {{value: number, errFlag: boolean, errMsg: string}} 解析后的结果
 */
function moneyParse(paramValue: number | string): {value: number,  errFlag: boolean, errMsg: string} {
    const r = { value: 0,  errFlag: false, errMsg: ''};
    if (typeof paramValue === 'number') {
        if (paramValue > MAX_VALUE || paramValue < MIN_VALUE) {
            r.errFlag = true;
            r.errMsg = `${paramValue}超出有效范围[${MIN_VALUE},${MAX_VALUE}]`;
            return r;
        }
        r.value = Math.round(paramValue * Precision);
    } else if (typeof paramValue === 'string') {
        r.value = Number.parseFloat(paramValue);
        if (Number.isNaN(r.value)) {
            r.errFlag = true;
            r.errMsg  = `${paramValue}不是有效的数字！`;
            return r;
        } else if (r.value > MAX_VALUE || r.value < MIN_VALUE) {
            r.errFlag = true;
            r.errMsg  = `${paramValue}超出有效范围[${MIN_VALUE},${MAX_VALUE}]`;
            return r;
        }
        r.value = Math.round(r.value * Precision);
    } else if (paramValue === undefined || paramValue === null) {
        r.value = 0;
    } else {
        r.value   = 0;
        r.errFlag = true;
        r.errMsg  = `${paramValue}不是数字(number)或字符串类型(string)`;
    }
    return r;
}
