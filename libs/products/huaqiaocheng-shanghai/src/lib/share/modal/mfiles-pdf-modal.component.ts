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

import { Component, ElementRef, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { ModalComponent, ModalSize } from 'libs/shared/src/lib/common/modal/ng2-bs3-modal';
import { PdfViewService } from 'libs/shared/src/lib/services/pdf-view.service';
import { XnService } from 'libs/shared/src/lib/services/xn.service';

@Component({
  selector: 'app-mfiles-pdf-modal',
  templateUrl: './mfiles-pdf-modal.component.html',
  styles: [`
  .pdf-container {
    width: 100%;
    height: calc(100vh - 285px);
    border: none;
  }

  .text-padding {
    padding: 10px;
  }

  .fa-color {
    color: #ff0000;
  }

  .list-group-position {
    max-height: 500px;
    overflow-y: auto
  }

  .display-content {
    height: calc(100vh - 280px);
    text-align: center;
    overflow-y: auto;
    background: #E6E6E6;
  }
  `]
})
export class MfilesPdfViewModalComponent implements OnInit {
  @ViewChild('modal') modal: ModalComponent;

  // 文件列表
  fileLists: any[] = [];
  // 默认激活的合同
  public activeIndex: number;
  params: {[key: string]: any} = {};

  private observable: any;
  private observer: any;

  public constructor(
    private pdfViewService: PdfViewService,
    private xn: XnService,
    private cdr: ChangeDetectorRef
  ) { }

  public ngOnInit() {
    this.observable = new Observable(observer => {
      this.observer = observer;
    });
  }

  open(params: {filesList: any[], pageTitle: string}): Observable<any> {
    // 默认第一个激活
    this.activeIndex = 0;
    this.params = params;
    this.fileLists = params.filesList || [];
    this.modal.open(ModalSize.XXLarge);
    this.switchView(this.fileLists[0], 0);
    return this.observable;
  }

  /**
   *  切换查看不同的合同，并签署
   * @param currentFile 当前合同
   * @param index 当前合同所在下标
   */
  public switchView(currentFile: any, index: number) {
    // 显示不同的合同
    this.activeIndex = index;
    this.displayFiles(currentFile);
  }

  /**
   *  显示当前所选合同内容
   * @param currentFile
   */
  private displayFiles(currentFile: any): void {
    this.xn.api.dragon.post('/contract/contract/json', {
      id: currentFile.id,
      secret: currentFile.secret
    }).subscribe(res => {
      this.pdfViewService.m_init = true;
      this.pdfViewService.pdfToCanvas(res.data, 'cfca');
      this.cdr.markForCheck();
    });
  }

  /**
   *  下载保存合同-当前所有合同
   */
  public onSave() {
    const orgName = this.xn.user.orgName;
    this.xn.api.dragon.download('/file/downFile', {
      files: this.fileLists,
    }).subscribe((v: any) => {
      this.xn.dragon.save(v._body, `文件.zip`);
    });
  }

  public onCancel() {
    this.close({
      action: 'cancel'
    });
  }

  /**
   *  确认生成付确
   */
  public onFinish() {
    setTimeout(() => {
      this.close({
        action: 'ok'
      });
    }, 500);
  }

  private close(value) {
    this.modal.close();
    this.pdfViewService.onDestroy();
    this.observer.next(value);
    this.observer.complete();
  }
}
