/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\account-system\src\lib\pages\my-account\account-info\account-info.component.ts
 * @summary：电子账本信息页面
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                 hucongying          init           2021-10-27
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
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@lr/ngx-formly';
import { RetCodeEnum } from 'libs/shared/src/lib/config/enum';
import { AccountStatusOptions } from 'libs/shared/src/lib/config/options';

@Component({
  templateUrl: './account-info.component.html',
  styles: [
    `
      ::ng-deep .ant-card-head-title {
        font-weight: bold;
      }
    `,
  ],
})
export class AccountInfoComponent implements OnInit, AfterViewChecked {
  /** 账户Id */
  accountId: number;
  loading: boolean = false;
  accountInfo: any = {} as any;
  form = new FormGroup({});
  showFields: FormlyFieldConfig[] = [
    {
      key: 'accountInfo',
      name: '电子账本信息',
      wrappers: ['card'],
      fieldGroupClassName: 'ant-row',
      fieldGroup: [
        {
          className: 'ant-col ant-col-md-8 ant-col-sm-24',
          wrappers: ['form-field-vertical'],
          key: 'uuid',
          type: 'input',
          templateOptions: {
            label: '开户UUID',
            placeholder: '',
            autocomplete: 'off',
            disabled: true,
            required: true,
          },
        },
        {
          className: 'ant-col ant-col-md-8 ant-col-sm-24',
          wrappers: ['form-field-vertical'],
          key: 'virAcctNo',
          type: 'input',
          templateOptions: {
            label: '电子账本账号',
            placeholder: '',
            autocomplete: 'off',
            disabled: true,
            required: true,
          },
        },
        {
          className: 'ant-col ant-col-md-8 ant-col-sm-24',
          wrappers: ['form-field-vertical'],
          key: 'identityNo',
          type: 'input',
          templateOptions: {
            label: '证件号码（组织机构代码）',
            placeholder: '',
            autocomplete: 'off',
            disabled: true,
            required: true,
          },
        },
        {
          className: 'ant-col ant-col-md-8 ant-col-sm-24',
          wrappers: ['form-field-vertical'],
          key: 'acctBankNo',
          type: 'input',
          templateOptions: {
            label: '开户归属支行号',
            placeholder: '',
            autocomplete: 'off',
            disabled: true,
            required: true,
          },
        },
        {
          className: 'ant-col ant-col-md-8 ant-col-sm-24',
          wrappers: ['form-field-vertical'],
          key: 'acctBank',
          type: 'input',
          templateOptions: {
            label: '开户归属支行',
            placeholder: '',
            autocomplete: 'off',
            disabled: true,
            required: true,
          },
        },
        {
          className: 'ant-col ant-col-md-8 ant-col-sm-24',
          wrappers: ['form-field-vertical'],
          key: 'accountStatus',
          type: 'select',
          templateOptions: {
            label: '账户状态',
            nzDisabled: true,
            options: this.accountStatusOptions
          },
        },
      ]
    },
  ]
  model = {};
  options: FormlyFormOptions = {};
  get accountStatusOptions() {
    return AccountStatusOptions
  }
  constructor(
    private xn: XnService,
    private cdr: ChangeDetectorRef,
    public hwModeService: HwModeService,
    private router: ActivatedRoute,
  ) { }
  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
  }
  ngOnInit(): void {
    this.router.params.subscribe(params => {
      this.accountId = params?.accountId ? params.accountId : null;
      this.getVirtualInfo();
    })
  }

  /**
   * 获取电子账本信息
   */
  getVirtualInfo() {
    this.loading = false;
    this.xn.loading.open();
    this.xn.middle.post('/account/info/virtual',
      { accountId: this.accountId, }
    ).subscribe(
      (x) => {
        this.xn.loading.close();
        if (x.code === RetCodeEnum.OK) {
          this.loading = true;
          this.accountInfo = x.data;
          this.model = {
            accountInfo: this.accountInfo
          }
        }
      },
      () => {
        this.xn.loading.close();
      }
    );
  }

  goBack() {
    window.history.go(-1);
  }
}
