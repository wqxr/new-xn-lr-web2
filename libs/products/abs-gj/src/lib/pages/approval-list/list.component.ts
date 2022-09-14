/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\abs-gj\src\lib\pages\approval-list\list.component.ts
 * @summary：list.component.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-11-24
 ***************************************************************************/

import { XnModalUtils } from '../../../../../../shared/src/lib/common/xn-modal-utils';
import {
  ButtonConfigModel,
  SubTabListOutputModel,
  TabConfigModel,
  TabListOutputModel
} from '../../../../../../shared/src/lib/config/list-config-model';
import {
  DragonFinancingContractModalComponent
} from '../../../../../../shared/src/lib/public/dragon-vanke/modal/dragon-asign-contract.modal';
import { FormGroup } from '@angular/forms';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import {
  AvengerResultCompareComponent
} from '../../../../../../shared/src/lib/public/avenger/modal/avenger-approval-resultCompare.modal';
import { ActivatedRoute } from '@angular/router';
import CommUtils from '../../../../../../shared/src/lib/public/component/comm-utils';
import { LocalStorageService } from '../../../../../../shared/src/lib/services/local-storage.service';
import {
  DragonPdfSignModalComponent
} from '../../../../../../shared/src/lib/public/dragon-vanke/modal/pdf-sign-modal.component';
import {
  AvengerPdfSignModalComponent
} from '../../../../../../shared/src/lib/public/avenger/modal/pdf-sign-modal.component';
import { CheckersOutputModel } from '../../../../../../shared/src/lib/config/checkers';
import {
  PersonUploadloanReceiptComponent
} from '../../../../../../shared/src/lib/public/dragon-vanke/modal/person-upload-loanreceipt-modal.component';
import { JsonTransForm } from '../../../../../../shared/src/lib/public/pipe/xn-json.pipe';
import { EditParamInputModel } from '../assets-manage/project-manager/project-manage.component';
import {
  AvengerChangeAccountComponent
} from '../../../../../../shared/src/lib/public/avenger/modal/avenger-approval-changeAccount.modal';
import {
  AvengerExportListModalComponent
} from '../../../../../../shared/src/lib/public/avenger/modal/export-list-modal.component';
import {
  AvengerIrecordComponent
} from '../../../../../../shared/src/lib/public/avenger/modal/avenger-irecordInfo.modal';
import {
  DragonMfilesViewModalComponent
} from '../../../../../../shared/src/lib/public/dragon-vanke/modal/mfiles-view-modal.component';
import {
  ApprovalStatus,
  DownloadRange, FreezeStatus,
  IsCashierType,
  IsProxyDef,
  SortType,
  SubTabValue,
  TabValue, YesOrNo
} from '../../../../../../shared/src/lib/config/enum';
import {
  AvengerMfilesViewModalComponent
} from '../../../../../../shared/src/lib/public/avenger/modal/mfiles-view-modal.component';
import { XnFormUtils } from '../../../../../../shared/src/lib/common/xn-form-utils';
import {
  AvengerapprovalfreeStyleComponent
} from '../../../../../../shared/src/lib/public/avenger/modal/avenger-approval-freeStyle.modal';
import { XnService } from '../../../../../../shared/src/lib/services/xn.service';
import { HwModeService } from '../../../../../../shared/src/lib/services/hw-mode.service';
import CommBase from '../comm-base';
import { SubTabEnum } from './list.config';
import { XnUtils } from '../../../../../../shared/src/lib/common/xn-utils';
import { PdfSignModalComponent } from '../../../../../../shared/src/lib/public/modal/pdf-sign-modal.component';
import {
  InvoiceDataViewModalComponent
} from '../../../../../../shared/src/lib/public/modal/invoice-data-view-modal.component';
import {
  FileViewModalComponent
} from '../../../../../../shared/src/lib/public/dragon-vanke/modal/file-view-modal.component';
import { EditModalComponent } from '../../../../../../shared/src/lib/public/dragon-vanke/modal/edit-modal.component';
import { IPageConfig } from '../../interfaces';

@Component({
  selector: 'lib-approval-list-gj',
  templateUrl: `./list.component.html`,
  styleUrls: [`./list.component.less`]
})
export class GjApprovalListComponent implements OnInit {
  private arrObjs = {} as any; // 缓存后退的变量
  private beginTime: any;
  private endTime: any;
  private timeId = [];
  private nowTimeCheckId = '';
  private preChangeTime: any[] = []; // 上次搜索时间段,解决默认时间段搜索请求两次
  private sorting = ''; // 共享该变量 列排序
  private naming = ''; // 共享该变量 列css样式
  private subTabEnum = SubTabEnum; // 子标签参数映射枚举
  private searches: CheckersOutputModel[] = []; // 面板搜索配置项暂存
  public tabConfig: TabConfigModel = new TabConfigModel(); // 当前列表配置
  public currentTab: TabListOutputModel = new TabListOutputModel(); // 当前标签页
  public currentSubTab: SubTabListOutputModel = new SubTabListOutputModel(); // 当前子标签页
  /** 标签页，默认激活第一个 */
  public defaultValue = TabValue.First;
  /** 默认子标签页 */
  public subDefaultValue = SubTabValue.DOING;
  public listInfo: any[] = []; // 数据
  public pageConfig = {pageSize: 10, first: 0, total: 0, page: 1}; // 页码配置
  public shows: CheckersOutputModel[] = []; // 搜索项
  public searchForm: FormGroup; // 搜索表单组
  public selectedItems: any[] = []; // 选中的项
  public selectedReceivables = 0; // 所选交易的应收账款金额汇总
  public selectedPayableAmounts = 0; // 所选交易的转让价款汇总
  public allReceivables = 0; // 所有交易的应收账款金额汇总
  public allPayableAmounts = 0; // 所有交易的转让价款汇总
  public completedCount = 0;
  public unfinishedCount = 0;
  formModule = 'dragon-input';
  modal: any;
  viewModal: any;
  base: CommBase;
  loanDate: string;
  approvalMemo: string;
  valueDate: string;
  isJinDie = -1;
  isFirst = false;
  heads: any[];
  /** 分页器每页显示条数配置 */
  pageSizeOptions = [5, 10, 20, 30, 50, 100];
  currentParams: any;
  isshow = false;
  watchApprovalMsg = '';
  pushApprovalMsg = '';
  timed: any;
  timedpush: any;
  public shieldArray = ['approval_ok', 'approval_reject', 'loan_ok', 'loan_fail', 'finance_approval_ok', 'finance_approval_fail'];
  public params = {
    mainFlowId: '',
    headquarters: '',
    pdfProjectFiles: '',
    payCompareStatus: '',
    stopStatus: '',
    changeStatus: '',
    isSupplierSign: '',
    valueDate: '',
  };

