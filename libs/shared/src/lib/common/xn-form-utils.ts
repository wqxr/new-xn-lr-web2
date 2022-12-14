import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { SelectOptions } from '../config/select-options';
import { CardValidator } from '../public/validator/card.validator';
import { CfcaMobileValidator } from '../public/validator/cfca-mobile.validator';
import { CnNameValidator } from '../public/validator/cn-name.validator';
import { DateValidator } from '../public/validator/date.validator';
import { EmailValidator } from '../public/validator/email.validator';
import { EqualValidator } from '../public/validator/equal.validator';
import { HasFieldValidator } from '../public/validator/has-field.validator';
import { InsAddrValidator } from '../public/validator/ins-addr.validator';
import { InsNameValidator } from '../public/validator/ins-name.validator';
import { MobileValidator } from '../public/validator/mobile.validator';
import { MobileTelValidator } from '../public/validator/mobileTel.validator';
import { MoneyValidator } from '../public/validator/money.validator';
import { Money1Validator } from '../public/validator/money1.validator';
import { MustOneValidator } from '../public/validator/must-one.validator';
import { NumberControlValidator } from '../public/validator/number-control';
import { NumberValidator } from '../public/validator/number.validator';
import { Number2Validator } from '../public/validator/number2.validator';
import { Number3Validator } from '../public/validator/number3.validator';
import { Number4Validator } from '../public/validator/number4.validator';
import { SmsValidator } from '../public/validator/sms.validator';
import { TaxNumberValidator } from '../public/validator/tax-number.validator';
import { UserNameValidator } from '../public/validator/user-name.validator';
import { ZipValidator } from '../public/validator/zip.validator';
import { XnUtils } from './xn-utils';
import { Number5Validator } from '../public/validator/number5.validator';

export class XnFormUtils {
  static buildFormGroup(formConf: any[], formConf2?: any[]): FormGroup {
    const group: any = {} as any;

    XnFormUtils.buildFormGroup2(group, formConf);
    if (formConf2) {
      XnFormUtils.buildFormGroup2(group, formConf2);
    }

    return new FormGroup(group);
  }

  private static conv(v) {
    if (v === undefined || v === null) {
      return '';
    }
    switch (typeof v) {
      case 'number':
        return isNaN(v) ? '' : '' + v;
      case 'boolean':
        return v ? '1' : '0';
      default:
        return v;
    }
  }

  private static conv2(v1, v2) {
    if (v1 === undefined || v1 === null) {
      return this.conv(v2);
    } else {
      return this.conv(v1);
    }
  }

  private static buildFormGroup2(group: any, formConf: any[]) {
    for (const conf of formConf) {
      if (conf.childChecker && conf.childChecker.length) {
        const childGroup: any = {} as any;
        for (const childConf of conf.childChecker) {
          XnFormUtils.convertChecker(childConf);
        }
        this.buildFormGroup3(childGroup, conf.childChecker);
        group[conf.checkerId] = new FormGroup(childGroup);
      } else {
        this.buildFormGroup3(group, [conf]);
      }
    }
  }

  private static buildFormGroup3(group: any, formConf: any[]) {
    for (const conf of formConf) {
      // console.log('buildFormGroup2', conf.name, conf);

      // show???????????????FormControl
      if (conf.type === 'show') {
        continue;
      }

      // ?????????????????????
      if (conf.required !== false && conf.required !== 0) {
        conf.required = true;
      } else {
        conf.required = false;
      }

      if (conf.options && conf.options.readonly) {
        // ???????????????????????????
        group[conf.name] = new FormControl({
          value: this.conv2(conf.value, conf.options.value),
          disabled: true,
        });
        continue;
      }
      const validators = [];
      if (conf.required !== false) {
        const fn = XnFormUtils.buildValidator('required', conf.required);
        if (fn) {
          validators.push(fn);
        }
      }
      if (conf.validators) {
        for (const key in conf.validators) {
          if (conf.validators.hasOwnProperty(key)) {
            const fn = XnFormUtils.buildValidator(key, conf.validators[key]);
            if (fn) {
              validators.push(fn);
            }
          }
        }
      }

      // ??????
      if (
        (conf.type === 'invoice' || conf.type === 'bank-invoice') &&
        (conf.options.mode === 'edit' || conf.options.mode === 'upload_edit') &&
        conf.required
      ) {
        const fn = XnFormUtils.buildValidator('hasField', {
          name: 'status',
          error: '?????????????????????',
        });
        if (fn) {
          validators.push(fn);
        }
      }

      // ??????
      if (
        (conf.type === 'honour' || conf.type === 'bank-honour') &&
        (conf.options.mode === 'edit' || conf.options.mode === 'upload_edit') &&
        conf.required
      ) {
        const fn = XnFormUtils.buildValidator('hasField', {
          name: 'honourAmount',
          error: '?????????????????????',
        });
        if (fn) {
          validators.push(fn);
        }
      }

      // ??????
      if (
        (conf.type === 'contract' || conf.type === 'bank-contract') &&
        (conf.options.mode === 'edit' || conf.options.mode === 'upload_edit') &&
        conf.required
      ) {
        const fn = XnFormUtils.buildValidator('hasField', {
          name: 'contractNum',
          error: '?????????????????????',
        });
        if (fn) {
          validators.push(fn);
        }
      }
      if (conf.type === 'number-control') {
        const fn = XnFormUtils.buildValidator('isNumberFixed', conf);
        if (fn) {
          validators.push(fn);
        }
      }

      group[conf.name] = new FormControl(this.conv(conf.value), validators);
      // ??????????????????
      if (
        !!conf.validators &&
        !!conf.validators.card &&
        !!conf.validators.card.name
      ) {
        group[conf.validators.card.name].valueChanges.subscribe((v) => {
          const ctrl = group[conf.name];
          ctrl.updateValueAndValidity();
        });
      }
    }
  }

