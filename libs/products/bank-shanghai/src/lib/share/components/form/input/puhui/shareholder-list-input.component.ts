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
import { ShPuhuiFlowIdEnum } from 'libs/shared/src/lib/config/enum';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';




/** 股东信息表单checker配置 */
const shows: CheckersOutputModel[] = [
  {
    checkerId: "shrhld",
    required: 1,
    type: "shrhlder",
    title: "股东信息详情",
    options: { readonly: false },
    flowId: "sub_sh_prattwhitney_input",
    value: "",
    name: 'shrhld',
    validators: ''
  },
]
@Component({
  templateUrl: "./shareholder-list-input.component.html",
  styles: [
    `
    .checkerTitle {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0px 50px;
    }
    .checkerHead{
      padding-bottom: 10px;
      border-bottom: 1px solid #aaa;
    }
    `
  ]
})
@DynamicForm({ type: 'shrhldList', formModule: 'dragon-input' })
export class ShareholderListInputComponent implements OnInit {

  @Input() row: any;
  @Input() form: FormGroup;
  /** checker项 */
  public shareholderList: CheckersOutputModel[] = XnUtils.deepClone(shows);
  /** form */
  public shareholderListFrom: FormGroup;
  public ctrl: AbstractControl;
  public xnOptions: XnInputOptions;
  public flowId: string = ShPuhuiFlowIdEnum.SUB_SH_PRATTWHITNEY_BANK_VERIFY;
  constructor(private er: ElementRef, private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.flowId = this.row.flowId;
    this.ctrl = this.form.get(this.row.name);
    if (this.row.value) {
      // 缓存的情况 构建表单赋值
      this.shareholderList = this.getCacheRows()
      this.buildForm()
      this.ctrl.setValue(this.row.value)
    } else {
      // 构建表单
      this.buildForm()
    }

    /** 监听表单值变化 */
    this.handelFormValueChange();
    this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
  }

  /**
   * 根据值组装表单
   * @param
   */
  getCacheRows() {
    const shrhldListValue: any = JSON.parse(this.row.value) || [];
    this.shareholderList[0]['value'] = shrhldListValue[0]
    if (shrhldListValue.length > 1) {
      // 多组股东信息 需要动态生成多组
      shrhldListValue.forEach((v: any, i: number) => {
        if (i !== 0) { this.addShrhld(v) }
      })
    }
    return this.shareholderList
  }

  /**
 * 新增股东
 * 往表单中增加一项股东信息checker
 * @param value checker项的value
 */
  addShrhld(value?: any) {
    const index = this.shareholderList.map(x => x.type).lastIndexOf('shrhlder');
    const uid = XnUtils.getUid();
    const checker = {
      checkerId: `shrhld_${uid}`,
      required: true,
      type: "shrhlder",
      title: "股东信息详情",
      validators: {},
      options: {
        readonly: this.row.options.readonly
      },
      flowId: ShPuhuiFlowIdEnum.SUB_SH_PRATTWHITNEY_INPUT,
      value: value ? value : '',
      other: "",
      name: `shrhld_${uid}`
    }
    this.shareholderList.splice(index + 1, 0, checker);
    this.reBuildForm()
  }

  /**
  * 重新构建表单
  */
  reBuildForm() {
    const formValue = this.shareholderListFrom?.value ? XnUtils.deepClone(this.shareholderListFrom?.value) : null;
    const shareholderList = XnUtils.deepClone(this.shareholderList);
    if (formValue) {
      /** 缓存之前的表单值 */
      Object.keys(formValue).forEach(key => {
        shareholderList.forEach((v: any) => {
          if (v.checkerId === key) {
            v.value = formValue[key]
          }
        })
      })
    }
    this.shareholderList = XnUtils.deepClone(shareholderList);
    this.shareholderListFrom = XnFormUtils.buildFormGroup(this.shareholderList);
    this.handelFormValueChange()
  }

  /**
   * 赋值操作
   *
   */
  setValue() {
    const formValue = this.shareholderListFrom.value;
    // 组装数据
    const shareholderListValue = [];
    Object.keys(formValue).forEach(key => {
      shareholderListValue.push(formValue[key])
    })
    this.ctrl.setValue(JSON.stringify(shareholderListValue))
  }

  /**
   * 构建表单
   * @param
   */
  buildForm() {
    this.shareholderList = XnUtils.deepClone(this.shareholderList)
    this.shareholderList.forEach(show => {
      if (this.row.options.readonly) {
        show.options.readonly = true
      } else {
        show.options.readonly = false
      }
    })
    for (const row of this.shareholderList) {
      XnFormUtils.convertChecker(row);
    }
    this.shareholderListFrom = XnFormUtils.buildFormGroup(this.shareholderList);
  }

  /**
   * 股东信息标题展示
   * @param row
   * @returns boolean
   */
  showShrhld(row: any): boolean {
    if (row.checkerId.indexOf('shrhld') >= 0) {
      return true
    } else {
      return false
    }
  }

  /**
   * 新增股东信息按钮限制
   * @returns
   */
  disAddForm(): boolean {
    const lengthOk = this.shareholderList.filter(x => { return x.checkerId.indexOf('shrhld') >= 0 }).length > 4 ? true : false;
    if (this.shareholderListFrom.valid) {
      return lengthOk
    } else {
      return true;
    }
  }

  /**
   * 删除股东信息
   * @param index 下标
   */
  delShrhld(index: number) {
    this.shareholderList.splice(index, 1);
    this.reBuildForm();
  }

  /**
   * 删除股东按钮展示
   * @param row
   * @returns boolean
   */
  showShrhldBtn(row: any): boolean {
    if (row.checkerId.split('shrhld').length > 1
      && row.checkerId !== 'shrhld'
      && !row.options.readonly
      && this.flowId === ShPuhuiFlowIdEnum.SUB_SH_PRATTWHITNEY_INPUT) {
      return true
    } else {
      return false
    }
  }

  handelFormValueChange() {
    /** 监听表单值变化 */
    this.shareholderListFrom?.valueChanges.subscribe(v => {
      if (this.shareholderListFrom?.valid) {
        this.setValue()
      } else {
        this.ctrl.setValue(null)
      }
    });
  }
}

