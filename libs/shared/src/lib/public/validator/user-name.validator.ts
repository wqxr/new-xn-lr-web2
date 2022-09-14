import { AbstractControl, ValidatorFn } from '@angular/forms';

export function UserNameValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        // const re: RegExp = /[\u4e00-\u9fa5（）()]{4,}/; // 非公司制企业可以命名为城市+名字+商店之类，如北京凌文商店（企业信用网可查）
        const re: RegExp =   /^[\u4E00-\u9FA5]{1,16}$/;
        const ok = re.test(control.value);
        return ok ? null : { 'userName': true };
    };
}