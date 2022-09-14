/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\products\account-system\src\lib\pages\my-account\bind-account\modifiy-account\modifiy-account.component.ts
* @summary：交易明细
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
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@lr/ngx-formly';
import { TradeDirectionOptions, TradeStatusOptions, TradeTypeOptions, TranAmtTypeOptions } from 'libs/shared/src/lib/config/options';

@Component({
  templateUrl: './trade-detail.component.html',
  styles: [
    `
      ::ng-deep .ant-card-head-title {
        font-weight: bold;
      }
    `,
  ],
})
export class TradeDetailComponent implements OnInit, AfterViewChecked {
  form = new FormGroup({});
  model: any = {};
  options: FormlyFormOptions = {};
  // 交易详情
  tradeInfo: any = {} as any;
  detailId: string;
  showFields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'ant-row',
      fieldGroup: [
        {
          className: 'ant-col ant-col-md-8 ant-col-sm-24',
          wrappers: ['form-field-horizontal'],
          key: 'otherAccNo',
          type: 'input',
          templateOptions: {
            label: '对方账户账号',
            placeholder: '',
            autocomplete: 'off',
            labelSpan: 7,
            controlSpan: 21,
          },
          expressionProperties: {
            'templateOptions.disabled': () => true,
            'templateOptions.required': () => true,
          },
        },
        {
          className: 'ant-col ant-col-md-8 ant-col-sm-24',
          wrappers: ['form-field-horizontal'],
          key: 'otherAccName',
          type: 'input',
          templateOptions: {
            label: '对方账户户名',
            placeholder: '',
            autocomplete: 'off',
            labelSpan: 7,
            controlSpan: 21,
          },
          expressionProperties: {
            'templateOptions.disabled': () => true,
            'templateOptions.required': () => true,
          },
        },
        {
          className: 'ant-col ant-col-md-8 ant-col-sm-24',
          wrappers: ['form-field-horizontal'],
          key: 'number',
          type: 'input',
          defaultValue: '人民币',
          templateOptions: {
            label: '对方账户币种',
            placeholder: '',
            autocomplete: 'off',
            labelSpan: 7,
            controlSpan: 21,
          },
          expressionProperties: {
            'templateOptions.disabled': () => true,
            'templateOptions.required': () => true,
          },
        },
        {
          className: 'ant-col ant-col-md-8 ant-col-sm-24',
          wrappers: ['form-field-horizontal'],
          key: 'tradeAmount',
          type: 'input',
          templateOptions: {
            label: '交易金额',
            placeholder: '',
            autocomplete: 'off',
            labelSpan: 7,
            controlSpan: 21,
          },
          expressionProperties: {
            'templateOptions.disabled': () => true,
            'templateOptions.required': () => true,
          },
        },
        {
          className: 'ant-col ant-col-md-8 ant-col-sm-24',
          wrappers: ['form-field-horizontal'],
          key: 'tradeDirection',
          type: 'select',
          templateOptions: {
            label: '交易方向',
            nzPlaceHolder: '请选择',
            nzShowSearch: true,
            autocomplete: 'off',
            labelSpan: 7,
            controlSpan: 21,
            options: TradeDirectionOptions
          },
          expressionProperties: {
            'templateOptions.disabled': () => true,
            'templateOptions.required': () => true,
          },
        },
        {
          className: 'ant-col ant-col-md-8 ant-col-sm-24',
          wrappers: ['form-field-horizontal'],
          key: 'tradeStatus',
          type: 'select',
          templateOptions: {
            label: '交易状态',
            nzPlaceHolder: '请选择',
            nzShowSearch: true,
            autocomplete: 'off',
            labelSpan: 7,
            controlSpan: 21,
            options: TradeStatusOptions
          },
          expressionProperties: {
            'templateOptions.disabled': () => true,
            'templateOptions.required': () => true,
          },
        },
        {
          className: 'ant-col ant-col-md-8 ant-col-sm-24',
          wrappers: ['form-field-horizontal'],
          key: 'tranMemo',
          type: 'select',
          templateOptions: {
            label: '交易类别',
            nzPlaceHolder: '请选择',
            nzShowSearch: true,
            autocomplete: 'off',
            labelSpan: 7,
            controlSpan: 21,
            options: TradeTypeOptions
          },
          expressionProperties: {
            'templateOptions.disabled': () => true,
            'templateOptions.required': () => true,
          },
        },
        {
          className: 'ant-col ant-col-md-8 ant-col-sm-24',
          wrappers: ['form-field-horizontal'],
          key: 'innerNo',
          type: 'input',
          templateOptions: {
            label: '关联流水号',
            placeholder: '',
            autocomplete: 'off',
            labelSpan: 7,
            controlSpan: 21,
          },
          expressionProperties: {
            'templateOptions.disabled': () => true,
            'templateOptions.required': () => false,
          },
        },
        {
          className: 'ant-col ant-col-md-8 ant-col-sm-24',
          wrappers: ['form-field-horizontal'],
          key: 'createTime',
          type: 'input',
          templateOptions: {
            label: '创建时间',
            placeholder: '',
            autocomplete: 'off',
            labelSpan: 7,
            controlSpan: 21,
          },
          expressionProperties: {
            'templateOptions.disabled': () => true,
            'templateOptions.required': () => true,
          },
        },
        {
          className: 'ant-col ant-col-md-8 ant-col-sm-24',
          wrappers: ['form-field-horizontal'],
          key: 'tranAmtType',
          type: 'select',
          templateOptions: {
            label: '动账交易类型',
            nzPlaceHolder: '请选择',
            nzShowSearch: true,
            autocomplete: 'off',
            labelSpan: 7,
            controlSpan: 21,
            options: TranAmtTypeOptions
          },
          expressionProperties: {
            'templateOptions.disabled': () => true,
            'templateOptions.required': () => false,
          },
        },
        {
          className: 'ant-col ant-col-md-24 ant-col-sm-24',
          wrappers: ['form-field-horizontal'],
          key: 'memo',
          type: 'textarea',
          templateOptions: {
            label: '摘要',
            nzPlaceHolder: '请输入',
            nzShowSearch: true,
            labelSpan: 15,
            controlSpan: 23,
          },
          expressionProperties: {
            'templateOptions.disabled': () => true,
            'templateOptions.required': () => false,
          },
        },
        {
          className: 'ant-col ant-col-md-24 ant-col-sm-24',
          wrappers: ['form-field-horizontal'],
          key: 'purpose',
          type: 'textarea',
          templateOptions: {
            label: '用途',
            nzPlaceHolder: '请输入',
            nzShowSearch: true,
            labelSpan: 15,
            controlSpan: 23,
          },
          expressionProperties: {
            'templateOptions.disabled': () => true,
            'templateOptions.required': () => false,
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
            labelSpan: 15,
            controlSpan: 23,
          },
          expressionProperties: {
            'templateOptions.disabled': () => true,
            'templateOptions.required': () => false,
          },
        },
      ]
    }];
  tradeTitle: string = '';

  constructor(
    private cdr: ChangeDetectorRef,
    public hwModeService: HwModeService,
    private router: ActivatedRoute,
  ) { }

  ngAfterViewChecked(): void {
    this.cdr.detectChanges()
  }

  ngOnInit(): void {
    this.router.queryParams.subscribe(params => {
      this.tradeInfo = JSON.parse(params.tradeInfo);
      this.tradeTitle = `交易明细ID：${this.tradeInfo.detailId}`;
      this.model = this.tradeInfo;
    })
  }

  goBack() {
    window.history.go(-1);
  }
}

