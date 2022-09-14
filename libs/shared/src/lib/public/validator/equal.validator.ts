import {AbstractControl, ValidatorFn} from '@angular/forms';

/**
 * 用于校验两次密码是否相同
 * @param name  要相同的字段name
 * @param error 不相同时的错误描述
 * @returns {(control:AbstractControl)=>{}}
 * @constructor
 */
export function EqualValidator(name, error): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        let ok = false;
        const root = control.root;
        if (root) {
            const ctrl = root.get(name);
            ok = (ctrl && ctrl.value === control.value);
        }
        return ok ? null : {equal: error};
    };
}
