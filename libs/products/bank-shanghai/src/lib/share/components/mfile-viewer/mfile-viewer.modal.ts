/*************************************************************************
 * Copyright (c) 2017 - 2020 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：xn-shared\src\lib\components\mfile-viewer\mfile-viewer.modal.ts
 * @summary：init mfile-viewer.modal.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  yutianbao        init             2020-09-12
 ***************************************************************************/
import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { ButtonGroup } from '../../../logic/table-button.interface';
import { FileViewerModel } from './interface';

@Component({
  selector: 'xn-mfile-viewer-modal',
  template: `
    <nz-modal
      [(nzVisible)]="isVisible"
      [nzWrapClassName]="params.nzWrapClassName"
      [nzTitle]="params.nzTitle"
      [nzStyle]="params.nzStyle"
      [nzWidth]="params.nzWidth"
      [nzContent]="modalContent"
      [nzMaskClosable]="params.nzMaskClosable"
      [nzClosable]="params.nzClosable"
      [nzFooter]="!!params.nzFooter ? modalFooter : null"
      [nzBodyStyle]="{'padding': '0px 5px'}"
      (nzOnCancel)="handleCancel()"
    >
      <ng-template #modalContent>
        <ng-container *ngIf="!!params?.filesList">
            <div nz-row>
                <div nz-col nzSm="24" nzMd="24" nzSpan="24" [ngStyle]="{'min-height': params.filesList.height || '100%'}">
                  <xn-mfile-viewer
                    [files]="params.filesList.files"
                    [current]="params.filesList?.current"
                    [showTools]="params.filesList?.showTools"
                    [width]="params.filesList?.width"
                    [height]="params.filesList?.height"
                  ></xn-mfile-viewer>
                </div>
            </div>
        </ng-container>
      </ng-template>
      <ng-template #modalFooter>
        <div nz-row>
            <ng-container *ngFor="let key of tableHeadBtnConfig">
                <div nz-col nzSm="12" nzMd="12" nzSpan="12" [ngClass]="{
                    'text-left': key === 'left', 'text-right': key === 'right'
                    }">
                    <ng-container *ngFor="let btn of params.buttons[key]">
                        <nz-space nzDirection="horizontal">
                            <nz-space-item>
                                <ng-container #normalBtnTpl>
                                    <button nz-button nzType="primary" type="button"
                                        (click)="handleBtnClick(btn)">
                                        <i *ngIf="!!btn.icon" nz-icon [nzType]="btn.icon" nzTheme="outline"></i>{{btn.label}}
                                    </button>
                                </ng-container>
                            </nz-space-item>
                        </nz-space>
                    </ng-container>
                </div>
            </ng-container>
        </div>
      </ng-template>
    </nz-modal>
  `,
  styles: [`
  ::ng-deep .vertical-center-modal {
      display: flex;
      align-items: center;
      justify-content: center;
  }
  ::ng-deep .vertical-center-modal .ant-modal {
    top: 15px;
  }
  ::ng-deep .ant-modal-close .ant-modal-close-x {
    padding: 15px;
  }
  `]
})
export class MFileViewerModalComponent {
  public params: FileViewerModel = {} as FileViewerModel;
  private observer: any;
  public isVisible = true;
  get tableHeadBtnConfig() {
    return Object.keys(this.params.buttons) || [];
  }

  constructor() {
    this.params.nzTitle = '';
    this.params.nzFooter = false;
    this.params.nzMaskClosable = true;
    this.params.nzClosable = true;
    this.params.nzStyle = {};
    this.params.nzWrapClassName = 'vertical-center-modal';
    this.params.buttons = { left: [], right: [] };
    this.params.nzWidth = 1000;
    // this.params.filesList.showTools = true;
    // this.params.filesList.width = '100%';
  }

  /**
   * @description: 打开模态框
   * @param {*}
   * @return {*}
   */
  open(params: FileViewerModel) {
    this.isVisible = true;
    this.params = Object.assign({}, this.params, params);
    console.log('open-------', params, this.params);
    if (params.delayTime) {
      setTimeout(() => {
        this.handleCancel();
      }, params.delayTime);
    }
    return new Observable(observer => {
      this.observer = observer;
    });
  }

  /**
   * 自定义按钮事件
   */
  handleBtnClick(btn: ButtonGroup) {
    if (btn.btnKey === 'ok') {
      this.handleSubmit({});
    } else if (btn.btnKey === 'cancel') {
      this.handleCancel();
    }
    this.isVisible = false;
  }

  /**
   * @description: 提交
   * @param {object} e
   * @return {*}
   */
  public handleSubmit(e: { [key: string]: any }) {
    this.close({
      action: 'ok',
      params: { ...e }
    });
  }

  /**
   * @description: 取消
   * @param {*}
   * @return {*}
   */
  public handleCancel() {
    this.close({
      action: 'cancel'
    });
  }

  /**
   * @description: 关闭modal框
   * @param {*} value
   * @return {*}
   */
  private close(value) {
    this.isVisible = false;
    this.observer.next(value);
    this.observer.complete();
  }
}
