/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：file-view-modal.component
 * @summary：查看文件信息，包含pdf,图片
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan            修改         2019-03-26
 * **********************************************************************
 */

import { Component, ElementRef, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { ModalComponent, ModalSize } from '../../common/modal/components/modal';
import { PdfViewService } from '../../services/pdf-view.service';
import { XnService } from '../../services/xn.service';

@Component({
  templateUrl: './file-view-modal.component.html',
  styles: [
    `
      .this-img {
        width: 60%;
        border: none;
        box-shadow: 8px 8px 15px #888888;
      }

      .pdf-container {
        width: 100%;
        min-height: 100%;
        border: 0;
        background: #e6e6e6;
      }

      .this-pdf {
        border: none;
        box-shadow: 8px 8px 15px #888888;
      }

      .img-container {
        width: 100%;
        min-height: 100%;
        background: #e6e6e6;
        border: 0;
        /*position: relative*/
      }

      .img-wrapper {
        transition: all 0.5s ease-in-out;
      }

      .button-group {
        padding: 20px 0 0 15px;
      }

      .display-content {
        height: calc(100vh - 280px);
        text-align: center;
        overflow-y: auto;
        background: #e6e6e6;
      }
      .pdf-pagination {
        margin: 0 8px;
      }
    `,
  ],
  providers: [PdfViewService],
})
export class FileViewModalComponent {
  @ViewChild('modal') modal: ModalComponent;
  @ViewChild('innerImg') innerImg: ElementRef;
  @ViewChild('outerImg') outerImg: ElementRef;
  @ViewChild('imgContainer') imgContainer: ElementRef;
  private observer: any;
  public fileSrc: string;
  public fileType = '';
  // 默认文件显示角度
  public degree = 0;
  // 默认文件显示大小
  private currentScale = 0.6;

  constructor(private pdfViewService: PdfViewService, private xn: XnService) {}

  /**
   * 打开验证窗口
   * @param params
   * @returns {any}
   */

  /**
   *  打开模态框
   * @param params
   */
  open(params: any): Observable<any> {
    this.fileType =
      params.fileName.substr(-3).toLowerCase() === 'pdf' ? 'pdf' : 'img';
    if (this.fileType === 'img') {
      this.fileSrc = this.xn.file.view(params);
    } else {
      setTimeout(() => {
        this.pdfViewService.pdfToCanvas(this.xn.file.view(params));
      }, 0);
    }

    this.modal.open(ModalSize.XLarge);
    return Observable.create((observer) => {
      this.observer = observer;
    });
  }

  /**
   *  关闭弹窗
   */
  public handleClose() {
    this.modal.close();
    this.pdfViewService.onDestroy();
    this.observer.next({ action: 'ok' });
    this.observer.complete();
  }

  /**
   *  文件旋转
   * @param direction 旋转方向 left:左转，right:右转
   */
  public rotateImg(direction: string) {
    if (
      this.innerImg &&
      this.innerImg.nativeElement &&
      this.outerImg &&
      this.outerImg.nativeElement &&
      this.imgContainer &&
      this.imgContainer.nativeElement
    ) {
      this.degree = this.pdfViewService.rotateImg(
        direction,
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
  // 我已阅读并同意
  onSubmit() {
    this.handleClose();
  }
}
