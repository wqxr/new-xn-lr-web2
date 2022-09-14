/*************************************************************************
 * Copyright (c) 2017 - 2022 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\account-system\src\lib\shared\components\modal\process-record.modal.ts
 * @summary：流程记录展示弹窗
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                HuCongying           init           2022-01-04
 ***************************************************************************/
import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { ProcessRecordModalParams } from './interface';
import { Observable } from 'rxjs';

@Component({
  template: `
    <nz-modal
      [nzWidth]="650"
      nzTitle="流程记录"
      [nzVisible]="isVisible"
      [nzFooter]="null"
      [nzMaskClosable]="false"
      (nzOnCancel)="closeModal()"
    >
      <xn-time-line [recordList]="params.recordList"></xn-time-line>
    </nz-modal>
  `,
  styles: [
    `
      ::ng-deep .ant-card-head-title {
        font-weight: bold;
      }
      ::ng-deep .ant-modal-body {
        max-height: 500px;
        overflow-y: scroll;
      }
      ::ng-deep .ant-modal-close .ant-modal-close-x {
        padding: 15px;
      }
    `,
  ],
})
export class XnProcessRecordModalComponent implements OnInit, AfterViewChecked {
  observer: any;
  // params
  params: ProcessRecordModalParams;
  isVisible = false;

  constructor(
    private cdr: ChangeDetectorRef,
    public hwModeService: HwModeService
  ) {}

  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
  }

  ngOnInit(): void {}

  /**
   * 打开模态框
   * @param params
   * @returns
   */
  open(params: ProcessRecordModalParams) {
    this.isVisible = true;
    this.params = Object.assign({}, this.params, params);
    return new Observable((observer) => {
      this.observer = observer;
    });
  }

  /**
   * 关闭modal框
   * @param value
   */
  private close(value: any) {
    this.isVisible = false;
    this.observer.next(value);
    this.observer.complete();
  }

  closeModal(): void {
    this.close(null);
  }
}
