/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\products\bank-shanghai\src\lib\share\components\record\puhui\edit-puhui.component.ts
* @summary：开户流程供应商复核、平台审核edit组件
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                 hucongying           init          2021-07-20
***************************************************************************/
import {
  Component, AfterViewInit, ViewContainerRef, Output, EventEmitter, AfterViewChecked, OnInit,
  ChangeDetectorRef, ElementRef, ViewChild, OnDestroy
} from '@angular/core';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { ModalComponent } from 'libs/shared/src/lib/common/modal/components/modal';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { PublicCommunicateService } from 'libs/shared/src/lib/services/public-communicate.service';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import XnFlowUtils from 'libs/shared/src/lib/common/xn-flow-utils';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { CheckersOutputModel } from 'libs/shared/src/lib/config/checkers';
import { FlowCustom, IFlowCustom } from '../../flow/flow-custom';
import { CheckStatus, OperateType, ProcduresIdEnum, RetCodeEnum, ShPuhuiFlowIdEnum, StepValueEnum, TabIndexEnum } from 'libs/shared/src/lib/config/enum';
import { LocalFlowProcessModel } from '../../process/flow-process.model';
import { platProcessJson, supplierProcessJson } from '../../process/puhui/puhui-flow-process-config';
import { catchError, timeout } from 'rxjs/operators';
import { of } from 'rxjs';
import { ShSingleListParamInputModel, ShSingleSearchListModalComponent } from 'libs/products/bank-shanghai/src/lib/share/modal/single-searchList-modal.component';
import { ShEditModalComponent } from 'libs/products/bank-shanghai/src/lib/share/modal/edit-modal.component';

/** 审核表单信息配置接口定义 */
export interface TitleModel {
  /** checkerId */
  checkerId: string,
  /** 标题 */
  title: string,
  /** 是否需要展示审核按钮 */
  needCheck: boolean,
  /** 审核状态字段 */
  checkStatusId?: string,
  /** 审核状态值 */
  checkStatus?: number
  /** 补正原因 */
  checkReson?: string
  /** 补正原因字段id */
  reasonId?: string,
  /** 当前步骤 */
  step?: number,
}

