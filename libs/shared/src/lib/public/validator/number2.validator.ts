import {AbstractControl, ValidatorFn} from '@angular/forms';

export function Number2Validator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        // 匹配正负整数，正负小数，%
        const re: RegExp = /^(\-|\+)?\d+(\.\d+)?%?$/;
        const ok = re.test(control.value);
        return ok ? null : {number2: true};
    };
}
