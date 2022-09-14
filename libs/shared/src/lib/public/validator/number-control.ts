import { AbstractControl, ValidatorFn } from '@angular/forms';

export function NumberControlValidator(paramOptions: RowType,): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        // 匹配[0-100]之间正小数,小数位数最多2位
        let tempValue = control.value.replace(/,/g, '');
        if (isNaN(tempValue)) {
            return { numberControl: '请输入数字' };
        }
        tempValue = Number(parseFloat(tempValue));
        const y = String(tempValue).indexOf('.') + 1; // 获取小数点的位置
        const count = String(tempValue).length - y; // 获取小数点后的个数
        if (paramOptions.min >= tempValue) {
            return { numberControl: `您输入的数字应该大于${paramOptions.min}` };
        }
        if (paramOptions.max <= tempValue) {
            return { numberControl: `您输入的数字应该小于${paramOptions.max}` };
        }
        if (y > 0 && count > 2) {
            return { numberControl: `格式错误，请输入两位小数` };
        }
    };
}

export interface RowType {
    min: number;
    max: number;
}
