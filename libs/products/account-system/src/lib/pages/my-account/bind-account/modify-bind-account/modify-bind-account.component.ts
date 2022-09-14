/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\products\account-system\src\lib\pages\my-account\bind-account\modifiy-account\modifiy-account.component.ts
* @summary：修改绑定银行账户
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                HuCongying           init           2021-11-02
***************************************************************************/
import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@lr/ngx-formly';
import { BankTypeEnum, IsMainCardEnum, RetCodeEnum } from 'libs/shared/src/lib/config/enum';

@Component({
  templateUrl: './modify-bind-account.component.html',
  styles: [
    `
      ::ng-deep .ant-card-head-title {
        font-weight: bold;
      }
      .head-box {
        height: 40px;
        line-height: 40px;
        background-color: #e9f0fa;
        padding: 0 20px;
        margin-bottom: 20px;
      }
    `,
  ],
})
export class ModifyBindAccountComponent implements OnInit, AfterViewChecked {
  // 电子账本账号
  virAcctNo: string = '';
  /** 账户Id */
  accountId: number;
  form: any = new FormGroup({});
  model: any = {};
  options: FormlyFormOptions = {
    formState: {
      bankList: [],
    },
  };
  loading: boolean = false;
  // 账号信息
  bankInfo: any = {}
  showFields: FormlyFieldConfig[] = [
    {
      className: 'ant-col ant-col-md-24 ant-col-sm-24',
      wrappers: ['form-field-horizontal'],
      key: 'virAcctNo',
      type: 'input',
      templateOptions: {
        label: '电子账本账号',
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
      key: 'accountName',
      type: 'input',
      defaultValue: this.xn.user.orgName,
      templateOptions: {
        label: '户名',
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
      key: 'bankName',
      type: 'input',
      templateOptions: {
        label: '开户行',
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
      type: 'input',
      templateOptions: {
        label: '银行账号',
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
      key: 'isMain',
      type: 'select',
      templateOptions: {
        label: '是否修改为主绑卡',
        nzPlaceHolder: '请选择',
        autocomplete: 'off',
        labelSpan: 7,
        controlSpan: 11,
        options: [
          { label: '是', value: true },
          { label: '否', value: false }
        ]
      },
      expressionProperties: {
        'templateOptions.disabled': () => false,
        'templateOptions.required': () => true,
      },
    },
  ]

  constructor(
    private xn: XnService,
    private cdr: ChangeDetectorRef,
    public hwModeService: HwModeService,
    private router: ActivatedRoute,
    private message: NzMessageService,
  ) { }
  ngAfterViewChecked(): void {
    this.cdr.detectChanges()
  }
  ngOnInit(): void {
    this.router.queryParams.subscribe(query => {
      this.bankInfo = JSON.parse(query.bankInfo);
      this.model.bankName = this.bankInfo.bankName;
      this.model.accountNo = this.bankInfo.accountNo;
      this.model.isMain = this.bankInfo.isMain === IsMainCardEnum.YES;
    })
    this.router.params.subscribe((params) => {
      this.accountId = params?.accountId ? params.accountId : null;
      this.getAccountInfo();
    });
  }

  /**
   * 获取账户详情
   */
  getAccountInfo() {
    this.loading = false;
    this.xn.middle.post2('/account/info/overview',
      { appId: this.xn.user.appId, bankType: BankTypeEnum.SH_BANK }
    ).subscribe(
      (x) => {
        if (x.code === RetCodeEnum.OK) {
          this.loading = true;
          this.model.virAcctNo = x.data.virAcctNo;
          this.cdr.markForCheck()
        }
      },
    );
  }

  /**
   * 提交信息
   */
  submitFrom() {
    const { isMain } = this.form.value;
    this.xn.middle.post2('/account/bank/edit',
      { bankId: this.bankInfo.bankId, isMain })
      .subscribe(res => {
        if (res.code === RetCodeEnum.OK) {
          this.message.success('修改成功!');
          this.goBack();
        }
      })
  }

  goBack() {
    window.history.go(-1);
  }
}

