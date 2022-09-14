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
 * 1.0                 zhyuanan          增加功能1         2019-05-05
 * **********************************************************************
 */

import {
  Component, AfterViewInit,
  ViewContainerRef,
  Output,
  EventEmitter, AfterViewChecked, OnInit
} from '@angular/core';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { Params, ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { HtmlModalComponent } from 'libs/shared/src/lib/public/modal/html-modal.component';
import XnFlowUtils from 'libs/shared/src/lib/common/xn-flow-utils';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { ChangeDetectorRef } from '@angular/core';
import { FlowCustom, IFlowCustom } from 'libs/products/avenger/src/lib/flow/flow-custom';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { EditModalComponent, EditParamInputModel } from '../modal/edit-modal.component';
import { CheckersOutputModel } from 'libs/shared/src/lib/config/checkers';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { PublicCommunicateService } from 'libs/shared/src/lib/services/public-communicate.service';
import { VankeViewChangeAccountComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/vanke-change-account.component';
import { OperateType } from 'libs/shared/src/lib/config/enum/common-enum';

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
  templateUrl: './edit.component.html',
  styles: [
    `.box-title {
            font-size: 14px;

        }

        .xn-panel-sm {
            margin-bottom: 10px;
        }

        .xn-panel-sm .panel-heading {
            padding: 5px 15px;
        }

        .xn-panel-sm .panel-heading .panel-title {
            font-size: 14px
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
        `,
  ],
})
export class AvengerEditComponent implements AfterViewInit, AfterViewChecked, OnInit {

  @Output() afterBuildFormGroup: EventEmitter<void> = new EventEmitter();
  public recordId: string;

  public svrConfig: any;
  public cancelChecker: any = { name: 'cancelChecker', type: 'textarea', required: false };

  public mainForm: FormGroup;

  public pageTitle = '处理流程记录';
  public pageDesc = '';

  public flowCustom: IFlowCustom;
  public flowId = '';

  public baseInfo: any[] = [];
  public shows: any[] = [];
  public hasActions: boolean;
  public loadingback = false;
  public newSvrConfig: any;
  public mainFlowId: string = this.svrConfig && this.svrConfig.record && this.svrConfig.record.mainFlowId || '';
  public rejectdata: string[] = [];
  public updatedata: CheckerDatas[] = [];
  isshowProgress: boolean; // 是否显示导航进度条

  constructor(
    private xn: XnService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private vcr: ViewContainerRef,
    private loading: LoadingService,
    public hwModeService: HwModeService, public communicateService: PublicCommunicateService,
    private localStorageService: LocalStorageService,) {
  }

