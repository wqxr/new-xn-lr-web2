import {AbstractControl, ValidatorFn} from '@angular/forms';
import {XnUtils} from '../../common/xn-utils';

/**
 * 短信验证码
 * @param name  手机号字段name
 * @param error 手机号码invalid的错误描述
 * @returns {(control:AbstractControl)=>{}}
 * @constructor
 */
export function SmsValidator(name, error): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        if (XnUtils.isEmpty(name)) {
            return null;
        }

        let ok = false;
        const root = control.root;
        if (root) {
            const ctrl = root.get(name);
            ok = (ctrl && ctrl.valid);
        }
        return ok ? null : {sms: error};
    };
}
