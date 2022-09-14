/*************************************************************************
 * Copyright (c) 2017 - 2020 北京希为科技有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：xn-shared\src\lib\components\file-viewer\file-viewer.modal.ts
 * @summary：init file-viewer.modal.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  WuShenghui        init             2020-09-12
 ***************************************************************************/
import { ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { Observable } from 'rxjs';
import { FileSignComponent } from './file-sign.component';
import { clickParams, FileInfo, FileSignData } from './interface';

@Component({
  selector: 'xn-file-sign-modal',
  template: `
    <nz-modal
      [(nzVisible)]="isVisible"
      [nzFooter]="modalFooter"
      (nzOnCancel)="handleCancel()"
      [nzMaskClosable]="maskClosable"
      [nzWidth]="1100"
      nzTitle="文件签收"
      [nzBodyStyle]="{'padding': '0px 5px 0px 0px'}"
    >
      <nz-layout>
        <nz-sider nzWidth="241" nzTheme="light">
          <nz-list nzItemLayout="horizontal" nzSize="large" [nzFooter]="footerTpl">
            <nz-list-item *ngFor="let filesObj of filesList" class="lists-item" [ngClass]="{'item-active': filesObj.selected}" (click)="switchFileItem(filesObj)">
              <span>
                <i nz-icon nzType="check-circle" nzTheme="fill" [ngStyle]="{'color': !!filesObj.signStatus ? '#40BD78' : '', 'margin-right': '5px'}"></i>
                {{ filesObj.label }}
              </span>
            </nz-list-item>
            <nz-list-empty *ngIf="!filesList.length"></nz-list-empty>
            <ng-template #footerTpl>
              <button nz-button nzType="default" (click)="handleCancel()">关闭</button>
            </ng-template>
          </nz-list>
        </nz-sider>
        <nz-layout>
          <nz-content>
            <xn-file-sign
              #fileSign
              [files]="currentFiles"
              [current]="data.current"
            ></xn-file-sign>
          </nz-content>
        </nz-layout>
      </nz-layout>

      <ng-template #modalFooter>
        <div nz-row>
          <div nzSpan="24" class="text-center">
            <button nz-button nzType="primary" [disabled]="!currentFiles.length || !!currentFilesObjStatus"
              (click)="handleFieSign()">
              {{!!currentFilesObjStatus ? '已签收' : '确认原件已签收'}}
            </button>
          </div>
        </div>
      </ng-template>
    </nz-modal>
  `,
  styles: [`
  /* ::ng-deep .ant-modal-body {
    padding: 0px 5px 0px 0px !important;
  } */
  ::ng-deep .ant-modal-header {
    padding: 16px 10px !important;
  }
  /* ::ng-deep .ant-modal-footer {
    text-align: center;
  } */
  .text-center {
    text-align: center;
  }
  ::ng-deep .ant-layout {
    min-height: 430px !important;
  }
  ::ng-deep .ant-layout-sider {
    width: 210px !important;
    border-right: 1px solid #f0f0f0;
    border-radius: 2px 2px 0 0;
  }
  ::ng-deep .ant-list-footer {
    text-align: center;
  }
  ::ng-deep .ant-layout-content {
    width: 885px;
  }
  ::ng-deep .ant-modal-close .ant-modal-close-x {
    padding: 15px;
  }
  .lists-item {
    cursor: pointer;
    font-size: 15px;
  }
  .lists-item:hover {
    background-color: #efeded !important;
  }
  .item-active {
    background-color: #E0EEFF !important;
  }
  `]
})
export class FileSignModal {
  @Input() data: FileSignData;
  @ViewChild('fileSign') fileSign: FileSignComponent;
  filesList: FileInfo[] = [];
  currentFilesObj: FileInfo;
  maskClosable = false;
  // current: any;
  isVisible = false;
  observer: any;

  get currentFilesObjStatus() {
    return !!this.currentFilesObj?.signStatus;
  }
  get currentFiles() {
    return this.currentFilesObj?.files || [];
  }

  constructor(private xn: XnService, private cdr: ChangeDetectorRef) {
  }

  showModal(): Observable<clickParams> {
    this.filesList = this.data.filesList;
    this.isVisible = true;
    this.switchFileItem(this.filesList[0]);
    return new Observable((observer) => {
      this.observer = observer;
    });
  }

  /**
   * 文件切换
   */
  switchFileItem(filesObj: FileInfo) {
    this.filesList.map((x: any) => {
      x.selected = x.value === filesObj.value;
    });
    this.currentFilesObj = this.filesList.find((y: any) => y.value === filesObj.value);
    // this.current = this.currentFilesObj.files[0];
    this.cdr.markForCheck();
    this.cdr.detectChanges();
    this.fileSign.tplViewer?.instance?.update();
    // console.log('switchFileItem=', this.currentFiles, this.currentFilesObj);
  }

  /**
   * 签收文件
   */
  handleFieSign() {
    const { filesList, appId, postUrl } = this.data;
    const signStatusObj: {[key: string]: any} = {};
    this.filesList.filter((x: any) => !!x.selected).map((y: any) => {
      signStatusObj[`${y.value}`] = 1;
    });
    this.xn.dragon.post(postUrl, { appId, ...signStatusObj }).subscribe((v: any) => {
      if (v && v.ret === 0){
        const fileIndex = this.filesList.findIndex((x: any) => x.value === this.currentFilesObj.value);
        this.filesList[fileIndex].signStatus = 1;
        this.currentFilesObj.signStatus = 1;
      }
    });
  }

  handleCancel() {
    this.close({
      action: 'cancel'
    });
  }

  handleOk() {
    this.close({
      action: 'ok',
      params: {}
    });
  }

  close(value: clickParams) {
    this.isVisible = false;
    this.observer.next(value);
    this.observer.complete();
  }

}
