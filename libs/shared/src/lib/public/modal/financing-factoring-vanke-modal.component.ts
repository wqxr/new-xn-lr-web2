/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：financing-factoring-vanke-modal.component
 * @summary：批量合同签署，下载
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason                  date
 * 1.0                 zhyuanan      代码调整，删除无用代码      2019-03-22
 * 1.1                 zhyuanan      按照合同排序依次签署        2019-04-11
 * 1.3                 zhyuanan      合同盖章状态修复            2019-04-24
 * **********************************************************************
 */

import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { XnService } from '../../services/xn.service';
import { ModalComponent, ModalSize } from '../../common/modal/components/modal';
import * as md5 from 'js-md5';
import { XnModalUtils } from '../../common/xn-modal-utils';
import { CfcaCodeModalComponent } from './cfca-code-modal.component';
import { PdfViewService } from '../../services/pdf-view.service';
import { SignTypeEnum } from '../../config/select-options';

@Component({
  selector: 'app-financing-factoring-vanke-modal',
  templateUrl: './financing-factoring-vanke-modal.component.html',
  styles: [
    `
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
        overflow-y: auto;
      }
      .display-content {
        height: calc(100vh - 280px);
        text-align: center;
        overflow-y: auto;
        background: #e6e6e6;
      }
    `,
  ],
})
export class FinancingFactoringVankeModalComponent implements OnInit {
  @ViewChild('modal') modal: ModalComponent;
  @ViewChild('szca') szca: ElementRef;

  private observer: any;
  private observable: any;
  private ocx: any;
  public pageTitle: string = '合同签署';
  // CA合同列表
  public contractCALists: any[] = [];
  public contractCFCALists: any[] = [];

  // 默认激活的合同
  public activecaCode: number;
  public activecfcaCode: number;
  // 是否为生产模式
  public isProduction: boolean = true;
  // 只读
  public isReadonly: boolean = false;
  public cancelTitle = '取消';
  // 不用签署合同，但返回 ok
  public isNoSignTitle: boolean;
  // 当前选中合同的数据
  public currentParams: any;
  // 阅读并签章
  public ableClick = true;
  // 当前合同md5值
  private currentContractPreSignMd5: any;
  private subject$: Subject<any>;
  public tempFlag = '';
  public flowId = '';
  public calist = [true, false];
  public allContractList: any[] = [];
  public isProxy: number = 0;

  public constructor(
    private xn: XnService,
    private pdfViewService: PdfViewService,
    private vcr: ViewContainerRef
  ) {
    this.isProduction = this.xn.user.env === 'production';
  }

  public ngOnInit() {
    this.observable = Observable.create((observer) => {
      this.observer = observer;
    });
  }

  /**
   *  打开合同签署弹框
   * @param paramContracts 合同列表[{id:'',secret:'',label:''},{id:'',secret:'',label:''}]
   */
  open(paramContracts: any): Observable<string> {
    // 默认第一个激活
    this.activecaCode = 0;
    this.activecfcaCode = 0;
    this.flowId = paramContracts.flowId;
    this.isProxy = paramContracts.isProxy;
    const paramCFCAList = paramContracts.filter(
      (x) => x.caSignType === SignTypeEnum['cfcaSignType']
    );
    const paramCAList = paramContracts.filter(
      (x) => x.caSignType === SignTypeEnum['caSignType']
    );
    this.contractCALists = this.filterContracts(paramCAList);
    this.contractCFCALists = this.filterContracts(paramCFCAList);
    this.allContractList = this.contractCALists.concat(this.contractCFCALists);
    this.showContract();
    this.modal.open(ModalSize.XXLarge);
    return this.observable;
  }

  /**
   *  按你文本
   */
  public onCancel() {
    if (this.cancelTitle === '确定') {
    }
    const param =
      this.cancelTitle === '确定'
        ? 'ok'
        : {
            action: 'cancel',
          };
    this.close(param);
  }

  public showContract() {
    if (
      (this.contractCALists.length > 0 && this.contractCFCALists.length > 0) ||
      this.contractCALists.length > 0
    ) {
      this.handleClick(1);
    } else if (this.contractCFCALists.length > 0) {
      this.handleClick(2);
    }
  }

  /**
   *  切换查看不同的合同，并签署
   * @param paramCurrentContract
   * @param index 当前合同所在下标
   */
  public switchView([paramCurrentContract, index]: [any, number]) {
    // 显示不同的合同
    this.ableClick = true;
    this.activecaCode = index;
    if (this.subject$) {
      this.subject$.unsubscribe();
    }
    this.displaySign(paramCurrentContract);
  }
  cfcaswitchView([paramCurrentContract, index]: [any, number]) {
    // 显示不同的合同
    this.ableClick = true;
    this.activecfcaCode = index;
    this.cfcadisplaySign(paramCurrentContract);
  }
  /**
   *  下载保存合同-当前所有合同
   */
  public onSave() {
    const orgName = this.xn.user.orgName;
    this.xn.api
      .download('/file/downFile', {
        files: this.allContractList,
      })
      .subscribe((v: any) => {
        this.xn.api.save(v._body, `${orgName}合同文件.zip`);
      });
  }

