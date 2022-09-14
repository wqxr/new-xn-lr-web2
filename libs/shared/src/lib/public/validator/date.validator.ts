import {AbstractControl, ValidatorFn} from '@angular/forms';
import {XnUtils} from '../../common/xn-utils';

export function DateValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        const ok = XnUtils.toDateFromString(control.value);
        return ok ? null : {date: true};
    };
}
