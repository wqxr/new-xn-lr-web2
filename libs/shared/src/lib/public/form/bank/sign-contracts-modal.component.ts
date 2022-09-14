import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable, of } from 'rxjs';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import {
  ModalComponent,
  ModalSize,
} from 'libs/shared/src/lib/common/modal/components/modal';

import * as moment from 'moment';

/**
 *  银行合同签署
 */
@Component({
  selector: 'xn-sign-contracts-modal',
  templateUrl: './sign-contracts-modal.component.html',
  styles: [
    `
      @media (min-width: 768px) {
        .modal-wrap .modal-dialog {
          width: 1200px;
        }
      }

      .modal-dialog {
        position: fixed;
      }

      .flex-row {
        display: flex;
        margin-bottom: -15px;
      }

      .pdf-container {
        width: 100%;
        height: calc(100vh - 260px);
        border: none;
      }

      .this-pdf {
        left: 0px;
        top: 0px;
        width: 100%;
        height: 100%;
      }

      .text-padding {
        padding: 10px;
      }

      .fa-color {
        color: #ff0000;
      }
    `,
  ],
})
export class SignContractsModalComponent implements OnInit {
  params: any;
  @ViewChild('modal') modal: ModalComponent;
  @ViewChild('szca') szca: ElementRef;

  private observer: any;
  private observable: any;

  // 合同列表
  public contractLists: any[] = [];
  // 默认激活的合同
  public acticeCode: number;
  public isProduction = true;
  private ocx: any;
  public saveShow: boolean;
  public isReadonly: boolean;
  // 当前选中合同的数据
  public currentParams: any;
  // 按钮显示的文字 默认阅读
  // public textIndex = 1;
  public ableClick = true;

  public constructor(private xn: XnService) {
    this.isProduction = this.xn.user.env === 'production';
  }

  public ngOnInit() {
    this.observable = Observable.create((observer) => {
      this.observer = observer;
    });
  }

  open(params: any): Observable<string> {
    params = this.filterDone(params);
    // 默认第一个激活
    this.acticeCode = 0;
    this.params = params;
    this.contractLists = params;
    this.isReadonly = params.length > 0 ? params[0].isReadonly : true;
    this.createOcx();
    // 默认显示第一份合同
    if (params && params.length) {
      this.displaySign(params[0]);
    }
    if (params.size) {
      this.modal.open(params.size);
    } else {
      this.modal.open(ModalSize.XLarge);
    }

    return this.observable;
  }

  filterDone(params) {
    if (params.length <= 0) {
      return;
    }
    const arr = [];
    for (let i = 0; i < params.length; i++) {
      if (params[i].done && params[i].done === true) {
      } else {
        arr.push(params[i]);
      }
    }
    return arr;
  }

  // 切换查看合同
  public switchView(item: any, i: number) {
    this.ableClick = true;
    this.acticeCode = i;
    // 按钮重置为1

    this.currentParams = item;
    // 显示不同的合同
    this.displaySign(item);
  }

  public onSave() {
    const orgName = this.xn.user.orgName;
    const time = moment(new Date().getTime()).format(
      'YYYY年MM月DD日HH时mm分ss秒'
    );
    const filename =
      this.currentParams.label + '-' + orgName + '-' + time + '.pdf';
    const save = this.ocx.SZCA_DocSaveAs(`${filename}`);
    let result = '成功';
    result = save === 0 ? '已成功下载至桌面' : '下载失败，请重新下载';
    alert(`合同文件：${filename}${result}`);
  }

  // 线下签署
  public offline() {
    // to do: 下载
    // this.onSave();

    this.close({
      action: 'offline',
    });
  }

  public online() {
    this.close({
      action: 'online',
    });
  }

  // 合同签署
  public contractSign() {
    // 检查usbkey的公司名称

    // this.close({
    //     action: 'ok'
    // });
    // this.contractLists.map(x => {
    //     this.onSign(x);
    // });
    setTimeout(() => {
      this.close('ok');
    }, 1000);
  }

