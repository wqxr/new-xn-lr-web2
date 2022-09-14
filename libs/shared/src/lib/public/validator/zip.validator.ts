import {AbstractControl, ValidatorFn} from '@angular/forms';

export function ZipValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        const re: RegExp = /^[0-9]\d{5}$/;
        const ok = re.test(control.value);
        return ok ? null : {zip: true};
    };
}
