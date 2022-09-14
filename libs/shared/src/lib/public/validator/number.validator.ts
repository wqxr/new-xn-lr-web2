import {AbstractControl, ValidatorFn} from '@angular/forms';

export function NumberValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        const re: RegExp = /^\d*$/;
        const ok = re.test(control.value);
        return ok ? null : {number: true};
    };
}
