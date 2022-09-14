
/*************************************************************************
 * Copyright (c) 2017 - 2022 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\account-system\src\lib\pages\account-list\flow-list\flow-list.component.ts
 * @summary：流程审核设置页面
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                 hucongying          init           2022-01-11
 ***************************************************************************/
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Column, TableData } from '@lr/ngx-table';
import { NzMessageService } from 'ng-zorro-antd/message';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { FlowCheckValueOptions, FlowTypeOptions } from 'libs/shared/src/lib/config/options'
import { RetCodeEnum } from 'libs/shared/src/lib/config/enum';
import { XnTableComponent } from '@lr/ngx-table/lib/table.component';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';

@Component({
  selector: 'xn-account-flow-list',
  templateUrl: './flow-list.component.html',
  styles: [
    `
      .table-content {
        padding: 10px;
        position: relative;
      }
    `,
  ],
})
export class AccountFlowListComponent implements OnInit {
  // @Input
  // 表格数据
  listInfo: any[] = [] as any;
  // 表头
  columns: Column[] = [
    {
      title: '序号', index: 'no', width: 50, fixed: 'left',
      format: (item: TableData, col: Column, index: number): string => (index + 1).toString()
    },
    { title: '流程类型', index: 'flowType', render: 'flowTypeTpl', width: 260, },
    { title: '是否需要审核', index: 'needAudit', render: 'yesTpl', width: 150, },
    { title: '是否需要复核', index: 'needReview', render: 'yesTpl', width: 150, },
    {
      title: '操作', index: 'action', fixed: 'right', width: 160, buttons: [
        {
          text: '审核设置',
          type: 'link',
          click: (record: TableData, modal?: any, instance?: XnTableComponent) => {
            this.setChecker(record);
          }
        },
      ]
    },
  ];
  // 流程ID
  flowId = '';

  // modelForm
  modelForm = new FormGroup({});
  // formModel
  formModel: any = {};
  modalOptions: FormlyFormOptions = {};
  // formModel
  formFields: FormlyFieldConfig[] = [
    {
      className: 'ant-col ant-col-md-24 ant-col-sm-24',
      wrappers: ['form-field-horizontal'],
      key: 'needAudit',
      type: 'radio',
      templateOptions: {
        label: '是否需要初审',
        labelSpan: 10,
        controlSpan: 14,
        required: true,
        options: FlowCheckValueOptions,
      },
    },
    {
      className: 'ant-col ant-col-md-24 ant-col-sm-24',
      wrappers: ['form-field-horizontal'],
      key: 'needReview',
      type: 'radio',
      templateOptions: {
        label: '是否需要复核',
        labelSpan: 10,
        controlSpan: 14,
        required: true,
        options: FlowCheckValueOptions,
      },
    },
  ];
  isLoading: boolean = false;
  isVisible = false;

  get flowTypeOptions() {
    return FlowTypeOptions;
  }
  constructor(
    private xn: XnService,
    public hwModeService: HwModeService,
    private cdr: ChangeDetectorRef,
    private message: NzMessageService,
  ) { }
  ngOnInit(): void {
    this.onPage();
  }

  /**
   * @summary
   */
  public onPage() {
    this.xn.middle.post2('/flow/config/info', {}).subscribe({
      next: (res: any) => {
        if (res.code === RetCodeEnum.OK) {
          this.listInfo = res.data.configList;
          this.cdr.markForCheck();
        }
      }
    });
  }

  /**
  * 审核配置
  */
  setChecker(record: TableData) {
    const { needAudit, needReview } = record;
    this.formModel = {
      needAudit: needAudit ? true : false,
      needReview: needReview ? true : false,
    }
    this.flowId = record.flowId;
    this.isVisible = true;
  }

  /**
   * 提交审核配置
   */
  modalOK() {
    const { needAudit, needReview } = this.formModel;
    const params = {
      flowId: this.flowId,
      needAudit,
      needReview,
    }
    this.isLoading = true;
    this.xn.middle
      .post2('/flow/config/update', params)
      .subscribe({
        next: (res: any) => {
          this.isLoading = false;
          if (res.code === RetCodeEnum.OK) {
            this.closeModal();
            this.message.success('设置成功');
            this.onPage();
          }
        },
        error: (err) => {
          this.isLoading = false;
        }
      });
  }

  closeModal() {
    this.modelForm.reset();
    this.isVisible = false;
    this.isLoading = false;
    this.flowId = '';
  }

}
