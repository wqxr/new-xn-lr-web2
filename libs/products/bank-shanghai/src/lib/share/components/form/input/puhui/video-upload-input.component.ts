/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\products\bank-shanghai\src\lib\share\components\form\input\puhui\video-upload-input.component.ts
* @summary：上海银行开户流程- 上传开户视频组件
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                 hucongying           init          2021-07-12
***************************************************************************/

import { ViewContainerRef } from '@angular/core';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef, Component,
  ElementRef, Input, OnInit,
} from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { RetCodeEnum, VideoUploadTypeEnum } from 'libs/shared/src/lib/config/enum';
import { DragonMfilesViewModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/mfiles-view-modal.component';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { interval, Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
declare let $: any;

@Component({
  selector: 'dragon-video-file-input',
  templateUrl: './video-upload-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .detailP {
          height: 25px;
          font-size: 14px;
          line-height: 25px;
          color: #ccc;
          margin-left: 15px;
      }
      .file-row-table {
          margin-bottom: 0;
      }

      .file-row-table td {
          padding: 6px;
      }

      .file-row-table button:focus {
          outline: none;
      }

      .span-disabled-bg {
          background-color: #eee
      }
      .disabled {
          pointer-events: none;
          opacity: 0.5;
      }
      .helpMsg {
          float: left;
          height: 25px;
          font-size: 13px;
          line-height: 25px;
          color: #F59A23;
          margin-left: 6px;
      }
      `
  ]
})
@DynamicForm({ type: 'video-file-input', formModule: 'default-input' })
export class DragonVideoFileInputComponent implements OnInit {
  @Input() row: any;
  @Input() form: FormGroup;
  @Input() mainFlowId?: string;

  public files: any[];
  public showP = true;
  public myClass = '';
  public alert = '';
  public ctrl: AbstractControl;
  public xnOptions: XnInputOptions;
  // 上传方式
  public radioValue: string = VideoUploadTypeEnum.LOCAL;
  // 删除按钮状态
  public delButtonStatus: boolean;
  // 文件类型格式
  public fileType = '';
  // 文件上传进度
  public loadingPercent: number = 0;
  // 进度条
  public loading: boolean = false;
  // 二维码
  public codeQr: boolean = false;
  // 二维码数据
  public qrdata: string = `https://lrscft.com/miniprogram?appId=${this.xn.user.appId}`;
  // 获取开户视频定时任务
  public videoTimer$: Subscription = null;

  get readonly() {
    return this.row.options && this.row.options?.readonly && this.row.options?.readonly === true;
  }
  get localUpload() {
    return VideoUploadTypeEnum.LOCAL;
  }
  get scancodeUpload() {
    return VideoUploadTypeEnum.SCAN_CODE;
  }

  constructor(
    private xn: XnService,
    private er: ElementRef,
    private cdr: ChangeDetectorRef,
    private vcr: ViewContainerRef,
    private msg: NzMessageService,
    private NzModal: NzModalService) { }

  ngOnInit() {
    this.delButtonStatus = this.row.options && this.row.options?.readonly && this.row.options?.readonly === true;
    this.files = [];
    this.ctrl = this.form.get(this.row.name);
    this.calcAlertClass();
    if (!!this.row.options.fileext) {
      this.fileType = `请上传${this.row.options.fileext}文件格式的文件`;
    } else {
      this.fileType = '';
    }

    // 设置初始值
    this.ctrl.valueChanges.subscribe(x => {
      this.setFiles(x);
      this.cdr.markForCheck();
    });
    this.setFiles(this.ctrl.value);
    this.getUploadType();
    this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
  }

  /**
   * 选中变化时回调
   * @param e
   */
  onModelChange(e: any) {
    this.NzModal.confirm({
      nzTitle: '<i>确定要切换上传方式吗?</i>',
      nzContent: '<b>切换后已上传的文件将会被清除，需要重新上传</b>',
      nzOnOk: () => {
        if (this.videoTimer$) {
          // 取消订阅
          this.videoTimer$.unsubscribe();
        }
        if (this.radioValue === this.localUpload && this.files.length) {
          // 删除小程序上传视频文件信息
          this.xn.dragon.post('/shanghai_bank/sh_general/rmPHXCXFileInfo',
            { appId: this.xn.user.appId }).subscribe()
        }
        this.clearFile();
      },
      nzOnCancel: () => {
        if (this.radioValue === this.localUpload) {
          this.radioValue = this.scancodeUpload
        } else {
          this.radioValue = this.localUpload
        }
        this.cdr.markForCheck();
      }
    })
  }

  /**
   * 判断文件上传方式
   */
  getUploadType() {
    if (this.files.length) {
      const fileInfo = this.files[0];
      const uploadType = fileInfo?.uploadType && fileInfo?.uploadType === this.scancodeUpload ? this.scancodeUpload : this.localUpload;
      this.radioValue = uploadType;
    }
  }

  /**
   * 获取开户视频定时任务
   */
  intervalHttp() {
    this.videoTimer$ = timer(0, 10000)
      .pipe(
        // 取消过期的请求
        switchMap(() => {
          return this.xn.dragon.post2('/shanghai_bank/sh_general/getPHXCXFileInfo', { appId: this.xn.user.appId })
        })
      )
      .subscribe(
        res => {
          if (res.ret === RetCodeEnum.OK) {
            if (!XnUtils.isEmptyObject(res.data)) {
              let fileInfo = JSON.parse(res.data.fileInfo);
              // 扫码上传额外增加uploadType字段
              fileInfo.uploadType = this.scancodeUpload;
              this.files = [fileInfo];
              this.codeQr = false;
              this.videoTimer$.unsubscribe();
              this.setValueByFiles();
            }
          } else {
            this.videoTimer$.unsubscribe();
          }
          this.cdr.markForCheck()
        },
        () => {
          this.videoTimer$.unsubscribe();
          this.cdr.markForCheck()
        },
        () => {
          this.videoTimer$.unsubscribe();
          this.cdr.markForCheck()
        }
      )
  }

  /**
   * 重置上传方式
   */
  clearFile() {
    this.codeQr = false;
    this.files = [];
    this.ctrl.setValue('');
  }

  showUploadType(type: string) {
    return this.radioValue === type;
  }

  /**
   * checker项赋值
   */
  private setFiles(x: any) {
    const files = this.ctrl.value
      ? XnUtils.parseObject(x)
      : XnUtils.parseObject(this.ctrl.value, []);
    this.files = [].concat(files);
  }

  /**
   * 上传之前的校验
   */
  public onBeforeSelect(e) {
    if (this.files.length > 0) {
      e.preventDefault();
      this.xn.msgBox.open(false, '请先删除已上传的文件，才能上传新文件');
      return;
    }
    this.ctrl.markAsTouched();
    this.calcAlertClass();
  }

  /**
   * 上传文件
   * @param e
   */
  public onSelect(e: any) {
    if (!e.target.files.length) {
      return;
    }
    const err = this.validateFileExt(e.target.files[0].name);
    if (err.length > 0) {
      this.msg.warning(`只支持上传mp4格式的视频文件`);
      this.alert = err;
      // 把file input的值置为空，这样下次选择同一个文件还能触发这个请求
      $(e.target).val('');
      return;
    }
    this.setValueByFiles();
    this.compressImage(e.target.files[0], (blob, file) => {
      this.loadingPercent = 0;
      const fd = new FormData();
      // FormData.append中如果不带第三个参数，则默认filename属性为blob, file && file.name是为了检测file是否存在
      fd.append('file_data', blob, file && file.name);
      this.xn.file.dragonUpload(fd).subscribe({
        next: v => {
          if (v.type === 'progress') {
            // 上传中
            this.loading = true;
            this.delButtonStatus = true;
            this.onProgress(v.data.originalEvent);
          } else if (v.type === 'complete') {
            // 上传完成
            if (v.data.ret === RetCodeEnum.OK) {
              this.delButtonStatus = false;
              this.loading = false;
              v.data.data.prevName = (file && file.name) || (blob && blob.name); // filename不存在则检测blobname
              this.files.push(v.data.data);
              this.ctrl.setValue(JSON.stringify([v.data.data]));
              this.cdr.detectChanges();
              this.setValueByFiles();
            } else {
              // 上传失败
              this.loading = false;
              this.delButtonStatus = false;
              this.xn.msgBox.open(false, v.data.msg);
            }
          }
        },
        error: errs => {
          this.xn.msgBox.open(false, errs, () => {
            $(e.target).val('');
            this.loading = false;
            this.loadingPercent = 0;
            this.delButtonStatus = false;
            this.cdr.markForCheck();
          });
        },
        complete: () => {
          this.loading = false;
          this.delButtonStatus = false;
          this.ctrl.markAsDirty();
          this.calcAlertClass();
        }
      });
    });

    // 把file input的值置为空，这样下次选择同一个文件还能触发这个请求
    $(e.target).val('');
  }

  /**
   * 获取上传进度
   * @param e
   */
  public onProgress(e: any) {
    if (e.lengthComputable) {
      this.loadingPercent = Math.floor((e.loaded * 100) / e.total);
      this.cdr.detectChanges();
    }
  }


  /**
   * 赋值操作
   */
  private setValueByFiles() {
    if (this.files.length === 0) {
      this.ctrl.setValue('');
    } else {
      this.ctrl.setValue(JSON.stringify([].concat(this.files).map(v => {
        return {
          fileId: v.fileId,
          fileName: v.fileName,
          filePath: v.filePath,
          uploadType: v?.uploadType ? v.uploadType : this.localUpload
        };
      })));
    }
    this.cdr.detectChanges();

  }

  /**
   * 删除文件
   */
  public onRemove(fileId: string) {
    for (let i = 0; i < this.files.length; ++i) {
      if (this.files[i].fileId === fileId) {
        this.files.splice(i, 1);
        this.setValueByFiles();
        this.ctrl.setValue('');
        this.ctrl.markAsDirty();
        this.calcAlertClass();
        break;
      }
    }
    if (this.radioValue === this.scancodeUpload) {
      // 删除小程序上传视频文件信息
      this.xn.dragon.post('/shanghai_bank/sh_general/rmPHXCXFileInfo',
        { appId: this.xn.user.appId }
      ).subscribe()
    } else {
      // 删除本地上传文件
      this.xn.file.dragonRemove(fileId).subscribe()
    }
    this.cdr.detectChanges();
  }

  /**
   * 文件格式校验
   * @param file
   * @param callback
   */
  private compressImage(file: any, callback: Function) {

    let picSize = this.row.options && this.row.options.picSize;
    if (!picSize) {
      callback(file, file);
      return;
    }
    picSize = parseInt(picSize, 10);

    if (/(MP4|mp4)$/.test(file.type) && file.size / 1024 > picSize) {
      if (file.size / (1024 * 1024) > 30) {
        this.xn.msgBox.open(false, '很抱歉，您允许上传的文件不能超过30M，谢谢');
        return;
      }
    }
    callback(file, file);
  }

  /**
   *  查看文件
   * @param paramFile
   */
  public onView(paramFile: any) {
    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      DragonMfilesViewModalComponent,
      [paramFile]
    ).subscribe(() => {
    });
  }

  /**
   * 获取二维码
   */
  public showQr() {
    if (this.files.length) {
      this.codeQr = false;
      this.msg.warning(`请先删除已上传的文件`);
    } else {
      this.codeQr = true;
      this.intervalHttp()
    }
  }

  /**
   *  验证所选文件格式，根据文件后缀
   * @param s 文件全名
   */
  private validateFileExt(s: string) {
    if ('fileext' in this.row.options) {
      const exts = this.row.options.fileext
        .replace(/,/g, '|')
        .replace(/\s+/g, ''); // 删除所有空格
      if (s.match(new RegExp('\\.(' + exts + ')$', 'i'))) {
        return '';
      } else {
        return `只支持以下文件格式: ${this.row.options.fileext}`;
      }
    } else {
      return '';
    }
  }

  /**
   *
   */
  private calcAlertClass() {
    this.myClass = `${XnFormUtils.getClass(this.ctrl)} ${this.delButtonStatus ? 'disabled' : ''}`;
    this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
  }
}