  isProxy = IsProxyDef.CDR;
  /** 判断是否数组 */
  judgeDataType = XnUtils.isArray;
  TabValue = TabValue;

  constructor(
    public xn: XnService,
    private vcr: ViewContainerRef,
    private router: ActivatedRoute,
    public hwModeService: HwModeService,
    public localStorageService: LocalStorageService,
  ) {}

  ngOnInit(): void {
    this.router.data.subscribe((res: TabConfigModel) => {
      this.tabConfig = res;
      this.initData(this.defaultValue);
    });
  }

  viewProcess(mainFloId: string) {
    this.xn.router.navigate([`abs-gj/main-list/detail/${mainFloId}`]);
  }

  /** 重置选择的信息 */
  resetSelectedInfo() {
    this.selectedItems = [];
    this.selectedReceivables = 0;
    this.selectedPayableAmounts = 0;
  }

  /** 重置交易信息 */
  resetAllTradeInfo() {
    this.allReceivables = 0;
    this.allPayableAmounts = 0;
  }

  /**
   * 标签页，加载列表信息
   * @param tabValue TabValue
   */
  public initData(tabValue: TabValue) {
    this.resetSelectedInfo();
    this.resetAllTradeInfo();
    this.listInfo = [];
    this.naming = '';
    this.sorting = '';
    this.pageConfig = {pageSize: 10, first: 0, total: 0, page: 1};
    this.defaultValue = tabValue;
    this.subDefaultValue = SubTabValue.DOING;

    for (const key in this.arrObjs) {
      if (this.arrObjs.hasOwnProperty(key)) {
        delete this.arrObjs[key];
      }
    }

    if (this.defaultValue === TabValue.First || this.defaultValue === TabValue.Third) {
      this.xn.api.post('/tool/is_jindie', {})
        .subscribe(x => {
          this.isJinDie = x.data.isOpen;
          if (this.isJinDie === 1) {
            this.tabConfig.title = '审批放款-成都轨交(已开启金蝶云审批)';
          } else {
            this.tabConfig.title = '审批放款-成都轨交(线下人工审批)';
          }
        });
    }

    if (this.defaultValue === TabValue.First) {
      this.watchApproval();
    }

    this.onPage();
    this.buildCondition(this.searches);
  }

  /**
   * 子标签tab切换，加载列表
   * @param subTabValue SubTabValue
   */
  public handleSubTabChange(subTabValue: SubTabValue) {

    if (this.subDefaultValue !== subTabValue) {
      if (subTabValue === SubTabValue.SPECIAL) {
        this.cancelSpecial(subTabValue);
      } else {
        this.resetAllTradeInfo();
        this.resetSelectedInfo();
        this.listInfo = [];
        this.naming = '';
        this.sorting = '';
        this.pageConfig = {pageSize: 10, first: 0, total: 0, page: 1};
        this.subDefaultValue = subTabValue;
        this.onPage();
      }
    }
  }

  public onPage(pageConfig: IPageConfig = {page: 1, pageSize: 10, first: 0, total: 0}) {
    if (this.defaultValue === TabValue.First) {
      this.pageSizeOptions = [5, 10, 20, 30, 50, 100, 500, 1000];
    } else {
      this.pageSizeOptions = [5, 10, 20, 30, 50, 100];
    }

    this.pageConfig = Object.assign({}, this.pageConfig, pageConfig);

    this.onUrlData();
    if (this.subDefaultValue === SubTabValue.SPECIAL) {
      this.cancelSpecial(this.subDefaultValue);
      return;
    }
    // 页面配置
    const find = this.tabConfig.tabList.find(tab => tab.value === this.defaultValue);
    this.currentTab = !!find ? find : new TabListOutputModel();
    // 子页面配置
    const subFind = this.currentTab.subTabList.find(sub => sub.value === this.subDefaultValue);
    this.currentSubTab = !!subFind ? subFind : new SubTabListOutputModel();
    this.heads = CommUtils.getListFields(this.currentSubTab.headText);
    this.searches = this.currentSubTab.searches; // 当前标签页的搜索项
    this.buildShow(this.searches);

    // 构建参数
    this.currentParams = this.buildParams(this.currentTab.params);
    if (this.currentTab.post_url === '') {
      // 固定值
      this.listInfo = [];
      this.pageConfig.total = 0;
      return;
    }
    this.resetSelectedInfo();
    this.getList(this.currentParams);
  }

  getList(params: any) {
    this.xn.loading.open();
    this.xn.avenger.post(this.currentTab.post_url, params)
      .subscribe(x => {
        if (x.data && x.data.data && x.data.data.length) {
          this.listInfo = x.data.data;
          this.selectedItems = [];
          this.allReceivables = x.data.receivable ? x.data.receivable : 0;
          this.allPayableAmounts = x.data.changePrice ? x.data.changePrice : 0;
          if (x.data.recordsTotal === undefined) {
            this.pageConfig.total = x.data.count;
          } else {
            this.pageConfig.total = x.data.recordsTotal;
          }
        } else if (x.data && x.data.lists && x.data.lists.length) {
          this.selectedItems = [];
          this.listInfo = x.data.lists;
          this.allReceivables = x.data.receivable ? x.data.receivable : 0;
          this.allPayableAmounts = x.data.changePrice ? x.data.changePrice : 0;
          this.pageConfig.total = x.data.count;
        } else {
          // 固定值
          this.selectedItems = [];
          this.listInfo = [];
          this.resetAllTradeInfo();
          this.pageConfig.total = 0;
        }
      }, () => {
        // 固定值
        this.listInfo = [];
        this.pageConfig.total = 0;
      }, () => {
        this.xn.loading.close();
      });

  }

