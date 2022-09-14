import {AbstractControl, ValidatorFn} from '@angular/forms';

export function Number5Validator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        // 匹配(0-100]之间正小数,小数位数最多2位
        const re: RegExp = /^(([1-9][0-9]|[1-9])(\.\d{1,2})?|0\.\d{1,2}|100)$/;
        const ok = re.test(control.value);
        return ok ? null : {number5: true};
    };
}
