import {AbstractControl, ValidatorFn} from '@angular/forms';
import {XnUtils} from '../../common/xn-utils';

/**
 * 全部为全角
 * @constructor
 */
export function CnNameValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        const ok = XnUtils.fullOrHalf(control.value);
        return ok ? null : {cnName: true};
    };
}
