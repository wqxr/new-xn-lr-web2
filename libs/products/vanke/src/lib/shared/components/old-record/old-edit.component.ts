/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：edit.component.ts
 * @summary：流程信息编辑页
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 wangqing          增加功能1         2019-08-28
 * **********************************************************************
 */

import {
  Component,
  AfterViewInit,
  ViewContainerRef,
  Output,
  EventEmitter,
  AfterViewChecked,
  OnInit,
  ChangeDetectorRef,
  ElementRef,
  ViewChild,
  OnDestroy,
  Input,
} from '@angular/core';
import { FormGroup } from '@angular/forms';

import { ModalComponent } from 'libs/shared/src/lib/common/modal/components/modal';
import { OperateType, ProcduresIdEnum } from 'libs/shared/src/lib/config/enum/common-enum';
import { ButtonConfigModel } from 'libs/shared/src/lib/config/list-config-model';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { PublicCommunicateService } from 'libs/shared/src/lib/services/public-communicate.service';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { CheckersOutputModel } from 'libs/shared/src/lib/config/checkers';
import XnFlowUtils from 'libs/shared/src/lib/common/xn-flow-utils';
import { IFlowCustom, FlowCustom } from '../flow/flow-custom';
import { VankeViewChangeAccountComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/vanke-change-account.component';
import {
  EditModalComponent,
  EditParamInputModel,
} from 'libs/shared/src/lib/public/dragon-vanke/modal/edit-modal.component';
import { VankeDataChangeModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/vanke-dataChange-modal.component';
import { HtmlModalComponent } from 'libs/shared/src/lib/public/modal/html-modal.component';
import { IntelligenceStandardModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/intelligence-standard-modal.component';
import { NewVankeAuditStandardModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/audit-standard-modal.component';
import { RejectModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/reject-modal.component';
import { IsPreTrade } from 'libs/shared/src/lib/config/enum';
import { PointService } from 'libs/shared/src/lib/services/point.service';
import * as _ from 'lodash';
class CheckerDatas {
  mainFlowId = '';
  recordId = '';
  procedureId = '';
  memo = '';
  flowId = '';
  appType = '';
  checkerData = '';
}

@Component({
  templateUrl: './old-edit.component.html',
  selector: 'old-vanke-edit-component',
  styles: [
    `
      .box-title {
        font-size: 14px;
      }

      .xn-panel-sm {
        margin-bottom: 10px;
      }

      .xn-panel-sm .panel-heading {
        padding: 5px 15px;
      }

      .xn-panel-sm .panel-heading .panel-title {
        font-size: 14px;
      }

      .panel-footer .btn + .btn {
        margin-left: 10px;
      }

      .app-flow-process {
        border: 1px solid #ddd;
        padding: 4px;
        margin-bottom: 10px;
        border-radius: 3px;
        background-color: #fff;
      }
      .helpUl li {
        text-align: left;
      }
      .rejectClass {
        position: absolute;
        top: 25%;
        left: 80%;
      }
      .changesClass {
        position: absolute;
        top: 28%;
        left: 80%;
      }
      .xn-divide-line {
        background-color: #d7d1d1;
        margin-top: -15px;
        margin-bottom: 15px;
      }
      .wrap-desc {
        display: flex;
        flex-direction: column;
      }
    `,
  ],
})
export class OldVankeEditComponent
  implements AfterViewInit, AfterViewChecked, OnInit, OnDestroy
{
  @ViewChild('accountDistannce') accountDistannce: ElementRef;
  @ViewChild('cancelModal') cancelModal: ModalComponent;
  @Output() afterBuildFormGroup: EventEmitter<void> = new EventEmitter();
  public recordId: string;

  @Input() svrConfig: any;
  public cancelChecker: any = {
    name: 'cancelChecker',
    type: 'textarea',
    required: false,
  };

  @Input() mainForm: FormGroup;

  public pageTitle = '处理流程记录';
  public pageDesc = '';

  public flowCustom: IFlowCustom;
  @Input() flowId = '';

  @Input() baseInfo: any[] = [];
  @Input() shows: any[] = [];
  @Input() hasActions: boolean;
  public loadingback = false;
  public newSvrConfig: any;
  public mainFlowId: string;
  public rejectdata: string[] = [];
  public updatedata: CheckerDatas[] = [];
  fromModule = 'dragon-input';
  isVanke: string;
  isshowProgress: boolean; // 是否显示导航进度条
  Showintelligence = false;
  isPreTrade: any;
  // public isShow: boolean = false;
  public showIconReject = false;
  public showIconVankeChanges = false;
  public changesInterval: any = null; // 定时任务
  commonReject = false;
  buttonList: any;

  constructor(
    private xn: XnService,
    private cdr: ChangeDetectorRef,
    private vcr: ViewContainerRef,
    private loading: LoadingService,
    public hwModeService: HwModeService,
    public communicateService: PublicCommunicateService,
    private localStorageService: LocalStorageService,
    public pointService: PointService
  ) {}

  ngAfterViewInit() {
    if (this.showRejectIcon()) {
      this.showRejectInfo();
    }
    if (
      this.showVankeChangesIcon() &&
      this.svrConfig.procedure.procedureId !== 'review'
    ) {
      this.startSetInterval(60000, false);
    }
    this.showIconReject = this.showRejectIcon() && this.showIconReject;
    this.showIconVankeChanges =
      this.showVankeChangesIcon() && this.showIconVankeChanges;
    if (this.flowId === 'dragon_financing') {
      this.isVanke = 'dragon';
    } else if (this.flowId === 'vanke_financing') {
      this.isVanke = 'vanke';
    }
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }
  ngOnInit() {
    this.recordId = this.svrConfig.record.recordId;
    this.isPreTrade = this.svrConfig.isPreTrade;
    this.flowCustom = FlowCustom.build(
      this.flowId,
      this.xn,
      this.vcr,
      this.loading,
      this.communicateService,
      this.localStorageService,
      this.pointService
    );
    this.newSvrConfig = _.cloneDeep(this.svrConfig); // JSON.parse(JSON.stringify(this.svrConfig));
    this.mainFlowId =
      (this.svrConfig &&
        this.svrConfig.record &&
        this.svrConfig.record.mainFlowId) ||
      '';
    this.updatedata = [new CheckerDatas(), new CheckerDatas()];
    if (!!this.changesInterval) {
      clearInterval(this.changesInterval);
    }
  }

  ngOnDestroy(): void {
    if (!!this.changesInterval) {
      clearInterval(this.changesInterval);
    }
  }

  // 是否显示退回原因图标
  showRejectIcon() {
    return (
      (this.svrConfig.record.flowId === 'dragon_financing' ||
        this.svrConfig.record.flowId === 'dragon_platform_verify' ||
        this.svrConfig.record.flowId === 'vanke_financing' ||
        this.svrConfig.record.flowId === 'vanke_platform_verify') &&
      this.svrConfig.procedure.procedureId === 'operate'
    );
  }

  // 是否显示数据变动图标
  showVankeChangesIcon() {
    return (
      this.svrConfig.record.flowId === 'vanke_platform_verify' &&
      this.svrConfig.wkType &&
      this.svrConfig.wkType === 1
    );
  }
  // 查看发票全部信息
  viewInvoice(){
    const url = this.xn.router.serializeUrl(this.xn.router.createUrlTree([`/console/manage/plat/invoice-view/${this.svrConfig.record.mainFlowId}`]));
    window.open(url,'_blank','noopener');
  }
  // 是否显示查看全部发票信息按钮
  showViewInvoice(){
      return this.showVankeChangesIcon() && this.svrConfig.procedure.procedureId===ProcduresIdEnum.OPERATE;
  }

  /**
   *  历史提交版折叠
   * @param paramItem paramItem
   */
  public collapse(paramItem: any): void {
    const items = this.newSvrConfig.actions;
    if (!paramItem.collapse || paramItem.collapse === false) {
      items.forEach((x: any) => (x.collapse = false)); // 所有都至false
      paramItem.collapse = true;
    } else if (paramItem.collapse === true) {
      paramItem.collapse = false;
    }
  }
  /**
   * 进度款前置记录判断
   * @param formValue formValue 对象
   */
  preTradeCheck(formValue): Promise<any[]> {
    const billNumberList = XnUtils.parseObject(formValue.data).map(
      (i) => i.billNumber
    );
    return new Promise((resolve) => {
      this.xn.api.dragon
        .post('/pre_trade/pre_trade/check', { billNumberList: billNumberList })
        .subscribe((res) => {
          if (res.ret === 0) {
            const { warn } = res.data;
            if (!_.isEmpty(res.data.warn)) {
              resolve(warn);
            } else {
              resolve(undefined);
            }
          } else {
            console.log('接口有误', res);
            resolve(undefined);
          }
          this.xn.loading.close();
        });
    });
  }
  /**
   *  提交同意
   *  提交数据前，回调该流程的个性配置，进行具体操作
   */
  public async onSubmit() {
    const orderInfo = this.newSvrConfig.checkers.filter(
      (item) => item.checkerId === 'orderInfo'
    );
    const warnData =
      orderInfo.length > 0 ? await this.preTradeCheck(orderInfo[0]) : null;
    if (!_.isEmpty(warnData)) {
      const resultList = XnUtils.parseObject(orderInfo[0].data).filter((i) => {
        return warnData.includes(i.billNumber);
      });
      const params: EditParamInputModel = {
        title: '提示',
        checker: [
          {
            title: '已选交易',
            checkerId: 'editPreTradeInfo',
            type: 'table-common',
            required: 0,
            value: !_.isEmpty(resultList) ? JSON.stringify(resultList) : '',
          },
        ] as CheckersOutputModel[],
        content:
          '以下【进度款前置融资业务】的“应收账款金额”小于“特定数值”，请确认是否继续发起提单？',
        subContent:
          'tips：特定数值=进度款前置融资产品流程中的付款金额 ×（1+（22.5%×（发起提单日期-进度款前置融资产品流程中的付款日期）/360））',
        buttons: ['取消', '确定'],
      };
      XnModalUtils.openInViewContainer(
        this.xn,
        this.vcr,
        EditModalComponent,
        params
      ).subscribe((res) => {
        if (!res) {
          return;
        }
        for (const checker of this.svrConfig.checkers) {
          if (checker.options && checker.options.readonly) {
            this.mainForm.value[checker.checkerId] = checker.value;
          }
        }
        this.innerSubmit(() => {
          return this.flowCustom.preSubmit(this.svrConfig, this.mainForm.value);
        });
      });
      return;
    }
    this.innerSubmit(() => {
      for (const checker of this.svrConfig.checkers) {
        if (checker.options && checker.options.readonly) {
          this.mainForm.value[checker.checkerId] = checker.value;
        }
      }
      return this.flowCustom.preSubmit(this.svrConfig, this.mainForm.value);
    });
  }

  /**
   * 获取other：用于必填项提示
   * @param row row
   */
  public getRowOther(row) {
    if (row.other !== undefined && row.other !== '') {
      return JSON.parse(row.other);
    }
  }
  get preTradeType() {
    return IsPreTrade;
  }
  getPreTrade(row): string {
    if (
      this.isPreTrade === IsPreTrade.YES &&
      row?.checkerId === 'accountInfo' &&
      JSON.parse(row?.value).isVirtual === false
    ) {
      return `收款账户信息有误，请变更为【取值为虚拟账户账号】`;
    } else {
      return '';
    }
  }
  /**
   * 根据mainForm.value[row.name]判断是否显示必填提示
   * 平台审核流程
   * @param row row
   */
  public otherJudge(row): boolean {
    const rowVal = this.mainForm.value[row.name];

    let flag = null;
    if (
      row.checkerId === 'dealContract' &&
      row.flowId === 'vanke_platform_verify'
    ) {
      flag = JSON.parse(rowVal).some(
        (x) =>
          !(
            x.contractName &&
            x.contractId &&
            x.contractMoney &&
            x.payRate &&
            x.contractType &&
            x.contractJia &&
            x.contractYi
          )
      );
      return flag;
    } else if (
      row.checkerId === 'dealContract' &&
      row.flowId === 'vanke_financing'
    ) {
      // 供应商上传资料-交易合同必填
      return !rowVal;
    } else if (
      row.checkerId === 'performanceFile' &&
      row.flowId === 'vanke_platform_verify'
    ) {
      flag = JSON.parse(rowVal).some(
        (x) => !(x.percentOutputValue && x.payType)
      );
      return flag;
    } else if (
      row.checkerId === 'performanceFile' &&
      row.flowId === 'vanke_financing'
    ) {
      // 供应商上传资料-履约证明必填
      return !rowVal;
    } else if (
      [
        'certificateFile',
        'invoice',
        'checkCertFile',
        'registerCertFile',
      ].includes(row.checkerId)
    ) {
      return !rowVal;
    }
    return false;
  }

  /**
   * 提示处理
   */
  onRowOtherClick(value: string, row: any) {
    if (value === '申请变更账号') {
      this.flowClick();
    } else if (value === '查看账号变更记录' || value === '查看账号使用记录') {
      const cardCode = this.svrConfig.checkers.filter(
        (x: any) => x.checkerId === 'debtInfo'
      )[0].value;
      XnModalUtils.openInViewContainer(
        this.xn,
        this.vcr,
        VankeViewChangeAccountComponent,
        {
          params: value,
          orgName: row.value,
          cardCode: JSON.parse(cardCode).cardCode,
        }
      ).subscribe(() => {});
    } else if (value === '下载更正函模板') {
      this.xn.api.dragon
        .download('/file/downloadCorrect', { mainFlowId: this.mainFlowId })
        .subscribe((v: any) => {
          this.xn.api.save(v._body, '更正函.zip');
        });
      // const a = document.createElement('a');
      // a.href = '../../../../../../assets/lr/doc/dragon-mode/更正函.docx';
      // a.click();
    }
  }
  flowClick() {
    this.temporaryflowStorage();
    this.xn.router.navigate([`/vanke/record/new/`], {
      queryParams: {
        id: 'sub_vanke_change',
        relate: 'mainFlowId',
        relateValue: this.svrConfig.record.mainFlowId,
        isPreTrade: this.isPreTrade,
      },
    });
  }
  /**
   *  取消
   */
  public onCancel() {
    this.xn.user.navigateBack();
  }

  /**
   *
   * @param row 当前checker项信息 获取帮助文档
   */
  gethelpDoc(row) {
    if (row.options && row.options.helpType) {
    }
  }
  /**
   *  中登登记，暂留
   */
  public onRegistration() {}
  // 显示暂存按钮
  showTempClick() {
    return (
      (this.svrConfig.flow.flowId === 'dragon_financing' &&
        this.svrConfig.record.nowProcedureId === 'operate') ||
      (this.svrConfig.flow.flowId === 'vanke_platform_verify' &&
        this.svrConfig.record.nowProcedureId === 'operate') ||
      (this.svrConfig.flow.flowId === 'dragon_platform_verify' &&
        this.svrConfig.record.nowProcedureId === 'operate') ||
      (this.svrConfig.flow.flowId === 'vanke_platform_verify' &&
        this.svrConfig.record.nowProcedureId === 'operate') ||
      (this.svrConfig.flow.flowId === 'vanke_financing' &&
        this.svrConfig.record.nowProcedureId === 'operate') ||
      (this.svrConfig.flow.flowId === 'sub_law_manager_survey' &&
        this.svrConfig.record.nowProcedureId === 'review')
    );
  }

  /**
   *  回退上一步，在历史记录中取到最近一次的提交值，即为草稿
   * @param shows shows
   * @param hides hides
   * @param fresh fresh
   */

  private showRejectInfo() {
    this.xn.api.dragon
      .post('/flow/tips', {
        mainFlowId: this.svrConfig.record.mainFlowId,
        flowId: this.svrConfig.record.flowId,
      })
      .subscribe((x) => {
        if (x.ret === 0 && x.data.flag === 1) {
          this.showIconReject = true;
          const params = {
            title: '平台拒绝信息',
            checker: [
              {
                title: '退回修改内容',
                checkerId: 'stopcontent',
                type: 'text',
                options: { readonly: true },
                required: 0,
                value: x.data.info,
              },
              {
                title: '问题描述',
                type: 'textarea',
                checkerId: 'questiondetail',
                options: { readonly: true },
                required: 0,
                value: x.data.desc,
              },
              {
                title: '退回原因',
                type: 'textarea',
                checkerId: 'questionReason',
                options: { readonly: true },
                required: 0,
                value: x.data.rejectReason,
              },
            ] as CheckersOutputModel[],
            buttons: ['确定'],
          };
          XnModalUtils.openInViewContainer(
            this.xn,
            this.vcr,
            EditModalComponent,
            params
          ).subscribe((v) => {
            if (v === null) {
              return;
            } else {
            }
          });
        } else {
          this.showIconReject = false;
        }
      });
  }

  /**下载中登附件 */
  downloadZd() {
    this.xn.loading.open();
    const invoiceData = this.mainForm.get('invoice').value;
    const invoiceLists = JSON.parse(invoiceData).map((x) => {
      const { invoiceNum, invoiceAmount, transferMoney } = x;
      return {
        invoiceNum,
        invoiceAmount,
        transferMoney,
      };
    });

    this.xn.dragon
      .download('/zhongdeng/zd/zhongdeng_attachment_download', {
        mainFlowId: this.mainFlowId,
        invoiceList: invoiceLists,
      })
      .subscribe((v: any) => {
        this.xn.loading.close();
        this.xn.api.dragon.save(
          v._body,
          `${this.mainForm.get('debtUnit').value}-${
            this.mainForm.get('receive').value
          }.pdf`
        );
      });
  }

  /**
   * 显示万科数据变动
   */
  private showVankeChangesInfo(init: boolean) {
    this.xn.dragon
      .post2('/sub_system/vanke_system/get_vanke_change_status', {
        mainFlowId: this.svrConfig.record.mainFlowId,
      })
      .subscribe((x) => {
        if (x.ret !== 0) {
          clearInterval(this.changesInterval);
        }
        if (x.ret === 0 && x.data && init) {
          const params = {
            title: '数据变动情况',
            type: 'platVerify',
            defaultValue: 'C',
            mainFlowId: this.svrConfig.record.mainFlowId,
          };
          XnModalUtils.openInViewContainer(
            this.xn,
            this.vcr,
            VankeDataChangeModalComponent,
            params
          ).subscribe();
        }
        if (x.ret === 0 && x.data && x.data.isChange) {
          this.showIconVankeChanges = true;
        } else {
          this.showIconVankeChanges = false;
        }
      });
  }

  private innerSubmit(fn) {
    fn().subscribe((v) => {
      // console.info('v', v);

      if (!!v && !!v.value) {
        return;
      }
      if (!(v && v.action)) {
        //  return;
        this.doSubmit();
        return;
      }
      if (v.action === 'stop') {
        return;
      }
      if (v.action === 'isVirtualStop') {
        XnModalUtils.openInViewContainer(
          this.xn,
          this.vcr,
          HtmlModalComponent,
          {
            type: 'warning',
            title: '提示',
            html: `<div>收款账户信息有误，请变更为【取值为虚拟账户账号】</div>`,
            size: 'normal',
          }
        ).subscribe((v2) => {
          if (v2 === 'ok' || v2?.action === 'ok') {
            this.temporaryflowStorage();
            this.xn.router.navigate([`/vanke/record/new/`], {
              queryParams: {
                id: 'sub_vanke_change',
                relate: 'mainFlowId',
                relateValue: this.svrConfig.record.mainFlowId,
                isPreTrade: this.svrConfig.isPreTrade,
              },
            });
          }
        });
        return;
      }
      if (v.action === 'vankestop') {
        // this.isShow = true;
        return;
      }

      if (v.action === 'tips') {
        XnModalUtils.openInViewContainer(
          this.xn,
          this.vcr,
          HtmlModalComponent,
          {
            type: v.tipsType,
            title: v.tipsTitle,
            html: v.tipsData,
            size: v.tipsSize,
          }
        ).subscribe((v2) => {
          if ((v.tipsType === 'yesno' && v2 === 'yes') || v.tipsType === 'ok') {
            this.doSubmit();
          }
        });
        return;
      }

      if (v.action === 'modal') {
        XnModalUtils.openInViewContainer(
          this.xn,
          this.vcr,
          v.modal,
          v.params
        ).subscribe((v2) => {
          if (v2 === 'ok' || v2?.action === 'ok') {
            this.doSubmit();
          } else if (!!v2 && v2.hasOwnProperty('accountName')) {
            this.doSubmit();
          } else if (v2 === null) {
            this.goDistance();
          }
        });
        return;
      }

      if (v.action === 'msgBox') {
        if (v.type === 'shanghai') {
          this.xn.msgBox.open(
            true,
            `该企业近期工商有变更，确定提交吗？`,
            () => {
              this.doSubmit();
            },
            () => {
              return;
            }
          );
        } else {
          if (this.svrConfig.wkType && this.svrConfig.wkType === 1) {
            this.xn.dragon
              .post('/sub_system/vanke_system/get_vanke_change_status', {
                mainFlowId: this.svrConfig.record.mainFlowId,
              })
              .subscribe((x) => {
                if (x.ret === 0 && x.data) {
                  const msg = [];
                  if (!!x.data.isChange) {
                    msg.push(
                      `当前交易因万科资金中心审批通过产生数据变动，请注意查看。`
                    );
                    if (x.data.factoringEndDate !== x.data.expiredDate) {
                      msg.push(
                        `其中【保理融资到期日】将在提交后由【${XnUtils.formatDate(
                          x.data.factoringEndDate
                        )}】更新为【${XnUtils.formatDate(
                          x.data.expiredDate
                        )}】，`
                      );
                    }
                    msg.push(`是否确认提交？`);
                    this.xn.msgBox.open(
                      true,
                      msg,
                      () => {
                        this.doSubmit();
                        return;
                      },
                      () => {
                        return;
                      }
                    );
                  } else {
                    this.doSubmit();
                    return;
                  }
                } else {
                  return;
                }
              });
          }
        }
      }
    });
  }

  /**
   *  回退
   *  审核不通过，打回到上一步或上一个节点（后台自己处理）
   */
  private onReject(): void {
    const params: any = {
      recordId: this.recordId,
      procedureId: this.svrConfig.procedure.procedureId,
      memo: this.mainForm.value.cancelChecker,
    };

    this.xn.api.dragon.post(`/flow/reject`, params).subscribe(() => {
      this.xn.user.navigateBack();
    });
  }

  /**
   *  中止流程
   */
  public onTerminate(): void {
    const params = {
      recordId: this.recordId,
      procedureId: this.svrConfig.procedure.procedureId,
      memo: this.mainForm.value.cancelChecker,
    };
    const agencyInfoMap = this.localStorageService.caCheMap.get('agencyInfo');
    const agencySession = {
      orgType: Number(window.sessionStorage.getItem('orgType')),
      agencyType: Number(window.sessionStorage.getItem('agencyType')),
    };
    const agencyInfo = !!agencyInfoMap
      ? JSON.parse(agencyInfoMap)
      : XnUtils.deepCopy(agencySession, {});
    this.xn.api.dragon.post('/flow/cancel', params).subscribe((json) => {
      this.cancelModal.dismiss();
      if (this.svrConfig.record.flowId === 'sub_law_manager_survey') {
        let msg = [];
        if (Number(agencyInfo.agencyType) === 1) {
          msg = [`已取消尽调。`];
          this.xn.msgBox.open(false, msg, () => {
            // 点击【确定】返回上一页
            this.xn.user.navigateBack();
          });
        } else if (Number(agencyInfo.agencyType) === 5) {
          msg = [`已取消尽调。`];
          this.xn.msgBox.open(false, msg, () => {
            // 2、点击【确定】返回上一页
            this.xn.user.navigateBack();
          });
        }
      } else {
        this.xn.user.navigateBack();
      }
    });
  }

  /**
   * 尽调流程-补充资料
   */
  addSurveyInfo() {
    const formValue: any = this.mainForm.getRawValue();
    const param = {
      mainFlowId: this.svrConfig.record.mainFlowId,
      recordId: this.svrConfig.record.recordId,
      surveyFiles: formValue.surveyFiles || '',
      surveyRole: formValue.surveyRole || '',
      surveyAdvise: formValue.surveyAdvise || '', // 终审尽调意见
    };
    this.xn.dragon
      .post('/flow/factor_add_material', param)
      .subscribe((json) => {
        if (json && json.ret === 0) {
          this.xn.msgBox.open(
            false,
            [`操作成功！`, `请等待保理商运营人员完成资料补充。`],
            () => {
              this.xn.router.navigate(['/console']);
            }
          );
        }
      });
  }

  /**
   *  提交资料，默认值为只读的再此直接读取，防止误操作修改
   */
  private doSubmit(): void {
    if (!!this.changesInterval) {
      clearInterval(this.changesInterval);
    }
    for (const checker of this.svrConfig.checkers) {
      if (checker.options && checker.options.readonly) {
        this.mainForm.value[checker.checkerId] = checker.value;
      }
      if (checker.checkerId === 'redeemReceive') {
        this.mainForm.value[checker.checkerId] = String(
          this.mainForm.value[checker.checkerId]
        ).replace(/\D/g, '');
      }
    }
    const formValue: any = this.mainForm.value;
    // TODO:
    const params: any = {
      recordId: this.svrConfig.record.recordId,
      procedureId: this.svrConfig.procedure.procedureId,
      memo: formValue.memo,
      checkers: XnFlowUtils.buildSubmitCheckers(
        this.svrConfig.checkers,
        formValue
      ),
      contracts: this.svrConfig.contracts,
    };
    // params.checkers['invoice'].invoiceCheckCode = formValue['invoice']
    XnUtils.checkLoading(this);
    this.xn.api.dragon.post(`/flow/submit`, params).subscribe((x) => {
      this.loading.close();
      this.presubmitSpecial(params, x);
      // modelId ： 1  注册通知 2 上传通知 3 签署通知
      const isUplaodData =
        this.svrConfig.flow.flowId === 'vanke_financing_pre' &&
        this.svrConfig.record.nowProcedureId === 'review';
      const isSignContract =
        this.svrConfig.flow.flowId === 'vanke_factoring_risk';
      console.log('this.svrConfig', this.svrConfig);
      if (isUplaodData || isSignContract) {
        this.xn.api
          .post('/user/wxmessage', {
            modelId: isUplaodData ? 2 : 3,
            mainFlowId: this.svrConfig.record.mainFlowId,
            recordId: this.svrConfig.record.recordId,
          })
          .subscribe((res) => {});
      }
      this.afterSubmit(
        this.svrConfig.flow.flowId,
        this.svrConfig.record.mainFlowId,
        this.svrConfig.record.nowProcedureId,
        x
      );
    });
  }
  /**
   *  流程中暫存
   */
  temporaryflowStorage(): void {
    for (const checker of this.svrConfig.checkers) {
      if (checker.options && checker.options.readonly) {
        this.mainForm.value[checker.checkerId] = checker.value;
      }
    }
    const formValue: any = this.mainForm.value;
    const params: any = {
      recordId: this.recordId,
      flowId: this.svrConfig.flow.flowId,
      procedureId: this.svrConfig.procedure.procedureId,
      memo: formValue.memo,
      checkers: XnFlowUtils.buildSubmitCheckers(
        this.svrConfig.checkers,
        formValue
      ),
      contracts: this.svrConfig.contracts,
    };
    XnUtils.checkLoading(this);
    this.xn.api.dragon.post(`/flow/temporarySave`, params).subscribe(() => {
      this.loading.close();
    });
  }

  temporaryStorage(): void {
    for (const checker of this.svrConfig.checkers) {
      if (checker.options && checker.options.readonly) {
        this.mainForm.value[checker.checkerId] = checker.value;
      }
    }
    const formValue: any = this.mainForm.value;
    const params: any = {
      recordId: this.recordId,
      flowId: this.svrConfig.flow.flowId,
      procedureId: this.svrConfig.procedure.procedureId,
      memo: formValue.memo,
      checkers: XnFlowUtils.buildSubmitCheckers(
        this.svrConfig.checkers,
        formValue
      ),
      contracts: this.svrConfig.contracts,
    };
    XnUtils.checkLoading(this);
    this.xn.api.dragon.post(`/flow/temporarySave`, params).subscribe(() => {
      this.loading.close();
      this.xn.user.navigateBack();
    });
  }

  /**
   * 暂停弹窗，确定后需通过接口向万科反馈信息
   */
  suspend() {
    console.log(this.newSvrConfig.actions);
    const invoiceItem = this.newSvrConfig.checkers.filter(
      (i) => i.type === 'invoice-transfer-vanke'
    );
    const invoiceData = XnUtils.parseObject(invoiceItem[0].value);
    this.xn.msgBox.open(
      true,
      [
        `暂停后，系统会将此业务通过接口退回给万科，需等万科更新此业务数据后才能恢复业务状态。`,
        `请确定是否暂停？`,
      ],
      () => {
        const params = {
          checker: [
            {
              title: '原因',
              checkerId: 'checkType',
              type: 'linkage-select',
              options: { ref: 'suspendReason' },
              value: '',
              required: 1,
            },
            {
              title: '资金方自定义说明',
              checkerId: 'checkText',
              type: 'text-area',
              options: {},
              placeholder: '请输入说明',
              validators: {
                maxlength: 3000,
              },
              value: ``,
              required: 1,
              // FIXME: 增加传输参数给 EditModalComponent 做发票展示
              invoiceData: XnUtils.jsonTostring(invoiceData),
            },
          ] as CheckersOutputModel[],
          title: '暂停',
          buttons: ['取消', '确定'],
        };
        XnModalUtils.openInViewContainer(
          this.xn,
          this.vcr,
          EditModalComponent,
          params
        ).subscribe((v3) => {
          if (v3 !== null) {
            // 调用暂停接口
            const param = {
              recordId: this.svrConfig.record.recordId,
              mainFlowId: this.svrConfig.record.mainFlowId,
              pauseReason: v3.checkType, // 暂停原因
              pauseInfo: v3.checkText, // 资金方自定义说明
            };
            XnUtils.checkLoading(this);
            this.xn.dragon.post(`/flow/suspend`, param).subscribe((res) => {
              this.loading.close();
              if (res.ret === 0) {
                this.xn.msgBox.open(
                  false,
                  `暂停成功，点击确定将进入台账`,
                  () => {
                    this.xn.router.navigate([`/vanke/vanke/machine_list`]);
                  }
                );
              }
            });
          }
        });
      },
      () => {}
    );
  }

  /**
   *  面版样式修改
   * @param paramAction paramAction
   */
  public panelCssClass(paramAction: any): string {
    if (paramAction.operator === OperateType.PASS) {
      return 'panel panel-info xn-panel-sm';
    } else if (
      paramAction.operator === OperateType.REJECT ||
      paramAction.operator === OperateType.SUSPENSION
    ) {
      return 'panel panel-warning xn-panel-sm';
    } else {
      return '';
    }
  }
  presubmitSpecial(params, x) {
    if (
      (this.svrConfig.flow.flowId === 'sub_change_start' ||
        this.svrConfig.flow.flowId === 'sub_change_capital') &&
      params.procedureId === '@begin'
    ) {
      if (x.ret === 0) {
        this.xn.msgBox.open(
          false,
          `提交成功！\n 下一步请客户经理复核人在【首页-待办任务】中完成【复核】的待办任务。`
        );
      }
    } else if (
      (this.svrConfig.flow.flowId === 'sub_change_start' ||
        this.svrConfig.flow.flowId === 'sub_change_capital') &&
      params.procedureId === 'review'
    ) {
      if (x.ret === 0) {
        this.xn.msgBox.open(
          false,
          `提交成功！\n 下一步请高级复核人在【首页-待办任务】中完成【高级复核】的待办任务。`
        );
      }
    } else if (
      this.svrConfig.flow.flowId === 'sub_change_start' &&
      params.procedureId === 'windReview'
    ) {
      if (x.ret === 0) {
        this.xn.msgBox.open(
          false,
          `提交成功！\n
                  提交成功！\n
                  交易将被限制发起审批，被限制推送数据到金蝶云
                  下一步请客户经理在【首页 - 待办任务】中完成【填写保理融资到期日】的待办任务`
        );
      }
    } else if (
      this.svrConfig.flow.flowId === 'sub_change_capital' &&
      params.procedureId === 'windReview'
    ) {
      if (x.ret === 0) {
        this.xn.msgBox.open(
          false,
          `提交成功！
                  交易将可被手动移出资产池、签署《致项目公司通知书（二次转让）-补充协议）》、《项目公司回执（二次转让）-补充协议》。`
        );
      }
    } else if (
      this.svrConfig.flow.flowId === 'sub_factor_add_material' &&
      params.procedureId === 'operate'
    ) {
      if (x.ret === 0) {
        this.xn.msgBox.open(false, [
          `提交成功！`,
          `下一步请尽调复核人在【首页-待办任务】中完成【尽调】的待办任务。`,
        ]);
      }
    }
  }
  private afterSubmitOperate(fn) {
    fn().subscribe((v) => {
      if (!(v && v.action)) {
        //  return;
        // this.doSubmit();
        this.xn.user.navigateBack();
        return;
      }
      if (v.action === 'stop') {
        return;
      }
      if (v.action === 'modal') {
        XnModalUtils.openInViewContainer(
          this.xn,
          this.vcr,
          v.modal,
          v.params
        ).subscribe((v2) => {
          // if (v2 === 'ok' || !!v2) {
          // } else if (v2 === null) {
          // }
          this.xn.user.navigateBack();
        });
        return;
      }
    });
  }

  /**
   *  提交完成后操作
   * @param flowId    子流程id
   * @param mainFlowId 主流程id
   * @param nowProcedureId 当前操作角色id
   */
  private afterSubmit(flowId, mainFlowId, nowProcedureId, x) {
    this.afterSubmitOperate(() => {
      return this.flowCustom.afterSubmitandGettip(
        this.svrConfig,
        this.mainForm.value,
        x
      );
    });
  }

  /**
   *  todo 查看审核标准
   */
  public showAuditStandard(type: number) {
    let contractObj = [];
    // 发票
    let invCheckers = [];
    let step = '';
    if (this.svrConfig.record.nowProcedureId === 'operate') {
      step = 'value';
      invCheckers = this.svrConfig.checkers;
      contractObj = this.localStorageService.caCheMap.get('VankecontractFile');
    } else if (this.svrConfig.record.nowProcedureId === 'review') {
      step = 'data';
      invCheckers = this.svrConfig.actions.filter((action) => {
        return action.recordSeq === this.svrConfig.record.recordSeq;
      })[0].checkers;
      const contractTemp = invCheckers.filter((invc) => {
        return invc.checkerId === 'dealContract';
      });
      if (
        contractTemp &&
        contractTemp.length === 1 &&
        contractTemp[0][step] &&
        JSON.parse(contractTemp[0][step]) &&
        this.judgeDataType(JSON.parse(contractTemp[0][step]))
      ) {
        contractObj = JSON.parse(contractTemp[0][step]);
      }
    }
    const invoiceObj = invCheckers.filter((item) => {
      return item.checkerId === 'invoice';
    });
    const invoiceArray = [];
    if (
      invoiceObj &&
      invoiceObj.length === 1 &&
      invoiceObj[0][step] &&
      JSON.parse(invoiceObj[0][step]) &&
      this.judgeDataType(JSON.parse(invoiceObj[0][step]))
    ) {
      const invoiceArr = JSON.parse(invoiceObj[0][step]);
      invoiceArr.forEach((invoice) => {
        invoiceArray.push({
          invoiceNum: invoice.invoiceNum,
          invoiceCode: invoice.invoiceCode,
          isHistory:
            invoice.mainFlowId &&
            this.judgeDataType(invoice.mainFlowId) &&
            invoice.mainFlowId.length
              ? true
              : false,
        });
      });
    }
    const params: any = {
      mainFlowId: this.svrConfig.record.mainFlowId,
      invoice: invoiceArray,
      contractJia: contractObj[0].contractJia || '', // 基础合同甲方名称
      contractYi: contractObj[0].contractYi || '', // 基础合同乙方名称
      payType: contractObj[0].payType || '', // 合同类型
      percentOutputValue: contractObj[0].percentOutputValue || '', // 本次产值金额
      payRate: contractObj[0].payRate || '', // 付款比例
      contractSignTime: contractObj[0].signTime || '', // 合同签订时间
    };
    if (type === 1) {
      this.xn.dragon
        .post('/list/main/checker_list_box', params)
        .subscribe((x) => {
          if (x.ret === 0 && x.data && x.data.length > 0) {
            const params1 = Object.assign(
              { flowId: this.flowId },
              { value: '', checkers: x.data }
            );
            XnModalUtils.openInViewContainer(
              this.xn,
              this.vcr,
              NewVankeAuditStandardModalComponent,
              params1
            ).subscribe(() => {});
          }
        });
    } else {
      this.xn.dragon
        .post('/rule_engine/checker/checker_list_box', params)
        .subscribe((x) => {
          XnModalUtils.openInViewContainer(
            this.xn,
            this.vcr,
            IntelligenceStandardModalComponent,
            { params: x.data.standardInfo }
          ).subscribe(() => {});
        });
    }
  }

  /**
   *  判断数据类型
   * @param value value
   */
  public judgeDataType(value: any): boolean {
    if (typeof Array.isArray === 'function') {
      return Array.isArray(value);
    } else {
      return Object.prototype.toString.call(value) === '[object Array]';
    }
  }
  openrejectplatWindow() {
    const detail = {
      projectCompany: '',
      debtUnit: '',
      receive: '',
    };
    detail.debtUnit = this.svrConfig.checkers.filter(
      (x: any) => x.checkerId === 'debtUnit'
    )[0].value;
    detail.projectCompany = this.svrConfig.checkers.filter(
      (x: any) => x.checkerId === 'projectCompany'
    )[0].value;
    detail.receive = this.svrConfig.checkers.filter(
      (x: any) => x.checkerId === 'receive'
    )[0].value;
    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      RejectModalComponent,
      detail
    ).subscribe((v) => {
      if (v.action === 'cancel') {
        return;
      }
      if (v.action === 'ok' && v.type === 1) {
        const params: any = {
          recordId: this.recordId,
          procedureId: this.svrConfig.procedure.procedureId,
          memo: this.mainForm.value.cancelChecker,
          rejectInfo: v.rejectInfo,
        };

        this.xn.api.dragon.post(`/flow/reject`, params).subscribe(() => {
          window.history.back();
        });
      } else if (v.action === 'ok' && v.type === 0) {
        this.onTerminate();
      }
    });
  }

  /**
   * 自定义页面锚点
   * scrollIntoView方法参数scrollIntoViewOptions可选
   * behavior：定义动画过渡效果， "auto"或 "smooth" 之一。默认为 "auto"。
   * block：定义垂直方向的对齐， "start", "center", "end", 或 "nearest"。默认为 "start"。
   * inline：定义水平方向的对齐， "start", "center", "end", 或 "nearest"。默认为 "nearest"
   */
  goDistance() {
    if (this.accountDistannce.nativeElement) {
      this.accountDistannce.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'start',
      });
    }
  }

  /**
   * 发起定时任务，查询数据变动与否
   * @param time 时间间隔（ms）
   * @param init 是否初始加载
   */
  startSetInterval(time: number, init: boolean) {
    if (!!this.changesInterval) {
      clearInterval(this.changesInterval);
    }
    this.showVankeChangesInfo(init);
    this.changesInterval = setInterval(() => {
      this.showVankeChangesInfo(init);
    }, time);
  }

  /**
   * checker项是否隐藏
   * @param row row
   * @returns boolean
   */
  showRow(row: any): boolean {
    /** 如果options 配置了nodisplay=true则意为隐藏该checker项 */
    if (row?.options && row?.options?.nodisplay) {
      return false;
    } else {
      return true;
    }
  }
}