  /**
   *  测试签署合同
   */
  public onOk() {
    if (this.allContractList && this.allContractList.length) {
      this.allContractList.forEach((x) => (x['status'] = 1));
    }
    setTimeout(() => {
      this.close('ok');
    }, 1000);
  }

  /**
   *  当所有合同都签署完成，点击完成合同签署
   */
  public contractSign() {
    setTimeout(() => {
      this.close('ok');
    }, 1000);
  }

  /**
   * 检查所有合同是否全部签署完成
   */
  public invalid(): boolean {
    return (
      this.allContractList &&
      this.allContractList.some(
        (item) => item.status === undefined || item.status !== 1
      )
    );
  }
  public cfcainvalid(): boolean {
    return this.allContractList.some(
      (item) => item.status === undefined || item.status !== 1
    );
  }

  /**
   *  阅读合同并签署
   */
  public readContract() {
    this.ableClick = true;
    this.onSign(this.currentParams);
  }
  public cfcareadContract() {
    this.ableClick = true;
    if (this.activecfcaCode !== 0) {
      return alert('请按照合同列表顺序签署合同');
    }
    this.cfcaSign(this.currentParams);
  }

  cfcaSign(paramContract: any) {
    const i: number = this.contractCFCALists.findIndex(
      (con) =>
        con.id === paramContract.id && con.secret === paramContract.secret
    );
    // TODO: 暂留
    // if (i > 0 && this.contractCFCALists[i - 1].status === undefined) {
    //   this.ableClick = false;
    //   return alert('请按照合同列表顺序签署合同');
    // }
    const params = {
      flowId: this.flowId,
      isProxy: this.isProxy,
      id: paramContract.id,
      secret: paramContract.secret,
    };
    const servicesParam = Object.assign({}, params, {
      service: 'api',
      phone: '',
    });
    this.xn.api.post2('/cfca/try_sign_contract ', params).subscribe((x) => {
      if (x.data.checkSms) {
        servicesParam.phone = x.data.phone.substring(x.data.phone.length - 4);
        XnModalUtils.openInViewContainer(
          this.xn,
          this.vcr,
          CfcaCodeModalComponent,
          servicesParam
        ).subscribe((v) => {
          if (v === null) {
            return;
          } else if (v?.action === 'ok') {
            this.pdfViewService.m_init = true;
            this.pdfViewService.pdfToCanvas(v.contract, 'cfca');
            this.contractCFCALists[i].status = 1;
            this.ableClick = true;
            // UPDATE: 修改为连续签署
            this.contractCFCALists.forEach((item) => {
              if (!item.status) {
                this.cfcaSign(item);
              }
            });
          }
        });
      } else if (!x.data.checkSms) {
        this.pdfViewService.m_init = true;
        this.pdfViewService.pdfToCanvas(x.data.contract, 'cfca');
        this.contractCFCALists[i]['status'] = 1;
        this.ableClick = true;
      } else {
        this.ableClick = false;
      }
    });
  }
  /**
   *  签署合同
   * @param paramContract
   */
  private onSign(paramContract: any) {
    // 当前合同所在下标
    const i: number = this.contractCALists.findIndex(
      (con) =>
        con.id === paramContract.id && con.secret === paramContract.secret
    );
    if (i > 0 && this.contractCALists[i - 1].status === undefined) {
      this.ableClick = false;
      return alert('请按照合同列表顺序签署合同');
    }
    const orgName = this.ocx.SZCA_GetCurrCertInfo(23).trim();
    const orgName2 = this.xn.user.orgName.trim();

    if (orgName !== orgName2) {
      if (this.isProduction) {
        alert(
          `数字证书与当前用户的公司名称不一致，无法签署PDF，证书使用者的公司名称：${orgName}，当前登录者公司名称：${orgName2}`
        );
        return;
      } else {
        alert(
          `【测试模式】数字证书与当前用户的公司名称不一致，证书使用者的公司名称：${orgName}，当前登录者公司名称：${orgName2}`
        );
      }
    }

    // 用户可能在签章输入PIN时点击了取消，此时通过签章数量来判断用户是否盖章了
    const sealCount = this.ocx.SZCA_GetSealCount();
    // 盖章
    let ret;
    if (paramContract.config && paramContract.config.position) {
      ret = this.ocx.SZCA_DoSealByPage(this.handlePageConfig());
    } else {
      ret = this.ocx.SZCA_MakeSealBySearchText('', paramContract.config.text);
    }
    if (ret !== 0) {
      alert(this.ocx.SZCA_GetErrMsg(ret));
      return;
    }
    // 间隔1秒后再检查印章数量
    setTimeout(() => {
      const sealCount2 = this.ocx.SZCA_GetSealCount();
      const data = this.ocx.SZCA_GetCurPdfString();
      if (sealCount2 <= sealCount || data === '') {
        // 认为没盖章
        alert(this.ocx.SZCA_GetErrMsg(this.ocx.SZCA_GetLastErrCode()));
        return;
      }
      // 二次检查合同签署
      if (sealCount2 <= sealCount || data === '') {
        alert(this.ocx.SZCA_GetErrMsg(this.ocx.SZCA_GetLastErrCode()));
        return;
      }
      // 判断盖章是否成功
      if (this.currentContractPreSignMd5 === md5(data)) {
        alert('盖章未成功！，请重新签署。');
        return;
      }
      this.xn.api
        .post3('/contract/upload', {
          id: paramContract.id,
          secret: paramContract.secret,
          data: data,
        })
        .subscribe(
          () => {
            // 盖章成功之后，修改该合同的状态
            this.contractCALists[i]['status'] = 1;
          },
          () => {},
          () => {
            this.ableClick = false;
          }
        );
    }, 1000);
  }