  // 审批放款进度查看
  watchApproval() {
    this.xn.avenger.post2('/jd_blh/approval_progress', {}).subscribe(data => {
      if (data.ret !== 0) {
        if (this.subDefaultValue === SubTabValue.SPECIAL) {
          this.cancelSpecial(this.subDefaultValue);
        } else {
          this.getList(this.currentParams);
        }
      } else {
        if (data.data.isCompleted === true) {
          if (this.subDefaultValue === SubTabValue.SPECIAL) {
            this.cancelSpecial(this.subDefaultValue);
          } else if (this.defaultValue !== TabValue.First) {
            this.getList(this.currentParams);
          }
          this.watchApprovalMsg = '';

        } else if (data.data.isCompleted === false) {
          setTimeout(() => {
            this.watchApproval();
          }, 5000);
          this.watchApprovalMsg = `请求正在进行中，其中总审批数据${data.data.total},
                            已完成${data.data.completedCount},未完成${data.data.unfinishedCount}`;
        }
      }
    });
  }

  // 推送数据进度查看
  pushApproval() {
    const that = this;
    this.xn.avenger.post2('/jd_blh/push_progress', {}).subscribe(data => {
      if (data.ret !== 0) {
        this.pushApprovalMsg = ``;
      } else {
        if (data.data.isCompleted === true) {
          this.getList(that.currentParams);
          this.pushApprovalMsg = ``;
        } else if (data.data.isCompleted === false) {
          this.pushApprovalMsg = `请求正在进行中，其中总推送数据${data.data.total},
                            已完成${data.data.completedCount},未完成${data.data.unfinishedCount}`;
          setTimeout(() => {
            this.pushApproval();
          }, 5000);
        }
      }
    });
  }

  /**
   *  搜索,默认加载第一页
   */
  public searchMsg() {
    this.resetSelectedInfo();
    this.resetAllTradeInfo();
    this.onPage();
  }

  /**
   * 重置
   */
  public reset() {
    this.resetSelectedInfo();
    this.resetAllTradeInfo();
    for (const key in this.arrObjs) {
      if (this.arrObjs.hasOwnProperty(key)) {
        delete this.arrObjs[key];
      }
    }
    this.buildCondition(this.searches);
    this.searchMsg();
  }

  /**
   *  列表头样式
   * @param paramsKey string
   */
  public onSortClass(paramsKey: string): string {
    if (paramsKey === this.sorting) {
      return 'sorting_' + this.naming;
    } else {
      return 'sorting';
    }
  }

  /**
   *  按当前列排序
   * @param sort string
   */
  public onSort(sort: string) {
    if (this.sorting === sort) {
      this.naming = this.naming === SortType.DESC ? SortType.ASC : SortType.DESC;
    } else {
      this.sorting = sort;
      this.naming = SortType.ASC;
    }
    this.onPage();
  }

  public cancelSpecial(subTabValue: SubTabValue) {
    this.resetSelectedInfo();
    this.listInfo = [];
    this.naming = '';
    this.sorting = '';
    const find = this.tabConfig.tabList.find(tab => tab.value === this.defaultValue);
    this.currentTab = !!find ? find : new TabListOutputModel();
    // 子页面配置
    const subFind = this.currentTab.subTabList.find(sub => sub.value === SubTabValue.SPECIAL);
    this.currentSubTab = !!subFind ? subFind : new SubTabListOutputModel();
    this.heads = CommUtils.getListFields(this.currentSubTab.headText);
    this.searches = this.currentSubTab.searches; // 当前标签页的搜索项
    this.buildShow(this.searches);
    const params = this.buildParams(10);
    this.xn.loading.open();
    this.xn.avenger.post('/aprloan/approval/list', params)
      .subscribe(x => {
        this.resetSelectedInfo();
        if (x.data) {
          if (x.data && x.data.data && x.data.data.length) {
            this.listInfo = x.data.data;
            this.allReceivables = x.data.receivable ? x.data.receivable : 0;
            this.allPayableAmounts = x.data.changePrice ? x.data.changePrice : 0;
            if (x.data.recordsTotal === undefined) {
              this.pageConfig.total = x.data.count;
            } else {
              this.pageConfig.total = x.data.recordsTotal;
            }
          } else {
            this.listInfo = [];
            this.resetAllTradeInfo();
            this.pageConfig.total = 0;
          }
        }
        this.xn.loading.close();
        this.subDefaultValue = subTabValue;
      });
  }

  /**
   * 计算表格合并项
   * currentSubTab.headText.length + 可选择1 + 序号1 + 行操作+1
   */
  public calcAttrColspan(): number {
    let nums: number = this.currentSubTab.headText.length + 1;
    const boolArray = [this.currentSubTab.canChecked,
      this.currentSubTab.edit && this.currentSubTab.edit.rowButtons && this.currentSubTab.edit.rowButtons.length > 0];
    nums += boolArray.filter(arr => arr === true).length;
    return nums;
  }

  /**
   *  判断列表项是否全部选中
   */
  public isAllChecked(): boolean {
    return !(this.listInfo.some(x => !x.checked || x.checked && x.checked === false) || this.listInfo.length === 0);
  }

  /**
   *  全选
   */
  public checkAll() {
    if (!this.isAllChecked()) {
      this.listInfo.forEach(item => item.checked = true);
      this.selectedItems = XnUtils.distinctArray2([...this.selectedItems, ...this.listInfo], 'mainFlowId');
      this.selectedReceivables = 0;
      this.selectedPayableAmounts = 0;
      this.selectedItems.forEach(item => {
        this.selectedReceivables = Number((this.selectedReceivables + item.receivable).toFixed(2)); // 勾选交易总额
        this.selectedPayableAmounts = Number((this.selectedPayableAmounts + (item.changePrice ? item.changePrice : 0)).toFixed(2));
      });
    } else {
      this.listInfo.forEach(item => item.checked = false);
      this.resetSelectedInfo();
    }
  }

