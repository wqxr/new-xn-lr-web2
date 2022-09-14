/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\products\bank-shanghai\src\lib\share\components\form\input\puhui\shareholder-list-input.component.ts
* @summary：上海银行普惠开户流程-股东信息交互组件
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                 hucongying          init           2021-07-05
***************************************************************************/
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { CheckersOutputModel } from 'libs/shared/src/lib/config/checkers';
import { ShareholderCardeEnum, ShareholderTypesEnum, ShPuhuiFlowIdEnum } from 'libs/shared/src/lib/config/enum';
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
    checkerId: "shrhldType",
    required: 1,
    type: "select",
    title: "股东性质",
    options: { readonly: false, ref: "shareholderTypes" },
    flowId: ShPuhuiFlowIdEnum.SUB_SH_PRATTWHITNEY_INPUT,
    value: "",
    validators: ''
  },
  {
    checkerId: "shrhldName",
    required: 1,
    type: "text",
    title: "股东姓名",
    options: {
      readonly: false,
      showWhen: ['shrhldType', [ShareholderTypesEnum.NATURAL_PERSON, ShareholderTypesEnum.PERSONNEL]]
    },
    placeholder: '请输入...',
    flowId: ShPuhuiFlowIdEnum.SUB_SH_PRATTWHITNEY_INPUT,
    value: "",
    validators: ''
  },
  {
    checkerId: "shrhldPercent",
    required: 1,
    type: "text",
    title: "自然人持股比例（%）",
    placeholder: '请输入...',
    options: {
      readonly: false,
      showWhen: ['shrhldType', [ShareholderTypesEnum.NATURAL_PERSON, ShareholderTypesEnum.PERSONNEL]]
    },
    flowId: ShPuhuiFlowIdEnum.SUB_SH_PRATTWHITNEY_INPUT,
    value: "",
    validators: {
      number5: true
    }
  },
  {
    checkerId: "shrhldIdType",
    required: 1,
    type: "select",
    title: "自然人股东证件类型",
    options: {
      ref: "shareholderCarsTypes",
      readonly: false,
      showWhen: ['shrhldType', [ShareholderTypesEnum.NATURAL_PERSON, ShareholderTypesEnum.PERSONNEL]]
    },
    flowId: ShPuhuiFlowIdEnum.SUB_SH_PRATTWHITNEY_INPUT,
    value: "",
    validators: ''
  },
  {
    checkerId: "shrhldIdNo",
    required: 1,
    type: "text",
    title: "自然人股东证件号码",
    placeholder: '请输入...',
    options: {
      readonly: false,
      showWhen: ['shrhldType', [ShareholderTypesEnum.NATURAL_PERSON, ShareholderTypesEnum.PERSONNEL]]
    },
    validators: {},
    flowId: ShPuhuiFlowIdEnum.SUB_SH_PRATTWHITNEY_INPUT,
    value: "",
  },
  {
    checkerId: "shrhldIdLimitDate",
    required: 1,
    type: "dragon-nzdate",
    title: "自然人股东证件有效期至",
    options: {
      readonly: false,
      showWhen: ['shrhldType', [ShareholderTypesEnum.NATURAL_PERSON, ShareholderTypesEnum.PERSONNEL]]
    },
    flowId: ShPuhuiFlowIdEnum.SUB_SH_PRATTWHITNEY_INPUT,
    value: "",
    validators: ''
  },
  // 企业信息
  {
    checkerId: "shrhldNameCompany",
    required: 1,
    type: "text",
    title: "企业名称",
    options: {
      readonly: false,
      showWhen: ['shrhldType', [ShareholderTypesEnum.ENTERPRISE]]
    },
    placeholder: '请输入...',
    flowId: ShPuhuiFlowIdEnum.SUB_SH_PRATTWHITNEY_INPUT,
    value: "",
    validators: ''
  },
  {
    checkerId: "shrhldPercentCompany",
    required: 1,
    type: "text",
    title: "企业持股比例（%）",
    placeholder: '请输入...',
    options: {
      readonly: false,
      showWhen: ['shrhldType', [ShareholderTypesEnum.ENTERPRISE]]
    },
    flowId: ShPuhuiFlowIdEnum.SUB_SH_PRATTWHITNEY_INPUT,
    value: "",
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
    options: {
      readonly: false,
      showWhen: ['shrhldType', [ShareholderTypesEnum.ENTERPRISE]]
    },
    validators: {},
    flowId: ShPuhuiFlowIdEnum.SUB_SH_PRATTWHITNEY_INPUT,
    value: "",
  },
  {
    checkerId: "shrhldIdLimitDateCompany",
    required: 1,
    type: "dragon-nzdate",
    title: "营业执照有效期至",
    options: {
      readonly: false,
      showWhen: ['shrhldType', [ShareholderTypesEnum.ENTERPRISE]]
    },
    flowId: ShPuhuiFlowIdEnum.SUB_SH_PRATTWHITNEY_INPUT,
    value: "",
    validators: ''
  },
]
@Component({
  templateUrl: "./shareholder-input.component.html",
  styles: []
})
@DynamicForm({ type: 'shrhlder', formModule: 'dragon-input' })
export class ShareholderInputComponent implements OnInit {

