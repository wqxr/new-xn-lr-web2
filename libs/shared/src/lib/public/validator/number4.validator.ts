import {AbstractControl, ValidatorFn} from '@angular/forms';

export function Number4Validator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        const re: RegExp = /^\d*$/;
        const ok = re.test(control.value.value);

        return ok ? null : {number4: true};
    };
}