  static buildValidator(key, value) {
    switch (key) {
      case 'required':
        if (value === true || value === 1) {
          return Validators.required;
        }
        return null;

      case 'minlength':
        return Validators.minLength(value);

      case 'maxlength':
        return Validators.maxLength(value);

      case 'mobile':
        return MobileValidator();
      case 'cfcaMobile':
        return CfcaMobileValidator();
      case 'mobileTel':
        return MobileTelValidator();

      case 'taxNumber':
        return TaxNumberValidator();

      case 'equal':
        return EqualValidator(value.name, value.error);

      case 'number':
        return NumberValidator();

      case 'number2':
        return Number2Validator();

      case 'number3':
        return Number3Validator();

      case 'number4':
        return Number4Validator();

      case 'number5':
        return Number5Validator();

      case 'money1':
        return Money1Validator();

      case 'sms':
        return SmsValidator(value.name, value.error);

      case 'hasField':
        return HasFieldValidator(value.name, value.error);

      case 'insName':
        return InsNameValidator();

      case 'userName':
        return UserNameValidator();

      case 'insAddr':
        return InsAddrValidator();

      case 'zip':
        return ZipValidator();

      case 'cnName':
        return CnNameValidator();

      case 'email':
        return EmailValidator();

      case 'card':
        return CardValidator(value.name);
      case 'cards':
        return CardValidator(value.name);

      case 'mustOne':
        return MustOneValidator(value);

      case 'date':
        return DateValidator();
      case 'money':
        return MoneyValidator();
      case 'isNumberFixed':
        return NumberControlValidator(value.options.size);
      default:
        return null;
    }
  }

  static buildValidatorErrorString(ctrl: AbstractControl): string {
    return XnFormUtils.buildValidatorErrors(ctrl).join('; ');
  }

  static buildValidatorErrors(ctrl: AbstractControl): string[] {
    if (ctrl.validator !== null && ctrl.touched && ctrl.invalid) {
      return XnFormUtils.buildValidatorAlert(ctrl.errors);
    } else {
      return [];
    }
  }