  ngAfterViewInit() {
    // console.info(this.mainFlowId, 'mainFlowId');
    // this.route.params.subscribe((params: Params) => {
    //     this.recordId = params['id'];
    //     this.showSubmit(this.recordId);
    //     console.info("wqwqwqwqwq", "edit");
    // });
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }
  ngOnInit() {
    this.updatedata = [new CheckerDatas(), new CheckerDatas()];
    this.route.params.subscribe((params: Params) => {
      this.recordId = params.id;
      this.showSubmit(this.recordId);
    });
  }
  /**
   *  拉取后台配置信息
   * @param recordId  流程记录id
   * @param fresh fresh
   */
  private showSubmit(recordId, fresh?) {  // fresh 为可选，true的时候则刷新，不拉取actions的最后一项，拉checker
    this.xn.avenger.post('/flow/showSubmit', {
      recordId
    }).subscribe(json => {
      this.svrConfig = json.data;
      if (this.svrConfig.record.flowId === 'financing_500' || this.svrConfig.record.flowId === 'financing_501') {
        const stopLength = this.svrConfig.actions.length;
        if (stopLength >= 2 && this.svrConfig.actions[stopLength - 2].procedureName === '退回原因'
          && ((this.svrConfig.record.flowId === 'financing_500' && this.svrConfig.procedure.procedureId === '@begin')
            || (this.svrConfig.record.flowId === 'financing_501' && this.svrConfig.procedure.procedureId === 'operate'))) {
          this.xn.avenger.post('/in_flow/reject/tips', { mainFlowId: this.svrConfig.record.mainFlowId }).subscribe(x => {
            if (x.ret === 0) {
              const params = {
                title: '平台拒绝信息',
                checker: [
                  {
                    title: '退回修改内容',
                    checkerId: 'stopcontent',
                    type: 'text',
                    options: { readonly: true },
                    required: 0,
                    value: x.data.memo,
                  },
                  {
                    title: '问题描述',
                    type: 'text',
                    checkerId: 'questiondetail',
                    options: { readonly: true },
                    required: 0,
                    value: x.data.dsc,
                  }
                ] as CheckersOutputModel[],
                buttons: ['确定'],
              };
              XnModalUtils.openInViewContainer(this.xn, this.vcr, EditModalComponent, params)
                .subscribe(v => {
                  if (v === null) {
                    return;
                  } else {
                  }
                });
              // this.xn.msgBox.open(false, `${x.data.memo}\n\n${x.data.dsc}`);
            }
          });
        }
      }
      this.flowId = this.svrConfig.flow.flowId;
      this.isshowProgress = this.flowId.startsWith('sub');
      this.flowCustom = FlowCustom.build(this.flowId, this.xn, this.vcr, this.loading,
        this.communicateService, this.localStorageService
      );

      this.flowCustom.postGetSvrConfig(this.svrConfig);
      this.svrConfig = XnFlowUtils.handleSvrConfig(this.svrConfig);
      this.flowCustom.preShow(this.svrConfig);
      this.mainFlowId = this.svrConfig.record.mainFlowId === '' ? '1' : this.svrConfig.record.mainFlowId;
      this.buildRows(fresh);
      // 拷贝对象
      this.newSvrConfig = JSON.parse(JSON.stringify(this.svrConfig));

    });
  }

  /**
   *  历史提交版折叠
   * @param paramItem paramItem
   */
  public collapse(paramItem: any): void {
    const items = this.newSvrConfig.actions;
    if (!paramItem.collapse || paramItem.collapse === false) {
      items.forEach((x: any) => x.collapse = false); // 所有都至false
      paramItem.collapse = true;
    } else if (paramItem.collapse === true) {
      paramItem.collapse = false;
    }
  }

