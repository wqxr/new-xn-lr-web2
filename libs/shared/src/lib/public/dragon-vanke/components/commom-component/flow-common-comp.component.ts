import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import XnFlowUtils from 'libs/shared/src/lib/common/xn-flow-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { VankeViewChangeAccountComponent } from '../../modal/vanke-change-account.component';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { stepList } from 'libs/shared/src/lib/config/select-options';
import {
  EditParamInputModel,
  EditModalComponent,
} from '../../modal/edit-modal.component';
import { CheckersOutputModel } from 'libs/shared/src/lib/config/checkers';
import {
  correctReason,
  opinionList,
} from '../bean/vanke-flow-correct-reason.config';
import { RuleEngineModalParams, RuleEngineResultModalComponent } from '../../modal/rule-engine-result-modal/rule-engine-result-modal.component';
import { RetCodeEnum, IsPreTrade } from 'libs/shared/src/lib/config/enum';
import { ModalSize } from 'libs/shared/src/lib/common/modal/ng2-bs3-modal';

@Component({
  selector: 'flow-commom-edit',
  templateUrl: './flow-common-comp.component.html',
  styleUrls: [
    '../../../../../../../products/vanke/src/lib/shared/components/step-record/step.less',
  ],
})
export class FlowCommonComponent implements OnInit {
  @Input() svrConfig: any;
  @Input() mainForm: FormGroup;
  @Input() shows?: any;
  isPreTrade: any;
  public constructor(
    public hwModeService: HwModeService,
    private xn: XnService,
    private loading: LoadingService,
    private vcr: ViewContainerRef
  ) {}

  public ngOnInit() {
    this.isPreTrade = this.svrConfig.isPreTrade;
  }
  get preTradeType() {
    return IsPreTrade;
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
        .download('/file/downloadCorrect', {
          mainFlowId: this.svrConfig.record.mainFlowId,
        })
        .subscribe((v: any) => {
          this.xn.api.save(v._body, '更正函.zip');
        });
    }
  }
  /** 流程事件 */
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

  /**
   * 获取other：用于必填项提示
   * @param row row
   */
  public getRowOther(row) {
    if (row.other !== undefined && row.other !== '') {
      return JSON.parse(row.other);
    }
  }
  getPreTrade(row): string {
    if (
      this.isPreTrade === IsPreTrade.YES &&
      row?.type === 'account-info' &&
      JSON.parse(row?.value).isVirtual === false
    ) {
      return `收款账户信息有误，请变更为【取值为虚拟账户账号】`;
    } else {
      return '';
    }
  }
  /**
   * 分块点击不同意
   * @param paramStep 分布信息
   */
  disAgree(paramStep: stepList) {
    const correctReasonList = correctReason
      .filter((x) => x.flowId === paramStep.flowId)
      .map((x) => x.correctList)[0];
    const params: EditParamInputModel = {
      title: '资料补正',
      checker: [
        {
          title: '资料补正原因',
          checkerId: 'correctReason',
          type: 'multiple-two-select',
          selectOptions: correctReasonList[0][paramStep.stepId],
          required: true,
        },
        {
          title: '汇总',
          checkerId: 'otherResult',
          type: 'table-input-change',
          heads: opinionList,
          required: true,
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
      if (v === null) {
      } else {
        const otherReason = v.otherResult.filter((x) => x.opinion !== '');
        paramStep.result_status = 2;
        paramStep.className = 'iconrefuse';
        paramStep.step_memo = JSON.stringify(otherReason);
      }
    });
  }
  /**
   * 分块点击同意
   * @param paramStep 分布信息
   */
  onAgree(paramStep: stepList) {
    this.fetchRuleEngine(paramStep);
  }

  /**
   * 展示规则校验结果
   */
  async fetchRuleEngine(paramStep: stepList) {
    let checkerIdList = paramStep.checkerIdList;
    const formValue = XnUtils.deepClone(this.mainForm.value) || {};
    /** 审核页面修改后的数据同步到规则引擎接口 */
    checkerIdList.map((checker) => {
      for (const key in formValue) {
        if (checker.checkerId === key) {
          checker.value = formValue[key];
        }
      }
    });
    const rule_info: any = await this.fetchRuleEngineChecker(checkerIdList);
    if (XnUtils.isEmptys(rule_info)) {
      /** 不需要调用规则引擎,设置通过 */
      paramStep.result_status = 1;
      paramStep.step_memo = '';
      paramStep.className = 'iconsuccess-green';
    } else {
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
        mainFlowId: this.svrConfig.record.mainFlowId,
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
          this.saveRuleChekList(params, paramStep, v?.type);
        }
      });
    }
  }

  /**
   * 保存规则校验文件
   * @param params
   */
  saveRuleChekList(params: any, paramStep: stepList, type?: number) {
    this.xn.loading.open();
    this.xn.dragon
      .post('/list/main/rule_checker_list_log', params)
      .subscribe((x) => {
        this.loading.close();
        if (x.ret === RetCodeEnum.OK) {
          // 文件保存成功 设置通过状态
          if (!type) {
            paramStep.result_status = 1;
            paramStep.step_memo = '';
            paramStep.className = 'iconsuccess-green';
          }
        }
      });
  }

  /**
   * 调用规则引擎接口获取校验结果
   * @returns
   */
  fetchRuleEngineChecker(checkerIdList: any) {
    const params = {
      mainFlowId: this.svrConfig.record.mainFlowId,
      recordId: this.svrConfig.record.recordId,
      checkers: checkerIdList,
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
}
