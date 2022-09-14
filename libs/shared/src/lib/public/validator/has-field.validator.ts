import {AbstractControl, ValidatorFn} from '@angular/forms';
import {XnUtils} from '../../common/xn-utils';

/**
 * 检查value里是否含有指定的field
 * @returns {(control:AbstractControl)=>{}}
 * @constructor
 */
export function HasFieldValidator(field, error): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        if (control && control.value) {
            const value = JSON.parse(control.value);
            const ok = XnUtils.hasField(value, field);
            return ok ? null : {hasField: error};
        }
    };
}