  /**
   *  提交同意
   *  提交数据前，回调该流程的个性配置，进行具体操作
   */
  public onSubmit() {
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
   *  取消
   */
  public onCancel() {
    this.xn.user.navigateBack();
  }

  /**
   *  刷新获取手机扫描二维码上传的文件
   */
  public onFresh(): void {
    this.showSubmit(this.recordId, true); // fresh 刷新的时候则不拉取actions的最后一个
  }

  /**
   *  中登登记，暂留
   */
  public onRegistration() {
  }


  public getOtherHelp(row) {
    if (row.other !== undefined && row.other !== '') {
      return JSON.parse(row.other);
    }
  }


  changeAccount(value: string, row: any) {
    if (value === '查看账号变更记录' || value === '查看账号使用记录') {
      const cardCode = this.svrConfig.checkers.filter((x: any) => x.checkerId === 'debtInfo')[0].value;
      XnModalUtils.openInViewContainer(this.xn, this.vcr, VankeViewChangeAccountComponent,
        { params: value, orgName: row.value, cardCode: JSON.parse(cardCode).accountNumber }).subscribe(() => {
        });
    } else if (value === '下载更正函模板') {
      this.xn.api.dragon.download('/file/downloadCorrect', { mainFlowId: this.mainFlowId }).subscribe((v: any) => {
        this.xn.api.save(v._body, '更正函.zip');
      });
    }


  }
  /**
   * 把svrConfig.checkers转换为rows对象，方便模板输出
   * @param fresh fresh
   */
  private buildRows(fresh?): void {
    this.baseInfo.push({
      type: 'text',
      title: '流程记录ID',
      data: this.svrConfig.record.recordId
    });

    if (!XnUtils.isEmpty(this.svrConfig.record.bcOrderId)) {
      this.baseInfo.push({
        type: 'text',
        title: '区块链账本ID',
        data: this.svrConfig.record.bcLedgerId
      });
      this.baseInfo.push({
        type: 'text',
        title: '区块链记录ID',
        data: this.svrConfig.record.bcOrderId
      });
    }
    this.shows = [];
    const hides = [this.cancelChecker];

    if (this.svrConfig.procedure.procedureId === '@begin') {
      // 起始步骤要处理下标题
      const titleConfig = this.flowCustom.getTitleConfig();
      const titleObj = {
        name: 'title',
        required: true,
        type: 'text',
        title: titleConfig && titleConfig.titleName || '流程标题',
        value: this.svrConfig.record.title || (titleConfig && titleConfig.def) || ''
      };

      if (!!titleConfig && titleConfig.hideTitle) {
        hides.push(titleObj);
        this.shows = [].concat(this.svrConfig.checkers);
      } else {
        this.shows = [titleObj].concat(this.svrConfig.checkers);
      }
    } else {
      this.shows = [].concat(this.svrConfig.checkers);
    }

    if (this.svrConfig.rejectType === 0) {
      this.shows.push({
        name: 'memo',
        required: false,
        type: 'textarea',
        title: '备注'
      });
    } else {
      this.shows.push({
        name: 'memo',
        required: false,
        type: 'textarea',
        title: '审核意见'
      });
    }
    this.copyDraft(this.shows, hides, fresh);
    this.mainForm = XnFormUtils.buildFormGroup(this.shows, hides);
    this.afterBuildFormGroup.emit();
  }

  /**
   *  回退上一步，在历史记录中取到最近一次的提交值，即为草稿
   * @param shows shows
   * @param hides hides
   * @param fresh fresh
   */
  private copyDraft(shows: any[], hides: any[], fresh: boolean): void {
    // 如果有草稿，就把草稿内容复制过来
    for (const action of this.svrConfig.actions.slice(0, fresh ? this.svrConfig.actions.length - 1 : this.svrConfig.actions.length)) {
      if (action.operator === 0 && action.procedureId === this.svrConfig.procedure.procedureId) {
        // 是草稿
        for (const checker of action.checkers) {
          if (checker.type === 'sms' || checker.type === 'password') {
            // sms/password字段不保留草稿
            continue;
          }

          let find = false;
          for (const item of shows) {
            if (item.checkerId === checker.checkerId) {
              item.value = checker.data;
              find = true;
              break;
            }
          }
          if (find) {
            continue;
          }
          for (const item of hides) {
            if (item.checkerId === checker.checkerId) {
              item.value = checker.data;
              find = true;
              break;
            }
          }
        }

        // memo字段
        for (const item of shows) {
          if (item.name === 'memo') {
            item.value = action.memo;
            break;
          }
        }
      } else {
        this.hasActions = true;
      }
    }
  }

  private innerSubmit(fn) {
    fn().subscribe(v => {
      if (!(v && v.action)) {
        this.doSubmit();
        return;
      }
      if (v.action === 'stop') {
        return;
      }

      if (v.action === 'tips') {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, HtmlModalComponent, {
          type: v.tipsType,
          title: v.tipsTitle,
          html: v.tipsData,
          size: v.tipsSize
        }).subscribe((v2) => {
          if (v.tipsType === 'yesno' && v2 === 'yes' || v.tipsType === 'ok') {
            this.doSubmit();
          }
        });
        return;
      }

      if (v.action === 'modal') {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, v.modal, v.params).subscribe(v2 => {
          if (v2 === 'ok') {
            this.doSubmit();
          }
        });
        return;
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
      memo: this.mainForm.value.cancelChecker
    };

    this.xn.avenger.post(`/flow/reject`, params)
      .subscribe(() => {
        this.xn.user.navigateBack();
      });
  }

  /**
   *  中止流程
   */
  private onTerminate(): void {
    const params = {
      recordId: this.recordId,
      procedureId: this.svrConfig.procedure.procedureId,
      memo: this.mainForm.value.cancelChecker
    };
    this.xn.avenger.post('/flow/cancel', params)
      .subscribe(json => {
        this.xn.user.navigateBack();
      });
  }

  /**
   *  提交资料，默认值为只读的再此直接读取，防止误操作修改
   */
  private doSubmit(): void {
    for (const checker of this.svrConfig.checkers) {
      if (checker.options && checker.options.readonly) {
        this.mainForm.value[checker.checkerId] = checker.value;
      }
    }
    const formValue: any = this.mainForm.value;
    const params: any = {
      recordId: this.recordId,
      procedureId: this.svrConfig.procedure.procedureId,
      memo: formValue.memo,
      checkers: XnFlowUtils.buildSubmitCheckers(this.svrConfig.checkers, formValue),
      contracts: this.svrConfig.contracts,
    };
    XnUtils.checkLoading(this);
    this.xn.avenger.post(`/flow/submit`, params)
      .subscribe(() => {
        this.loading.close();
        this.afterSubmitandGettip(this.svrConfig);
        this.afterSubmit(this.svrConfig.flow.flowId, this.svrConfig.record.mainFlowId, this.svrConfig.record.nowProcedureId);
      });

  }

  /**
   *  面版样式修改
   * @param paramAction paramAction
   */
  public panelCssClass(action) {
    if (action.operator === OperateType.PASS) {
      return 'panel panel-info xn-panel-sm';
    } else if (action.operator === OperateType.REJECT || action.operator === OperateType.SUSPENSION) {
      return 'panel panel-warning xn-panel-sm';
    } else {
      return '';
    }
  }

  /**
   *  提交完成后操作
   * @param flowId    子流程id
   * @param mainFlowId 主流程id
   * @param nowProcedureId 当前操作角色id
   */
  private afterSubmit(flowId, mainFlowId, nowProcedureId) {
    if (nowProcedureId !== 'windReview') {
      this.xn.user.navigateBack();
      return;
    }
  }

  /**
   * 提交后提示信息
   */
  public afterSubmitandGettip(svrConfig: any) {
    if (svrConfig.flow.flowId === 'sub_nuonuocs_blue' && svrConfig.procedure.procedureId === '@begin') {
      this.xn.msgBox.open(false, '提交成功！下一步请财务复核人在【首页 - 待办任务】中完成【复核】的待办任务。');
    } else if (svrConfig.flow.flowId === 'sub_nuonuocs_blue' && svrConfig.procedure.procedureId === 'review') {
      this.xn.msgBox.open(false, '提交成功！开票申请已发送至第三方，稍候可在列表中查看开票结果。');
    }
    if (svrConfig.flow.flowId === 'sub_nuonuocs_red' && svrConfig.procedure.procedureId === '@begin') {
      this.xn.msgBox.open(false, '提交成功！下一步请财务复核人在【首页 - 待办任务】中完成【复核】的待办任务。');
    } else if (svrConfig.flow.flowId === 'sub_nuonuocs_red' && svrConfig.procedure.procedureId === 'review') {
      this.xn.msgBox.open(false, '提交成功！作废申请已发送至第三方，稍候可在列表中查看作废结果。');
    }
    if (
      (
        svrConfig.flow.flowId === 'sub_factoring_change_520' ||
        svrConfig.flow.flowId === 'sub_factoring_change_jd_520' ||
        svrConfig.flow.flowId === 'sub_financing_sign_jd_520'
      ) &&
      svrConfig.procedure.procedureId === 'review'
    ) {
      this.xn.msgBox.open(false, '提交成功！请供应商在【首页-待办任务】中填写变更信息');
    }
    if (svrConfig.flow.flowId === 'sub_factoring_change_yjl_520' && svrConfig.procedure.procedureId === 'review') {
      this.xn.msgBox.open(false, '提交成功！请供应商在【首页-待办任务】中填写变更信息');

    }

    if (
      (svrConfig.flow.flowId === 'sub_customer_verify_520' || svrConfig.flow.flowId === 'sub_customer_verify_jd_520') &&
      svrConfig.procedure.procedureId === 'operate') {
      this.xn.msgBox.open(false, '提交成功,下一步请客户经理复核人在【首页-待办任务】中完成【复核】的待办任务');

    }
    if ((svrConfig.flow.flowId === 'sub_customer_verify_520' || svrConfig.flow.flowId === 'sub_customer_verify_jd_520') &&
      svrConfig.procedure.procedureId === 'review') {
      this.xn.msgBox.open(false, '提交成功！请风险复核人在【首页-待办任务】中完成【风险复核】的待办任务。');
    }

    if ((svrConfig.flow.flowId === 'sub_financing_verify_520' || svrConfig.flow.flowId === 'sub_financing_verify_jd_520') &&
      svrConfig.procedure.procedureId === 'operate') {
      this.xn.msgBox.open(false, '提交成功！请高管复核人在【首页-待办任务】中完成【高管复核】的待办任务。');

    }
    if ((svrConfig.flow.flowId === 'sub_financing_verify_520' || svrConfig.flow.flowId === 'sub_financing_verify_jd_520') &&
      svrConfig.procedure.procedureId === 'review'
      && svrConfig.procedure.nextProcedureId === '@end') {
      this.xn.msgBox.open(false, '提交成功！已完成账号变更流程。');

    }
    if ((svrConfig.flow.flowId === 'sub_financing_verify_520' || svrConfig.flow.flowId === 'sub_financing_verify_jd_520') &&
      svrConfig.procedure.procedureId === 'riskReview'
      && svrConfig.procedure.nextProcedureId === '@end') {
      this.xn.msgBox.open(false, '提交成功！已完成账号变更流程。');

    }

  }

  openrejectplatWindow() {
    this.xn.avenger.post('/in_flow/reject/showData', { mainFlowId: this.mainFlowId }).subscribe(x => {
      if (x.data && x.data.backCompany && x.data.dealApp && x.data.rate) {
        const params: EditParamInputModel = {
          title: '拒绝',
          checker: [
            {
              title: '',
              checkerId: 'rejectrate',
              type: 'platrateReject',
              required: 0,
              validators: {},
              value: x.data.rate,
            },
            {
              title: '保理商',
              checkerId: 'factoringName',
              type: 'text',
              options: { readonly: true },
              required: 0,
              value: x.data.dealApp.factoringName,
            },
            {
              title: '万科供应商名称',
              checkerId: 'supplierName',
              type: 'text',
              options: { readonly: true },
              required: 0,
              validators: {},
              value: x.data.dealApp.supplierName,
            },
            {
              title: '上游客户名称',
              checkerId: 'upstreamName',
              type: 'text',
              options: { readonly: true },
              required: 0,
              validators: {},
              value: x.data.dealApp.upstreamName
            },
            {
              title: '应收账款金额',
              checkerId: 'receive',
              type: 'text',
              options: { readonly: true },
              required: 0,
              validators: {},
              value: x.data.receive
            },
            {
              title: '退回企业修改内容',
              checkerId: 'backCompany',
              type: 'ModifiedContent',
              validators: {},
              value: x.data.backCompany,
              required: 1,
            },
            {
              title: '问题描述',
              checkerId: 'memo',
              type: 'textarea',
              required: 0,
              validators: {},
            }
          ] as CheckersOutputModel[],
          buttons: ['取消', '确定']
        };
        XnModalUtils.openInViewContainer(this.xn, this.vcr, EditModalComponent, params).subscribe(v => {
          if (v === null) {

            return;
          } else {
            v.backCompany.map((item, index) => {
              if (item.checked) {
                item.checkers.map(items => {
                  if (items.checked === true) {
                    this.rejectdata.push(items.name);
                    this.rejectdata = Array.from(new Set(this.rejectdata));
                  }
                });

                this.updatedata[index].appType = item.name;
                this.updatedata[index].flowId = item.flow;
                this.updatedata[index].mainFlowId = v.rejectrate.mainFlowId;
                this.updatedata[index].memo = v.memo;
                this.updatedata[index].procedureId = this.svrConfig.procedure.procedureId;
                this.updatedata[index].recordId = this.svrConfig.record.recordId;
                this.updatedata[index].checkerData = JSON.stringify(this.rejectdata);
                this.rejectdata = [];
              }
            });


          }
          const datalist = this.updatedata.filter(index => {
            return index.mainFlowId !== '';
          });
          this.xn.avenger.post('/in_flow/reject/updateData', { CheckerDatas: datalist }).subscribe(r => {
            if (r.data) {
              this.xn.router.navigate([`/console/record/avenger/record/${this.flowId}`]);
            }
          });
        });
      } else {

      }

    });




  }
}
