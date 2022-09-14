
/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\shared\src\lib\public\dragon-vanke\components\form\input\rule-engine-result\components\artificial-judge-error\artificial-judge-error-input.component.ts
* @summary：规则引擎人工判断规则异常组件
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                 hucongying          init           2021-09-07
***************************************************************************/

import { Component, OnInit, ElementRef, Input, ChangeDetectorRef, ViewContainerRef } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Column, TableData } from '@lr/ngx-table';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { DragonMfilesViewModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/mfiles-view-modal.component';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'xn-rule-engine-success-artifical-input',
  templateUrl: './artificial-judge-success-input.component.html',
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

@DynamicForm({ type: 'rule-engine-success-artifical', formModule: 'dragon-input' })
export class XnRuleEngineSuccessManagerInputComponent implements OnInit {
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
    { title: '合同类型/款项性质', index: 'file_nature_child_option_name',width:150 },
    { title: '标记类别', index: 'file_classify_name' ,width:100},
    { title: '人工审核标准', index: 'standardNameList', render: 'StandardTpl',width:150 },
    { title: '操作', index: 'action', fixed: 'right', render: 'ActionTpl',width:100 },
  ];
  // 人工审核文件类型及审核标准数据
  public standardErrorList: any[] = [];
  get readonly() {
    return this.row.options.readonly
  }
  constructor(
    private er: ElementRef,
    private xn: XnService,
    private cdr: ChangeDetectorRef,
    private vcr: ViewContainerRef,
    private $modal: NzModalService,
  ) { }
  ngOnInit() {
    this.ctrl = this.form.get(this.row.name);
    if (this.row.value) {
      const manualReview = JSON.parse(this.row.value);
      const file_type_list = XnUtils.distinctArray(manualReview.map(standard => standard.file_type_id));
      // 依据文件类型 file_type_id将人工审核标准数据分类
      this.standardErrorList = file_type_list.map(file_type => {
        const standardList = manualReview.filter(standard => standard.file_type_id === file_type);
        return {
          file_type_id: file_type,
          file_type_name: standardList[0]['file_type_name'],
          standardList,
        }
      })
    } else {
      this.standardErrorList = []
    }
  }

  /**
   *  查看文件
   * @param paramFile
   */
  public onView(paramFile: any) {
    let fileList = JSON.parse(paramFile)
    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      DragonMfilesViewModalComponent,
      fileList
    ).subscribe(() => { });
  }

  /**
   * 赋值
   */
  toValue() {
    let manualReview: any[] = [];
    this.standardErrorList.map(standrd => {
      standrd.standardList.map(rule => {
        manualReview.push(rule)
      })
    });
  }

  /**
   * 删除补充文件
   * @param item 审核标准
   * @param i 当前审核标准下标
   * @param index 当前标记类别下标
   */
  delFile(item: any, stand_index: number, index: number, i: number) {
    this.$modal.confirm({
      nzTitle: '温馨提示',
      nzContent: '确定要删除吗？',
      nzOkType: 'primary',
      nzOnOk: () => {
        item.file = '';
        this.standardErrorList[stand_index]['standardList'][index]['standardNameList'][i]['file'] = '';
        this.cdr.detectChanges()
        this.toValue()
      },
    });
  }

  /**
   * 删除备注
   * @param item 审核标准
   * @param i 当前审核标准下标
   * @param index 当前标记类别下标
   */
  delMark(item: any, stand_index: number, index: number, i: number) {
    this.$modal.confirm({
      nzTitle: '温馨提示',
      nzContent: '确定要删除吗？',
      nzOkType: 'primary',
      nzOnOk: () => {
        item.user_remark = ''
        this.standardErrorList[stand_index]['standardList'][index]['standardNameList'][i]['user_remark'] = '';
        this.cdr.detectChanges()
        this.toValue()
      },
    });
  }
}