/** 审核信息分类配置 */
const titleModel: TitleModel[] = [
  {
    checkerId: 'orgName', title: '企业信息', needCheck: true,
    checkStatusId: 'companyInfoStatus', reasonId: 'coInfoRjReason',
    checkStatus: CheckStatus.UNCHECK, checkReson: '', step: StepValueEnum.FIRST
  },
  { checkerId: 'shrhldList', title: '股东信息', needCheck: false, checkStatus: CheckStatus.PASS, checkReson: '' },
  { checkerId: 'bankAccountNo', title: '对公账号信息', needCheck: false, checkStatus: CheckStatus.PASS, checkReson: '' },
  {
    checkerId: 'earningOwnerList', title: '受益人信息', needCheck: true,
    checkStatusId: 'earningOwnerStatus', reasonId: 'eaInfoRjReason',
    checkStatus: CheckStatus.UNCHECK, checkReson: '', step: StepValueEnum.SECOND
  },
  {
    checkerId: 'appApplyType', title: '经办人信息', needCheck: true,
    checkStatusId: 'operatorStatus', reasonId: 'opInfoRjReason',
    checkStatus: CheckStatus.UNCHECK, checkReson: '', step: StepValueEnum.THIRD
  },
]
@Component({
  selector: 'oct-bank-edit-ph',
  templateUrl: './edit-puhui.component.html',
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
      .helpUl li{
          text-align:left
      }
      .rejectClass{
          position: absolute;
          top: 30%;
          left: 90%;
      }
      .changesClass{
          position: absolute;
          top: 30%;
          left: 90%;
      }
      .xn-divide-line {
          /* #d7d1d159 */
          background-color: #d9edf7;
          font-weight: bold;
          margin-top: -15px;
          margin-bottom: 15px;
      }
      .divide-tag {
          border-bottom: 1px solid #00c0ef;
          margin-top: -15px;
          margin-bottom: 15px;
      }
      ::ng-deep .ant-modal-close-x {
        padding: 10px;
      }
      .checkerTitle {
        width: 150px;
        display: flex;
        justify-content: space-between;
      }
      `,
  ],
})
export class OctPuhuiEditComponent implements AfterViewInit, AfterViewChecked, OnInit, OnDestroy {
  @ViewChild('accountDistannce') accountDistannce: ElementRef;
  @ViewChild('cancelModal') cancelModal: ModalComponent;
  @Output() afterBuildFormGroup: EventEmitter<void> = new EventEmitter();

  public recordId: string;
  public svrConfig: any;
  public cancelChecker: any = { name: 'cancelChecker', type: 'textarea', required: false };
  public mainForm: FormGroup;
  public pageTitle = '处理流程记录';
  // 流程配置
  public flowCustom: IFlowCustom;
  // 流程flowId
  public flowId = '';
  public baseInfo: any[] = [];
  public shows: any[] = [];
  public hasActions: boolean;
  public newSvrConfig: any;
  public mainFlowId = '';
  public fromModule = 'dragon-input';
  // 导航配置
  public flowProcess: LocalFlowProcessModel[] = [];
  // 审核表单信息配置
  public titleModel: TitleModel[] = XnUtils.deepClone(titleModel);
  // 平台审核展示的表单
  public checkShows: CheckersOutputModel[] = []
  public firstStep: number = StepValueEnum.FIRST
  public secondStep: number = StepValueEnum.SECOND
  public thirdStep: number = StepValueEnum.THIRD
  /** 当前步骤 */
  public step: number = StepValueEnum.FIRST;
  public newFlow: boolean = false;
  // 供应商需要资料补正的步骤
  public rejectStepMap: number[] = [];

  /** 未审核状态 */
  get unCheckStatus() {
    return CheckStatus.UNCHECK
  }
  /** 审核通过状态 */
  get passStatus() {
    return CheckStatus.PASS
  }
  /** 审核不通过状态 */
  get unPassStatus() {
    return CheckStatus.UNPASS
  }
  /** 经办步骤 */
  get operate() {
    return ProcduresIdEnum.OPERATE
  }
  /** 复核步骤 */
  get review() {
    return ProcduresIdEnum.REVIEW
  }
  /** 流程通过 */
  get operatePass() {
    return OperateType.PASS
  }

  constructor(private xn: XnService, private route: ActivatedRoute, private router: Router, private cdr: ChangeDetectorRef,
    private vcr: ViewContainerRef, private loading: LoadingService, public hwModeService: HwModeService,
    public communicateService: PublicCommunicateService, private localStorageService: LocalStorageService) {
  }

  ngOnInit() {
    /** 监听分布提交表单组件发射出来的值 */
    this.communicateService.change.subscribe(v => {
      if (v?.step) {
        this.step = v.step;
        this.svrConfig = v.svrConfig;
      }
    })

    this.route.params.subscribe((params: Params) => {
      this.recordId = params.id;
      this.showSubmit(this.recordId);
    });
  }

  ngAfterViewInit() {
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
  }

  /**
   *  拉取后台配置信息
   * @param recordId  流程记录id
   * @param fresh fresh 为可选，true的时候则刷新，不拉取actions的最后一项，拉checker
   */
  private showSubmit(recordId: string, fresh?: boolean) {
    this.xn.dragon.post('/flow/showSubmit', { recordId }).subscribe(json => {
      this.svrConfig = json.data;
      this.flowId = this.svrConfig.flow.flowId;
      this.flowCustom = FlowCustom.build(this.flowId, this.xn, this.vcr, this.loading,
        this.communicateService, this.localStorageService
      );
      this.flowCustom.postGetSvrConfig(this.svrConfig);
      this.svrConfig = XnFlowUtils.handleSvrConfig(this.svrConfig);
      this.flowCustom.preShow(this.svrConfig);
      // 构建表单
      this.buildRows();
      // 拷贝对象
      this.newSvrConfig = XnUtils.deepClone(this.svrConfig);
      if (this.flowId === ShPuhuiFlowIdEnum.SUB_SO_PRATTWHITNEY_INPUT) {
        // 供应商复核导航
        this.flowProcess = supplierProcessJson;
        this.fetchCheckInfo();
      } else {
        // 平台审核导航
        this.flowProcess = platProcessJson;
        this.expandShMemo();
        // 同步审核状态
        this.platAsyncCheckInfo();
      }
      this.cdr.markForCheck();
      this.cdr.detectChanges();
    });
  }

  /**
   * 供应商分步提交表单展示判断
   * @returns
   */
  showSupplierStepForm() {
    // sub_sO_prattwhitney_input 指供应商发起开户流程
    // procedureId为经办步骤时，供应商需要补正资料
    return this.flowId === ShPuhuiFlowIdEnum.SUB_SO_PRATTWHITNEY_INPUT && this.svrConfig.procedure.procedureId === ProcduresIdEnum.BEGIN;
  }

  /**
   * 资料补正
   */
  addRegisteData() {
    const hasUnPass = this.titleModel.some((item: TitleModel) => item.checkStatus === CheckStatus.UNPASS);
    if (hasUnPass) {
      this.rejectData()
    } else {
      this.xn.msgBox.open(false, '当前不存在审核不通过的资料信息')
    }
  }

  /**
   * 回退给供应商补正资料
   */
  rejectData() {
    const paramData = this.titleModel.filter((item: TitleModel) => item.checkStatus === CheckStatus.UNPASS);
    // 存在”不通过“状态资料,展示确认补正原因弹窗
    const params: ShSingleListParamInputModel = {
      title: '确认补正原因',
      get_url: '',
      get_type: 'dragon',
      multiple: null,
      heads: [
        { label: '类别', value: 'title', type: 'text' },
        { label: '补正原因', value: 'checkReson', type: 'text' },
      ],
      searches: [],
      key: 'title',
      data: paramData,
      total: paramData.length,
      inputParam: {},
      leftButtons: [{ label: '取消', value: 'cancel' }],
      rightButtons: [{ label: '确定', value: 'submit' }],
      options: {}
    };
    XnModalUtils.openInViewContainer(this.xn, this.vcr, ShSingleSearchListModalComponent, params).subscribe(v => {
      if (v?.action === 'ok') {
        const params: any = {
          recordId: this.recordId,
          procedureId: this.svrConfig.procedure.procedureId,
          memo: JSON.stringify(paramData),
        };
        // 回退给供应商去补正资料
        this.xn.loading.open();
        this.xn.api.dragon.post(`/flow/reject`, params)
          .subscribe((res: any) => {
            this.xn.loading.close();
            if (res.ret === RetCodeEnum.OK) {
              this.xn.msgBox.open(false, '操作成功,此笔交易将回退给供应商补正资料', () => {
                this.xn.user.navigateBack();
              })
            }
          });
      }
    });
  }

  /**
   * 资料补正按钮禁用校验
   * @returns
   */
  showAddData(): boolean {
    const hasUnPass = this.titleModel.some((item: TitleModel) => item.checkStatus === CheckStatus.UNPASS);
    return !hasUnPass
  }

  /**
   * 提交按钮禁用校验
   * @returns
   */
  canSubmit(): boolean {
    if (this.flowId === ShPuhuiFlowIdEnum.SUB_SO_PRATTWHITNEY_PLATFORM_VERIFY && this.svrConfig.procedure.procedureId === ProcduresIdEnum.OPERATE) {
      // 平台审核初审
      const isPassCheck = this.titleModel.every((item: TitleModel) => item.checkStatus === CheckStatus.PASS)
      return !isPassCheck
    } else {
      return !this.mainForm.valid
    }
  }

  /**
   * 获取审核状态信息值
   */
  getCheckStatus() {
    this.shows.forEach(show => {
      this.titleModel.forEach(item => {
        if (item.checkStatusId === show.checkerId) {
          item.checkStatus = show.data ? show.data : -1
        }
      })
    })
  }

  /**
   * 修改审核状态
   * @param item 审核配置信息
   * @param checkStatus 状态值 -1 0 1
   */
  editCheckInfo(item: TitleModel, checkStatus: number) {
    const status = item.checkStatus;
    item.checkStatus = checkStatus;
    if (checkStatus === CheckStatus.UNPASS) {
      // 审核不通过
      const params = {
        title: '填写补正原因',
        checker: [
          {
            title: `${item.title}补正原因`,
            checkerId: 'checkReson',
            type: 'text-area',
            required: true,
            options: { readonly: false, inputMaxLength: 100 },
          },
        ],
        buttons: ['取消', '确定'],
      };
      XnModalUtils.openInViewContainer(this.xn, this.vcr, ShEditModalComponent, params).subscribe(v => {
        if (v) {
          item.checkReson = v.checkReson;
        } else {
          // 取消补正
          item.checkStatus = status
        }
        this.asyncCheckStatus(item)
      });
    } else {
      // 审核通过
      item.checkReson = '';
      this.asyncCheckStatus(item);
    }

  }

  /**
   * 将审核信息同步到this.svrConfig.checker
   * @param item 审核配置信息
   */
  asyncCheckStatus(item: TitleModel) {
    this.svrConfig.checkers.forEach(show => {
      // 审核状态
      if (show.checkerId === item.checkStatusId) {
        show.data = item.checkStatus;
        show.value = item.checkStatus;
      }
      // 审核原因
      if (show.checkerId === item.reasonId) {
        show.data = item.checkReson;
        show.value = item.checkReson;
      }
    })
  }

  /**
   * 股东信息样式判断
   * @param row
   * @returns
   */
  showMaxRow(row: any) {
    return (row.checkerId === 'shrhldList' || row.checkerId === 'earningOwnerList') ? true : false;
  }

  /**
   * tabchange事件
   * @param e
   */
  onTabChange(e: any) {
    switch (e.index) {
      // 企业信息
      case TabIndexEnum.FIRST:
        this.checkShows = this.shows.slice(0, 16)
        break;
      // 受益人信息
      case TabIndexEnum.SECOND:
        this.checkShows = this.shows.slice(16, 17)
        break;
      // 经办人信息
      case TabIndexEnum.THIRD:
        this.checkShows = this.shows.slice(17, 34)
        break;

      default:
        break;
    }
  }

  /**
   * 平台初审，如果有退回到供应商需要同步上一次审核状态
   */
  platAsyncCheckInfo() {
    // 平台上一次的审核信息取actions数组的第一项
    const action = this.newSvrConfig.actions[0];
    if (action.operator === OperateType.REJECT
      && action.flowId === ShPuhuiFlowIdEnum.SUB_SO_PRATTWHITNEY_INPUT
      && this.newSvrConfig.actions.length < 3) {
      const checkInfo: TitleModel[] = JSON.parse(action.memo);
      // 同步审核信息
      this.titleModel.forEach(t => {
        t.checkStatus = CheckStatus.PASS;
        t.checkReson = '';
        checkInfo.forEach(check => {
          if (t.checkerId === check.checkerId) {
            t.checkStatus = check.checkStatus;
            t.checkReson = check.checkReson;
          }
        })
      })
    }
  }

  /**
   * 获取补正原因，展示需要补正的步骤资料
   */
  fetchCheckInfo() {
    // 补正原因取actions数组的第一项
    const action = this.newSvrConfig.actions[0];
    if (action.operator === OperateType.REJECT && this.showPuhuiMemo(action) && this.newSvrConfig.actions.length < 3) {
      // 默认展开补正原因信息
      action['collapse'] = this.newSvrConfig.record.nowProcedureId === ProcduresIdEnum.BEGIN ? true : false;
      const checkInfo: TitleModel[] = JSON.parse(action.memo);
      this.step = checkInfo[0]['step'] || StepValueEnum.FIRST;
      // 获取需要补正的步骤
      this.rejectStepMap = checkInfo.map(x => x.step);
    }
  }

  /**
   * 是否展示资料补正退回原因memo
   * @param memo
   * @returns
   */
  showPuhuiMemo(action: any): boolean {
    return action.memo && action.memo.startsWith('[') && action.memo.endsWith(']') && action.operatorId !== ProcduresIdEnum.SHBANK;
  }

  /**
   * 如果当前待办处在【上银退回平台审核】,需要展开上海银行退回原因
   */
  expandShMemo() {
    const actions = this.newSvrConfig.actions;
    // 当前流程步骤
    const nowProcedureId = this.newSvrConfig.record.nowProcedureId;
    actions.forEach((action: any, index: number) => {
      // shbank 代表上海银行退回的标识
      if (action.operatorId === ProcduresIdEnum.SHBANK && nowProcedureId === ProcduresIdEnum.OPERATE && index === actions.length - 2) {
        // 将退回原因展开显示
        action['collapse'] = true;
      }
    });
  }

  /**
   * 是否展示上海银行退回原因
   */
  showShRejectMemo(action: any): boolean {
    // shbank 代表上海银行退回的标识
    if (action.operatorId === ProcduresIdEnum.SHBANK) {
      return true;
    } else {
      return false;
    }

  }

  /**
   * 是否是需要补正的步骤
   * @param step 当前步骤
   * @returns
   */
  isEditCheck(step: number) {
    if (this.rejectStepMap.length) {
      return this.rejectStepMap.includes(step) ? false : true;
    } else {
      return false
    }
  }

  /**
   *  历史提交版折叠
   * @param paramItem
   */
  public collapse(paramItem: any): void {
    const items = this.newSvrConfig.actions;
    if (!paramItem.collapse) {
      items.forEach((x: any) => x.collapse = false); // 所有都至false
      paramItem.collapse = true;
    } else {
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
   * 获取other：用于必填项提示
   * @param row
   */
  public getRowOther(row) {
    return !!row.other ? XnUtils.parseObject(row.other, {}) : {};
  }

  /**
   *  取消
   */
  public onCancel() {
    this.xn.user.navigateBack();
  }

  /**
   * 把svrConfig.checkers转换为rows对象，方便模板输出
   * @param fresh
   */
  private buildRows(): void {
    this.baseInfo.push({
      type: 'text',
      title: '流程记录ID',
      data: this.svrConfig.record.recordId
    });
    this.shows = [];
    const hides = [this.cancelChecker];

    if (this.svrConfig.procedure.procedureId === ProcduresIdEnum.BEGIN) {
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
    if (this.svrConfig.rejectType === OperateType.NONE) {
      this.shows.push({
        name: 'memo',
        required: false,
        type: 'textarea',
        title: '备注',
        other: '',
      });
    } else {
      this.shows.push({
        name: 'memo',
        required: false,
        type: 'textarea',
        title: '审核意见',
        other: '',
      });
    }
    // 默认先展示企业信息相关表单项
    this.checkShows = this.shows.slice(0, 16)
    this.copyDraft(this.shows, hides);
    this.mainForm = XnFormUtils.buildFormGroup(this.shows, hides);
    this.afterBuildFormGroup.emit();
  }

  /**
   *  回退上一步，在历史记录中取到最近一次的提交值，即为草稿
   * @param shows
   * @param hides
   */
  private copyDraft(shows: any[], hides: any[]): void {
    // 如果有草稿，就把草稿内容复制过来
    for (const action of this.svrConfig.actions) {
      if (action.operator === 0 && action.procedureId === this.svrConfig.procedure.procedureId) {
        // 是草稿
        for (const checker of action.checkers) {

          let find = false;
          for (const item of shows) {
            if (item.checkerId === checker.checkerId && !!!item.value) {
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
      if (!!v && !!v.value) {
        return;
      }
      if (!(v && v.action)) {
        this.doSubmit();
        return;
      }
    });
  }

  /**
   *  回退,退回到上一步
   *  审核不通过，打回到上一步或上一个节点（后台自己处理）
   */
  public onReject(): void {
    const params: any = {
      recordId: this.recordId,
      procedureId: this.svrConfig.procedure.procedureId,
      memo: this.mainForm.value.cancelChecker
    };

    this.xn.api.dragon.post(`/flow/reject`, params)
      .subscribe(() => {
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
    this.xn.api.dragon.postOnly(`/flow/submit`, params).pipe(
      //设置超时时间5分钟
      timeout(1000 * 60 * 5),
      catchError(err => {
        // 把错误信息也包装成json格式
        let msg = '请求出现异常';
        if (err instanceof Response) {
          if ((err as any)._body) {
            msg = `请求异常，状态码${err.status}，${(err as any)._body}`;
          } else {
            msg = `请求异常，状态码${err.status}`;
          }
        }
        return of({
          ret: 99900,
          msg
        });
      })
    ).subscribe((res) => {
      this.loading.close();
      if (res.ret === RetCodeEnum.OK) {
        this.afterSubmit(this.svrConfig.flow.flowId, this.svrConfig.record.mainFlowId, this.svrConfig.record.nowProcedureId, res);
      } else {
        this.xn.msgBox.open(false, res.msg)
      }
    }, () => {
      this.loading.close();
    });
  }

  /**
   *  面版样式修改
   * @param paramAction
   */
  public panelCssClass(paramAction: any): string {
    if (paramAction.operator === OperateType.PASS) {
      return 'panel panel-info xn-panel-sm';
    } else if (paramAction.operator === OperateType.REJECT || paramAction.operator === OperateType.SUSPENSION) {
      return 'panel panel-warning xn-panel-sm';
    } else {
      return '';
    }
  }

  /**
   * 提交后操作
   */
  private afterSubmitOperate(fn) {
    fn().subscribe(v => {
      if (!(v && v.action)) {
        this.xn.user.navigateBack();
        return;
      }
      if (v.action === 'stop') {
        return;
      }
      if (v.action === 'modal') {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, v.modal, v.params).subscribe(v2 => {
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
  private afterSubmit(flowId: string, mainFlowId: string, nowProcedureId: string, x: any) {
    this.afterSubmitOperate(() => {
      return this.flowCustom.afterSubmitandGettip(this.svrConfig, this.mainForm.value, x);
    });
  }

  /**
   *  判断数据类型
   * @param value
   */
  public judgeDataType(value: any): boolean {
    if (typeof Array.isArray === 'function') {
      return Array.isArray(value);
    } else {
      return Object.prototype.toString.call(value) === '[object Array]';
    }
  }

  /**
   * 审核状态展示按钮class类
   */
  checkStatusClass(title: TitleModel) {
    switch (title.checkStatus) {
      // 待审核
      case CheckStatus.UNCHECK:
        return 'btn-warning'
      // 审核通过
      case CheckStatus.PASS:
        return 'btn-success'
      // 审核不通过
      case CheckStatus.UNPASS:
        return 'btn-danger'

      default:
        return 'btn-warning'
    }
  }

  showRow(row: CheckersOutputModel) {
    return !['checkerCFCACode', 'CFCACode'].includes(row.checkerId);
  }

}

