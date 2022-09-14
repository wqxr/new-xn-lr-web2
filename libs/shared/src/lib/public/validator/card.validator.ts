import { AbstractControl, ValidatorFn } from '@angular/forms';
import { IDCardReg } from './valid.regexp';

export function CardValidator(name): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    const root = control.root;
    if (root) {
      const ctrl = root.get(name);
      if (
        (!!ctrl && !!(ctrl.value === '身份证' || Number(ctrl.value) === 0)) ||
        name === 'idCard' ||
        name === 'adminCardNo'
      ) {
        return IDCardReg.test(control.value) ? null : {card: '请输入合法的身份证号码'};
      }
      // else if (!!ctrl && !!(ctrl.value === '护照' || Number(ctrl.value) === 2)) {
      //     const re: RegExp = /(^[PSED]{1}\d{7}$)|(^[GS]{1}\d{8}$)/;
      //     const value = control.value.toUpperCase();
      //     const ok = re.test(value);
      //     return ok ? null : { card: '请输入合法的护照号码' };
      //  else if (!!ctrl && !!(Number(ctrl.value) === 1)) {
      //     const re: RegExp = /^[HM]\d{10}$/;
      //      const value = control.value;
      //     const ok = re.test(value);
      //     return ok ? null : { card: '请输入合法的港澳通行证号码' };
      // }
    }
  };
}
