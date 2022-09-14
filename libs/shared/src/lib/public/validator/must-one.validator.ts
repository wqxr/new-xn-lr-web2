import {AbstractControl, ValidatorFn} from '@angular/forms';
import {XnUtils} from '../../common/xn-utils';

/**
 * @constructor
 */
export function MustOneValidator(fields: string[]): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        const root = control.root;
        if (!root) {
            return {mustOne: '请至少填写一项'};
        }

        if (!!control && control.valid && !XnUtils.isEmpty(control.value)) {
            for (const field of fields) {
                const ctrl = root.get(field);
                if (ctrl && !ctrl.valid) {
                    ctrl.updateValueAndValidity();
                }
            }
            return null;
        }

        for (const field of fields) {
            const ctrl = root.get(field);
            if (!!ctrl && ctrl.valid && !XnUtils.isEmpty(ctrl.value)) {

                for (const field2 of fields) {
                    if (field2 !== field) {
                        const ctrl2 = root.get(field2);
                        if (ctrl2 && !ctrl2.valid) {
                            ctrl2.updateValueAndValidity();
                        }
                    }
                }

                return null;
            }
        }

        return {mustOne: '请至少填写一项'};
    };
}
