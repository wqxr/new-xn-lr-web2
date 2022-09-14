/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\products\bank-shanghai\src\lib\share\components\form\show\puhui\earningOwner-show.component.ts
* @summary：上海银行普惠开户流程-股东信息show组件
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
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';




/** 受益人信息表单checker配置 */
const shows: CheckersOutputModel[] = [
  {
    checkerId: "earningOwner",
    required: 1,
    type: "earningOwner",
    title: "受益人信息详情",
    options: { readonly: true },
    flowId: "sub_sh_prattwhitney_input",
    value: "",
    name: 'shrhld',
    validators: '',
  },
]
@Component({
  template: `
  <div class="panel-body">
    <div class="form-group" *ngFor="let row of earningOwnerList; let i = index">
      <!-- 受益人信息 -->
      <div>
        <app-dynamic-show [row]="row" [form]="earningOwnerListForm" formModule="dragon-show">
        </app-dynamic-show>
      </div>
    </div>
  </div>
  `,
  styles: [],
})
@DynamicForm({ type: 'earningOwnerList', formModule: 'dragon-show' })
export class EarningOwnerShowComponent implements OnInit {
  @Input() row: any;
  @Input() form: FormGroup;
  /** checker项 */
  public earningOwnerList: CheckersOutputModel[] = XnUtils.deepClone(shows);
  /** form */
  public earningOwnerListForm: FormGroup;
  public ctrl: AbstractControl;
  public xnOptions: XnInputOptions;
  cache: any;
  constructor(private er: ElementRef, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    if (this.row.data) {
      // 构建表单赋值
      this.earningOwnerList = this.getCacheRows();
      this.buildForm();
    }

    this.xnOptions = new XnInputOptions(
      this.row,
      this.form,
      this.ctrl,
      this.er
    );
  }

  /**
   * 根据值组装表单
   * @param
   */
  getCacheRows() {
    const shrhldListValue: any = JSON.parse(this.row.data) || [];
    this.earningOwnerList[0]['data'] = shrhldListValue[0];
    if (shrhldListValue.length > 1) {
      // 多组受益人信息 需要动态生成多组
      shrhldListValue.forEach((v: any, i: number) => {
        if (i !== 0) {
          this.addShrhld(v);
        }
      });
    }
    return this.earningOwnerList;
  }

  /**
   * 新增受益人
   * 往表单中增加一项股东信息checker
   * @param value checker项的value
   */
  addShrhld(value?: any) {
    const index = this.earningOwnerList
      .map((x) => x.type)
      .lastIndexOf('earningOwner');
      const uid = XnUtils.getUid();
    const checker = {
      checkerId: `earningOwner_${uid}`,
      required: true,
      type: 'earningOwner',
      title: '受益人信息详情',
      validators: {},
      options: {
        readonly: true,
      },
      flowId: 'sub_sh_prattwhitney_input',
      data: value ? value : '',
      other: '',
      name: `earningOwner_${uid}`,
    };
    this.earningOwnerList.splice(index + 1, 0, checker);
  }

  /**
   * 构建表单
   * @param
   */
  buildForm() {
    this.earningOwnerList = XnUtils.deepClone(this.earningOwnerList);
    for (const row of this.earningOwnerList) {
      XnFormUtils.convertChecker(row);
    }
    this.earningOwnerListForm = XnFormUtils.buildFormGroup(
      this.earningOwnerList
    );
  }

}

