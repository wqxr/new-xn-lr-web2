import { AbstractControl, ValidatorFn } from '@angular/forms';

export function MobileTelValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        // 移动官网查实：
        // 134、135、136、137、138、139
        // 147
        // 150、151、152、157、158、159
        // 178
        // 182、183、184、187、188
        // 联通官网查实：
        // 130、131、132
        // 155、156
        // 176
        // 185、186
        // 电信官网查实：
        // 133
        // 153
        // 177
        // 180、181、189
        // 虚拟运营商
        // 170
        // 增加的
        // 166
        // 增加的
        // 199
        // 综合：
        // 130-139、147、150-153、155-159、170、173、176-178、180-189
        const mobile: RegExp = /^[1][0-9]{10}$/;
        const tel: RegExp = /^([0-9]{0,4}-)?[0-9]{7,8}$/; // 座机
        const ok = mobile.test(control.value) || tel.test(control.value);
        return ok ? null : { mobileTel: true };
    };
}
