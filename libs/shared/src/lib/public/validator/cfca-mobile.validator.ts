import { AbstractControl, ValidatorFn } from '@angular/forms';

export function CfcaMobileValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        const re: RegExp =
            /^[1][0-9]{10}$/;
        const okmobile = re.test(control.value);
        const RegExp1 = /^(167|170|171)\d{8}?$/;
        const ok = RegExp1.test(control.value);
        if (!okmobile) {
            return { mobile: true };
        } else if (ok) {
            return { cfcamobile: true };
        } else {
            return null;
        }
    };
}
