/*************************************************************************
 * Copyright (c) 2017 - 2022 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\account-system\src\lib\shared\components\check-card\check-card.component.ts
 * @summary：审核信息card组件
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                HuCongying           init           2022-01-05
 ***************************************************************************/
import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@lr/ngx-formly';
import { CheckRequestService } from '../../services/check-request.service';
import { XnProcessRecordModalComponent } from '../modal/process-record.modal';
import { ShowModalService } from '../../services/show-modal.service';

@Component({
  selector: 'xn-account-check-card',
  template: `
    <div>
      <form style="position: relative" nz-form nzLayout="vertical">
        <xn-formly
          [form]="form"
          [model]="model"
          [fields]="showFields"
        >
        </xn-formly>
        <div class="record-link">
          <a (click)="viewRecord()">查看流程记录</a>
        </div>
      </form>
    </div>
  `,
  styles: [
    `
      ::ng-deep .ant-card-head-title {
        font-weight: bold;
      }
      ::ng-deep .ant-card {
        margin-bottom: 20px;
      }
      ::ng-deep .ant-picker {
        width: 100%;
      }
      ::ng-deep .ant-modal-close .ant-modal-close-x {
        padding: 15px;
      }
      .record-link {
        position: absolute;
        top: 15px;
        right: 10px;
      }
    `,
  ],
})
export class AccountCheckCardComponent implements OnInit {
  /** 账户Id */
  @Input() accountId: string;
  /** 操作记录类型 */
  @Input() recordType: string;
  @Input() form: FormGroup;
  @Input() model: any;
  // 审核信息表单
  showFields: FormlyFieldConfig[] = [
    {
      wrappers: ['card'],
      className: 'filed-card',
      fieldGroupClassName: 'ant-row',
      templateOptions: {
        nzTitle: '审核信息',
      },
      fieldGroup: [
        {
          className: 'ant-col ant-col-md-8 ant-col-sm-24',
          wrappers: ['form-field-horizontal'],
          key: 'auditResult',
          type: 'radio',
          templateOptions: {
            label: '审核结果',
            nzShowSearch: true,
            required: true,
            labelSpan: 15,
            controlSpan: 22,
            options: [
              { label: '审核通过', value: true },
              { label: '审核退回', value: false },
            ],
          },
        },
        {
          className: 'ant-col ant-col-md-8 ant-col-sm-24',
          wrappers: ['form-field-horizontal'],
          key: 'nowFlow',
          type: 'input',
          templateOptions: {
            label: '当前审核步骤',
            nzShowSearch: true,
            required: false,
            disabled: true,
            labelSpan: 15,
            controlSpan: 18,
          },
        },
        {
          className: 'ant-col ant-col-md-8 ant-col-sm-24',
          wrappers: ['form-field-horizontal'],
          key: 'checker',
          type: 'input',
          templateOptions: {
            label: '审核人',
            required: false,
            disabled: true,
            labelSpan: 15,
            controlSpan: 18,
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
            required: false,
            labelSpan: 15,
            controlSpan: 22,
          },
        },
      ],
    },
  ];

  constructor(
    private xn: XnService,
    private vcr: ViewContainerRef,
    private checkRequestService: CheckRequestService,
    private showModal: ShowModalService,
  ) { }
  ngOnInit(): void { }

  /**
   * 查看流程记录
   */
  async viewRecord() {
    const params = await this.checkRequestService.viewRecord({ accountId: this.accountId, recordType: this.recordType });
    this.showModal
      .openModal(this.xn, this.vcr, XnProcessRecordModalComponent, params)
      .subscribe();
  }
}
