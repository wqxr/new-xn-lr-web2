/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：invoice-view-modal.component.ts
 * @summary：查看发票文件
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 wangqing          采购融资发票查看        2019-06-13
 * **********************************************************************
 */

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PdfViewService } from 'libs/shared/src/lib/services/pdf-view.service';
import { ModalComponent, ModalSize } from 'libs/shared/src/lib/common/modal/components/modal';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { FormGroup } from '@angular/forms';
import { InvoiceViewModalComponent } from 'libs/shared/src/lib/public/modal/invoice-view-modal.component';
@Component({
  templateUrl: './avenger-invoice-view.modal.html',
  styles: [`.flex-row {
        display: flex;
        margin-bottom: 15px;
      }

      .this-title {
        width: 90px;
        text-align: right;
        padding-top: 7px;
      }

      .this-padding {
        padding-left: 10px;
        padding-right: 10px;
      }

      .this-flex-1 {
        flex: 1;
      }

      .this-flex-2 {
        flex: 2;
      }

      .this-flex-3 {
        flex: 3;
      }

      .xn-money-alert {
        color: #8d4bbb;
        font-size: 12px;
      }

      .pdf-container {
        width: 100%;
        min-height: 100%;
        background: #E6E6E6;
      }

      .this-img {
        width: 80%;
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
        background: #E6E6E6;
      }

      .img-wrapper {
        transition: all 0.5s ease-in-out;
      }

      .edit-content {
        height: calc(100vh - 280px);
        display: flex;
        flex-flow: column;
      }

      .edit-content-flex {
        flex: 1;
        overflow: auto;
        background: #E6E6E6;
      }

      .button-group {
        float: right;
        padding: 20px 0 15px !important;
      }

      .this-control {
        display: block;
        vertical-align: top;
        font-size: 13px;
        width: 230px;
        margin-bottom: 5px
      }
      .clear-bg{
        background-color: #FFFFFF;
      }
      .img-wrapper {
        transition: all 0.5s ease-in-out;
      }

      .page {
        float: left;
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
        background: #E6E6E6;
      }

      .edit-img-flex{
        width: 100%;
        text-align: center;
        position: relative;
        background: #E6E6E6;
        overflow-y: scroll;
        height: 80%;

      }
      .buttonclass{
        width:54px;
    }
      `],
  providers: [
    PdfViewService
  ]
})
export class AvengerViewInvoiceComponent implements OnInit {

  @ViewChild('modal') modal: ModalComponent;
  @ViewChild('innerImg') innerImg: ElementRef;
  @ViewChild('outerImg') outerImg: ElementRef;
  @ViewChild('imgContainer') imgContainer: ElementRef;
  @ViewChild('innerImg1') innerImg1: ElementRef;
  @ViewChild('outerImg1') outerImg1: ElementRef;
  @ViewChild('imgContainer1') imgContainer1: ElementRef;

  private observer: any;

  fpdm: any; // 发票代码
  fphm: any; // 发票号码
  kprq: any; // 开票日期
  kpje: any; // 开票金额
  fileImg: any; // 发票图像
  upstreamfileImg = '';
  isdiaplayPic = false;
  isPreliminary = false;
  titleclick = '显示详情';
  sail = '';
  forsail = '';
  detailinfo = '';
  degree = 0;
  moneyAlert = '';
  pageTitle = '查看发票信息';
  // 金蝶验证数据
  public jindieDetail: any;
  private currentScale = .6;
  public mainForm: FormGroup;
  params: any;
  public total: number;
  public pageSize = 1;
  constructor(private xn: XnService, private pdfViewService: PdfViewService) {
  }

  ngOnInit() {
  }

