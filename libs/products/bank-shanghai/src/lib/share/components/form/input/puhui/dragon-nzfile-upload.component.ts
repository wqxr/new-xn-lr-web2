/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\products\bank-shanghai\src\lib\share\components\form\input\puhui\dragon-nzfile-upload.component.ts
* @summary：基于nzupload改造的文件上传组件,适用于dragon-input
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                 hucongying          init          2021-07-29
***************************************************************************/
import { Component, ElementRef, Input, OnInit, ViewContainerRef } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { RetCodeEnum } from 'libs/shared/src/lib/config/enum';
import { DragonMfilesViewModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/mfiles-view-modal.component';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { FileAdapterService } from 'libs/shared/src/lib/services/file-adapter.service';
import { PdfViewService } from 'libs/shared/src/lib/services/pdf-view.service';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadChangeParam, NzUploadFile, UploadFilter } from 'ng-zorro-antd/upload';
import { MFileViewerService } from '../../../mfile-viewer';


/** 文件上传的状态 */
export const enum UploadStatus {
  /** 上传中 */
  UPLOADING = 'uploading',
  /** 上传完成 */
  DONE = 'done',
  /** 上传失败 */
  ERROR = 'error',
  /** 移除文件 */
  REMOVED = 'removed'
}
@Component({
  template: `
    <div class="clearfix">
      <nz-upload
        nzType="drag"
        nzAction="dragon/file/upload"
        [nzMultiple]="multiple"
        [nzSize]="5120"
        [(nzFileList)]="FileList"
        [nzData]="handleUploadData()"
        nzName="file_data"
        [nzFilter]="filters"
        nzListType="text"
        [nzPreview]="handlePreview"
        [nzBeforeUpload]="beforeUpload"
        [nzShowUploadList]="showIcon"
        (nzChange)="handleChange($event)"
        [nzDisabled]="readOnly"
        [nzRemove]="handelMoved"
      >
        <div *ngIf="!FileList.length || previewPdfVisible">
          <p class="ant-upload-drag-icon">
            <img src="assets/lr/img/upload.png" />
          </p>
          <p class="ant-upload-text">{{ filename }}</p>
          <p class="ant-upload-hint">
            {{ helpMsg }}
          </p>
        </div>
        <div *ngIf="FileList.length && !previewPdfVisible">
          <img style="width:25%;" [src]="previewImage" />
        </div>
      </nz-upload>
    </div>
  `,
  styles: [
    `
      ::ng-deep .ant-upload-list-item-name {
        display: inline-block;
        width: 100%;
        padding-left: 22px;
        overflow: hidden;
        line-height: 1.5715;
        white-space: nowrap;
        text-overflow: ellipsis;
        cursor: pointer;
      }
    `,
  ],
})
@DynamicForm({ type: 'nzfile-upload', formModule: 'dragon-input' })
export class DragonNzFileUploadInputComponent implements OnInit {
  @Input() row: any;
  @Input() form: FormGroup;
  // 预览图片url
  public previewImage: any;
  // 上传成功的的文件
  public files: any[];
  // 是否多选
  public multiple: boolean = false;
  public previewPdfVisible = false;
  // 文件列表
  public FileList: NzUploadFile[] = [];
  // 文件格式
  public fileext: string[] = [];
  public ctrl: AbstractControl;
  // 自定义过滤器
  public filters: UploadFilter[] = [
    {
      name: 'type',
      // tslint:disable-next-line: deprecation
      fn: (fileList: NzUploadFile[]) => {
        const filterFiles = fileList.filter(
          (w) =>
            // tslint:disable-next-line: no-bitwise
            ~this.fileext.indexOf(w.type)
        );
        // const repeatFiles = XnUtils.distinctArray2(this.FileList, 'name');
        if (filterFiles.length !== fileList.length) {
          this.msg.create(
            'error',
            `请上传${this.row.options.fileext}格式的图片!`
          );
          return filterFiles;
        }
        const isLt5M = fileList.filter(
          (x) => x.size / 1024 < this.row.options.picSize
        );
        if (isLt5M.length !== fileList.length) {
          this.msg.create(
            'error',
            `文件大小超过${this.row.options.picSize / 1024}M!，请重新上传`
          );
          return isLt5M;
        }
        return fileList;
      },
    },
  ];
  // 文件名称
  public filename: string = '上传营业执照';
  // 文案提示
  public helpMsg: string = '请上传大小5M以内的JPEG/JPG/PNG/PDF格式文件';
  public xnOptions: XnInputOptions;
  // 是否只读状态
  get readOnly() {
    return this.row.options?.readonly ? true : false;
  }

  get showIcon() {
    return { showDownloadIcon: false, showRemoveIcon: !this.readOnly }
  }

  constructor(
    private msg: NzMessageService,
    private vcr: ViewContainerRef,
    private xn: XnService,
    private pdfViewService: PdfViewService,
    private er: ElementRef,
    private fileAdapter: FileAdapterService,
    private mFileViewerService: MFileViewerService
  ) { }

