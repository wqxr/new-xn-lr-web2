/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：show-view-modal.component
 * @summary：查看文件,pdf，图片 缩放，查看
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan           修改            2019-03-27
 * **********************************************************************
 */

import { Component, ElementRef, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { ModalComponent, ModalSize } from '../../common/modal/components/modal';
import { XnUtils } from '../../common/xn-utils';
import { PdfViewService } from '../../services/pdf-view.service';
import { XnService } from '../../services/xn.service';
export class DetailInfo {
  /** 字段名称 */
  public label: string;
  /** 字段id */
  public checkId: string;
  /** 字段值 */
  public value: string;
  /** dom中根据type 的类型对文件进行不同处理，达到特定显示 */
  public type?: string;
}

/** 展示信息字段配置 */
const detailInfo: DetailInfo[] = [
  { label: '企业名称', checkId: 'orgName', value: '' },
  { label: '法定代表人姓名', checkId: 'orgLegalPerson', value: '' },
  { label: '管理员姓名', checkId: 'amdinUserName', value: '' },
  { label: '管理员身份证号', checkId: 'amdinCardNo', value: '' },
  { label: '管理员手机号', checkId: 'amdinPhone', value: '' },
  { label: '管理员邮箱', checkId: 'amdinEmail', value: '' },
  { label: 'CA管理员姓名', checkId: 'userName', value: '' },
  { label: 'CA管理员身份证号', checkId: 'idCard', value: '' },
  { label: 'CA管理员手机号', checkId: 'phone', value: '' },
]
@Component({
  templateUrl: './show-view-modal.component.html',
  styles: [
    `.this-img {
            width: 60%;
            border: none;
            box-shadow: 8px 8px 15px #888888;
        }

        .pdf-container {
            width: 100%;
            min-height: 100%;
            border: 0;
            background: #E6E6E6;
        }

        .this-pdf {
            border: none;
            box-shadow: 8px 8px 15px #888888;
        }

        .img-container {
            width: 100%;
            min-height: 100%;
            background: #E6E6E6;
            border: 0;
            position: relative
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
            background: #E6E6E6;
        }
        tr td {
          min-width:130px;
          padding-bottom:10px;
        }
        tr td:nth-child(2) {
          font-weight: bold;
        }
        `,
  ],
  providers: [
    PdfViewService
  ]
})
export class ShowViewModalComponent {

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
  private currentScale = .6;
  // 需要平台，需要状态为审核机构创建， 且展示的位图片
  public showSaveBtn = false;
  // params
  public params: any;
  // 左侧额外展示的详情信息
  public detailInfo: DetailInfo[] = detailInfo;

  constructor(private xn: XnService, private pdfViewService: PdfViewService) {
  }

  /**
   * 打开验证窗口
   * @param params
   * @returns {any}
   */

  open(params: any): Observable<any> {
    this.params = params;
    const recordId = params?.recordId || '';
    if (recordId) {
      // 平台审核注册流程-查看《授权确认函》文件需要展示企业信息、法人信息、管理员信息、CA数字证书管理员信息
      this.xn.api.post('/user/review_detail_info', { recordId }).subscribe(v => {
        if (v.ret === 0) {
          this.detailInfo.map(x => { x.value = v.data[x.checkId] })
        }
      })
    }
    this.fileType = ((params && params.label || params).substr(-3).toLowerCase() === 'pdf') ? 'pdf' : 'img';
    this.showSaveBtn = this.xn.user.orgType === 99 && this.xn.user.status === 2 && this.fileType === 'img';
    if (this.fileType === 'img') {
      this.fileSrc = `${params.url}`;
    } else {
      setTimeout(() => {
        // 将pdf转成canvas
        const url = `${params.url}`;
        this.pdfViewService.pdfToCanvas(url);

      }, 0);
    }
    this.modal.open(ModalSize.XLarge);
    return Observable.create(observer => {
      this.observer = observer;
    });
  }

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
    if (this.innerImg && this.innerImg.nativeElement
      && this.outerImg && this.outerImg.nativeElement
      && this.imgContainer && this.imgContainer.nativeElement
    ) {
      this.degree = this.pdfViewService.rotateImg(direction, this.degree,
        this.innerImg.nativeElement, this.outerImg.nativeElement, this.imgContainer.nativeElement, this.currentScale);
    }
  }

  /**
   *  文件缩放
   * @param params 放大缩小  large:放大，small:缩小
   */
  public scaleImg(params: string) {
    if (this.innerImg && this.innerImg.nativeElement
      && this.outerImg && this.outerImg.nativeElement
      && this.imgContainer && this.imgContainer.nativeElement
    ) {
      this.currentScale = this.pdfViewService.scaleImg(params,
        this.innerImg.nativeElement, this.outerImg.nativeElement, this.imgContainer.nativeElement);
    }
  }

  /**
   *  保存选装后的图片
   */
  public handleSave() {
    if (this.degree === 0) {
      this.xn.msgBox.open(false, '请旋转后再保存图片。');
      return;
    }

    const key = XnUtils.parseUrl(this.fileSrc).key || 0;
    this.xn.api.post('/attachment/image/rotate', {
      key,
      angle: this.degree
    }).subscribe(json => {
      this.xn.msgBox.open(false, '图片旋转保存成功。');
    });
  }
}
