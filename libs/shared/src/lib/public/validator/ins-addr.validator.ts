import {AbstractControl, ValidatorFn} from '@angular/forms';

export function InsAddrValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        // 中文，可以包括括号，要求长度6个以上
        const re: RegExp = /^[\u4e00-\u9fa5（）()]+/;
        const ok = re.test(control.value);
        return ok ? null : {insAddr: true};
    };
}
