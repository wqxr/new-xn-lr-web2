/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\account-system\src\lib\shared\components\formly-form\idcard-upload\idcard-input.component.ts
 * @summary：证件文件+审核状态组件
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                HuCongying           init           2021-11-11
 ***************************************************************************/
import { Component, OnInit } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';

@Component({
  selector: 'xn-formly-field-idcard-upload',
  template: `
    <div
      *ngIf="to.readonly"
      class="card-input ant-input ant-input-disabled"
    >
      <a
        *ngIf="to.checkInfo.fileName;"
        (click)="onPreviewFile($event)"
        class="ant-col-18"
        style="word-break: break-all;"
        [title]="to.checkInfo.fileName"
        >{{ showFileName(to.checkInfo.fileName) }}</a
      >
      <a
        *ngIf="to.checkInfo.showReason; else normal"
        nz-tooltip
        [nzTooltipTitle]="to.checkInfo.checkReason"
        class="ant-col-6"
        [ngStyle]="{ color: to.checkInfo.nzColor }"
        style="text-align: right;"
      >
        <i nz-icon [nzType]="to.checkInfo.iconType" nzTheme="outline"></i>
        {{ to.checkInfo.checkText }}
      </a>
      <ng-template #normal>
        <a
          class="ant-col-6"
          [ngStyle]="{ color: to.checkInfo.nzColor }"
          style="text-align: right;"
        >
          <i nz-icon [nzType]="to.checkInfo.iconType" nzTheme="outline"></i>
          {{ to.checkInfo.checkText }}
        </a>
      </ng-template>
    </div>
    <ng-container *ngIf="!to.readonly">
      <nz-upload
        ngDefaultControl
        [formControl]="formControl"
        [nzType]="to.nzType"
        [nzLimit]="to.nzLimit"
        [nzSize]="to.nzSize"
        [nzFileType]="to.nzFileType"
        [nzAccept]="to.nzAccept"
        [nzAction]="to.nzAction"
        [nzBeforeUpload]="to.beforeUpload"
        [nzCustomRequest]="to.nzCustomRequest"
        [nzData]="to.nzData"
        [nzFilter]="to.nzFilter"
        [(nzFileList)]="to.nzFileList"
        [nzDisabled]="to.nzDisabled"
        [nzHeaders]="to.nzHeaders"
        [nzListType]="to.nzListType"
        [nzMultiple]="to.nzMultiple"
        [nzName]="to.nzName"
        [nzShowUploadList]="to.nzShowUploadList"
        [nzShowButton]="to.nzShowButton"
        [nzWithCredentials]="to.nzWithCredentials"
        [nzPreview]="onPreview.bind(this)"
        [nzPreviewFile]="to.previewFile"
        [nzRemove]="to.onRemove"
        [nzDirectory]="to.directory"
        [nzTransformFile]="to.nzTransformFile"
        [nzIconRender]="to.nzIconRender"
        [nzFileListRender]="to.nzFileListRender"
        (nzFileListChange)="onFileListChange($event)"
        (nzChange)="onChange($event)"
      >
        <ng-container *ngIf="to.nzListType === 'text'; else plus">
          <div class="upload-btn">
            <button
              nz-button
              (click)="onClick($event)"
              [disabled]="to.nzDisabled"
            >
              <i nz-icon nzType="upload"></i>
              <span>点击上传</span>
            </button>
            <div>支持文件格式: {{ to.nzAccept }}</div>
          </div>
        </ng-container>
      </nz-upload>
      <ng-template #plus>
        <i nz-icon nzType="plus"></i>
      </ng-template>
    </ng-container>
  `,
  styles: [
    `
      .card-input {
        display: flex;
        min-height: 32px;
      }
      .upload-btn {
        display: flex;
        align-items: flex-end;
      }
      .upload-btn div {
        color: #7078809e;
        padding-left: 8px;
      }
    `,
  ],
})
export class IdcardUploadComponent extends FieldType implements OnInit {
  viewer: any;
  beforeUpload = false;
  beforeUploadList: NzUploadFile[] = [];
  nzFileListChange: any;

  defaultOptions = {
    templateOptions: {
      /** check file */
      checkInfo: {},
      onPreviewFile: () => {},
      /** upload */
      nzType: 'select',
      nzLimit: 0,
      nzSize: 0,
      nzFileType: 'image/png,image/jpeg,image/gif,image/bmp',
      nzAccept: 'image/png',
      nzAction: '/upload',
      nzCustomRequest: null,
      nzData: {},
      nzFilter: [],
      nzFileList: [],
      nzDisabled: false,
      nzHeaders: {},
      nzListType: 'text',
      nzMultiple: false,
      nzName: 'file',
      nzShowUploadList: true,
      nzShowButton: true,
      nzWithCredentials: false,
      nzIconRender: null,
      nzFileListRender: null,
      fileKey: 'fileId',
    },
  };

  private _fileList: { fileId: string; name: string; url: string }[] = [];

  get fileList() {
    return this._fileList;
  }

  constructor() {
    super();
  }

  ngOnInit() {
    this.formControl.valueChanges.subscribe((e) => {
      if (e === null) {
        this.to.nzFileList = [];
        this._fileList = [];
      }
    });

    setTimeout(() => {
      const { nzFileList } = this.to;
      if (nzFileList) {
        this.setFieldValue(nzFileList);
      }
    });
  }

  onPreviewFile(event: MouseEvent) {
    event.preventDefault();
    if (this.to.onPreviewFile) {
      this.to.onPreviewFile();
    }
  }

  onClick(event: MouseEvent) {
    event.preventDefault();
  }

  onPreview(e: any) {
    if (this.to.onPreview) {
      this.to.onPreview(e, this);
    }
  }

  onRemove() {
    return true;
  }

  onChange(value: NzUploadChangeParam) {
    if (value.type === 'success') {
      const data = value.fileList.map((x) =>
        x.response ? x.response.data : x
      );
      if (data) {
        this.setFieldValue(data);
      }
    }
  }

  onFileListChange(value: any[]) {
    if (value.length === 0) {
      this.setFieldValue([]);
      return;
    }

    const model = this.model[`${this.field.key}`];
    if (Array.isArray(model)) {
      const data = model.filter(
        (x: any) =>
          value.findIndex(
            (y) =>
              y[this.to.fileKey] === x[this.to.fileKey] ||
              y.response.data[this.to.fileKey] === x[this.to.fileKey]
          ) >= 0
      );
      this.setFieldValue(data);
    }
  }

  private setFieldValue(value: any) {
    // TODO: filter upload fail
    this.model[`${this.field.key}`] = value;
    this.formControl.setValue(value);
    this._fileList = value.map((x: any) => ({
      fileId: x.fileId,
      name: x.fileName,
      url: x.key,
    }));
  }

  showFileName(fileName: string):string {
    return fileName.length>=20 ? `${fileName.substring(0,20)}...` : fileName;
  }

}
