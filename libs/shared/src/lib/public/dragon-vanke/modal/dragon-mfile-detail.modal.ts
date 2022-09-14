/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：contract-vanke-edit-modal.component
 * @summary：龙光文件查看补录弹窗
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 wangqing     龙光文件查看补录弹窗       2019-08-30
 * **********************************************************************
 */

import { Component, ElementRef, ViewChild } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FormGroup, AbstractControl } from '@angular/forms';
import { PdfViewService } from '../../../services/pdf-view.service';
import {
  ModalComponent,
  ModalSize,
} from '../../../common/modal/components/modal';
import { XnService } from '../../../services/xn.service';
import { XnFormUtils } from '../../../common/xn-form-utils';
import { XnUtils } from '../../../common/xn-utils';

@Component({
  selector: 'app-public-contract-edit-modal',
  templateUrl: './dragon-mfile-detail.modal.html',
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
        float: left;
        vertical-align: middle;
        margin-top: -20px;
        margin-right: 10px;
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
        min-height: 300px;
        max-height: 100%;
      }

      .button-group {
        float: right;
      }
    `,
  ],
  providers: [PdfViewService],
})
export class DragonViewContractModalComponent {
  @ViewChild('modal') modal: ModalComponent;
  @ViewChild('innerImg') innerImg: ElementRef;
  @ViewChild('outerImg') outerImg: ElementRef;
  @ViewChild('imgContainer') imgContainer: ElementRef;
  public fileType: string;
  public fileSrc: any[] = [];
  public fSrc: string;
  public total: number;
  public pageSize = 1;
  private observer: any;
  public mainForm: FormGroup;
  public shows: any[];
  public degree = 0;

  public params: any;
  public pageTitle = '';
  private currentScale = 0.6; // 初始缩放
  type = 0;
  public formModule = 'dragon-input';
  choseFile: any[] = [];
  fileIndex = 1;
  public ctrl: AbstractControl;
  public constructor(
    private pdfViewService: PdfViewService,
    private xn: XnService
  ) {}

  /**
   *  打开模态框
   * @param params
   */
  open(params: any): Observable<any> {
    this.params = params;
    this.total = JSON.parse(this.params.contractFile).length;
    this.shows = params.checker || [];
    this.shows.forEach((show) => {
      if (show.checkerId === 'contractMoney' || show.checkerId === 'receive') {
        show.value = Number(show.value).toFixed(2);
        show.value = XnUtils.formatMoneyFloat(show.value);
      }
    });
    this.pageTitle = params.title;
    this.type = params.type;
    this.buildFormGroup();
    this.ctrl = this.mainForm.get('index');
    if (this.params.contractFile !== undefined) {
      if (
        JSON.parse(this.params.contractFile) &&
        JSON.parse(this.params.contractFile).length > 0
      ) {
        const file = JSON.parse(this.params.contractFile);

        if (file && file.length > 0) {
          file.forEach((x) => {
            this.fileType =
              x.filePath.substr(-3).toLowerCase() === 'pdf' ? 'pdf' : 'img';
            if (this.fileType === 'img') {
              this.fileSrc.push({
                picType: 0,
                url: this.xn.file.dragonView(x),
                fileId: x.fileId,
              });
            } else {
              const self = this;
              new Promise((resolve, reject) => {
                self.fileSrc.push({
                  picType: 1,
                  url: self.xn.file.dragonView(x),
                  fileId: x.fileId,
                });
              }).then(() => {});
            }
          });
          // this.total = this.fileSrc.length;
          this.onPage(1);
        }
      }
    }
    // if (this.params.certificatecontractPic !== undefined) {
    //     if (JSON.parse(this.params.certificatecontractPic) && JSON.parse(this.params.certificatecontractPic).length > 0) {
    //         const file = JSON.parse(this.params.certificatecontractPic)[0];

    //         this.onPage(1, file);
    //     }
    // }

    this.modal.open(ModalSize.XXLarge);
    return Observable.create((observer) => {
      this.observer = observer;
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
    if (!!this.params.inputFile) {
      console.log('this.params.inputFile', this.params);
      this.choseFile = JSON.parse(this.params.inputFile);
      this.choseFile.forEach((x, index) => {
        JSON.parse(x).forEach((y) => {
          if (y.fileId === this.fileSrc[e - 1].fileId) {
            this.ctrl.setValue(index + 1);
          }
        });
      });
    }
    this.pdfViewService.m_init = false;
    if (this.fileSrc[e - 1].picType === 0) {
      this.fileType = 'img';
      this.fSrc = this.fileSrc[e - 1].url;
    } else {
      this.fileType = 'pdf';
      setTimeout(() => {
        this.pdfViewService.pdfToCanvas(this.fileSrc[e - 1].url);
      }, 0);
    }
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

  public handleCancel() {
    this.close({
      action: 'cancel',
    });
  }

  public handleSubmit() {
    if (this.mainForm.value.contractMoney.toString().includes(',')) {
      this.mainForm.value.contractMoney = this.ReceiveData(
        this.mainForm.value.contractMoney.toString()
      );
    } else {
      this.mainForm.value.contractMoney = Number(
        this.mainForm.value.contractMoney
      );
    }
    if (
      this.mainForm.value.percentOutputValue !== '' &&
      this.mainForm.value.percentOutputValue.toString().includes(',')
    ) {
      this.mainForm.value.percentOutputValue = this.ReceiveData(
        this.mainForm.value.percentOutputValue.toString()
      );
    } else {
      this.mainForm.value.percentOutputValue = Number(
        this.mainForm.value.percentOutputValue
      );
    }
    if (
      this.mainForm.value.totalReceive !== '' &&
      this.mainForm.value.totalReceive.toString().includes(',')
    ) {
      this.mainForm.value.totalReceive = this.ReceiveData(
        this.mainForm.value.totalReceive.toString()
      );
    } else {
      this.mainForm.value.totalReceive = Number(
        this.mainForm.value.totalReceive
      );
    }
    const obj = Object.assign(
      {},
      {
        mainFlowId: this.params.mainFlowId,
        debtUnit: this.params.debtUnit || '',
        projectCompany: this.params.projectCompany || '',
        receive: this.params.receive || '',
        // contractFile: this.params.contractFile
      },
      this.mainForm.value
    );
    if (this.params.title === '履约证明') {
      obj.performanceFile = this.params.contractFile;
    } else {
      obj.contractFile = this.params.contractFile;
      obj.inputFile = this.params.inputFile;
    }

    this.xn.dragon.post('/contract_temporary/save', obj).subscribe((x) => {
      if (x.ret === 0) {
        this.close({
          flag: x.data.flag,
          action: 'ok',
          contractInfo: this.mainForm.value,
        });
      }
    });
  }
  // 计算应收账款转让金额
  public ReceiveData(item: any) {
    let tempValue = item.replace(/,/g, '');
    tempValue = parseFloat(tempValue).toFixed(2);
    return Number(tempValue);
  }
  private close(value) {
    this.modal.close();
    this.pdfViewService.onDestroy();
    this.observer.next(value);
    this.observer.complete();
  }

  /**
   *  构建表单控件
   */
  private buildFormGroup() {
    XnFormUtils.buildSelectOptions(this.shows);
    this.buildChecker(this.shows);
    this.mainForm = XnFormUtils.buildFormGroup(this.shows);
  }

  private buildChecker(stepRows) {
    for (const row of stepRows) {
      XnFormUtils.convertChecker(row);
    }
  }
}
