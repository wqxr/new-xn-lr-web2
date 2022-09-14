import { AbstractControl, ValidatorFn } from '@angular/forms';

// 验证纳税人识别号格式
export function TaxNumberValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        const regArr = [
            /^[\da-z]{10,15}$/i,
            /^\d{6}[\da-z]{10,12}$/i,
            /^[a-z]\d{6}[\da-z]{9,11}$/i,
            /^[a-z]{2}\d{6}[\da-z]{8,10}$/i,
            /^\d{14}[\dx][\da-z]{4,5}$/i,
            /^\d{17}[\dx][\da-z]{1,2}$/i,
            /^[a-z]\d{14}[\dx][\da-z]{3,4}$/i,
            /^[a-z]\d{17}[\dx][\da-z]{0,1}$/i,
            /^[\d]{6}[\da-z]{13,14}$/i
        ];
        let ok = false;
        regArr.forEach(reg => {
            if (reg.test(control.value)) {
                ok = true;
                return ;
            }
        });
        return ok ? null : { taxNumber: true };
    };
}
