/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\account-system\src\lib\pages\my-account\supply-account-info\add-bank-modal.component.ts
 * @summary：新增银行账户
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                HuCongying           init           2021-11-01
 ***************************************************************************/
import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@lr/ngx-formly';
import { AreaLevelEnum, RetCodeEnum } from 'libs/shared/src/lib/config/enum';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { Observable } from 'rxjs';

@Component({
  template: `
    <xn-account-form-modal
      [form]="modelForm"
      title="新增账号"
      [width]="860"
      [isVisible]="isVisible"
      [fields]="formFields"
      [options]="modalOptions"
      [model]="formModel"
      [modalFooter]="cFooter"
      [maskClosable]="false"
      (cancel)="closeModal()"
    >
      <ng-template #cFooter>
        <button nz-button nzType="default" (click)="closeModal()">取消</button>
        <button
          nz-button
          nzType="primary"
          [nzLoading]="isLoading"
          [disabled]="!modelForm?.valid"
          (click)="modalOK()"
        >
          提交
        </button>
      </ng-template>
    </xn-account-form-modal>
  `,
  styles: [
    `
      ::ng-deep .ant-card-head-title {
        font-weight: bold;
      }
      ::ng-deep .ant-modal-body {
        max-height: 500px;
        overflow-y: scroll;
      }
      ::ng-deep .ant-modal-close .ant-modal-close-x {
        padding: 15px;
      }
    `,
  ],
})
export class XnAddBankModalComponent implements OnInit, AfterViewChecked {
  // modelForm
  modelForm = new FormGroup({});
  // formModel
  formModel: any = {};
  // formModel
  formFields: FormlyFieldConfig[] = [
    {
      className: 'ant-col ant-col-md-24 ant-col-sm-24',
      wrappers: ['form-field-horizontal'],
      key: 'accountName',
      type: 'input',
      defaultValue: this.xn.user.orgName,
      templateOptions: {
        label: '户名',
        placeholder: '',
        autocomplete: 'off',
        labelSpan: 5,
        controlSpan: 17,
      },
      expressionProperties: {
        'templateOptions.disabled': () => true,
        'templateOptions.required': () => true,
      },
    },
    {
      className: 'ant-col ant-col-md-24 ant-col-sm-24',
      wrappers: ['form-field-horizontal'],
      key: 'accountHolder',
      type: 'input',
      templateOptions: {
        label: '开户人',
        placeholder: '',
        autocomplete: 'off',
        labelSpan: 5,
        controlSpan: 17,
      },
      expressionProperties: {
        'templateOptions.disabled': () => false,
        'templateOptions.required': () => true,
      },
    },
    {
      className: 'ant-col ant-col-md-24 ant-col-sm-24',
      wrappers: ['form-field-horizontal'],
      key: 'cardCode',
      type: 'input',
      templateOptions: {
        label: '账号',
        placeholder: '',
        autocomplete: 'off',
        labelSpan: 5,
        controlSpan: 17,
      },
      expressionProperties: {
        'templateOptions.disabled': () => false,
        'templateOptions.required': () => true,
      },
    },
    {
      className: 'ant-col ant-col-md-24 ant-col-sm-24',
      wrappers: ['form-field-horizontal'],
      key: 'bankProvince',
      type: 'select',
      templateOptions: {
        label: '开户行省',
        nzPlaceHolder: '请选择',
        nzShowSearch: true,
        autocomplete: 'off',
        labelSpan: 5,
        controlSpan: 17,
      },
      expressionProperties: {
        'templateOptions.disabled': () => false,
        'templateOptions.required': () => true,
        'templateOptions.options': 'formState.provinceOptions',
      },
      hooks: {
        onInit: () => {
          this.modelForm.get('bankProvince')?.valueChanges.subscribe((v) => {
            if (v) {
              this.modelForm.get('bankCity').setValue('');
              this.getCityOptions(v);
            }
          });
        },
      },
    },
    {
      className: 'ant-col ant-col-md-24 ant-col-sm-24',
      wrappers: ['form-field-horizontal'],
      key: 'bankCity',
      type: 'select',
      templateOptions: {
        label: '开户行市',
        nzPlaceHolder: '请选择',
        nzShowSearch: true,
        autocomplete: 'off',
        labelSpan: 5,
        controlSpan: 17,
      },
      expressionProperties: {
        'templateOptions.disabled': () => false,
        'templateOptions.required': () => true,
        'templateOptions.options': 'formState.cityOptions',
      },
      hooks: {
        onInit: () => {
          this.modelForm.get('bankCity')?.valueChanges.subscribe((v) => {
            if (v) {
              const provinceCode = this.modelForm.get('bankProvince').value;
              const province = this.modalOptions.formState.provinceOptions.filter(
                b => b.value === provinceCode
              )[0]['label'];
              const city = v;
              this.getBankList(province, city);
            }
          });
        },
      },
    },
    {
      className: 'ant-col ant-col-md-24 ant-col-sm-24',
      wrappers: ['form-field-horizontal'],
      key: 'bank',
      type: 'select',
      templateOptions: {
        label: '选择银行',
        nzPlaceHolder: '请选择',
        nzShowSearch: true,
        autocomplete: 'off',
        labelSpan: 5,
        controlSpan: 17,
      },
      expressionProperties: {
        'templateOptions.disabled': () => false,
        'templateOptions.required': () => true,
        'templateOptions.options': 'formState.bankList',
      },
      hooks: {
        onInit: () => {
          this.modelForm.get('bank')?.valueChanges.subscribe((v) => {
            if (v) {
              const provinceCode = this.modelForm.get('bankProvince').value;
              const province = this.modalOptions.formState.provinceOptions.filter(
                b => b.value === provinceCode
              )[0]['label'];
              const city = this.modelForm.get('bankCity').value;
              this.getAccountBankList(province, city, v);
            }
          });
        },
      },
    },
    {
      className: 'ant-col ant-col-md-24 ant-col-sm-24',
      wrappers: ['form-field-horizontal'],
      key: 'bankHead',
      type: 'select',
      templateOptions: {
        label: '选择开户行',
        nzPlaceHolder: '请选择',
        nzShowSearch: true,
        autocomplete: 'off',
        labelSpan: 5,
        controlSpan: 17,
      },
      expressionProperties: {
        'templateOptions.disabled': () => false,
        'templateOptions.required': () => true,
        'templateOptions.options': 'formState.accountBankList',
      },
      hooks: {
        onInit: () => {
          this.modelForm.get('bankHead')?.valueChanges.subscribe((v) => {
            if (v) {
              this.modelForm.get('bankCode').setValue(v);
              this.formModel.bankCode = v;
            }
          });
        },
      },
    },
    {
      className: 'ant-col ant-col-md-24 ant-col-sm-24',
      wrappers: ['form-field-horizontal'],
      key: 'bankCode',
      type: 'input',
      templateOptions: {
        label: '开户行行号',
        placeholder: '',
        autocomplete: 'off',
        labelSpan: 5,
        controlSpan: 17,
      },
      expressionProperties: {
        'templateOptions.disabled': () => true,
        'templateOptions.required': () => true,
      },
    },
    {
      className: 'ant-col ant-col-md-24 ant-col-sm-24',
      wrappers: ['form-field-horizontal'],
      key: 'remark',
      type: 'textarea',
      templateOptions: {
        label: '备注',
        nzPlaceHolder: '请输入',
        nzShowSearch: true,
        labelSpan: 5,
        controlSpan: 17,
      },
      expressionProperties: {
        'templateOptions.required': () => true,
      },
    },
  ];
  isLoading: boolean = false;
  modalOptions: FormlyFormOptions = {
    formState: {
      // 省
      provinceOptions: [],
      // 市
      cityOptions: [],
      // 银行
      bankList: [],
      // 开户行
      accountBankList: []
    },
  };
  observer: any;
  isVisible = false;

