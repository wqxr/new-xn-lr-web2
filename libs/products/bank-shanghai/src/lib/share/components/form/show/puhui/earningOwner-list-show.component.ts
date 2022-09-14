/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\products\bank-shanghai\src\lib\share\components\form\show\puhui\earningOwner-list-show.component.ts
* @summary：上海银行普惠开户流程-受益人信息详情show组件
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                 hucongying          init           2021-07-20
***************************************************************************/
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { CheckersOutputModel } from 'libs/shared/src/lib/config/checkers';
import { EarningOwnerTypeEnum } from 'libs/shared/src/lib/config/enum';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';


/** 受益人信息表单值类型定义 */
export interface EarningOwnerValue {
  /** 受益所有人性质 */
  earningOwnerType?: string,
  /** 其他情况描述 */
  earningOwnerTypeName?: string,
  /** 受益所有人姓名 */
  earningOwnerName?: string,
  /** 受益所有人证件类型 */
  earningOwnerIdType?: string,
  /** 受益所有人证件号码 */
  earningOwnerIdNo?: string,
  /** 受益所有人证件有效期 */
  earningOwnerLimitDate?: any,
  /** 受益所有人证件正面图片 */
  earningOwnerFrontImg?: any,
  /** 受益所有人证件反面图片 */
  earningOwnerBackImg?: any,

}

/** 股东信息表单checker配置 */
const shows: CheckersOutputModel[] = [
  {
    checkerId: "earningOwnerType",
    required: 1,
    type: "select",
    title: "受益所有人性质",
    options: { readonly: true, ref: "earningOwnerType" },
    flowId: "sub_sh_prattwhitney_input",
    validators: ''
  },
  {
    checkerId: "earningOwnerTypeName",
    required: 1,
    type: "text",
    title: "其他情况描述",
    options: { readonly: true, showWhen: ['earningOwnerType', [EarningOwnerTypeEnum.OTHER]] },
    flowId: "sub_sh_prattwhitney_input",
    validators: ''
  },
  {
    checkerId: "earningOwnerName",
    required: 1,
    type: "text",
    title: "受益所有人姓名",
    options: { readonly: true, },
    flowId: "sub_sh_prattwhitney_input",
    validators: ''
  },
  {
    checkerId: "earningOwnerIdType",
    required: 1,
    type: "select",
    title: "受益所有人证件类型",
    options: { ref: "shareholderCarsTypes", readonly: true, },
    flowId: "sub_sh_prattwhitney_input",
    validators: ''
  },
  {
    checkerId: "earningOwnerIdNo",
    required: 1,
    type: "text",
    title: "受益所有人证件号码",
    options: { readonly: true, },
    validators: {
      cards: {
        name: 'earningOwnerIdNo'
      }
    },
    flowId: "sub_sh_prattwhitney_input",
  },
  {
    checkerId: "earningOwnerAddress",
    required: 1,
    type: "text-area",
    title: "受益所有人地址",
    options: { readonly: true, inputMaxLength: 200 },
    flowId: "sub_sh_prattwhitney_input",
    validators: ''
  },
  {
    checkerId: "earningOwnerLimitDate",
    required: 1,
    type: "dragon-nzdate",
    title: "受益所有人证件有效期",
    options: { readonly: true, },
    flowId: "sub_sh_prattwhitney_input",
    validators: ''
  },
  {
    title: '受益所有人证件正面图片',
    checkerId: 'earningOwnerFrontImg',
    type: 'nzfile-upload',
    required: 1,
    options: {
      readonly: true,
      filename: '受益所有人证件正面图片',
      fileext: 'image/jpg,image/jpeg,image/png',
      picSize: 5120,
      helpMsg: '请上传大小5M以内的JPEG/JPG/PNG格式文件'
    },
  },
  {
    title: '受益所有人反面图片',
    checkerId: 'earningOwnerBackImg',
    type: 'nzfile-upload',
    required: 1,
    options: {
      readonly: true,
      filename: '受益所有人反面图片',
      fileext: 'image/jpg,image/jpeg,image/png',
      picSize: 5120,
      helpMsg: '请上传大小5M以内的JPEG/JPG/PNG格式文件'
    },
  },
]
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
              [form]="EarningOwnerFrom"
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
@DynamicForm({ type: 'earningOwner', formModule: 'dragon-show' })
export class EarningOwnerListShowComponent implements OnInit {
  @Input() row: any;
  @Input() form: FormGroup;
  /** checker项 */
  public shows: CheckersOutputModel[] = [];
  /** form */
  public EarningOwnerFrom: FormGroup;
  public ctrl: AbstractControl;
  public xnOptions: XnInputOptions;
  constructor(private er: ElementRef, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    if (this.row.data) {
      // 构建表单赋值
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
  buildForm(shrhldValue?: EarningOwnerValue) {
    this.shows = shrhldValue
      ? this.getShowValue(shows, shrhldValue)
      : XnUtils.deepClone(shows);
    XnFormUtils.buildSelectOptions(this.shows);
    for (const row of this.shows) {
      XnFormUtils.convertChecker(row);
    }
    this.EarningOwnerFrom = XnFormUtils.buildFormGroup(this.shows);
  }

  /**
   * checker项赋值
   * @param shows 股东信息表单配置
   * @param shrhldValue 表单值
   * @returns 股东信息表单配置
   */
  getShowValue(
    shows: CheckersOutputModel[],
    shrhldValue: EarningOwnerValue
  ): CheckersOutputModel[] {
    const newShows = XnUtils.deepClone(shows);
    newShows.forEach((show) => {
      Object.keys(shrhldValue).forEach((key) => {
        if (show.checkerId === key) {
          show.data = shrhldValue[key];
        }
      });
    });
    return newShows;
  }
}