  /**
   * 单选
   * @param paramItem any
   * @param index any
   */
  public singleChecked(paramItem, index) {

    if (paramItem.checked && paramItem.checked === true) {
      paramItem.checked = false;
      this.selectedItems = this.selectedItems.filter((x: any) => x.mainFlowId !== paramItem.mainFlowId);
      this.selectedReceivables = Number((this.selectedReceivables - paramItem.receivable).toFixed(2)); // 勾选交易总额
      this.selectedPayableAmounts = Number((this.selectedPayableAmounts - (paramItem.changePrice ? paramItem.changePrice : 0)).toFixed(2));
    } else {
      paramItem.checked = true;
      this.selectedItems.push(paramItem);
      this.selectedItems = XnUtils.distinctArray2(this.selectedItems, 'mainFlowId'); // 去除相同的项
      this.selectedReceivables = Number((this.selectedReceivables + paramItem.receivable).toFixed(2)); // 勾选交易总额
      this.selectedPayableAmounts = Number((this.selectedPayableAmounts + (paramItem.changePrice ? paramItem.changePrice : 0)).toFixed(2));
    }

  }

  /**
   *  查看合同，只读
   */
  public showContract(paramContractInfo, type: string, proxy: number) {
    if ((proxy === IsProxyDef.CDR || proxy === IsProxyDef.VANKE_ABS) && type !== 'receivetable') {
      this.viewModal = DragonPdfSignModalComponent;
    } else if (proxy === IsProxyDef.AVENGER || type === 'receivetable') {
      this.viewModal = AvengerPdfSignModalComponent;
    } else {
      this.viewModal = PdfSignModalComponent;
    }
    const params = Object.assign({}, paramContractInfo, {readonly: true});
    XnModalUtils.openInViewContainer(this.xn, this.vcr, this.viewModal, params).subscribe();
  }

