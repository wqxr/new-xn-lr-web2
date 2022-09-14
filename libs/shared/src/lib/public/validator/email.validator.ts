import {AbstractControl, ValidatorFn} from '@angular/forms';
import { EmailReg } from './valid.regexp';

export function EmailValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        return EmailReg.test(control.value) ? null : {email: true};
    };
}
