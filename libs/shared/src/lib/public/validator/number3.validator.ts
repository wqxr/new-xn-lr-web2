import {AbstractControl, ValidatorFn} from '@angular/forms';

export function Number3Validator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        // 匹配[0-100)之间正小数,小数位数最多2位(不超过100,需要包括100的用number5)
        const re: RegExp = /^(^[1-9](\d)?(\.\d{1,2})?$)|(^0$)|(^\d\.\d{1,2}$)$/;
        const ok = re.test(control.value);
        return ok ? null : {number3: true};
    };
}