  @Input() row: any;
  @Input() form: FormGroup;
  /** checker项 */
  public shows: CheckersOutputModel[] = [];
  /** form */
  public shareholderFrom: FormGroup;
  public ctrl: AbstractControl;
  public xnOptions: XnInputOptions;
  constructor(private er: ElementRef, private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.ctrl = this.form.get(this.row.name);
    if (this.row.value) {
      // 缓存的情况 构建表单赋值
      this.buildForm(this.row.value)
      this.ctrl.setValue(this.row.value)
    } else {
      // 构建表单
      this.buildForm()
    }

    /** 监听表单值变化 */
    this.shareholderFrom?.valueChanges.subscribe(v => {
      if (this.shareholderFrom?.valid) {
        this.setValue()
      } else {
        this.ctrl.setValue(null)
      }
    });
    this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
  }

  /**
   * 赋值操作
   *
   */
  setValue() {
    const formValue = XnUtils.deepClone(this.shareholderFrom.value);
    const { shrhldType } = formValue;
    // 股东性质：【直接或间接拥有25%以上股份的控股股东-企业】的场合
    if (shrhldType === ShareholderTypesEnum.ENTERPRISE) {
      Object.keys(formValue).forEach((key: string) => {
        if (key.includes('Company')) {
          const checkerId = key.split('Company')[0];
          formValue[checkerId] = formValue[key];
          delete formValue[key];
        }
      });
      // 股东证件类型传【企业营业执照】对应的码值
      formValue.shrhldIdType = ShareholderCardeEnum.BUSINESS_LICENSE;
    }
    this.ctrl.setValue(formValue);
  }

  /**
   * 构建表单
   * @param shrhldValue 表单值
   */
  buildForm(shrhldValue?: shrhldValue) {
    this.shows = shrhldValue ? this.getShowValue(shows, shrhldValue) : XnUtils.deepClone(shows)
    this.shows.forEach(show => {
      if (this.row.options.readonly) {
        show.options.readonly = true
      } else {
        show.options.readonly = false
      }
    })
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
  getShowValue(shows: CheckersOutputModel[], shrhldValue: shrhldValue): CheckersOutputModel[] {
    const newShows = XnUtils.deepClone(shows)
    newShows.forEach((show: any) => {
      Object.keys(shrhldValue).forEach(key => {
        if (show.checkerId === key) {
          show.value = shrhldValue[key];
        } else if (show.checkerId.split('Company')[0] === key) {
          show.value = shrhldValue[key];
        }
      })
    })
    return newShows;
  }
}

