/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\account-system\src\lib\shared\components\modal\file-viewer.modal.ts
 * @summary：init ProtocolFileViewerModal
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                HuCongying           init           2021-11-01
 ***************************************************************************/
import { Component } from '@angular/core';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { Observable } from 'rxjs';
import { ScrollEvent } from '../../directives';
import { FileViewerModel } from './interface';

@Component({
  selector: 'xn-protocol-file-viewer-modal',
  template: `
    <nz-modal
      [(nzVisible)]="isVisible"
      [nzMaskClosable]="false"
      [nzFooter]="modalFooter"
      (nzOnCancel)="handleCancel()"
      [nzWidth]="params.nzWidth"
      [nzTitle]="params.nzTitle"
    >
      <xn-protocol-file-viewer
        (onSrcollEvent)="handSrcollEvent($event)"
        [bottomOffset]="bottomOffset"
        [topOffset]="topOffset"
        [files]="params.filesList.files"
        [current]="params.filesList.current"
      ></xn-protocol-file-viewer>

      <ng-template #modalFooter>
        <div nz-row>
          <div nz-col nzSpan="12" style="text-align: left;">
            <button
              nz-button
              nzType="primary"
              [nzLoading]="isLoadingDownload"
              (click)="downLoadProtocol($event)"
            >
              下载附件
            </button>
            <button nz-button nzType="default" (click)="handleCancel()">
              取消
            </button>
          </div>
          <div nz-col nzSpan="12" style="text-align: right;">
            <ng-container *ngIf="!params.options?.readonly">
              <span style="margin-right: 10px;">请您仔细阅读至最后一页</span>
              <button
                [disabled]="unread"
                nz-button
                nzType="primary"
                (click)="handleSubmit()"
              >
                我已阅读并同意
              </button>
            </ng-container>
            <ng-container *ngIf="params.options?.readonly">
              <button nz-button nzType="primary" (click)="handleSubmit()">
                确定
              </button>
            </ng-container>
          </div>
        </div>
      </ng-template>
    </nz-modal>
  `,
  styles: [
    `
      ::ng-deep .ant-modal-close .ant-modal-close-x {
        padding: 15px;
      }
      ::ng-deep .ng2-pdf-viewer-container {
        overflow: unset !important;
      }
    `,
  ],
})
export class ProtocolFileViewerModal {
  isVisible = false;
  params: FileViewerModel;
  observer: any;
  /** 滚动条触底距离 */
  bottomOffset = 500;
  topOffset = 50;
  unread: boolean = true;
  isLoadingDownload: boolean = false;

  constructor(private xn: XnService) {}

  /**
   * 打开模态框
   * @param params
   * @returns
   */
  open(params: FileViewerModel) {
    this.isVisible = true;
    this.params = Object.assign({}, this.params, params);
    return new Observable((observer) => {
      this.observer = observer;
    });
  }

  /**
   * 滚动条事件
   * @param event
   */
  handSrcollEvent(event: ScrollEvent) {
    this.unread = !event.isReachingBottom;
  }

  /**
   * 提交
   * @param e
   */
  public handleSubmit(e: { [key: string]: any }) {
    this.close({
      action: true,
      params: { ...e },
    });
  }

  /**
   * 取消
   */
  public handleCancel() {
    this.close({
      action: false,
    });
  }

  /**
   * 下载文件
   */
  downLoadProtocol(e: Event) {
    e.preventDefault();
    this.isLoadingDownload = true;
    this.xn.middle
      .getFileDownload('/account/service/protocol', {
        accountId: this.params.options.accountId,
      })
      .subscribe((res) => {
        this.isLoadingDownload = false;
        const fileName = this.xn.middle.getFileName(res.Body.headers);
        this.xn.middle.save(res.Body.body, fileName);
      });
  }

  /**
   * 关闭modal框
   * @param value
   */
  private close(value: { action: boolean; params?: any }) {
    this.isVisible = false;
    this.observer.next(value);
    this.observer.complete();
  }
}