  static buildValidatorAlert(errors): string[] {
    // console.log('erres', errors);
    const ret: string[] = [];
    let count = 0;
    for (const key in errors) {
      if (errors.hasOwnProperty(key)) {
        ++count;
      }
    }

    // tslint:disable-next-line:forin
    for (const key in errors) {
      // console.log(key);
      if (key === 'required') {
        if (count === 1) {
          // ??????1?????????????????????????????????????????????
          ret.push('????????????');
        }
      } else if (key === 'minlength') {
        ret.push(`????????????${errors[key].requiredLength}?????????`);
      } else if (key === 'maxlength') {
        ret.push(`????????????${errors[key].requiredLength}?????????`);
      } else if (key === 'mobile') {
        ret.push(`??????????????????11????????????`);
      } else if (key === 'cfcamobile') {
        ret.push(
          '????????????????????????????????????????????????(167???170???171??????????????????????????????'
        );
      } else if (key === 'mobileTel') {
        ret.push(`???????????????????????????????????????11?????????`);
      } else if (key === 'taxNumber') {
        ret.push(`?????????????????????????????????`);
      } else if (key === 'equal') {
        ret.push(errors[key]);
      } else if (key === 'number') {
        ret.push('???????????????');
      } else if (key === 'number2') {
        ret.push('??????????????????????????????????????????');
      } else if (key === 'number3') {
        ret.push('???????????????????????????????????????2?????????');
      } else if (key === 'number4') {
        ret.push('???????????????');
      } else if (key === 'number5') {
        ret.push('???????????????????????????????????????2?????????');
      } else if (key === 'sms') {
        ret.push(errors[key]);
      } else if (key === 'hasField') {
        ret.push(errors[key]);
      } else if (key === 'insName') {
        ret.push(`???????????????????????????????????????`);
      } else if (key === 'insAddr') {
        ret.push(`????????????????????????????????????`);
      } else if (key === 'zip') {
        ret.push(`?????????6?????????????????????`);
      } else if (key === 'cnName') {
        ret.push(`????????????????????????????????????????????????`);
      } else if (key === 'email') {
        ret.push(`??????????????????????????????`);
      } else if (key === 'card') {
        ret.push(errors[key]);
      } else if (key === 'mustOne') {
        ret.push(errors[key]);
      } else if (key === 'money') {
        ret.push(`????????????????????????`);
      } else if (key === 'money1') {
        // ret.push('???????????????????????????????????????2?????????');
        ret.push(errors[key]);
      } else if (key === 'date') {
        ret.push(`?????????20170731???????????????`);
      } else if (key === 'noCheck') {
        ret.push(`?????????????????????`);
      } else if (key === 'overMaxInvoice') {
        ret.push(`?????????????????????????????????????????????`);
      } else if (key === 'duplicateVerification') {
        ret.push(`??????????????????????????????????????????,????????????`);
      } else if (key === 'customer') {
        ret.push(errors[key]);
      } else if (key === 'numberControl') {
        ret.push(errors[key]);
      } else if (key === 'userName') {
        ret.push(`??????????????????????????????`);
      } else if (key === 'pattern') {
        ret.push(`????????????????????????`);
      }
    }

    return ret;
  }

