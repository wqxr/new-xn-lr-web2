import {AbstractControl, ValidatorFn} from '@angular/forms';

export function PassportValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        const re: RegExp = /^[\u4e00-\u9fa5]+[\u4e00-\u9fa5·]*$/; // 两个以上中文姓名，外国翻译过来的中文姓名很长，而且有个·
        const ok = re.test(control.value);
        return ok ? null : {passport: true};
    };
}
