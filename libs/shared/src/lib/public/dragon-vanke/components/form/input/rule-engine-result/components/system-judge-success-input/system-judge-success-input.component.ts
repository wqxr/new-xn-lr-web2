
/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\shared\src\lib\public\dragon-vanke\components\form\input\rule-engine-result\components\system-judge-success-input\system-judge-success-input.component.ts
* @summary：规则引擎系统判断规则通过组件
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                 hucongying          init           2021-09-08
***************************************************************************/

import { Component, OnInit, Input, ViewContainerRef } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Column, TableData } from '@lr/ngx-table';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { RuleHandTypeEnum, RuleValidTypeEnum } from 'libs/shared/src/lib/config/enum';
import { VaildTypeOptions } from 'libs/shared/src/lib/config/options';
import { DragonMfilesViewModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/mfiles-view-modal.component';
import { XnService } from 'libs/shared/src/lib/services/xn.service';

@Component({
  selector: 'xn-rule-engine-success-sys-input',
  templateUrl: './system-judge-success-input.component.html',
  styles: [
    `
    .rule-index {
      font-size: 16px;
    }

    .rule-index span {
      margin-left: 10px;
      font-weight: bold;
      font-size: 17px;
    }

    .rule-clump {
      font-size: 16px;
    }

    .rule-clump span {
      margin-left: 10px;
      font-weight: bold;
      font-size: 17px;
    }
    `
  ]
})

@DynamicForm({ type: 'rule-engine-success-sys', formModule: 'dragon-input' })
export class XnRuleEngineSuccessInputComponent implements OnInit {
  @Input() row: any;
  @Input() form: FormGroup;
  @Input() svrConfig: any;
  public ctrl: AbstractControl;
  // 表头
  public headsColumns: Column[] = [
    {
      title: '序号', index: 'no', format: (item: TableData, col: Column, index: number): string =>
        (index + 1).toString(), width: 60
    },
    { title: '规则引擎结果', index: 'result', width: 60, render: 'ResultTpl' },
    { title: '校验类型', index: 'validateType', width: 70, render: 'VaildTypeTpl' },
    { title: '规则名称', index: 'ruleName', render: 'ruleNameTpl' },
    { title: '指标内容', index: 'indexList',render: 'indexTpl', },
    { title: '规则编号', index: 'ruleCode', width: 80, },
    { title: '操作', index: 'action', fixed: 'right', render: 'ActionTpl',width:100 },
  ];
  // 节点信息
  public pointInfo: any = {};
  // 规则集信息
  public rsList: any[] = [];

  // 校验类型option
  get vaildTypeOptions() {
    return VaildTypeOptions
  }
  // 校验类型enum
  get ruleValidTypeEnum() {
    return RuleValidTypeEnum
  }

  // 强提醒处理方式类型enum
  get ruleHandTypeEnum() {
    return RuleHandTypeEnum
  }

  get readonly() {
    return this.row.options.readonly
  }
  constructor(
    private xn: XnService,
    private vcr: ViewContainerRef,
  ) { }
  ngOnInit() {
    this.ctrl = this.form.get(this.row.name);
    if (this.row.value) {
      const pointInfo = JSON.parse(this.row.value)
      XnUtils.jsonToHump(pointInfo)
      this.pointInfo = XnUtils.deepClone(pointInfo)
      this.rsList = this.pointInfo.rsList
    }
  }

  /**
    *  查看文件
    * @param paramFile
    */
  public onViewFile(paramFile: any) {
    let fileList = JSON.parse(paramFile)
    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      DragonMfilesViewModalComponent,
      fileList
    ).subscribe(() => { });
  }

  /**
   * 删除文件
   * @param item
   * @param i
   * @param index
   */
  delFile(item: any, i: number, index: number) {
    item.file = '';
    this.rsList[i]['ruleList'][index]['file'] = '';
    this.toValue()
  }

  /**
   * 操作按钮
   * @param vaildType 规则校验类型
   * @param ruleValidType
   * @returns
   */
  actionType(vaildType: number, ruleValidType: number) {
    return vaildType === ruleValidType
  }

  /**
   * 备注按钮
   * @param item 规则信息
   * @param handType 强提醒处理方式
   * @returns
   */
  showMark(item: any, handType: string) {
    return item['validateType'] === RuleValidTypeEnum.STRONG_REMINDER && item['handleType'].split(',').includes(handType);
  }

  /**
   * 赋值
   */
  toValue() {
    const fromValue = XnUtils.deepClone(this.pointInfo);
    XnUtils.jsonToUnderline(fromValue);
    this.ctrl.setValue(JSON.stringify(fromValue));
  }
}
