import {AbstractControl, ValidatorFn} from '@angular/forms';
import {XnUtils} from '../../common/xn-utils';

export function MoneyValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        const ok = XnUtils.convertCurrency(control.value);
        return ok[0] ? null : {money: true};
    };
}