  // 检查合同是否全部签署完成
  public invalid(): boolean {
    if (this.contractLists && this.contractLists.length) {
      return this.contractLists.find(
        (item) => !(item.status && item.status === 1)
      );
    }
  }

  // 显示合同
  private displaySign(params: any) {
    console.log('需要验证的合同：', params);
    this.currentParams = params;
    // 设置盖章位置
    // this.currentParams['config'] = {
    //     text: '（盖章）'
    // };
    this.saveShow = params.label ? true : false;
    // if (this.isOcxEnabled()) {
    this.xn.api
      .post3('/contract/json', {
        id: params.id,
        secret: params.secret,
      })
      .subscribe((json) => {
        try {
          this.ableClick = false;
          const ret = this.ocx.SZCA_LoadFromString(json.data);
          if (ret !== 0) {
            alert(this.ocx.SZCA_GetErrMsg(ret));
            return;
          }
        } catch (error) {
          console.warn(error);
        }
      });
    // }
  }

  private isOcxEnabled(): boolean {
    try {
      const err = this.ocx.SZCA_GetLastErrCode();
      console.log('SZCA_GetLastErrCode', err);
      return true;
    } catch (e) {
      console.log('SZCA_GetLastErrCode exception:', e);
      return false;
    }
  }

  // 创建ocx
  private createOcx() {
    // szca的控件需要这样动态创建
    const div = document.createElement('div');
    div.style.width = '100%';
    div.style.height = '100%';

    if (navigator.userAgent.indexOf('MSIE') > 0) {
      div.innerHTML = `<object id="PDFReader" align="middle"
                style="left: 0; top: 0; width: 100%; height:100%;" classid="clsid:27DD22AC-F026-49FB-8733-AABB4DA82B8C"></object>`;
    } else if (navigator.userAgent.indexOf('Chrome') > 0) {
      div.innerHTML = `<embed id="PDFReader" type="application/x-lrscft-activex"
                style="left: 0; top: 0; width: 100%; height:100%;" clsid='{27DD22AC-F026-49FB-8733-AABB4DA82B8C}'>`;
    } else if (navigator.userAgent.indexOf('Firefox') > 0) {
      div.innerHTML = `<object id="PDFReader" type="application/x-lrscft-activex" align='baseline' border='0'
                style="left: 0; top: 0; width: 100%; height:100%;" clsid="{27DD22AC-F026-49FB-8733-AABB4DA82B8C}"></object>`;
    } else {
      div.innerHTML = `<object id="PDFReader" align="middle"
                style="left: 0; top: 0; width: 100%; height:100%;" classid="clsid:27DD22AC-F026-49FB-8733-AABB4DA82B8C"></object>`;
    }

    this.szca.nativeElement.appendChild(div);
    this.ocx = document.getElementById('PDFReader');

    console.log('ocx', this.ocx, this.isOcxEnabled());
    // if (!this.isOcxEnabled()) {
    //     return;
    // }

    this.showOrHide();
  }

  showOrHide() {
    const tools = [
      { index: 1, show: 0 },
      { index: 2, show: 0 },
      { index: 3, show: 1 },
      { index: 4, show: 0 },
      { index: 5, show: 0 },
      { index: 6, show: 0 },
      { index: 7, show: 0 },
      { index: 8, show: 0 },
      { index: 9, show: 0 },
      { index: 10, show: 0 },
    ];

    try {
      tools.forEach((tool) => {
        this.ocx.SZCA_SetToolButtomShowHide(tool.index, tool.show);
      });
    } catch (e) {
      console.warn(e);
    }
  }

  onCancel() {
    this.close({
      action: 'cancel',
    });
  }

  private close(value: any) {
    this.modal.close();
    this.observer.next(value);
    this.observer.complete();
  }
}