  ngOnInit() {
    this.pdfViewService.m_init = true;
    this.multiple = this.row.options && this.row.options?.multiple;
    this.ctrl = this.form.get(this.row.name);
    this.fileext = this.row.options.fileext.split(',');
    this.filename = this.row.options?.filename || '上传营业执照';
    this.helpMsg = this.row.options?.helpMsg || '请上传大小5M以内的JPEG/JPG/PNG/PDF格式文件';
    if (!!this.row.value || !!this.ctrl.value) {
      if (this.multiple === true) {
        this.FileList = JSON.parse(this.ctrl.value);
      } else {
        const file = JSON.parse(this.ctrl.value);
        this.formatFileList(file)
      }
    }

    this.ctrl.valueChanges.subscribe((v) => {
      if (!v) {
        this.FileList = [];
      } else {
        const file = JSON.parse(v);
        this.FileList = [];
        this.formatFileList(file)
      }
    });

    this.files = [];
    this.xnOptions = new XnInputOptions(
      this.row,
      this.form,
      this.ctrl,
      this.er
    );
  }

  /**
   * 已上传文件展示前过滤
   * @param file
   */
  formatFileList(file: any) {
    this.FileList.push(file);
    this.FileList[0].status = UploadStatus.DONE;
    this.FileList[0].uid = '-1';
    this.FileList[0].name = JSON.parse(this.ctrl.value).fileName;
    this.FileList[0].url = `/dragon/file/view?key=${JSON.parse(this.ctrl.value).fileId}`;
    // 图片缩略图url
    this.previewImage = `/dragon/file/view?key=${JSON.parse(this.ctrl.value).fileId}`;
  }

  /**
   * 上传所需参数
   * @returns
   */
  handleUploadData() {
    return { checkerId: this.row.checkerId };
  }

  async handleChange({ file, fileList }: NzUploadChangeParam): Promise<void> {
    const status = file.status;
    if (status === UploadStatus.DONE) {
      // 上传完成
      this.previewPdfVisible = file.type === 'application/pdf' ? true : false;
      if (file.response.ret === RetCodeEnum.OK) {
        this.msg.success(`${file.name} file uploaded successfully.`);
        if (this.multiple === true) {
          this.files.push(file.response.data);
          this.form
            .get(this.row.checkerId)
            .setValue(JSON.stringify(this.files));
        } else {
          this.form
            .get(this.row.checkerId)
            .setValue(JSON.stringify(file.response.data));
        }
        this.previewImage = await this.getBase64(file.originFileObj!);
      } else {
        this.form.get(this.row.checkerId).setValue('');
        this.xn.msgBox.open(false, file.response.msg);
      }
    } else if (status === UploadStatus.ERROR) {
      // 上传失败
      this.msg.error(`${file.name} file upload failed.`);
      this.FileList = [];
    } else if (status === UploadStatus.REMOVED) {
      // 移除文件
      if (!file.response) {
        this.onRemove(file.fileId);
      } else {
        this.onRemove(file.response.data.fileId);
        this.xn.dragon
          .post(`/file/delete`, { key: file.response.data.fileId })
          .subscribe((x) => { });
      }
    }
  }

  /**
   * 文件上传前处理
   * @param file
   * @returns
   */
  beforeUpload = (file: NzUploadFile) => {
    let ispass = true; // 是否继续往下执行
    const lastModifiedList: any[] = this.FileList.map((x) => x.lastModified);
    if (!this.multiple && this.FileList.length >= 1) {
      this.msg.error(`只允许上传一张图片`);
      ispass = false;
    } else if (lastModifiedList.includes(file.lastModified)) {
      this.msg.error(`${file.name}已经上传`);
      ispass = false;
    }
    // 以下操作在
    return ispass; // 返回true继续执行，false直接停止
  };

  /**
   * 文件预览
   * @param file
   */
  handlePreview = async (file: NzUploadFile) => {
    let filesArr: any = [];
    if (file.url) {
      // 编辑状态下的
      const { fileId, fileName, filePath } = file;
      const viewFile = { fileId, fileName, filePath };
      filesArr = [{ ...viewFile, url: this.fileAdapter.XnFilesView(viewFile, 'dragon') }]
    } else {
      // 首次上传的状态
      file.preview = await this.getBase64(file.originFileObj!);
      filesArr = [file.response.data].map((x: any) => {
        return { ...x, url: this.fileAdapter.XnFilesView(x, 'dragon') };
      });
    }
    this.previewImage = file.url || file.preview;
    if (file.type === 'application/pdf') {
      this.previewPdfVisible = true;
      XnModalUtils.openInViewContainer(
        this.xn,
        this.vcr,
        DragonMfilesViewModalComponent,
        [file.response.data]
      ).subscribe();
    } else {
      const param = {
        nzTitle: '文件查看',
        nzWidth: 1100,
        nzFooter: true,
        nzMaskClosable: false,
        nzClosable: false,
        filesList: {
          files: filesArr.length ? filesArr : [{ fileId: '', fileName: '', filePath: '', url: '' }],
          showTools: true,
          width: '100%'
        },
        buttons: {
          left: [],
          right: [
            { label: '关闭', btnKey: 'cancel', type: 'normal' }
          ]
        }
      };
      this.mFileViewerService.openModal(param).subscribe((x: any) => { });
    }
  };

  /**
   * 移除文件handel
   * @param file
   * @returns
   */
  handelMoved = (file: NzUploadFile) => {
    this.previewImage = '';
    return this.readOnly ? false : true;
  };

  getBase64(file: File): Promise<string | ArrayBuffer | null> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  public onRemove(fileId: string) {
    for (let i = 0; i < this.files.length; ++i) {
      if (this.files[i].fileId === fileId) {
        this.files.splice(i, 1);
        break;
      }
    }
    if (this.multiple === true) {
      this.form.get(this.row.checkerId).setValue(JSON.stringify(this.files));
    } else {
      this.form.get(this.row.checkerId).setValue('');
    }
  }

  ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
  }

}
