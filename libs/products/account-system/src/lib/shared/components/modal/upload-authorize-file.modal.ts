/*************************************************************************
 * Copyright (c) 2017 - 2022 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\account-system\src\lib\shared\components\modal\upload-authorize-file.modal.ts
 * @summary：init XnUploadAuthorizeModalComponent
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                HuCongying           init           2022-03-07
 ***************************************************************************/
import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { AuthorizationParams, AuthorizeModalParams } from './interface';
import { Observable } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import {
  NzUploadChangeParam,
  NzUploadFile,
  UploadFilter,
} from 'ng-zorro-antd/upload';
import { MinUtils } from '../../utils';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { FileViewerService } from '@lr/ngx-shared';

@Component({
  template: `
    <nz-modal
      nzTitle="上传授权书"
      [nzWidth]="800"
      [nzVisible]="isVisible"
      [nzClosable]="true"
      [nzFooter]="cFooter"
      [nzMaskClosable]="false"
      (nzOnCancel)="closeModal()"
    >
      <div style="padding: 50px 0 150px;">
        <div style="margin-bottom: 15px;" nz-row>
          <div nz-col nzSpan="20" nzOffset="4">
          {{ tipText }}
          </div>
        </div>
        <div nz-row>
          <div nz-col nzSpan="2" nzOffset="4">
            <div class="label-title">授权书</div>
          </div>
          <div nz-col nzSpan="18">
            <nz-upload
              nzAction="middle-ground/api/file/upload"
              [nzFileList]="fileList"
              [nzFilter]="filters"
              [nzShowUploadList]="showIcon"
              [nzBeforeUpload]="beforeUpload"
              [nzRemove]="onRemoved"
              [nzPreview]="previewFile"
              (nzChange)="handleChange($event)"
            >
              <button nz-button nzType="primary">上传文件</button>
            </nz-upload>
            <span class="upload-tip"
              >支持文件格式：.pdf,.jpg,.jpeg,.png
              <a style="margin-right: 10px" (click)="downloadTemplate()"
                >模板下载</a
              ></span
            >
          </div>
        </div>
      </div>

      <ng-template #cFooter>
        <button
          nz-button
          nzType="default"
          (click)="closeModal()"
        >
          取消
        </button>
        <button
          nz-button
          nzType="primary"
          [disabled]="!fileList.length"
          (click)="modalOK()"
        >
          确定
        </button>
      </ng-template>
    </nz-modal>
  `,
  styles: [
    `
      .label-title::before {
        display: inline-block;
        margin-right: 4px;
        color: #ff4d4f;
        font-size: 14px;
        font-family: SimSun, sans-serif;
        line-height: 1;
        content: '*';
      }
      .upload-tip {
        position: absolute;
        top: 5px;
        left: 100px;
        color: #727a82;
      }
      ::ng-deep .ant-card-head-title {
        font-weight: bold;
      }
      ::ng-deep .ant-modal-body {
        max-height: 500px;
        overflow-y: scroll;
      }
      ::ng-deep .ant-modal-footer {
        text-align: center;
        border: none;
      }
    `,
  ],
})
export class XnUploadAuthorizeModalComponent
  implements OnInit, AfterViewChecked
{
  observer: any;
  // params
  params: AuthorizeModalParams;
  isVisible = false;
  fileList: NzUploadFile[] = [];
  // 文件格式
  fileext: string[] = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
  ];
  // 自定义过滤器
  public filters: UploadFilter[] = [
    {
      name: 'type',
      fn: (fileList: NzUploadFile[]) => {
        const filterFiles = fileList.filter((w) =>
          this.fileext.includes(w.type)
        );
        if (filterFiles.length !== fileList.length) {
          this.message.warning('请上传.pdf,.jpg,.jpeg,.png格式的文件');
          return filterFiles;
        }
        const isLt20M = fileList.filter((x) => x.size / 1024 < 2000);
        if (isLt20M.length !== fileList.length) {
          this.message.warning('文件大小超过20M!，请重新上传');
          return isLt20M;
        }
        return fileList;
      },
    },
  ];

  get showIcon() {
    return {
      showPreviewIcon: true,
      showDownloadIcon: false,
      showRemoveIcon: true,
    };
  }

  get tipText() {
    return this.params.tipText;
  }

  constructor(
    private xn: XnService,
    private cdr: ChangeDetectorRef,
    private message: NzMessageService,
    private fs: FileViewerService
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
  open(params: AuthorizeModalParams) {
    this.isVisible = true;
    this.params = Object.assign({}, this.params, params);
    return new Observable((observer) => {
      this.observer = observer;
    });
  }

  /**
   * 上传文件handle
   * @param info
   */
  handleChange(info: NzUploadChangeParam): void {
    let fileList = [...info.fileList];
    fileList = fileList.slice(-1);
    fileList = fileList.map((file: NzUploadFile) => {
      if (file.response) {
        file.url = file.response.url;
      }
      return file;
    });
    this.fileList = fileList;
  }

  /**
   * 文件上传前处理
   * @param file
   * @returns
   */
  beforeUpload = (file: NzUploadFile) => {
    const lastModifiedList: any[] = this.fileList.map((x) => x.lastModified);
    if (this.fileList.length >= 1) {
      this.message.error('最多上传一个文件');
      return false;
    } else if (lastModifiedList.includes(file.lastModified)) {
      this.message.error(`${file.name}已经上传`);
      return false;
    } else {
      return true;
    }
  };

  /**
   * 删除文件
   * @param file
   * @returns
   */
  onRemoved = (file: NzUploadFile) => {
    this.fileList = [];
    this.cdr.markForCheck();
    return true;
  };

  /**
   * 下载模板
   */
  downloadTemplate() {
    const params: AuthorizationParams = this.params.params;
    this.xn.middle
      .getFileDownload('/account/authorization', params)
      .subscribe((res) => {
        const fileName = this.xn.middle.getFileName(res.Body.headers);
        this.xn.middle.save(res.Body.body, fileName);
      });
  }

  /**
   * 预览文件
   * @param file
   * @returns
   */
  previewFile = (file: NzUploadFile): void => {
    MinUtils.jsonToHump(file.response.data);
    const { fileName, fileKey } = file.response.data;
    this.fs.openModal({
      files: [
        {
          name: fileName,
          url: `${fileKey}`,
        },
      ],
    });
  };

  /**
   * 关闭modal框
   * @param fileKey
   */
  private close(fileKey: string) {
    this.isVisible = false;
    this.observer.next(fileKey);
    this.observer.complete();
  }

  modalOK(): void {
    const file = this.fileList[0];
    MinUtils.jsonToHump(file.response.data);
    const { fileKey } = file.response.data;
    this.close(fileKey);
  }

  closeModal(): void {
    this.close('');
  }
}
