import { Component, ElementRef, Input, OnInit, ViewContainerRef } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadChangeParam, NzUploadFile, UploadFilter } from 'ng-zorro-antd/upload';
import { XnModalUtils } from '../../common/xn-modal-utils';
import { PdfViewService } from '../../services/pdf-view.service';
import { XnService } from '../../services/xn.service';
import { FileViewModalComponent } from '../modal/file-view-modal.component';
import { XnInputOptions } from './xn-input.options';

@Component({
  selector: 'nz-demo-upload-drag',
  template: `
  <div class="clearfix">
    <nz-upload
      nzType="drag"
      nzAction="api/attachment/upload"
      [nzMultiple]="multiple"
      [nzSize]=5120
      [(nzFileList)]="FileList"
      [nzData]="handleUploadData()"
      nzName="file_data"
      [nzFilter]="filters"
      nzListType="text"
      [nzPreview]="handlePreview"
      [nzBeforeUpload]="beforeUpload"
      [nzShowUploadList]={showDownloadIcon:false,showRemoveIcon:true}
      (nzChange)="handleChange($event)"
      [nzDisabled]="readOnly"
      [nzRemove]="handelMoved"
    >
    <div *ngIf='FileList.length===0 || previewPdfVisible'>
      <p class="ant-upload-drag-icon">
        <img src='assets/lr/img/upload.png'>
      </p>
      <p class="ant-upload-text">{{ filename }}</p>
      <p class="ant-upload-hint">
      {{ helpMsg }}

      </p>
      </div>
      <div *ngIf='FileList.length>0 && !previewPdfVisible'>
      <img   style='width:25%' [src]='previewImage'/>
      </div>

    </nz-upload>
    <nz-modal [nzVisible]="previewVisible" [nzContent]="modalContent" [nzFooter]="null" (nzOnCancel)="previewVisible = false">
    <ng-template #modalContent>
      <img [src]="previewImage" [ngStyle]="{ width: '100%' }" />
    </ng-template>
  </nz-modal>
  </div>
  `,
  styles: [`
  ::ng-deep .ant-upload-list-item-name{
    display: inline-block;
    width: 100%;
    padding-left: 22px;
    overflow: hidden;
    line-height: 1.5715;
    white-space: nowrap;
    text-overflow: ellipsis;
    cursor: pointer;
  }
  `]
})
export class NzDemoUploadDragComponent implements OnInit {


  constructor(private msg: NzMessageService, private vcr: ViewContainerRef,
    private xn: XnService, private pdfViewService: PdfViewService,private er: ElementRef,) { }
  @Input() row: any;
  @Input() form: FormGroup;
  previewImage: any;
  files: any[];
  multiple: boolean = false;
  previewVisible = false;
  previewPdfVisible = false;
  FileList: NzUploadFile[] = [];
  fileext: string[] = [];
  ctrl: AbstractControl;
  filters: UploadFilter[] = [
    {
      name: 'type',
      // tslint:disable-next-line: deprecation
      fn: (fileList: NzUploadFile[]) => {
        const filterFiles = fileList.filter(
          w =>
            // tslint:disable-next-line: no-bitwise
            ~this.fileext.indexOf(
              w.type
            )
        );
        // const repeatFiles = XnUtils.distinctArray2(this.FileList, 'name');
        if (filterFiles.length !== fileList.length) {
          this.msg.create('error', `请上传${this.row.options.fileext}格式的图片!`);
          return filterFiles;
        }
        const isLt5M = fileList.filter(x => x.size / 1024 < this.row.options.picSize);
        if (isLt5M.length !== fileList.length) {
          this.msg.create('error', `文件大小超过${this.row.options.picSize / 1024}M!，请重新上传`);
          return isLt5M;
        }
        return fileList;
      }
    }
  ];
  filename:string = '上传营业执照';
  // 文案提示
  helpMsg:string = '请上传大小5M以内的JPEG/JPG/PNG/PDF格式文件'
  xnOptions: XnInputOptions;
  // 是否只读状态
  get readOnly(){
    return this.row.options?.readonly?true:false;
  }
  ngOnInit() {
    this.pdfViewService.m_init = true;
    this.multiple = this.row.options && this.row.options.multiple;
    this.ctrl = this.form.get(this.row.name);
    this.fileext = this.row.options.fileext.split(',');
    this.filename = this.row.options?.filename || '上传营业执照'
    this.helpMsg = this.row.options?.helpMsg || '请上传大小5M以内的JPEG/JPG/PNG/PDF格式文件'
    if (!!this.row.value || !!this.ctrl.value) {
      if (this.multiple === true) {
        this.FileList = JSON.parse(this.ctrl.value);
      } else {
        this.FileList.push(JSON.parse(this.ctrl.value));
        this.FileList[0].status = 'done',
          this.FileList[0].uid = '-1',
          this.FileList[0].name = JSON.parse(this.ctrl.value).fileName;
        this.FileList[0].url = `/api/attachment/view?key=${JSON.parse(this.ctrl.value).fileId}`;
        this.previewImage = `/api/attachment/view?key=${JSON.parse(this.ctrl.value).fileId}`;
      }
    }
    this.files = [];
    this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
  }
  handleUploadData() {
    return { checkerId: this.row.checkerId };
  }