  /**
   *  查看更多发票
   */
  public viewMore(paramItem) {
    if (typeof paramItem === 'string') {
      paramItem = JSON.parse(paramItem);
    }
    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      InvoiceDataViewModalComponent,
      paramItem
    ).subscribe();
  }

  /**
   *  查看文件信息
   */
  public viewFiles(paramFile) {
    XnModalUtils.openInViewContainer(this.xn, this.vcr, FileViewModalComponent, paramFile).subscribe();
  }

  // 查看付款确认书
  viewMFiles(paramFile, proxy: number) {
    let params;
    if (proxy === IsProxyDef.CDR || proxy === IsProxyDef.VANKE_ABS) {
      this.viewModal = DragonMfilesViewModalComponent;
      params = JSON.parse(paramFile);
    } else if (proxy === IsProxyDef.AVENGER) {
      params = [{file: paramFile}];
      this.viewModal = AvengerMfilesViewModalComponent;
    } else {
      this.viewModal = FileViewModalComponent;
    }

    XnModalUtils.openInViewContainer(this.xn, this.vcr, this.viewModal, params).subscribe();
  }

  /**
   *  格式化数据
   */
  public jsonTransForm(paramData) {
    return JsonTransForm(paramData);
  }

  /**
   *  判断数据是否长度大于显示最大值
   */
  public arrayLength(paramFileInfos: any) {
    if (!paramFileInfos) { return false; }
    const obj =
            typeof paramFileInfos === 'string'
              ? JSON.parse(paramFileInfos)
              : JSON.parse(JSON.stringify(paramFileInfos));
    return !!obj && obj.length > 2;
  }

  /**
   *  表头按钮组事件
   * @param paramBtnOperate ButtonConfigModel
   */
  public handleHeadClick(paramBtnOperate: ButtonConfigModel) {
    if (!['download_approval_list', 'system_loan_receipt'].includes(paramBtnOperate.operate) && this.selectedItems.length === 0) {
      this.xn.msgBox.open(false, '请选择交易');
      return;
    }
    if (paramBtnOperate.operate === 'initiate_examination') {

      const list = this.selectedItems.map(item => {
        const {
                mainFlowId,
                headquarters,
                pdfProjectFiles,
                payCompareStatus,
                stopStatus,
                changeStatus,
                isSupplierSign,
                isUpstreamSign,
              } = item;
        return {
          mainFlowId,
          headquarters,
          pdfProjectFiles,
          payCompareStatus,
          stopStatus,
          changeStatus,
          isSupplierSign,
          isUpstreamSign,
        };
      });
      this.xn.avenger.post(paramBtnOperate.post_url, {list}).subscribe(() => {
        if (this.subDefaultValue === SubTabValue.SPECIAL) {
          this.subDefaultValue = SubTabValue.DOING;
          this.handleSubTabChange(SubTabValue.SPECIAL);
        } else {
          this.getList(this.currentParams);
          this.localStorageService.setCacheValue('isstartStatus', {startStatus: true});
          clearInterval(this.timed);
          this.watchApproval();
        }
      });


    } else if (paramBtnOperate.operate === 'approval_ok') { // 审批成功
      const mainflowIdlist = [];
      this.selectedItems.map(item => {
        item.creditStatus = ApprovalStatus.Agree;
        item.financeStatus = ApprovalStatus.Agree;
        mainflowIdlist.push(item.mainFlowId);
      });
      this.xn.avenger.post(paramBtnOperate.post_url, {
        type: ApprovalAction.Agree,
        mainFlowIds: mainflowIdlist
      })
        .subscribe(x => {
          if (x.data) {
            this.initData(TabValue.Sixth);
          }
        });
    } else if (paramBtnOperate.operate === 'approval_reject') {  // 审批拒绝
      const mainflowIdlist = [];
      this.selectedItems.map(item => {
        item.creditStatus = ApprovalStatus.Veto;
        item.financeStatus = ApprovalStatus.Veto;
        mainflowIdlist.push(item.mainFlowId);
      });
      this.xn.avenger.post(paramBtnOperate.post_url, {
        type: ApprovalAction.Reject,
        mainFlowIds: mainflowIdlist
      })
        .subscribe(x => {
          if (x.data) {
            this.initData(TabValue.Sixth);
          }
        });
    } else if (paramBtnOperate.operate === 'sign_contract') { // 批量签署合同
      this.batchSign(paramBtnOperate);
    } else if (paramBtnOperate.operate === 'loan_ok') {      // 放款成功
      const params: EditParamInputModel = {
        title: '放款信息',
        checker: [
          {
            title: '放款时间',
            checkerId: 'loanDate',
            type: 'date4',
            validators: {},
          },
        ] as CheckersOutputModel[],
        buttons: ['取消', '确定']
      };
      XnModalUtils.openInViewContainer(this.xn, this.vcr, EditModalComponent, params).subscribe(v => {
        if (v === null) {

          return;
        } else {
          this.loanDate = v.loanDate;
          this.xn.avenger.post(paramBtnOperate.post_url,
            {mainFlowIds: this.selectedItems.map((x: any) => x.mainFlowId), loanDate: this.loanDate, type: 1})
            .subscribe(() => {
              this.initData(TabValue.Fourth);
            });
        }
      });

    } else if (paramBtnOperate.operate === 'loan_fail') {        // 放款失败
      this.xn.avenger.post(paramBtnOperate.post_url,
        {mainFlowIds: this.selectedItems.map((x: any) => x.mainFlowId), type: 0})
        .subscribe(() => {
          this.initData(TabValue.Fourth);
        });
    } else if (paramBtnOperate.operate === 'approval_again') {   // 重新审批
      this.xn.router.navigate([`/console/record/avenger/new/sub_approval_again_530`],
        {
          queryParams: {
            id: 'sub_approval_again_530',
            relate: 'mainIds',
            relateValue: this.selectedItems.map((x: any) => x.mainFlowId),
          }
        });
    } else if (paramBtnOperate.operate === 'download_approval_list') {// 导出清单
      this.downloadApprovallist(paramBtnOperate);
    } else if (paramBtnOperate.operate === 'accountDownload') {
      this.xn.avenger.download('/aprloan/approval/accountDownload',
        {
          mainFlowIds: this.selectedItems.map((x: any) => x.mainFlowId),
          isProxy: this.listInfo.map((x: any) => x.isProxy)[0]
        })
        .subscribe((x: any) => {
          this.xn.api.save(x._body, '会计下载表格.xlsx');
          this.selectedItems.forEach(y => {
            y.kjDownTimes += 1;
          });
        });


    } else if (paramBtnOperate.operate === 'loadFinancing') {
      const mainFlowIds = this.selectedItems.map((x: any) => x.mainFlowId);
      const onemainFlowIds = mainFlowIds[0].split('_');
      const firstSign = onemainFlowIds[onemainFlowIds.length - 1];
      mainFlowIds.forEach(x => {
        if (x.indexOf(firstSign) < 0) {
          this.xn.msgBox.open(false, '请选择同种类型的交易');
          return;
        }

      });
      const params = {
        title: '出纳下载表格',
        checker: [
          {
            title: '请选择下载模板',
            checkerId: 'cashierDown',
            type: 'radio',
            options: {ref: 'cashierDownTemplate'},
            required: 1,
          },

        ]
      };
      XnModalUtils.openInViewContainer(this.xn, this.vcr, EditModalComponent, params).subscribe(v => {
        if (v === null) {
          return;
        }
        if (v.cashierDown === IsCashierType.Wei_fang) {
          this.xn.avenger.download('/aprloan/approval/loadFinancingWf',
            {
              mainFlowIds: this.selectedItems.map((x: any) => x.mainFlowId),
              isProxy: this.selectedItems[0].isProxy
            }).subscribe((x: any) => {
            this.xn.api.save(x._body, '出纳下载表格(潍坊模板).xlsx');
            this.selectedItems.forEach(y => {
              y.cnDownTimes += 1;
            });
          });
        } else if (v.cashierDown === IsCashierType.Pu_fa) {
          this.xn.avenger.download('/aprloan/approval/loadFinancingPf',
            {
              mainFlowIds: this.selectedItems.map((x: any) => x.mainFlowId),
              isProxy: this.selectedItems[0].isProxy
            }).subscribe((x: any) => {
            this.xn.api.save(x._body, '出纳下载表格(浦发模板).xlsx');
            this.selectedItems.forEach(y => {
              y.cnDownTimes += 1;
            });
          });
        } else {
          this.xn.avenger.download('/aprloan/approval/loadFinancing',
            {
              mainFlowIds: this.selectedItems.map((x: any) => x.mainFlowId),
              isProxy: this.selectedItems[0].isProxy
            }).subscribe((x: any) => {
            this.xn.api.save(x._body, '出纳下载表格(工行模板).xlsx');
            this.selectedItems.forEach(y => {
              y.cnDownTimes += 1;
            });
          });
        }
      });

    } else if (paramBtnOperate.operate === 'finish_sign_contract') {
      this.finishSignContract(paramBtnOperate);

    } else if (paramBtnOperate.operate === 'person_return_upload' || paramBtnOperate.operate === 'system_loan_receipt') {
      this.getPersonreturnList(paramBtnOperate.operate);
    } else if (paramBtnOperate.operate === 'finance_approval_ok' || paramBtnOperate.operate === 'finance_approval_fail') {
      const type = paramBtnOperate.operate === 'finance_approval_ok' ? 1 : 0;
      const mainFlowId = this.selectedItems.map(item => item.mainFlowId);
      this.xn.avenger.post(paramBtnOperate.post_url, {type, mainFlowIds: mainFlowId})
        .subscribe(x => {
          if (x.data) {
            this.initData(TabValue.Seventh);
          }
        });
    }
  }

  // 人工付款回单上传
  getPersonreturnList(type: string) {
    const datainfos = type === 'person_return_upload' ? this.selectedItems : [];
    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      PersonUploadloanReceiptComponent,
      {datainfo: datainfos}
    ).subscribe((x) => {
      if (x.action === 'ok') {
        this.initData(TabValue.Fifth);
      }
    });
  }

  /**
   * 行按钮组事件
   * @param paramItem 当前行数据
   * @param paramBtnOperate 按钮操作配置
   * @param i 下标
   */
  public handleRowClick(paramItem, paramBtnOperate: ButtonConfigModel, i: number) {
    paramBtnOperate.click(this.base, paramItem, this.xn, this.hwModeService);
  }

  /**
   * 构建搜索项
   */
  private buildShow(searches) {
    this.shows = [];
    this.onUrlData();
    this.buildCondition(searches);
  }

  /**
   * 批量签署合同
   */
  private batchSign(btn) {
    let isOk1 = false;
    let alert1 = '';
    const isFactoringSign = this.selectedItems.map(x => ({
      isFactoringSign: x.isFactoringSign,
      mainFlowId: x.mainFlowId
    }));
    isFactoringSign.forEach(x => {
      // 保理商已签署合同
      if (x.isFactoringSign === YesOrNo.Yes) {
        alert1 += x.mainFlowId + '、';
        isOk1 = true;
      }
    });
    if (isOk1) {
      this.xn.msgBox.open(false, `此${alert1}的保理商已签署合同`);
      return;
    }
    const mainFlowIds = this.selectedItems.map((x: any) => x.mainFlowId);
    const onemainFlowIds = mainFlowIds[0].split('_');
    const firstSign = onemainFlowIds[onemainFlowIds.length - 1];
    mainFlowIds.forEach(x => {
      if (x.indexOf(firstSign) < 0) {
        this.xn.msgBox.open(false, '请选择同种类型的交易');
        return;
      }
    });

    this.modal = DragonFinancingContractModalComponent;

    this.xn.avenger.post(btn.post_url, {mainFlowIds})
      .subscribe(con => {
        const cons = JSON.parse(con.data.contracts);
        cons.isProxy = this.isProxy;
        cons.forEach(x => {
          if (!x.config) {
            x.config = {text: ''};
          }

          if (x.label.includes('国内无追索权商业保理合同')) {
            x.config.text = '乙方（保理商、受让人）数字签名';
          } else if (x.label.includes('应收账款转让协议书')) {
            x.config.text = '乙方（受让方）';
          } else if (x.label.includes('应收账款转让登记协议')) {
            x.config.text = '乙方（受让方）';
          } else if (x.label.includes('国内商业保理合同(三方协议)') || x.label.includes('应收账款转让清单')) {
            x.config.text = '甲方(电子签章、数字签名)';
          } else if (x.label.includes('国内商业保理合同-线上版（新增邮储版）')) {
            x.config.text = '甲方(电子签章、数字签名)';
          } else if (x.label === '保理合同-国寿') {
            x.config.text = '保理商（盖章）';

          } else if (x.label.includes('邮储')) {
            x.config.text = '保理商： （公章）';
          } else if (x.label.includes('应收账款转让通知书（适用于供应商向债务人出具）') || x.label.includes('应收账款转让通知书（适用于供应商向万科股份出具）')) {
            x.config.text = '供应商/债权人：';
          } else if (x.label.includes('国内商业保理合同(万科版-通力电梯修订版)')) {
            x.config.text = '甲方授权代表：';
          } else {
            x.config.text = '（盖章）';
          }
        });
        XnModalUtils.openInViewContainer(this.xn, this.vcr, this.modal, cons).subscribe(x => {
          if (x === 'ok') {
            // 保存合同信息
            this.SaveContract();
          }
        });
      });
  }

  /**
   *
   * @param paramsValue 进入资产池  --资产池名称
   */
  enterCapitalPool(paramsValue) {
    const params = {
      mainFlowId: paramsValue
    };
    this.xn.dragon.post('/trade/get_mainflowid_pool_info', params).subscribe(x => {
      if (x.ret === 0 && x.data.capitalPoolId !== '') {

        this.xn.router.navigate(['/abs-gj/assets-management/capital-pool'], {
          queryParams: {
            title: `项目管理>ABS储架项目>${x.data.projectName}-${x.data.headquarters}`,
            projectId: x.data.project_manage_id,
            headquarters: x.data.headquarters,
            fitProject: x.data.projectName,
            capitalPoolId: x.data.capitalPoolId,
            capitalPoolName: x.data.capitalPoolName,
            isMachineenter: true,
          }
        });
      } else if (x.ret === 0 && !x.data.capitalPoolId) {
        this.onPage(this.pageConfig);
      }
    });
  }

  // 完成签署，推送数据
  finishSignContract(paramBtnOperate: ButtonConfigModel) {
    let isOk1 = false;
    let isOk2 = false;
    let alert1 = '';
    let alert2 = '';
    const isFactoringSign = this.selectedItems.map(x => ({
      isFactoringSign: x.isFactoringSign,
      mainFlowId: x.mainFlowId, freezeTwo: x.freezeTwo
    }));
    isFactoringSign.forEach(x => {
      // 保理商未签署合同
      if (x.isFactoringSign === YesOrNo.No) {
        alert1 += x.mainFlowId + '、';
        isOk1 = true;
      }
      // 交易被冻结
      if (x.freezeTwo === FreezeStatus.Frozen) {
        alert2 += x.mainFlowId + '、';
        isOk2 = true;
      }
    });
    if (isOk2) {
      this.xn.msgBox.open(false, `此${alert1}的交易被冻结，不可推送数据`);
      return;
    }
    if (isOk1) {
      this.xn.msgBox.open(false, `此${alert1}的保理商未签署合同，不可推送数据`);
      return;
    }
    this.approvalLimit(paramBtnOperate);
  }

  // 发起财务审批时，限制条件
  approvalLimit(paramBtnOperate: ButtonConfigModel) {
    const params: EditParamInputModel = {
      title: '选择起息日',
      checker: [
        {
          title: '起息时间',
          checkerId: 'valueDate',
          type: 'date4',
          validators: {},
          required: 1,
          options: {},
          value: '',
        },
        {
          title: '审批注释',
          checkerId: 'memo',
          type: 'textarea',
          validators: {},
          required: 1,
          options: {},
          value: '',
        },
      ] as CheckersOutputModel[],
      buttons: ['取消', '确定']
    };
    XnModalUtils.openInViewContainer(this.xn, this.vcr, EditModalComponent, params).subscribe(v => {
      if (v === null) {
        return;
      } else {
        this.valueDate = v.valueDate;   // 起息日时间
        this.approvalMemo = v.memo;
        const list = this.selectedItems.map(item => item.mainFlowId);
        this.xn.avenger.post(paramBtnOperate.post_url, {
          approvalMemo: this.approvalMemo,
          valueDate: this.valueDate,
          mainFlowIds: list
        }).subscribe(() => {
          this.initData(TabValue.Third);
          this.localStorageService.setCacheValue('ispushStatus', {startStatus: true});
          clearInterval(this.timedpush);
          this.pushApproval();
        });
      }
    });
  }

  private SaveContract() {
    // 保存合同信息
    this.xn.avenger.post('/jd_blh/signOver', {mainFlowIds: this.selectedItems.map(main => main.mainFlowId)})
      .subscribe((temp: any) => {
        if (temp.ret === 0) {
          this.resetSelectedInfo();
          this.onPage(this.pageConfig);
        }

      });
  }

  /**
   * 搜索项值格式化
   */
  private buildCondition(searches) {
    const tmpTime = {
      beginTime: this.beginTime,
      endTime: this.endTime
    };
    const objList = [];
    this.timeId = XnUtils.deepClone(this.searches.filter(v => v.type === 'quantum').map(v => v.checkerId));
    for (const item of searches) {
      const obj = {} as any;
      obj.title = item.title;
      obj.checkerId = item.checkerId;
      obj.required = false;
      obj.type = item.type;
      obj.sortOrder = item.sortOrder;
      obj.options = item.options;
      if (item.checkerId === this.timeId[0]) {
        obj.value = JSON.stringify(tmpTime);
      } else {
        obj.value = this.arrObjs[item.checkerId];
      }
      objList.push(obj);
    }
    this.shows = XnUtils.deepClone(objList.sort((a, b) => a.sortOrder - b.sortOrder));
    XnFormUtils.buildSelectOptions(this.shows);
    this.buildChecker(this.shows);
    this.searchForm = XnFormUtils.buildFormGroup(this.shows);
    const time = this.searches.filter(v => v.type === 'quantum');
    const timeCheckId = time[0] && time[0].checkerId;
    this.nowTimeCheckId = timeCheckId;
    this.searchForm.valueChanges.subscribe((v) => {
      // 时间段
      const changeId = v[timeCheckId];
      delete v[timeCheckId];
      if (changeId !== '' && this.nowTimeCheckId) {
        const paramsTime = JSON.parse(changeId);
        const beginTime = parseInt(paramsTime.beginTime, 10);
        const endTime = parseInt(paramsTime.endTime, 10);
        // 保存每次的时间值。
        this.preChangeTime.unshift({begin: beginTime, end: endTime});
        // 默认创建时间
        this.beginTime = beginTime;
        this.endTime = endTime;
        if (this.preChangeTime.length > 1) {
          if (this.preChangeTime[1].begin === this.beginTime &&
            this.preChangeTime[1].end === this.endTime) {
          } else {
            this.beginTime = beginTime;
            this.endTime = endTime;
            this.onPage();
          }
        }
      }
      const arrObj = {} as any;
      for (const item in v) {
        if (v.hasOwnProperty(item) && v[item] !== '') {
          const searchFilter = this.searches.filter(v1 => v1 && v1.base === 'number')
            .map(c => c.checkerId);
          if (searchFilter.indexOf(item) >= 0) {
            arrObj[item] = Number(v[item]);
          } else {
            arrObj[item] = v[item];
          }
        }
      }
      this.arrObjs = XnUtils.deepClone(arrObj);
      this.onUrlData();
    });
  }

  /**
   * 构建列表请求参数
   */
  private buildParams(addparams: number) {
    const params: any = {
      start: this.pageConfig.first,
      length: this.pageConfig.pageSize,
      startTime: this.beginTime,
      endTime: this.endTime,
    };

    if (addparams !== undefined) {
      params.flag = addparams;
    }
    // 排序处理
    if (this.sorting && this.naming) {
      params.order = [this.sorting + ' ' + this.naming];
    }
    // 搜索处理
    if (this.searches.length > 0) {
      for (const search of this.searches) {
        if (!XnUtils.isEmpty(this.arrObjs[search.checkerId])) {
          if (search.checkerId === 'cnDownTimes' || search.checkerId === 'kjDownTimes') {
            params[search.checkerId] = Number(this.arrObjs[search.checkerId]);
          } else if (search.checkerId === 'startTime' || search.checkerId === 'createTime') {
            const date = JSON.parse(this.arrObjs[search.checkerId]);
            params.startTime = date.beginTime;
            params.endTime = date.endTime;
          } else if (search.checkerId === 'headPreDate') {
            const date = JSON.parse(this.arrObjs[search.checkerId]);
            params.headPreDateStart = date.beginTime;
            params.headPreDateEnd = date.endTime;
          } else if (search.checkerId === 'realLoanDate') {
            const date = JSON.parse(this.arrObjs[search.checkerId]);
            params.realLoanDateStart = date.beginTime;
            params.realLoanDateEnd = date.endTime;
          } else if (search.checkerId === 'type') {
            const obj = JSON.parse(this.arrObjs[search.checkerId]);
            params.type = Number(obj.proxy);
            if (obj.status !== undefined) {
              params.selectBank = Number(obj.status);

            }
          } else if (search.checkerId === 'valueDate') {
            const date = JSON.parse(this.arrObjs[search.checkerId]);
            params.valueStart = date.beginTime;
            params.valueEnd = date.endTime;
          } else if (search.checkerId === 'capitalPoolName') {
            const info = JSON.parse(this.arrObjs[search.checkerId]);
            if (info.status === String(PoolName.Not)) {
              params.capitalPoolStatus = PoolName.Not;
            } else {
              params.capitalPoolStatus = PoolName.Have;
              params.capitalPoolName = info.text;
            }
          } else if (search.checkerId === 'isPriorityLoanDate') {
            const priorityLoanDate = JSON.parse(this.arrObjs[search.checkerId]);
            if (priorityLoanDate.isPriorityLoanDate === 0) {
              params.isPriorityLoanDate = priorityLoanDate.isPriorityLoanDate;
            } else if (priorityLoanDate.isPriorityLoanDate > 0) {
              params.priorityLoanDateStart = priorityLoanDate.priorityLoanDateStart;
              params.priorityLoanDateEnd = priorityLoanDate.priorityLoanDateEnd;
              params.isPriorityLoanDate = priorityLoanDate.isPriorityLoanDate;
            }
          } else if (search.checkerId === 'changePrice') { // 转让价款过滤
            let changePrice = '';
            this.arrObjs[search.checkerId].split(',').forEach(v => {
              changePrice += v;
            });
            params.changePrice = Number(changePrice);
          } else {
            params[search.checkerId] = this.arrObjs[search.checkerId];
          }

        }
      }
    }
    // 列表子标签页，构建参数 ,当且子标签状态有大于2中时,添加状态参数
    if (this.currentTab.subTabList.length >= 2) {
      params.status = this.subTabEnum[this.subDefaultValue];
    }
    params.isProxy = this.isProxy;
    return params;
  }

  private buildChecker(stepRows) {
    for (const row of stepRows) {
      XnFormUtils.convertChecker(row);
    }
  }

  /**
   * 回退操作，路由存储
   */
  private onUrlData() {
    const urlData = this.xn.user.getUrlData(this.xn.router.url);
    if (urlData && urlData.pop) {
      this.pageConfig = urlData.data.pageConfig || this.pageConfig;
      this.beginTime = urlData.data.beginTime || this.beginTime;
      this.endTime = urlData.data.endTime || this.endTime;
      this.arrObjs = urlData.data.arrObjs || this.arrObjs;
      this.defaultValue = urlData.data.defaultValue || this.defaultValue;
      this.subDefaultValue = urlData.data.subDefaultValue || this.subDefaultValue;
    } else {
      this.xn.user.setUrlData(this.xn.router.url, {
        pageConfig: this.pageConfig,
        beginTime: this.beginTime,
        endTime: this.endTime,
        arrObjs: this.arrObjs,
        defaultValue: this.defaultValue,
        subDefaultValue: this.subDefaultValue
      });
    }
  }

  // 弹出实收费用详情窗口
  openInterest(item: any) {
    const checkers = [
      {
        title: '',
        checkerId: 'contractNum',
        type: 'interestRate',
        required: false,
        options: {readonly: true},
        value: item
      },
    ];
    const params = {
      checker: checkers,
      title: '实收费用',
      buttons: ['关闭'],

    };
    XnModalUtils.openInViewContainer(this.xn, this.vcr, EditModalComponent, params).subscribe();
  }

  // 打开当前信贷信息窗口
  openApproval(Paramitem: any) {
    this.xn.avenger.post('/jd_blh/approval_info', {mainFlowId: Paramitem.mainFlowId}).subscribe(x => {
      if (x.ret === 0) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, AvengerIrecordComponent, x.data)
          .subscribe();
      }
    });
  }

  // 审批放款弹出费用情况
  openFrees(Paramitem: any) {
    this.xn.avenger.post('/jd/fee_info', {mainFlowId: Paramitem.mainFlowId}).subscribe(x => {
      if (x.ret === 0) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, AvengerapprovalfreeStyleComponent, x.data)
          .subscribe();
      }
    });

  }

  // 变更记录弹窗

  openChangedetail(paramItem: any) {
    if (paramItem.ischangeAccount === 0) {
      return;
    }
    this.xn.avenger.post('/aprloan/approval/changeList', {mainFlowId: paramItem.mainFlowId}).subscribe(x => {
      if (x.ret === 0) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, AvengerChangeAccountComponent, x.data.data)
          .subscribe();
      }
    });


  }

  // 打开付确信息比对结果弹窗
  openResultcompare(paramItem: any) {
    this.xn.avenger.post('/aprloan/approval/fkqrsList', {mainFlowId: paramItem.mainFlowId}).subscribe(x => {
      if (x.ret === 0) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, AvengerResultCompareComponent, x.data.data)
          .subscribe();
      }
    });

  }

  // 导出清单

  downloadApprovallist(paramItem: any) {
    const params = {hasSelect: !!this.selectedItems && this.selectedItems.length > 0};
    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      AvengerExportListModalComponent,
      params
    ).subscribe(x => {
      if (x === '') {
        return;
      }
      this.xn.loading.open();
      const param = {
        flag: paramItem.flag,
        mainFlowIds: [],
        type: '',
      };
      if (x.exportList === DownloadRange.All) {
        param.type = DownloadRange.All;
        param.mainFlowIds = [];
      } else if (x.exportList === DownloadRange.Selected) {
        param.type = DownloadRange.Selected;
        param.mainFlowIds = this.selectedItems.map(c => c.mainFlowId);
      }
      this.xn.api.download(paramItem.post_url,
        param)
        .subscribe((con: any) => {
          this.xn.api.save(con._body, '审批放款清单.xlsx');
          this.xn.loading.close();
        });
    });
  }
}

/** 审批动作 */
enum ApprovalAction {
  /** 同意 */
  Agree  = 1,
  /** 拒绝 */
  Reject = 0,
}

/** 搜索项【资产池】下拉选择 */
enum PoolName {
  /** 有 */
  Have = 1,
  /** 无 */
  Not  = 0,
}
