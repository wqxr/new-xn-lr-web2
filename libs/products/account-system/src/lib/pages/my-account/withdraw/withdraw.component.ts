/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\products\account-system\src\lib\pages\my-account\withdraw\withdraw.component.ts
* @summary：提现页面
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
import { ActivatedRoute } from '@angular/router';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { FormControl, FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@lr/ngx-formly';
import { NzModalService } from 'ng-zorro-antd/modal';
import { BankTypeEnum, RetCodeEnum, SystemCodeEnum } from 'libs/shared/src/lib/config/enum';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { TwoDecimalsReg } from '../../../shared/validators/valid.regexp';
import { MinUtils } from '../../../shared/utils';

@Component({
  templateUrl: './withdraw.component.html',
  styles: [
    `
      ::ng-deep .ant-card-head-title {
        font-weight: bold;
      }
      .balance-tip {
        position: absolute;
        top: 300px;
        left: 30%;
        z-index: 20;
      }
    `,
  ],
})
export class WithDrawComponent implements OnInit, AfterViewChecked {
  // 企业appId
  appId: string = this.xn.user.appId;
  /** 账户Id */
  accountId: number;
  loading: boolean = false;
  operatorInfo: any = {} as any;
  accountInfo: any = {} as any;
  form = new FormGroup({});
  model: any = {};
  options: FormlyFormOptions = {
    formState: {
      bankList: [],
      tip: '',
      operatorMobile: ''
    },
  };
  showFields: FormlyFieldConfig[] = [
    {
      wrappers: ['card'],
      fieldGroupClassName: 'ant-row',
      templateOptions: {
        nzTitle: '提现申请',
      },
      fieldGroup: [
        {
          className: 'ant-col ant-col-md-24 ant-col-sm-24',
          wrappers: ['form-field-horizontal'],
          key: 'virAcctNo',
          type: 'input',
          templateOptions: {
            label: '电子账本',
            placeholder: '',
            autocomplete: 'off',
            labelSpan: 7,
            controlSpan: 11,
          },
          expressionProperties: {
            'templateOptions.disabled': () => true,
            'templateOptions.required': () => true,
          },
        },
        {
          className: 'ant-col ant-col-md-24 ant-col-sm-24',
          wrappers: ['form-field-horizontal'],
          key: 'accountNo',
          type: 'select',
          templateOptions: {
            label: '银行账户',
            nzPlaceHolder: '请选择',
            nzShowSearch: true,
            autocomplete: 'off',
            labelSpan: 7,
            controlSpan: 11,
          },
          expressionProperties: {
            'templateOptions.disabled': () => false,
            'templateOptions.required': () => true,
            'templateOptions.options': 'formState.bankList',
          },
          hooks: {
            onInit: () => {
              this.form.get('accountNo').valueChanges.subscribe(v => {
                if (v) {
                  this.form.get('bankName').setValue(v);
                }
              })
            }
          }
        },
        {
          className: 'ant-col ant-col-md-24 ant-col-sm-24',
          wrappers: ['form-field-horizontal'],
          key: 'bankName',
          type: 'input',
          templateOptions: {
            label: '银行账号',
            placeholder: '',
            autocomplete: 'off',
            labelSpan: 7,
            controlSpan: 11,
            required: true,
            disabled: true
          },
        },
        {
          className: 'ant-col ant-col-md-24 ant-col-sm-24',
          wrappers: ['form-field-horizontal'],
          key: 'amount',
          type: 'input-tip',
          templateOptions: {
            label: '提现金额',
            placeholder: '',
            autocomplete: 'off',
            labelSpan: 7,
            controlSpan: 11,
          },
          expressionProperties: {
            'templateOptions.disabled': () => false,
            'templateOptions.required': () => true,
            'templateOptions.tip': 'formState.tip',
          },
          validators: {
            card: {
              expression: (filed: FormControl) => {
                if (filed.value) {
                  return TwoDecimalsReg.test(filed.value);
                } else {
                  return true;
                }
              },
              message: '请输入数字最多支持两位小数',
            },
          },
        },
        {
          className: 'ant-col ant-col-md-24 ant-col-sm-24',
          wrappers: ['form-field-horizontal'],
          key: 'smsCode',
          type: 'input-code',
          templateOptions: {
            label: '经办人手机短信验证码',
            placeholder: '请输入',
            required: true,
            maxLength: 6,
            labelSpan: 7,
            controlSpan: 11,
          },
          expressionProperties: {
            'templateOptions.mobile': 'formState.operatorMobile',
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
            labelSpan: 7,
            controlSpan: 11,
          },
          expressionProperties: {
            'templateOptions.required': () => false,
          },
        },
      ]
    },
  ]
  // 可提现余额
  balance: any = '';

  constructor(
    private xn: XnService,
    private cdr: ChangeDetectorRef,
    public hwModeService: HwModeService,
    private router: ActivatedRoute,
    private $modal: NzModalService,
  ) { }
  ngAfterViewChecked(): void {
    this.cdr.detectChanges()
  }
  ngOnInit(): void {
    this.router.queryParams.subscribe(query => {
      this.balance = query.balance || '0';
      this.options.formState.tip = `可提现金额为 ${this.balance} 元`
    })
    this.router.params.subscribe(params => {
      this.accountId = params.accountId || null;
      this.getBankList();
      this.getAccountInfo();
      this.getOperatorInfo();
    })
  }

  /**
   * 获取账户详情
   */
  getAccountInfo() {
    this.loading = false;
    this.xn.middle.post('/account/info/overview',
      { appId: this.appId, bankType: BankTypeEnum.SH_BANK }
    ).subscribe(
      (x) => {
        this.loading = true;
        if (x.code === RetCodeEnum.OK) {
          this.accountInfo = x.data;
          const { virAcctNo } = this.accountInfo
          this.model = { virAcctNo };
        }
      },
    );
  }

  /**
  * 获取经办人信息
  */
  getOperatorInfo() {
    this.loading = false;
    this.xn.middle
      .post('/account/info/operator', { accountId: this.accountId })
      .subscribe(
        (x) => {
          this.loading = true;
          if (x.code === RetCodeEnum.OK) {
            this.operatorInfo = x.data;
            this.options.formState.operatorMobile = this.operatorInfo.mobile;
            this.cdr.markForCheck();
          }
        },
      );
  }

  /**
   * 获取银行账户列表
   */
  getBankList() {
    this.loading = false;
    this.xn.middle
      .post('/account/bank/list', { accountId: this.accountId })
      .subscribe(
        (x) => {
          this.loading = true;
          if (x.code === RetCodeEnum.OK) {
            this.options.formState.bankList = x.data.bankList.map(t => {
              return { label: t.bankName, value: t.accountNo }
            });
            this.cdr.markForCheck();
          }
        },
      );
  }

  /**
   * 提交信息
   */
  submitFrom() {
    this.xn.loading.open();
    const formValue = XnUtils.deepClone(this.form.value);
    formValue.accountId = this.accountId;
    formValue.systemCode = SystemCodeEnum.XN_LR;
    this.xn.middle.post('/account/trade/withdraw', formValue).subscribe(
      res => {
        this.xn.loading.close();
        if (res.code === RetCodeEnum.OK) {
          this.$modal.success(
            {
              nzTitle: '提示',
              nzContent: '已提交提现申请，处理结果请在“我的电子账本”中查看',
              nzOnOk: () => {
                this.goBack();
              },
              nzOnCancel: () => { },
            }
          )
        }
      }
    )
  }

  goBack() {
    window.history.go(-1);
  }
}

