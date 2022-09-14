/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：shanghai-asign-contract.modal
 * @summary：批量合同签署，下载
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason                  date
 * 1.0                 wangqing      代码调整，删除无用代码      2019-08-28
 * 1.1                 wangqing      按照合同排序依次签署        2019-08-28
 * 1.3                 wangqing      合同盖章状态修复            2019-08-28
 * 1.4                 yutianbao       上银供应商签合同          2020-11-20
 * **********************************************************************
 */

import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Observable, of } from 'rxjs';
import * as md5 from 'js-md5';
import { Subject } from 'rxjs';
import {
  ModalComponent,
  ModalSize,
} from 'libs/shared/src/lib/common/modal/ng2-bs3-modal';
import { PdfViewService } from 'libs/shared/src/lib/services/pdf-view.service';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { SignTypeEnum } from 'libs/shared/src/lib/config/select-options';
import { CfcaCodeModalComponent } from 'libs/shared/src/lib/public/modal/cfca-code-modal.component';

@Component({
  selector: 'lib-shanghai-asign-contract-modal',
  templateUrl: './shanghai-asign-contract.modal.component.html',
  styles: [
    `
      .pdf-container {
        width: 100%;
        height: calc(100vh - 285px);
        border: none;
      }
      ::ng-deep .pdf-container canvas {
        margin: auto !important;
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
export class ShanghaiFinancingContractModalComponent implements OnInit {
  @ViewChild('modal') modal: ModalComponent;
  @ViewChild('szca') szca: ElementRef;

  private observer: any;
  private observable: any;
  private ocx: any;
  public pageTitle: string = '合同签署';
  // 合同列表
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
  // CA合同列表
  public contractCALists: any[] = [];
  public contractCFCALists: any[] = [];
  public ableClick = true;
  public pageClick = true;
  public tempFlag = '';
  // 当前合同md5值
  private currentContractPreSignMd5: any;
  private subject$: Subject<any>;
  public calist = [true, false];
  public flowId = '';
  public isProxy: number = 0;
  public allContractList: any[] = [];
  public constructor(
    private xn: XnService,
    private pdfViewService: PdfViewService,
    private vcr: ViewContainerRef,
    private cdr: ChangeDetectorRef
  ) {
    this.isProduction = this.xn.user.env === 'production';
  }

  public ngOnInit() {
    this.observable = new Observable((observer) => {
      this.observer = observer;
    });
  }

  /**
   *  打开合同签署弹框
   * @param contractObj 合同列表{ flowId: '', isProxy: 60, contracts: [{id:'',secret:'',label:'', ....},...]}
   */
  open(contractObj: any): Observable<string> {
    // 默认第一个激活
    this.activecaCode = 0;
    this.activecfcaCode = 0;
    this.flowId = contractObj.flowId;
    this.isProxy = contractObj.isProxy;
    const paramCFCAList = contractObj.contracts.filter(
      (x: any) =>
        x.caSignType.toString() === SignTypeEnum.cfcaSignType.toString()
    );
    const paramCAList = contractObj.contracts.filter(
      (x: any) => x.caSignType.toString() === SignTypeEnum.caSignType.toString()
    );
    this.contractCALists = this.filterContracts(paramCAList);
    this.contractCFCALists = this.filterContracts(paramCFCAList);
    this.allContractList = this.contractCALists.concat(this.contractCFCALists);
    this.showContract();
    this.modal.open(ModalSize.XXLarge);
    return this.observable;
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

  /**
   *  切换查看不同的合同，并签署
   * @param paramCurrentContract
   * @param index 当前合同所在下标
   */
  public switchView([paramCurrentContract, index]: [any, number]) {
    // 显示不同的合同
    this.ableClick = true;
    this.pageClick = true;
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
   *  cfca显示当前所选合同内容
   * @param paramCurrentContract
   */
  private cfcadisplaySign(paramCurrentContract: any): void {
    this.xn.dragon
      .post3('/contract/contract/json', {
        id: paramCurrentContract.id,
        secret: paramCurrentContract.secret,
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

  /**
   *  下载保存合同-当前所有合同
   */
  public onSave() {
    const orgName = this.xn.user.orgName;
    this.xn.api.dragon
      .download('/file/downFile', {
        files: this.allContractList,
      })
      .subscribe((v: any) => {
        this.xn.dragon.save(v._body, `${orgName}合同文件.zip`);
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
    return this.allContractList.some(
      (item) => item.status === undefined || item.status !== 1
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
    this.pageClick = true;
    this.onSign(this.currentParams);
  }

  public pageContract() {
    this.pageClick = true;
    this.ableClick = true;
    this.pageonSign(this.currentParams);
  }

  public cfcareadContract() {
    this.ableClick = true;
    if (this.activecfcaCode !== 0) {
      return alert('请按照合同列表顺序签署合同');
    }
    this.cfcaSign(this.currentParams);
  }

  private cfcaSign(paramContract: any) {
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
      label: paramContract.label,
    };
    const servicesParam = Object.assign({}, params, {
      service: 'dragon',
      phone: '',
    });
    this.xn.dragon.post('/cfca/try_sign_contract', params).subscribe((x) => {
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
            this.cdr.markForCheck();
          }
        });
      } else if (!x.data.checkSms) {
        this.pdfViewService.m_init = true;
        this.pdfViewService.pdfToCanvas(x.data.contract, 'cfca');
        this.contractCFCALists[i]['status'] = 1;
        this.ableClick = true;
        this.cdr.markForCheck();
      } else {
        this.ableClick = false;
        this.cdr.markForCheck();
      }
    });
  }

  /**
   *  签署合同
   * @param paramContract
   */
  private pageonSign(paramContract: any) {
    const sealCount = this.ocx.SZCA_GetSealCount();
    if (sealCount < 1) {
      this.pageClick = false;
      this.ableClick = false;
      alert('没检测到章,请重新盖章');
      return;
    }

    // 当前合同所在下标
    const i: number = this.contractCALists.findIndex(
      (con) =>
        con.id === paramContract.id && con.secret === paramContract.secret
    );
    if (i > 0 && this.contractCALists[i - 1].status === undefined) {
      this.ableClick = true;
      this.pageClick = false;
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
    // const sealCount = this.ocx.SZCA_GetSealCount();
    // // 盖章
    // let ret = this.ocx.SZCA_DoSealByPage(this.handlePageConfig());
    // if (ret !== 0) {
    //     alert(this.ocx.SZCA_GetErrMsg(ret));
    //     return;
    // }
    // 间隔1秒后再检查印章数量
    setTimeout(() => {
      const data = this.ocx.SZCA_GetCurPdfString();
      this.xn.dragon
        .post3('/file/contractUpload', {
          id: paramContract.id,
          secret: paramContract.secret,
          label: paramContract.label,
          data: data,
        })
        .subscribe(() => {
          try {
            this.contractCALists[i]['status'] = 1;
            this.pageClick = false;
            this.ableClick = false;
          } catch (error) {
            this.xn.msgBox.open(false, error);
          }
        });
    }, 1000);
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
      this.pageClick = false;
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
      this.xn.dragon
        .post3('/file/contractUpload', {
          id: paramContract.id,
          secret: paramContract.secret,
          label: paramContract.label,
          data: data,
        })
        .subscribe(() => {
          try {
            this.contractCALists[i]['status'] = 1;
            this.ableClick = false;
            this.pageClick = false;
          } catch (error) {
            this.xn.msgBox.open(false, error);
          }
        });
      // 盖章成功之后，修改该合同的状态
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
    this.currentParams.config.position = `0,200,160,${pageCount}`;
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
   *  显示当前所选合同内容
   * @param paramCurrentContract
   */
  private displaySign(paramCurrentContract: any): void {
    this.tempFlag = paramCurrentContract.id;
    this.isReadonly = paramCurrentContract.readonly || false;
    this.cancelTitle = paramCurrentContract.cancelTitle || this.cancelTitle;
    this.isNoSignTitle = paramCurrentContract.isNoSignTitle;
    this.subject$ = new Subject();
    this.subject$.subscribe((res) => {
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
        this.ableClick = false;
        this.pageClick = false;
        this.currentContractPreSignMd5 = md5(res.data); // 当前文件未签署前md5
      } catch (error) {}
    });

    this.xn.api.dragon
      .post('/contract/contract/json', {
        id: paramCurrentContract.id,
        secret: paramCurrentContract.secret,
      })
      .subscribe(this.subject$);
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
                style="left: 0; top: 0; width: 100%; height:100%;"  clsid='{27DD22AC-F026-49FB-8733-AABB4DA82B8C}'>`;
    } else if (navigator.userAgent.indexOf('Firefox') > 0) {
      div.innerHTML = `<object id="PDFReader" type="application/x-lrscft-activex" align='baseline' border='0'
                style="left: 0; top: 0; width: 100%; height:100%;" clsid="{27DD22AC-F026-49FB-8733-AABB4DA82B8C}"></object>`;
    } else {
      div.innerHTML = `<object id="PDFReader" align="middle"
                style="left: 0; top: 0; width: 100%; height:100%;" classid="clsid:27DD22AC-F026-49FB-8733-AABB4DA82B8C"></object>`;
    }

    this.szca.nativeElement.appendChild(div);
    this.ocx = document.getElementById('PDFReader');

    // this.ocx.OnDoSealSuccess();
    // alert('盖章成功');
    // this.pageonSign(this.currentParams);
    this.showOrHide();
  }

  handleClick(type: number) {
    if (type === 2) {
      this.calist = [false, true];
      $(this.szca.nativeElement).children().first().remove();
      this.activecfcaCode = 0;
      this.cfcadisplaySign(this.contractCFCALists[0]);
    } else {
      this.createOcx();
      this.calist = [true, false];
      this.activecaCode = 0;
      this.displaySign(this.contractCALists[0]);
    }
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