  async handleChange({ file, fileList }: NzUploadChangeParam): Promise<void> {
    const status = file.status;
    if (status !== 'uploading') {
      console.log(file, fileList);
    }
    if (status === 'done') {
      if (file.type === 'application/pdf') {
        this.previewPdfVisible = true;
      } else {
        this.previewPdfVisible = false;
      }
      if (file.response.ret === 0) {
        this.msg.success(`${file.name} file uploaded successfully.`);
        if (this.multiple === true) {
          this.files.push(file.response.data);
          this.form.get(this.row.checkerId).setValue(JSON.stringify(this.files));
        } else {
          this.form.get(this.row.checkerId).setValue(JSON.stringify(file.response.data));
        }

        this.previewImage = await this.getBase64(file.originFileObj!);

      } else {
        this.form.get(this.row.checkerId).setValue('');
        this.xn.msgBox.open(false, file.response.msg);
      }
    } else if (status === 'error') {
      this.msg.error(`${file.name} file upload failed.`);
    }
    if (status === 'removed') {
      if (!file.response) {
        this.onRemove(file.fileId);
      } else {
        this.onRemove(file.response.data.fileId);
        this.xn.api.post(`/attachment/delete`, { key: file.response.data.fileId }).subscribe(x => {
        });
      }

    }
  }
  beforeUpload = (file: NzUploadFile) => {
    let ispass = true; // 是否继续往下执行
    const lastModifiedList: any[] = this.FileList.map(x => x.lastModified);
    if (!this.multiple && this.FileList.length >= 1) {
      this.msg.error(`只允许上传一张图片`);
      ispass = false;
    } else if (lastModifiedList.includes(file.lastModified)) {
      this.msg.error(`${file.name}已经上传`);
      ispass = false;
    }
    // 以下操作在
    return ispass; // 返回true继续执行，false直接停止
  }

  handlePreview = async (file: NzUploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await this.getBase64(file.originFileObj!);
    }
    this.previewImage = file.url || file.preview;
    if (file.type === 'application/pdf') {
      this.previewPdfVisible = true;
      XnModalUtils.openInViewContainer(this.xn, this.vcr, FileViewModalComponent, file.response.data).subscribe();
    } else {
      this.previewVisible = true;
    }
  }

  /**
   * 移除文件handel
   * @param file
   * @returns
   */
  handelMoved = (file: NzUploadFile)=>{
    return this.readOnly ? false : true;
  }

  getBase64(file: File): Promise<string | ArrayBuffer | null> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }
  public onRemove(fileId) {
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
