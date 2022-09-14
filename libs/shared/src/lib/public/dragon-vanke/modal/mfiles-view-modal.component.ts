import { setTimeout } from 'core-js/library/web/timers';
/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：mfiles-view-modal.component.ts
 * @summary：查看文件信息,多张
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 wangqing          查看文件方法修改     2019-04-18
 * **********************************************************************
 */

import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  ModalComponent,
  ModalSize,
} from '../../../common/modal/components/modal';
import { FormGroup } from '@angular/forms';
import { PdfViewService } from '../../../services/pdf-view.service';
import { XnService } from '../../../services/xn.service';
import { MediaFileTypeEnum } from '../../../config/enum';

@Component({
  selector: 'app-dragon-mfiles-view-modal',
  templateUrl: './mfiles-view-modal.component.html',
  styles: [
    `
      .pdf-container {
        width: 100%;
        min-height: 100%;
        background: #e6e6e6;
      }

      .this-img {
        width: 60%;
        border: none;
        box-shadow: 8px 8px 15px #888888;
      }

      .this-pdf {
        border: none;
        box-shadow: 8px 8px 15px #888888;
      }

      .img-container {
        width: 100%;
        min-height: 100%;
        text-align: center;
        position: relative;
        background: #e6e6e6;
      }

      .img-wrapper {
        transition: all 0.5s ease-in-out;
      }

      .page {
        float: right;
        vertical-align: middle;
      }

      .edit-content {
        height: calc(100vh - 280px);
        display: flex;
        flex-flow: column;
      }

      .edit-content-flex {
        flex: 1;
        text-align: center;
        overflow-y: scroll;
        background: #e6e6e6;
      }

      .button-group {
        float: right;
        padding: 20px 15px 0 15px;
      }
    `,
  ],
  providers: [PdfViewService],
})
export class DragonMfilesViewModalComponent implements OnInit, AfterViewInit {
  @ViewChild('modal') modal: ModalComponent;
  public fileType: string;
  public fileSrc: string[] = [];
  public fSrc: string;
  public total: number;
  public pageSize = 1;
  private observer: any;
  public mainForm: FormGroup;
  public degree = 0;
  public params: any;
  pageTitle = '';
  public currentScale = 1;
  public shows: any[] = [];
  // 视频url
  public videoUrl = '';
  @ViewChild('innerImg') innerImg: ElementRef;
  @ViewChild('outerImg') outerImg: ElementRef;
  @ViewChild('imgContainer') imgContainer: ElementRef;
  get fileExt() {
    return MediaFileTypeEnum;
  }

  public constructor(
    private pdfViewService: PdfViewService,
    private xn: XnService,
    private cdr: ChangeDetectorRef
  ) { }

  public ngOnInit() { }
  ngAfterViewInit() {
    setTimeout(() => {
      this.scaleImg('large');
      this.scaleImg('large');
    });
  }
  /**
   *  翻页查看文件
   * @param e 当先文件所在页码
   * this.pdfViewService.m_init = false; 将类的m_init值设置为false
   */
  public onPage(e) {
    if (typeof e !== 'number') {
      return;
    }
    this.pdfViewService.m_init = false;
    this.fSrc = this.fileSrc[e - 1];
    let file = this.params[e - 1];
    if (typeof file === 'string') {
      console.log('进不进这里');
      file = JSON.parse(file);
    }
    this.fileType = this.getFileType(file);
    if (this.fileType === MediaFileTypeEnum.IMG) {
      this.fSrc = file.isAvenger
        ? this.xn.file.view(file)
        : this.xn.file.dragonView(file);
    } else if (this.fileType === MediaFileTypeEnum.VIDEO) {
      this.videoUrl = this.xn.file.dragonView(file);
    } else {
      setTimeout(() => {
        file.isAvenger
          ? this.pdfViewService.pdfToCanvas(this.xn.file.view(file))
          : this.pdfViewService.pdfToCanvas(this.xn.file.dragonView(file));
      });
    }
  }
  /**
   * 获取文件类型
   * @param file 文件
   */
  getFileType(file: any): string {
    const fileSubStr = file.fileName.substr(-3).toLowerCase();
    let fileType = '';
    if (!!!file.filePath) {
      fileType =
        fileSubStr === MediaFileTypeEnum.PDF
          ? MediaFileTypeEnum.PDF
          : MediaFileTypeEnum.IMG;
      fileType = /(MP4|mp4)$/.test(fileSubStr)
        ? MediaFileTypeEnum.VIDEO
        : fileType;
    } else {
      fileType =
        fileSubStr === MediaFileTypeEnum.PDF
          ? MediaFileTypeEnum.PDF
          : MediaFileTypeEnum.IMG;
      fileType = /(MP4|mp4)$/.test(fileSubStr)
        ? MediaFileTypeEnum.VIDEO
        : fileType;
    }
    return fileType;
  }
  /**
   *  文件旋转
   * @param val 旋转方向 left:左转，right:右转
   */
  public rotateImg(val) {
    if (
      this.innerImg &&
      this.innerImg.nativeElement &&
      this.outerImg &&
      this.outerImg.nativeElement &&
      this.imgContainer &&
      this.imgContainer.nativeElement
    ) {
      this.degree = this.pdfViewService.rotateImg(
        val,
        this.degree,
        this.innerImg.nativeElement,
        this.outerImg.nativeElement,
        this.imgContainer.nativeElement,
        this.currentScale
      );
    }
  }

  /**
   *  文件缩放
   * @param params 放大缩小  large:放大，small:缩小
   */
  public scaleImg(params: string) {
    if (
      this.innerImg &&
      this.innerImg.nativeElement &&
      this.outerImg &&
      this.outerImg.nativeElement &&
      this.imgContainer &&
      this.imgContainer.nativeElement
    ) {
      // 缩放图片
      this.currentScale = this.pdfViewService.scaleImg(
        params,
        this.innerImg.nativeElement,
        this.outerImg.nativeElement,
        this.imgContainer.nativeElement
      );
    }
  }

  public onCancel() {
    this.close({
      action: 'cancel',
    });
  }
  onDownload() {
    const { fileName } = this.params[0];
    if (this.fileType === MediaFileTypeEnum.VIDEO) {
      this.xn.file.saveFile(
        this.params[0],
        `${fileName.split('.')[0]}`,
        'dragon'
      );
    } else {
      this.xn.dragon
        .download('/file/downFile', {
          files: this.params,
        })
        .subscribe((v: any) => {
          this.xn.dragon.save(v._body, `${fileName}.zip`);
        });
    }
  }
  open(params: any): Observable<any> {
    this.params = params;
    this.total = this.params.length;
    if (this.params && this.params.length > 0) {
      this.onPage(1);
    }
    this.cdr.markForCheck();
    const modalSize = ModalSize.XLarge;
    this.modal.open(modalSize);

    return Observable.create((observer) => {
      this.observer = observer;
    });
  }

  private close(value) {
    this.modal.close();
    this.pdfViewService.onDestroy();
    this.observer.next(value);
    this.observer.complete();
  }
}