  constructor(
    private xn: XnService,
    private cdr: ChangeDetectorRef,
    public hwModeService: HwModeService,
  ) { }

  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
  }

  ngOnInit(): void {

  }

  /**
   * 打开模态框
   * @param params
   * @returns
   */
  open() {
    this.formModel = {
      accountName: this.xn.user.orgName || '',
    };
    this.isVisible = true;
    this.cdr.markForCheck();
    this.getProvinceOptions();
    return new Observable((observer) => {
      this.observer = observer;
    });
  }

  /**
   * 查询省
   */
  getProvinceOptions() {
    this.xn.middle
      .post('/bos/enum/area/list', { level: AreaLevelEnum.PROVINCE })
      .subscribe((x) => {
        if (x.code === RetCodeEnum.OK) {
          this.modalOptions.formState.provinceOptions = x.data.areaList.map(
            (t) => {
              return { label: t.provinceName, value: t.provinceCode };
            }
          );
        }
      });
  }

  /**
   * 查询市
   */
  getCityOptions(areaCode: string) {
    this.xn.middle
      .post('/bos/enum/area/list', { level: AreaLevelEnum.CITY, areaCode })
      .subscribe((x) => {
        if (x.code === RetCodeEnum.OK) {
          if (XnUtils.isEmptys(x.data.areaList)) {
            const provinceOptions = this.modalOptions.formState.provinceOptions;
            this.modalOptions.formState.cityOptions = provinceOptions.filter(c =>
              c.value === areaCode).map(t => {
                return { label: t.label, value: t.label }
              })
          } else {
            this.modalOptions.formState.cityOptions = x.data.areaList.map(
              (t) => {
                return { label: t.cityName, value: t.cityName };
              }
            );
          }
        }
      });
  }

  /**
   * 查询银行列表
   */
  getBankList(province: string, city: string) {
    this.xn.middle
      .post('/bank/list_by_area', { province, city })
      .subscribe((x) => {
        if (x.code === RetCodeEnum.OK) {
          this.modalOptions.formState.bankList =
            x.data.bankList.map(t => {
              return { label: t, value: t }
            })
        }
      });
  }

  /**
   * 根据银行获取开户行列表
   */
  getAccountBankList(province: string, city: string, bankHead: string) {
    this.xn.middle
      .post('/bank/list_by_bank', { province, city, bankHead })
      .subscribe((x) => {
        if (x.code === RetCodeEnum.OK) {
          this.modalOptions.formState.accountBankList =
            x.data.acctBankList.map(t => {
              return { label: t.acctBank, value: t.acctBankCode }
            })
        }
      });
  }

  /**
   * 关闭modal框
   * @param value
   */
  private close(value: any) {
    this.isVisible = false;
    this.observer.next(value);
    this.observer.complete();
  }

  modalOK(): void {
    if (this.modelForm.valid) {
      const value = Object.assign({}, this.formModel, this.modelForm.value);
      const bankCode = value.bankCode;
      const bankName = this.modalOptions.formState.accountBankList.filter(
        b => b.value === bankCode
      )[0]['label'];
      value.bankName = bankName;
      this.close(value);
    }
  }

  closeModal(): void {
    this.modelForm.reset();
    this.close(null);
  }

  goBack() {
    window.history.go(-1);
  }
}
