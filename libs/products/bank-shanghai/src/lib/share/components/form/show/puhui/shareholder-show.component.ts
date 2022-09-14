/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\bank-shanghai\src\lib\share\components\form\show\puhui\shareholder-show.component.ts
 * @summary：上海银行普惠开户流程-股东信息详情show组件
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                 hucongying          init           2021-07-19
 ***************************************************************************/
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
} from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { CheckersOutputModel } from 'libs/shared/src/lib/config/checkers';
import { ShareholderTypesEnum, ShPuhuiFlowIdEnum } from 'libs/shared/src/lib/config/enum';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';

/** 股东信息表单值类型定义 */
export interface shrhldValue {
  /** 股东性质 */
  shrhldType: string,
  /** 股东姓名 */
  shrhldName?: string,
  /** 自然人持股比例 */
  shrhldPercent?: string,
  /** 自然人股东证件类型 */
  shrhldIdType?: string,
  /** 自然人股东证件号码 */
  shrhldIdNo?: string,
  /** 自然人股东证件有效期 */
  shrhldIdLimitDate?: any,
  /** 企业名称 */
  shrhldNameCompany?: string,
  /** 企业持股比例 */
  shrhldPercentCompany?: string,
  /** 营业执照统一社会信用代码 */
  shrhldIdNoCompany?: string,
  /** 营业执照有效期 */
  shrhldIdLimitDateCompany?: any,
}

/** 股东信息表单checker配置 */
const shows: CheckersOutputModel[] = [
  {
    checkerId: 'shrhldType',
    required: 1,
    type: 'select',
    title: '股东性质',
    options: { readonly: true, ref: 'shareholderTypes' },
    flowId: ShPuhuiFlowIdEnum.SUB_SH_PRATTWHITNEY_INPUT,
    validators: '',
  },
  {
    checkerId: 'shrhldName',
    required: 1,
    type: 'text',
    title: '股东姓名',
    options: { readonly: true },
    flowId: ShPuhuiFlowIdEnum.SUB_SH_PRATTWHITNEY_INPUT,
    validators: '',
  },
  {
    checkerId: 'shrhldPercent',
    required: 1,
    type: 'text',
    title: '自然人持股比例（%）',
    options: { readonly: true, },
    flowId: ShPuhuiFlowIdEnum.SUB_SH_PRATTWHITNEY_INPUT,
    value: '',
    validators: {
      number5: true,
    },
  },
  {
    checkerId: 'shrhldIdType',
    required: 1,
    type: 'select',
    title: '自然人股东证件类型',
    options: {
      ref: 'shareholderCarsTypes',
      readonly: true,
    },
    flowId: ShPuhuiFlowIdEnum.SUB_SH_PRATTWHITNEY_INPUT,
    validators: '',
  },
  {
    checkerId: 'shrhldIdNo',
    required: 1,
    type: 'text',
    title: '自然人股东证件号码',
    options: { readonly: true, },
    validators: {
      cards: {
        name: 'shrhldIdNo',
      },
    },
    flowId: ShPuhuiFlowIdEnum.SUB_SH_PRATTWHITNEY_INPUT,
  },
  {
    checkerId: 'shrhldIdLimitDate',
    required: 1,
    type: 'dragon-nzdate',
    title: '自然人股东证件有效期至',
    options: { readonly: true, },
    flowId: ShPuhuiFlowIdEnum.SUB_SH_PRATTWHITNEY_INPUT,
    validators: '',
  },
  // 企业信息
  {
    checkerId: "shrhldNameCompany",
    required: 1,
    type: "text",
    title: "企业名称",
    options: { readonly: true },
    placeholder: '请输入...',
    flowId: ShPuhuiFlowIdEnum.SUB_SH_PRATTWHITNEY_INPUT,
    validators: ''
  },
  {
    checkerId: "shrhldPercentCompany",
    required: 1,
    type: "text",
    title: "企业持股比例（%）",
    placeholder: '请输入...',
    options: { readonly: true },
    flowId: ShPuhuiFlowIdEnum.SUB_SH_PRATTWHITNEY_INPUT,
    validators: {
      number5: true
    }
  },
  {
    checkerId: "shrhldIdNoCompany",
    required: 1,
    type: "text",
    title: "营业执照统一社会信用代码",
    placeholder: '请输入...',
    options: { readonly: true },
    validators: {},
    flowId: ShPuhuiFlowIdEnum.SUB_SH_PRATTWHITNEY_INPUT,
  },
  {
    checkerId: "shrhldIdLimitDateCompany",
    required: 1,
    type: "dragon-nzdate",
    title: "营业执照有效期至",
    options: { readonly: true },
    flowId: ShPuhuiFlowIdEnum.SUB_SH_PRATTWHITNEY_INPUT,
    validators: ''
  },
];
@Component({
  template: `
    <div class="panel-body">
      <div *ngFor="let show of shows; let i = index">
        <div class="form-group" *ngIf="show.data">
          <div
            class="col-sm-2 xn-control-label"
            [ngClass]="{
              'required-label-strong': !row.options.readonly,
              'required-star': !row.options.readonly
            }"
          >
            {{ show.title }}
          </div>
          <div class="col-sm-8">
            <app-dynamic-show
              [row]="show"
              [form]="shareholderFrom"
              formModule="dragon-show"
            >
            </app-dynamic-show>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
@DynamicForm({ type: 'shrhlder', formModule: 'dragon-show' })
export class ShareholderShowComponent implements OnInit {
  @Input() row: any;
  @Input() form: FormGroup;
  /** checker项 */
  public shows: CheckersOutputModel[] = [];
  /** form */
  public shareholderFrom: FormGroup;
  public ctrl: AbstractControl;
  public xnOptions: XnInputOptions;
  constructor(private er: ElementRef, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    if (this.row.data) {
      this.buildForm(this.row.data);
    }
    this.xnOptions = new XnInputOptions(
      this.row,
      this.form,
      this.ctrl,
      this.er
    );
  }

  /**
   * 构建表单
   * @param shrhldValue 表单值
   */
  buildForm(shrhldValue?: shrhldValue) {
    this.shows = shrhldValue
      ? this.getShowValue(shows, shrhldValue)
      : XnUtils.deepClone(shows);
    XnFormUtils.buildSelectOptions(this.shows);
    for (const row of this.shows) {
      XnFormUtils.convertChecker(row);
    }
    this.shareholderFrom = XnFormUtils.buildFormGroup(this.shows);
  }

  /**
   * checker项赋值
   * @param shows 股东信息表单配置
   * @param shrhldValue 表单值
   * @returns 股东信息表单配置
   */
  getShowValue(
    shows: CheckersOutputModel[],
    shrhldValue: shrhldValue
  ): CheckersOutputModel[] {
    const newShows = XnUtils.deepClone(shows);
    newShows.forEach((show: any) => {
      Object.keys(shrhldValue).forEach((key) => {
        if (shrhldValue['shrhldType'] === ShareholderTypesEnum.ENTERPRISE) {
          // 股东性质：【直接或间接拥有25%以上股份的控股股东-企业】的场合
          if (show.checkerId === key && key === 'shrhldType') {
            show.data = shrhldValue[key];
          } else if (show.checkerId === `${key}Company`) {
            // 企业其他信息过滤展示
            show.data = shrhldValue[key];
          }
        } else {
          if (show.checkerId === key) {
            show.data = shrhldValue[key];
          }
        }
      });
    });
    return newShows;
  }
}
