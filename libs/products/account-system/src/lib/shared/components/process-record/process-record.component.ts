/*************************************************************************
 * Copyright (c) 2017 - 2022 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\account-system\src\lib\shared\components\process-record\process-record.component.ts
 * @summary：流程记录组件
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                HuCongying           init           2022-01-04
 ***************************************************************************/
import { Component, Input, OnInit } from '@angular/core';
import { RecordStepEnum } from 'libs/shared/src/lib/config/enum';
import { RecordStepOptions } from 'libs/shared/src/lib/config/options';
import { RecordConfig } from '../modal/interface';

@Component({
  selector: 'xn-time-line',
  template: `
    <div class="record-content">
      <nz-timeline *ngIf="recordList?.length; else empty">
        <nz-timeline-item
          *ngFor="let record of recordList"
          [nzDot]="isRejectRecord(record) ? rejectTemplate : passTemplate"
        >
          <h4 class="record-title">{{ record.recordStep | xnOption: recordStepOptions }}</h4>
          <div>
            {{ record.operatorAppName }} {{ record.operatorUserName }} 在
            {{ record.createTime }} 完成。
            <a
              *ngIf="record.remark"
              style="cursor: pointer"
              nz-popover
              nzPopoverTitle="备注"
              [nzPopoverContent]="contentTemplate"
              nzPopoverPlacement="top"
              nzPopoverTrigger="hover"
            >
            备注
            </a>
            <ng-template #contentTemplate>
              <div style="padding: 12px">
                <span>{{ record.remark }}</span>
              </div>
            </ng-template>
          </div>
        </nz-timeline-item>
      </nz-timeline>

      <ng-template #passTemplate>
        <i class="pass-icon" nz-icon nzType="check-circle" nzTheme="fill"></i>
      </ng-template>

      <ng-template #rejectTemplate>
        <i class="reject-icon" nz-icon nzType="close-circle" nzTheme="fill"></i>
      </ng-template>

      <ng-template #empty>
        <nz-empty nzNotFoundImage="simple"></nz-empty>
      </ng-template>
    </div>
  `,
  styles: [
    `
      .record-content {
        padding: 20px;
        min-height: 300px;
        overflow-y: auto;
      }
      .record-title {
        font-weight: bold;
      }
      .pass-icon {
        font-size: 18px;
      }
      .reject-icon {
        color: #de4040;
        font-size: 18px;
      }
    `,
  ],
})
export class XnTimeLineComponent implements OnInit {
  @Input() recordList: RecordConfig[] = [];

  get recordStepOptions(){
    return RecordStepOptions;
  }

  constructor() { }

  ngOnInit(): void { }

  /**
   * 是否退回操作
   * @param record
   * @returns
   */
  isRejectRecord(record: RecordConfig) {
    return [
      RecordStepEnum.OPEN_REJECT,
      RecordStepEnum.OPERATOR_REJECT,
      RecordStepEnum.BUSINESS_REJECT].includes(record.recordStep);
  }
}