  /**
   * 打开验证窗口
   * @param params
   * @returns {any}
   */
  open(params: any): Observable<any> {
    this.params = params;
    this.fpdm = params.invoiceCode || '';
    this.fphm = params.invoiceNum || '';
    this.kprq = params.invoiceDate || '';
    this.kpje = params.invoiceAmount || '';
    this.isPreliminary = params.isPreliminary || false;

    if (params.invoiceAmount) {
      this.moneyAlert = XnUtils.convertCurrency(params.invoiceAmount)[1];
    }

    if (this.params.upstreamInvoice !== undefined) {
      this.upstreamfileImg = params.upstreamFileId || params.fileId ? this.xn.file.view({
        fileId: params.upstreamFileId || params.fileId,
        filePath: params.upstreamFilePath || params.filePath, isAvenger: true
      }) : '';
    }
    // 显示发票图像
    if (this.params.invoiceNum !== undefined) {
      this.fileImg = params.fileId || params.filePath ? this.xn.file.view({ ...params, isAvenger: true }) : '';

    }

    this.modal.open(ModalSize.XLarge);
    this.showJdDetail(params.invoiceNum);
    return Observable.create(observer => {
      this.observer = observer;
    });
  }

  public onOk() {
    this.modal.close();
    this.pdfViewService.onDestroy();
    this.observer.next({ action: 'ok' });
    this.observer.complete();
  }

  /**
   *  文件旋转
   * @param val 旋转方向 left:左转，right:右转
   */
  public rotateImg(val, type: number) {
    if (type === 0) {
      if (this.innerImg && this.innerImg.nativeElement
        && this.outerImg && this.outerImg.nativeElement
        && this.imgContainer && this.imgContainer.nativeElement
      ) {
        this.degree = this.pdfViewService.rotateImg(val, this.degree,
          this.innerImg.nativeElement, this.outerImg.nativeElement, this.imgContainer.nativeElement, this.currentScale);
      }
    } else if (type === 1) {
      if (this.innerImg1 && this.innerImg1.nativeElement
        && this.outerImg1 && this.outerImg1.nativeElement
        && this.imgContainer1 && this.imgContainer1.nativeElement
      ) {
        this.degree = this.pdfViewService.rotateImg(val, this.degree,
          this.innerImg1.nativeElement, this.outerImg1.nativeElement, this.imgContainer1.nativeElement, this.currentScale);
      }
    }

  }



  /**
   *  文件缩放
   * @param params 放大缩小  large:放大，small:缩小
   */
  public scaleImg(params: string, type: number) {
    if (type === 0) {
      if (this.innerImg && this.innerImg.nativeElement
        && this.outerImg && this.outerImg.nativeElement
        && this.imgContainer && this.imgContainer.nativeElement
      ) {
        // 缩放图片
        this.currentScale = this.pdfViewService.scaleImg(params,
          this.innerImg.nativeElement, this.outerImg.nativeElement, this.imgContainer.nativeElement);
      }
    } else if (type === 1) {
      if (this.innerImg1 && this.innerImg1.nativeElement
        && this.outerImg1 && this.outerImg1.nativeElement
        && this.imgContainer1 && this.imgContainer1.nativeElement
      ) {
        // 缩放图片
        this.currentScale = this.pdfViewService.scaleImg(params,
          this.innerImg1.nativeElement, this.outerImg1.nativeElement, this.imgContainer1.nativeElement);
      }
    }

  }
  /**
   *  显示金蝶验证详情
   * @param paramInvoiceNum
   */
  public showJdDetail(paramInvoiceNum: string) {
    if (!!paramInvoiceNum) {
      this.xn.avenger.post('/file/invoice_message', { invoiceNum: paramInvoiceNum }).subscribe(x => {
        if (x.data === '') {

        } else {
          this.jindieDetail = x.data;
          this.sail = x.data.list.find(item => {
            return item.label === '购方名称';
          }).value;
          this.forsail = x.data.list.find(item => {
            return item.label === '销方名称';
          }).value;
          this.detailinfo = x.data.list.find(item => {
            return item.label === '备注';
          }).value;
        }
      });
    }
  }
  public handleCancel() {
    this.close({
      action: 'cancel'
    });
  }
  private close(value) {
    this.modal.close();
    this.pdfViewService.onDestroy();
    this.observer.next(value);
    this.observer.complete();
  }

  /**
   *  表头文件查看按钮文字
   */
  public diaplayRecord() {
    this.isdiaplayPic = !this.isdiaplayPic;
    this.isdiaplayPic === false ? this.titleclick = '显示详情' : this.titleclick = '显示图片';

  }
  public handleSubmit() {
    const obj = Object.assign({}, this.params.files, this.mainForm.value);
    this.close({
      action: 'ok',
      contractType: obj
    });
  }
}
