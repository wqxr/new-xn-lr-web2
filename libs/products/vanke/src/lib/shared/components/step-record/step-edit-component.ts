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
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { IFlowCustom, FlowCustom, buttonType } from '../flow/flow-custom';
import {
  ModalComponent,
  ModalSize,
} from 'libs/shared/src/lib/common/modal/components/modal';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { PublicCommunicateService } from 'libs/shared/src/lib/services/public-communicate.service';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { ButtonConfigModel } from 'libs/shared/src/lib/config/list-config-model';
import { CancelRejectComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/cancel-modal.component';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import {
  OperateType,
  EditButtonType,
  RetCodeEnum,
  StepOperateTypeEnum,
  StepResultStatusEnum,
  ProcduresIdEnum,
} from 'libs/shared/src/lib/config/enum/common-enum';
import { CheckersOutputModel } from 'libs/shared/src/lib/config/checkers';
import {
  EditModalComponent,
  EditParamInputModel,
} from 'libs/shared/src/lib/public/dragon-vanke/modal/edit-modal.component';
import { HtmlModalComponent } from 'libs/shared/src/lib/public/modal/html-modal.component';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { VankeDataChangeModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/vanke-dataChange-modal.component';
import XnFlowUtils from 'libs/shared/src/lib/common/xn-flow-utils';
import { RejectModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/reject-modal.component';
import { allOpinionList } from 'libs/shared/src/lib/public/dragon-vanke/components/bean/vanke-flow-correct-reason.config';
import { RuleEngineResultModalComponent, RuleEngineModalParams } from 'libs/shared/src/lib/public/dragon-vanke/modal/rule-engine-result-modal/rule-engine-result-modal.component';
import { VankeFlowEnum, IsPreTrade } from 'libs/shared/src/lib/config/enum';
import { PointService } from 'libs/shared/src/lib/services/point.service';
import * as _ from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
@Component({
  templateUrl: './step-edit-component.html',
  selector: 'vanke-edit-step',
  styleUrls: ['./step.less'],
})
export class VankeStepEditComponent
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
  public flowCustom: IFlowCustom;
  @Input() flowId = '';
  @Input() baseInfo: any[] = [];
  @Input() shows: any[] = [];
  @Input() hasActions: boolean;
  public loadingback = false;
  public newSvrConfig: any;
  public mainFlowId: string;
  public rejectdata: string[] = [];
  formModule = 'dragon-input';
  Showintelligence = false;
  public showIconReject = false;
  public showIconVankeChanges = false;
  public changesInterval: any = null; // 定时任务
  commonReject = false;
  buttonList: buttonType;
  constructor(
    private xn: XnService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private vcr: ViewContainerRef,
    private loading: LoadingService,
    public hwModeService: HwModeService,
    public communicateService: PublicCommunicateService,
    private localStorageService: LocalStorageService,
    private nzModal: NzModalService,
    public pointService: PointService,
  ) {}

  ngAfterViewInit() {
    if (
      this.showVankeChangesIcon() &&
      this.svrConfig.procedure.procedureId !== 'review'
    ) {
      this.startSetInterval(60000, false);
    }
    this.showIconVankeChanges =
      this.showVankeChangesIcon() && this.showIconVankeChanges;
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }
  ngOnInit() {
    this.recordId = this.svrConfig.record.recordId;
    this.flowCustom = FlowCustom.build(
      this.flowId,
      this.xn,
      this.vcr,
      this.loading,
      this.communicateService,
      this.localStorageService,
      this.pointService
    );
    this.flowCustom.postShow(this.svrConfig, this.mainForm).subscribe((x) => {
      this.buttonList = x.buttonList;
      this.cdr.markForCheck();
    });
    this.flowCustom.postGetSvrConfig(this.svrConfig, this.shows);
    this.mainFlowId =
      (this.svrConfig &&
        this.svrConfig.record &&
        this.svrConfig.record.mainFlowId) ||
      '';
    this.newSvrConfig = _.cloneDeep(this.svrConfig); // JSON.parse(JSON.stringify(this.svrConfig));
    if (!!this.changesInterval) {
      clearInterval(this.changesInterval);
    }
  }

  ngOnDestroy(): void {
    if (!!this.changesInterval) {
      clearInterval(this.changesInterval);
    }
  }

  // 是否显示数据变动图标
  showVankeChangesIcon() {
    return (
      this.svrConfig.record.flowId ===
        'vanke_abs_step_platform_verify_operate' &&
      this.svrConfig.wkType &&
      this.svrConfig.wkType === 1
    );
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
   * 底部操作栏按钮点击事件
   * @param paramBtnOperate button操作对象
   */
  handleHeadClick(paramBtnOperate: ButtonConfigModel) {
    if (
      paramBtnOperate.operate === EditButtonType.REJECT ||
      paramBtnOperate.operate === EditButtonType.SUSPENSION
    ) {
      XnModalUtils.openInViewContainer(
        this.xn,
        this.vcr,
        CancelRejectComponent,
        { svrConfigs: this.svrConfig }
      ).subscribe((x) => {
        if (x.action === OperateType.REJECT) {
          this.onReject(x.demo);
        } else if (x.action === OperateType.SUSPENSION) {
          this.onTerminate(x.demo);
        }
      });
    } else if (paramBtnOperate.operate === EditButtonType.SAVE) {
      this.temporaryStorage();
    } else if (paramBtnOperate.operate === EditButtonType.COREECT_REJECT) {
      // 发起资料补正
      this.correctReject();
    } else if (paramBtnOperate.operate === EditButtonType.VANKE_CHANGE) {
      //发起万科修改
      this.suspend();
    } else if (paramBtnOperate.operate === EditButtonType.RULR_ENGINE) {
      // 审核标准
      this.fetchRuleEngine();
    } else if (paramBtnOperate.operate === EditButtonType.REVIEW) {
      this.xn.router.navigate(
        [`/logan/record/file-classification/${this.mainFlowId}`],
        {
          queryParams: {
            isEdit: true,
          },
        }
      );
    } else {
      paramBtnOperate.click(this.mainForm, this.svrConfig, this.xn, this.vcr);
    }
  }

  private correctReject() {
    const datainfo = this.svrConfig.stepList.filter(
      (x) => x.result_status === 2
    );
    const list = JSON.parse(JSON.stringify(datainfo)).map((item) => {
      item.opinion = item.step_memo;
      let { name, opinion } = item;
      if (item.opinion !== '') {
        opinion = JSON.parse(opinion);
      }
      return {
        name,
        opinion,
      };
    });
    if (!list.length) {
      this.xn.msgBox.open(false, '该交易无补正项，请检查！');
      return;
    }
    const params: EditParamInputModel = {
      title: '发起资料补正',
      checker: [
        {
          title: '汇总',
          checkerId: 'otherResult',
          type: 'table-input-change',
          heads: allOpinionList,
          required: false,
          value: JSON.stringify(list),
        },
      ] as CheckersOutputModel[],
      buttons: ['取消', '确定'],
      size: 'xlg',
    };

    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      EditModalComponent,
      params
    ).subscribe((v) => {
      if (!!v) {
        JSON.parse(v.otherResult).forEach((y) => {
          datainfo.forEach((x) => {
            if (x.name === y.name) {
              x.step_memo = JSON.stringify(y.opinion);
            }
          });
        });
        this.onReject('');
      }
    });
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
   */
  public onSubmit() {
    if(this.svrConfig?.flow?.flowId === VankeFlowEnum.StepFinancing
      && this.svrConfig?.record?.nowProcedureId === ProcduresIdEnum.OPERATE) {
        /** 供应商上传资料（初审）, 需提示业务文件来源 */
      let { contractFile,invoice,performanceFiles } = this.mainForm.value;
      contractFile = XnUtils.jsonFileToArry(contractFile); // 交易合同
      invoice = XnUtils.jsonFileToArry(invoice); // 发票
      performanceFiles = XnUtils.jsonFileToArry(performanceFiles); // 履约证明
      /** isVanke汇融文件来源标识 */
      const isVankeContract = contractFile.some((contract: any) => contract?.isVanke);
      const isVankeInvoice = invoice.some((invoice: any) => invoice?.isVanke);
      const isVankePerformance = performanceFiles.some((performance: any) => performance?.isVanke);
      /** 供应商提交资料时提示业务文件来源 */
      const nzContentTemplate =
      `
      <div class="ant-row">
        <div class="ant-col ant-col-10 ant-col-offset-8">
          <p>基础交易合同: <b>${isVankeContract?'万科汇融':'供应商上传'}</b></p>
          <p>履约文件: <b>${isVankePerformance?'万科汇融':'供应商上传'}</b></p>
          <p>发票: <b>${isVankeInvoice?'万科汇融':'供应商上传'}</b></p>
        </div>
      </div>
    `;
    this.nzModal.create({
      nzTitle: '请确认当前业务资料来源',
      nzContent: nzContentTemplate,
      nzMaskClosable: false,
      nzOnOk: () => {
        this.preSubmit();
      },
      nzOnCancel: () => {
        return;
      }});
    } else {
      this.preSubmit();
    }
  }

  /**
   * 提交数据前，回调该流程的个性配置，进行具体操作
   */
  async preSubmit(){
    let orderInfo = null;
    if (this.svrConfig.isPreTrade === IsPreTrade.YES) {
      orderInfo =
        this.svrConfig.procedure.procedureId !== 'review'
          ? this.svrConfig.checkers.filter(
              (item) => item.checkerId === 'orderInfo'
            )
          : this.newSvrConfig.actions[0].stepList[0].checkerIdList.filter(
              (item) => item.checkerId === 'orderInfo'
            );
    }
    const warnData =
      orderInfo?.length > 0 ? await this.preTradeCheck(orderInfo[0]) : null;
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
  /**
   *  取消
   */
  public onCancel() {
    this.xn.user.navigateBack();
  }

  /**
   *  中登登记，暂留
   */
  public onRegistration() {}

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
      recordId: this.svrConfig.record.recordId,
      flowId: this.svrConfig.flow.flowId,
      procedureId: this.svrConfig.procedure.procedureId,
      memo: formValue.memo,
      checkers: XnFlowUtils.buildSubmitCheckers(
        this.svrConfig.checkers,
        formValue
      ),
      contracts: this.svrConfig.contracts,
      stepList: this.svrConfig.stepList,
    };
    XnUtils.checkLoading(this);
    this.xn.api.dragon.post(`/flow/temporarySave`, params).subscribe(() => {
      this.loading.close();
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
      if (v.action === 'stop') {
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
  private onReject(demo: string): void {
    const params: any = {
      recordId: this.recordId,
      procedureId: this.svrConfig.procedure.procedureId,
      memo: demo,
      stepList: this.svrConfig.stepList,
    };
    this.xn.api.dragon.post(`/flow/reject`, params).subscribe(() => {
      this.xn.user.navigateBack();
    });
  }

  /**
   *  中止流程
   */
  private onTerminate(demo: string): void {
    const params = {
      recordId: this.recordId,
      procedureId: this.svrConfig.procedure.procedureId,
      memo: demo,
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
      if (this.svrConfig.record.flowId === 'sub_law_manager_survey') {
        let msg = [`已取消尽调。`];
        if (Number(agencyInfo.agencyType) === 1) {
          // msg = [`已取消尽调。`];
          this.xn.msgBox.open(false, msg, () => {
            // 点击【确定】返回上一页
            this.xn.user.navigateBack();
          });
        } else if (Number(agencyInfo.agencyType) === 5) {
          // msg = [`已取消尽调。`];
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
      recordId: this.recordId,
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
      recordId: this.recordId,
      procedureId: this.svrConfig.procedure.procedureId,
      memo: formValue.memo,
      checkers: XnFlowUtils.buildSubmitCheckers(
        this.svrConfig.checkers,
        formValue
      ),
      contracts: this.svrConfig.contracts,
      stepList: this.svrConfig.stepList,
    };
    XnUtils.checkLoading(this);
    this.xn.api.dragon.post(`/flow/submit`, params).subscribe((x) => {
      this.loading.close();
      // modelId ： 1  注册通知 2 上传通知 3 签署通知
      const isUplaodData =
        this.svrConfig.flow.flowId === 'vanke_financing_pre' &&
        this.svrConfig.record.nowProcedureId === 'review';
      const isSignContract =
        this.svrConfig.flow.flowId === 'vanke_factoring_risk';
      if (isUplaodData || isSignContract) {
        this.xn.api
          .post('/user/wxmessage', {
            modelId: isUplaodData ? 2 : 3,
            mainFlowId: this.svrConfig.record.mainFlowId,
            recordId: this.recordId,
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
   * 暂存文件接口, 根据flowId进行相应路由跳转
   */
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
      stepList: this.svrConfig.stepList,
    };
    XnUtils.checkLoading(this);
    this.xn.api.dragon.post(`/flow/temporarySave`, params).subscribe(() => {
      this.loading.close();
      if (params.flowId === 'vanke_abs_step_platform_verify_operate') {
        // router to FileClassification 前往文件分类页面
        const checkers = XnFlowUtils.buildSubmitCheckers(
          this.svrConfig.checkers,
          formValue
        );
        this.xn.router.navigate(
          [`/logan/record/file-classification/${this.mainFlowId}`],
          {
            queryParams: {
              recordId: this.svrConfig.record.recordId,
              flowId: this.svrConfig.record.flowId,
              procedureId: this.svrConfig.procedure.procedureId,
            },
          }
        );
      } else {
        // TODO: 这里做其它地方跳转
        this.xn.user.navigateBack();
      }
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
              recordId: this.recordId,
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
        this.onTerminate('');
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
   * 展示规则校验结果
   */
  async fetchRuleEngine() {
    const rule_info: any = await this.fetchRuleEngineChecker();
    if (XnUtils.isEmptys(rule_info?.point_info)) {
      return this.xn.msgBox.open(false, '请完成补充信息');
    }
    const params: RuleEngineModalParams = {
      title: '审核标准',
      size: ModalSize.XXXLarge,
      checker: [
        {
          title: '审核结果',
          checkerId: 'ruleResult',
          type: 'xn-rule-engine-result',
          options: { readonly: false },
          required: 1,
          value: JSON.stringify(rule_info),
        },
      ] as CheckersOutputModel[],
      mainFlowId: this.mainFlowId,
      svrConfig: this.svrConfig
    };
    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      RuleEngineResultModalComponent,
      params
    ).subscribe((v) => {
      if (v?.ruleResult) {
        const ruleResult = JSON.parse(v.ruleResult);
        const params = {
          mainFlowId: this.svrConfig.record.mainFlowId,
          point_info: ruleResult.point_info,
          manualReview: ruleResult.manualReview,
        };
        this.saveRuleChekList(params);
      }
    });
  }

  /**
   * 保存规则校验文件
   * @param params
   */
  saveRuleChekList(params: any) {
    this.xn.loading.open();
    this.xn.dragon
      .post('/list/main/rule_checker_list_log', params)
      .subscribe((x) => {
        this.loading.close();
      });
  }
  /** 提交的限制条件 */
  valid() {
    return (!this.mainForm.valid || this.validCheckStatus());
  }

  /**
   * 调用规则引擎接口获取校验结果
   * @returns
   */
  fetchRuleEngineChecker() {
    let checkerList = XnUtils.deepClone(this.svrConfig.checkers);
    const formValue = XnUtils.deepClone(this.mainForm.value) || {};
    /** 审核页面修改后的数据同步到规则引擎接口 */
    checkerList.map((checker) => {
      for (const key in formValue) {
        if (checker.checkerId === key) {
          checker.value = formValue[key];
        }
      }
    });
    const params = {
      mainFlowId: this.svrConfig.record.mainFlowId,
      recordId: this.svrConfig.record.recordId,
      checkers: checkerList,
    };
    return new Promise((resolve) => {
      this.xn.loading.open();
      this.xn.dragon
        .post('/list/main/rule_checker_list', params)
        .subscribe((res) => {
          this.xn.loading.close();
          if (res.ret === RetCodeEnum.OK && res.data) {
            resolve(res.data);
          } else {
            resolve(null);
          }
        });
    });
  }

  /**
   * 分步模块审核状态校验handle
   * @returns
   */
  validCheckStatus() {
    const stepList: any[] = this.svrConfig?.stepList || [];
    /** 审核通过的 */
    const checkPassList = stepList
      .filter((step) => {
        return step.operateType === StepOperateTypeEnum.NEED_CHECK;
      })
      .every((step) => {
        return step.result_status === StepResultStatusEnum.PASS;
      });
    return !checkPassList;
  }

  /**
   * 流程审核意见展示判断
   * @param action 流程审核记录信息
   * @returns
   */
  showActionMemo(action: any) {
    // 无需向供应商展示“链融平台发起提单（即预录入环节）的经办及复核”意见内容
    return action.flowId !== VankeFlowEnum.StepFinancing;
  }
}