  static getClass(ctrl: AbstractControl) {
    if (ctrl.validator !== null && ctrl.touched) {
      if (ctrl.valid) {
        return 'xn-control-valid';
      } else {
        return 'xn-control-invalid';
      }
    } else {
      return '';
    }
  }
  static buildSelectOptions(rows: any[]) {
    for (const row of rows) {
      if (row.checkerId === 'flowId') {
      }
      if (row.selectOptions && !(row.selectOptions instanceof Array)) {
        row.selectOptions = SelectOptions.get(row.selectOptions);
      }
    }
  }
  /**
   * ?????????????????????????????????boolean
   * @param checker checker??????
   * @returns true or false
   */
  static isSelectTypes(checker) {
    return (
      checker.type === 'select' ||
      checker.type === 'dselect' ||
      checker.type === 'mselect' ||
      checker.type === 'multiselect' ||
      checker.type === 'tselect' ||
      checker.type === 'select1' ||
      checker.type === 'linkage-select' ||
      checker.type === 'link-selectInput' ||
      checker.type === 'vanke-select' ||
      checker.type === 'qrs-select-file' ||
      checker.type === 'machine-tradetype' ||
      checker.type === 'samp-select-text' ||
      checker.type === 'samp-select-number' ||
      checker.type === 'samp-select-amount' ||
      checker.type === 'select-text' ||
      checker.type === 'text-qd' ||
      checker.type === 'multip-linkage-select' ||
      checker.type === 'status-display' ||
      checker.type === 'businessRelated' ||
      checker.type === 'linkage-select-jd' ||
      checker.type === 'linkage-select-yjl' ||
      checker.type === 'label-select' ||
      checker.type === 'dragon-cascader-search' ||
      checker.type === 'dragon-select-search' ||
      checker.type === 'multiple-two-select'
    );
  }
  /**
   * ???????????????checker???????????????????????????select?????????options??????
   * @param checker checker
   * @param svrConfig svrConfig
   * @returns checker checker
   */
  static convertChecker(checker: any, svrConfig?: any): any {
    checker.name = checker.checkerId;
    checker.options = XnUtils.parseObject(checker.options);
    checker.validators = XnUtils.parseObject(checker.validators);
    if (this.isSelectTypes(checker)) {
      if (!!checker.options.ref) {
        // selectOptions?????????ref?????????
        checker.selectOptions = SelectOptions.get(checker.options.ref);
      } else {
        checker.selectOptions =
          checker.selectOptions && checker.selectOptions.length
            ? checker.selectOptions
            : SelectOptions.get('defaultRadio');
      }
    } else if (
      checker.type === 'radio' ||
      checker.type === 'radio-billingType'
    ) {
      // radio?????????selectOptions
      if (checker.options.ref) {
        checker.selectOptions = SelectOptions.get(checker.options.ref);
      } else {
        checker.selectOptions =
          checker.selectOptions && checker.selectOptions.length
            ? checker.selectOptions
            : SelectOptions.get('defaultRadio');
      }
    } else if (checker.type === 'checkbox') {
      // radio?????????selectOptions
      if (checker.options.ref) {
        checker.selectOptions = SelectOptions.get(checker.options.ref);
      } else {
        checker.selectOptions =
          checker.selectOptions && checker.selectOptions.length
            ? checker.selectOptions
            : SelectOptions.get('defaultCheckbox');
      }
    } else if (checker.type === 'sms') {
      checker.smsType = parseInt(checker.options.ref, 10);
    } else if (
      checker.type === 'invoice' ||
      checker.type === 'honour' ||
      checker.type === 'conditions' ||
      checker.type === 'bank-invoice' ||
      checker.type === 'bank-honour' ||
      checker.type === 'supervisor' ||
      checker.type === 'check'
    ) {
      // ?????? ?????? ?????? ??????
      const ref = checker.options.ref;
      console.log('?????? ?????? ?????? ??????ref: ', ref);
      if (!!ref && !!svrConfig) {
        const [procedureId, checkerId] = ref.split('.');

        // ?????????????????????????????????
        for (let i = svrConfig.actions.length - 1; i >= 0; --i) {
          const action = svrConfig.actions[i];
          if (action.procedureId === procedureId) {
            for (const c of action.checkers) {
              if (c.checkerId === checkerId) {
                checker.value = c.data;
                break;
              }
            }
            break;
          }
        }
      }
    } else if (
      checker.type === 'contract' ||
      checker.type === 'bank-contract'
    ) {
      // ?????? ?????? ?????? ??????
      const ref = checker.options.ref;
      if (!!ref && !!svrConfig) {
        const [procedureId, checkerId] = ref.split('.');

        // ?????????????????????????????????
        for (let i = svrConfig.actions.length - 1; i >= 0; --i) {
          const action = svrConfig.actions[i];
          if (action.procedureId === procedureId) {
            for (const c of action.checkers) {
              if (c.checkerId === checkerId) {
                // checker.value = c.data;
                if (checker.flowId === 'financing_platform5') {
                  const cData = JSON.parse(c.data);
                  const checkerValue = JSON.parse(checker.value);
                  for (let a = 0; a < cData.length; a++) {
                    for (const b in checkerValue[a]) {
                      if (checkerValue[a].hasOwnProperty(b)) {
                        if (cData[a][b] === undefined) {
                          cData[a][b] = '';
                          cData[a][b] = checkerValue[a][b];
                        }
                      }
                    }
                  }
                  checker.value = JSON.stringify(cData);
                } else {
                  checker.value = c.data;
                }
                break;
              }
            }
            break;
          }
        }
      }
    } else if (checker.type === 'money') {
      if (checker && checker.data) {
        // console.log('prev: ' + checker.data);
        let num = checker.data;
        let numTemp = 0;

        // ?????????????????????
        if (parseInt(num.toString().indexOf('-'), 10) !== -1) {
          numTemp = -1;
          num = num.replace(/-/g, '');
        }
        // ?????????????????????
        if (parseInt(num.toString().indexOf('.'), 10) !== -1) {
          const regArrTemp = num.split('.');
          const regArrFirstTemp = regArrTemp[0];
          num = num.replace(/^0/, '');
          const regArr = num.split('.');
          regArr[0] = regArr[0].replace(/^0+/, ''); // ?????????????????????0
          regArr[0] = regArr[0]
            .replace(/,/g, '')
            .split('')
            .reverse()
            .join('')
            .replace(/(\d{3})/g, '$1,')
            .replace(/\,$/, '')
            .split('')
            .reverse()
            .join('');
          num = regArr.join('.');
          num = parseInt(regArrFirstTemp, 10) === 0 ? '0' + num : num; // ?????????????????????0.x???????????????
        } else {
          if (parseInt(num, 10) !== 0) {
            num = num.replace(/^0+/, ''); // ?????????0??????0??????
          } else {
            num = num.replace(/^0+/, '0'); // ???0?????????1???0
          }
          num = num
            .replace(/,/g, '')
            .split('')
            .reverse()
            .join('')
            .replace(/(\d{3})/g, '$1,')
            .replace(/\,$/, '')
            .split('')
            .reverse()
            .join('');
        }
        if (numTemp === -1) {
          num = '-' + num;
        }
        checker.data = num;
      }
    } else if (checker.type === 'account-info') {
      const isVirtual = XnUtils.parseObject(checker.value).isVirtual;
      checker.isVirtual = isVirtual;
      svrConfig.isVirtual = isVirtual;
      return checker;
    } else if (checker.type === 'common-plat-contract') {
      // TODO: ???????????????????????????????????????
      // console.log('common-plat-contract', checker);
    }
    return checker;
  }
}
