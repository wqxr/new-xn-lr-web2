import {AbstractControl, ValidatorFn} from '@angular/forms';

export function InsNameValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        // const re: RegExp = /[\u4e00-\u9fa5（）()]{4,}/; // 非公司制企业可以命名为城市+名字+商店之类，如北京凌文商店（企业信用网可查）
        const re: RegExp = /^[\u4e00-\u9fa5（）\da-zA-Z&]{2,50}$/gi;
        const ok = re.test(control.value);
        return ok ? null : {insName: true};
    };
}