  /**
   *   过滤不需要显示的合同
   *   ${`done`} 主合同
   *   ${`hide`} 不需要显示的合同
   * @param paramContracts
   */
  private filterContracts(paramContracts: any[]): any[] {
    const arr = [];
    for (let i = 0; i < paramContracts.length; i++) {
      if (
        (paramContracts[i].done && paramContracts[i].done === true) ||
        (paramContracts[i].hide && paramContracts[i].hide === true)
      ) {
      } else {
        arr.push(paramContracts[i]);
      }
    }
    return arr;
  }

  /**
   *  配置位置盖章信息
   */
  private handlePageConfig(): string {
    const pageCount = this.ocx.SZCA_GetPageCount();
    const retPage = [];

    // 如果this.params.config中有页码是负数的，则转换为实际页码
    const pages = this.currentParams.config.position.split('#');
    for (const page of pages) {
      const items = page.split(',');
      const pageNum = parseInt(items[items.length - 1], 0);
      if (pageNum < 0) {
        items[items.length - 1] = pageCount + 1 + pageNum;
      }
      retPage.push(items.join(','));
    }

    return retPage.join('#');
  }
  /**
   *  ca显示当前所选合同内容
   * @param paramCurrentContract
   */
  private displaySign(paramCurrentContract: any): void {
    this.tempFlag = paramCurrentContract.id;
    this.subject$ = new Subject();
    this.subject$.subscribe((res) => {
      console.log('subject res', res);
      if (this.tempFlag !== paramCurrentContract.id) {
        return;
      }
      try {
        const ret = this.ocx.SZCA_LoadFromString(res.data);
        if (ret !== 0) {
          alert(this.ocx.SZCA_GetErrMsg(ret));
          return;
        }
        this.currentParams = paramCurrentContract;
        this.isReadonly = paramCurrentContract.readonly || false;
        this.cancelTitle = paramCurrentContract.cancelTitle || this.cancelTitle;
        this.isNoSignTitle = paramCurrentContract.isNoSignTitle;
        this.ableClick = false;
        this.currentContractPreSignMd5 = md5(res.data); // 当前文件未签署前md5
      } catch (error) {}
    });

    this.xn.api
      .post3('/contract/json', {
        id: paramCurrentContract.id,
        secret: paramCurrentContract.secret,
      })
      .subscribe(this.subject$);
  }

  /**
   *  cfca显示当前所选合同内容
   * @param paramCurrentContract
   */
  private cfcadisplaySign(paramCurrentContract: any): void {
    this.xn.api
      .post3('/contract/json', {
        id: paramCurrentContract.id,
        secret: paramCurrentContract.secret,
        label: paramCurrentContract.label,
      })
      .subscribe((res) => {
        this.pdfViewService.m_init = true;
        this.pdfViewService.pdfToCanvas(res.data, 'cfca');
        this.ableClick = false;
      });
    this.tempFlag = paramCurrentContract.id;
    this.currentParams = paramCurrentContract;
    this.isReadonly = paramCurrentContract.readonly || false;
    this.cancelTitle = paramCurrentContract.cancelTitle || this.cancelTitle;
    this.isNoSignTitle = paramCurrentContract.isNoSignTitle;
  }
  handleClick(type: number) {
    if (type === 2) {
      this.calist = [false, true];
      this.activecfcaCode = 0;
      $(this.szca.nativeElement).children().first().remove();
      this.cfcadisplaySign(this.contractCFCALists[0]);
    } else {
      this.createOcx();
      this.activecaCode = 0;
      this.calist = [true, false];
      this.displaySign(this.contractCALists[0]);
    }
  }

  /**
   *  创建ocx
   */
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
    this.showOrHide();
  }

  /**
   *  显示签章工具工具栏
   */
  private showOrHide(): void {
    try {
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
      tools.forEach((tool) => {
        this.ocx.SZCA_SetToolButtomShowHide(tool.index, tool.show);
      });
    } catch {
      //
    }
  }

  /**
   *  关闭签署合同弹框
   * @param paramAction
   */
  private close(paramAction: any): void {
    this.modal.close();
    this.pdfViewService.onDestroy();
    this.observer.next(paramAction);
    this.observer.complete();
  }
}
