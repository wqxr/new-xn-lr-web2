/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\abs-gj\src\lib\pages\assets-management\dragon-project-manager\dragon-capital-pool\dragon-capital-pool.component.ts
 * @summary：dragon-capital-pool.component.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-11-25
 ***************************************************************************/
import { XnModalUtils } from '../../../../../../../../shared/src/lib/common/xn-modal-utils';
import {
  ButtonConfigModel,
  SubTabListOutputModel,
  TabConfigModel,
  TabListOutputModel
} from '../../../../../../../../shared/src/lib/config/list-config-model';
import {
  DragonFinancingContractModalComponent
} from '../../../../../../../../shared/src/lib/public/dragon-vanke/modal/dragon-asign-contract.modal';
import { FormGroup } from '@angular/forms';
import { SelectContent } from '../../../../../../../../shared/src/lib/common/dragon-vanke/emus';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewContainerRef } from '@angular/core';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import CommUtils from '../../../../../../../../shared/src/lib/public/component/comm-utils';
import { LocalStorageService } from '../../../../../../../../shared/src/lib/services/local-storage.service';
import {
  DragonPdfSignModalComponent
} from '../../../../../../../../shared/src/lib/public/dragon-vanke/modal/pdf-sign-modal.component';
import {
  DragonOcrEditModalComponent
} from '../../../../../../../../shared/src/lib/public/dragon-vanke/modal/dragon-ocr-edit-modal.component';
import ProjectManagerCapitalList from './capital-pool.config';
import { CheckersOutputModel } from '../../../../../../../../shared/src/lib/config/checkers';
import { JsonTransForm } from '../../../../../../../../shared/src/lib/public/pipe/xn-json.pipe';
import {
  VankeDeleteTransactionEditModalComponent
} from '../../../../../../../../shared/src/lib/public/dragon-vanke/modal/vanke-delete-transaction-modal.component';
import {
  CapitalPoolExportListModalComponent
} from '../../../../../../../../shared/src/lib/public/dragon-vanke/modal/capital-pool-export-list-modal.component';
import { EditParamInputModel } from '../project-manage.component';
import { Subject } from 'rxjs';
import {
  DragonMfilesViewModalComponent
} from '../../../../../../../../shared/src/lib/public/dragon-vanke/modal/mfiles-view-modal.component';
import { XnFormUtils } from '../../../../../../../../shared/src/lib/common/xn-form-utils';
import {
  VankeCapitalPoolGeneratingContractModalComponent
} from '../../../../../../../../shared/src/lib/public/dragon-vanke/modal/vanke-capitalPool-generate-contract.component';
import { XnService } from '../../../../../../../../shared/src/lib/services/xn.service';
import {
  CapitalChangeProcessModalComponent
} from '../../../../../../../../shared/src/lib/public/dragon-vanke/modal/capital-pool-change-process-modal.component';
import { BankManagementService } from '../../../../../../../../console/src/lib/bank-management/bank-mangement.service';
import { XnUtils } from '../../../../../../../../shared/src/lib/common/xn-utils';
import { CapitalType } from '../../../capital-pool/emus';
import {
  NewFileModalComponent
} from '../../../../../../../../shared/src/lib/public/dragon-vanke/modal/new-file-modal.component';
import {
  EditModalComponent
} from '../../../../../../../../shared/src/lib/public/dragon-vanke/modal/edit-modal.component';
import {
  SingleListParamInputModel,
  SingleSearchListModalComponent
} from '../../../../../../../../shared/src/lib/public/dragon-vanke/modal/single-searchList-modal.component';
import {
  Channel,
  CompanyName,
  DownloadRange,
  FlowId,
  FreezeStatus,
  IsProxyDef,
  LockStatus,
  SelectRange,
  SortType,
  SubTabValue,
  TabValue
} from '../../../../../../../../shared/src/lib/config/enum';
import { BrowserService } from 'libs/shared/src/lib/services/browser.service';
import { IPageConfig } from '../../../../interfaces';
import { GjDownloadModalComponent } from '../../../../components/download-modal/download-modal.component';

declare const moment: any;
declare const $: any;

@Component({
  selector: 'lib-capital-pool-gj',
  templateUrl: `./capital-pool.component.html`,
  styleUrls: ['./capital-pool.component.css']
})
export class GjProjectCapitalPoolComponent implements OnInit, AfterViewInit {

  constructor(
    private xn: XnService,
    private vcr: ViewContainerRef,
    private er: ElementRef,
    public bankManagementService: BankManagementService,
    private router: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private localStorageService: LocalStorageService,
    private browserService: BrowserService,
  ) {}

  tabConfig: any;  // 表格配置
  currentTab: any;   // 当前标签页tabList
  defaultValue = TabValue.First;

  pageConfig = {pageSize: 10, first: 0, total: 0, page: 1};

  shows: any[] = [];  // 搜索项
  form: FormGroup;   // 搜索项表单实例
  searches: any[] = []; // 面板搜索配置项项
  selectedItems: any[] = [];  // 选中的项

  displayShow = true;  // 搜索条件显示或隐藏

  arrObjs = {}; // 缓存后退的变量
  beginTime: any;
  endTime: any;
  timeId = [];
  nowTimeCheckId = '';
  preChangeTime: any[] = [];   // 上次搜索时间段

  downLoadList: any[] = [];  // 下载附件列表
  public listInfo: any[] = []; // 列表数据

  sorting = ''; // 表头排序
  naming = '';

  heads: any[];   // 表头配置
  title = '';  // 页面标题

  params = {   // 交易详情配置
    checker: [],
    title: '交易详情',
  };
  myOptions = {  // 交易详情配置
    'show-delay': 800,
    'hide-delay': 800,
    'max-width': '860px',
    placement: 'right',
  };
  private tooltip$ = new Subject<string>();

  headLeft = 0;   // 横向滚动
  public tradeStatusFlag = false;  // 标识资产池内交易是否有变动

  public currentSubTab: SubTabListOutputModel = new SubTabListOutputModel(); // 当前子标签页subTabList
  public subDefaultValue = SubTabValue.DOING; // 默认子标签页
  public formModule = 'dragon-input';   // 所属模块

  headquarters = ''; // 总部公司
  fitProject = ''; // 所选项目
  capitalPoolId: string;  // 资产池id
  capitalPoolName: string;  // 资产池名称
  public queryParams: any; // 路由数据
  public projectId: any; // 路由数据projectId

  public capitalSelecteds: any[]; // 资产池选中的项 的mainflowId集合
  isMachineenter = false;  // 是否从台账跳转过来

  // 统计信息
  sumReceive = 0;
  sumChangePrice = 0;
  selectSumReceive = 0;
  selectSumChangePrice = 0;

  productParams: any;  // 产品信息页面参数
  isProxy = IsProxyDef.CDR;
  /** 浏览器滚动条宽度，默认 8px */
  scrollbarWidth = 8;
  /** 判断是否数组 */
  judgeDataType = XnUtils.isArray;
  /** tab页类型参数映射 */
  TabTypeMap = new Map([
    [TabValue.First, 1],
    [TabValue.Third, 3],
    [TabValue.Fifth, 4],
  ]);
  TabValue = TabValue;
  LockStatus = LockStatus;

  /** 列表字段排序对应的请求参数 */
  listFieldOrderParam = new Map([
    ['mainFlowId', 1],
    ['projectCompany', 2],
    ['debtUnit', 3],
    ['projectSite', 4],
    ['debtSite', 5],
    ['receive', 6],
    ['discountRate', 7],
    ['flowId', 8],
    ['contractType', 9],
    ['isInvoiceFlag', 10],
    ['factoringEndDate', 11],
    ['surveyMan', 12],
    ['surveyStatus', 13],
    ['priorityLoanDate', 14],
    ['realLoanDate', 15],
    ['payConfirmId', 16],
  ]);

  ngOnInit(): void {
    this.router.queryParams.subscribe(x => {
      this.queryParams = {...x};
      this.title = x.title;
      this.headquarters = x.headquarters;
      this.fitProject = x.fitProject;
      this.capitalPoolId = x.capitalPoolId;
      this.capitalPoolName = x.capitalPoolName;
      this.projectId = x.projectId;
      this.isMachineenter = x.isMachineenter !== undefined;
    });
    this.router.data.subscribe(() => {
      const tabConfig = ProjectManagerCapitalList.getTabConfig(this.localStorageService, this.xn, 'cpaitalTadeList');
      this.tabConfig = !!tabConfig ? tabConfig : new TabConfigModel();
      this.initData(this.defaultValue);
    });

    this.tooltip$.pipe(
      debounceTime(300),   // 请求防抖 300毫秒
      distinctUntilChanged()  // 节流
    ).subscribe((param) => { this.viewDetailFunc(param); });
  }

  /**
   *  标签页，加载列表信息
   */
  public initData(tabValue: TabValue) {
    this.selectedItems = [];
    this.listInfo = [];
    this.naming = '';
    this.sorting = '';
    this.pageConfig = {pageSize: 10, first: 0, total: 0, page: 1};
    this.defaultValue = tabValue;
    this.subDefaultValue = SubTabValue.DOING;
    const find = this.tabConfig.tabList.find(tab => tab.value === this.defaultValue);
    this.currentTab = !!find ? find : new TabListOutputModel();
    // 子页面配置
    const subFind = this.currentTab.subTabList.find(sub => sub.value === this.subDefaultValue);
    this.currentSubTab = !!subFind ? subFind : new SubTabListOutputModel();
    this.fixSubTab();
    if (this.defaultValue === TabValue.Second) {
      this.getHeadorSearch(this.currentSubTab);
    } else if (this.defaultValue === TabValue.Fourth) {
      // 产品信息页面传值
      this.productParams = {
        capitalPoolId: this.capitalPoolId
      };
    } else {
      this.onPage();
    }
    this.tradeChanges();
  }

  /** 子标签配置调整 */
  fixSubTab() {
    if (this.defaultValue === TabValue.First) {
      // 删除 -> 基础资产tab页 - 右侧按钮 - 【其他】下拉按钮 - 【发起变更】按钮
      this.currentSubTab.edit.rightheadButtons = this.currentSubTab.edit.rightheadButtons.map(c => {
        if (c.operate === 'other_btn') {
          c.children = c.children.filter(d => d.operate !== 'start_change');
        }
        return c;
      });
    }
    if (this.defaultValue === TabValue.Second) {
      // 删除 -> 交易文件tab页 - 左侧按钮 - 【其他】下拉按钮
      // this.currentSubTab.edit.leftheadButtons = this.currentSubTab.edit.leftheadButtons.filter(c => {
      //   return c.operate !== 'other_btn';
      // });
    }
  }

  /** 重置所选交易统计信息 */
  resetSelectedInfo() {
    this.selectSumReceive = 0;
    this.selectSumChangePrice = 0;
    this.selectedItems = [];
  }

  /** 重置交易统计信息 */
  resetAllTradeInfo() {
    this.sumReceive = 0;
    this.sumChangePrice = 0;
  }

  public onPage(pageConfig: IPageConfig = {page: 1, first: 1, total: 0, pageSize: 10}, newCurrent?: any) {
    this.pageConfig = Object.assign({}, this.pageConfig, pageConfig);

    this.resetSelectedInfo();
    this.onUrlData();
    // 页面配置
    if (this.defaultValue === TabValue.Second) {
      this.heads = CommUtils.getListFields(newCurrent.headText);
      this.searches = newCurrent.searches; // 当前标签页的搜索项
    } else {
      this.heads = CommUtils.getListFields(this.currentSubTab.headText);
      this.searches = this.currentSubTab.searches; // 当前标签页的搜索项
    }

    this.buildShow(this.searches);
    // 构建参数
    const params = this.buildParams();
    if (this.currentTab.post_url === '') {
      // 固定值
      this.listInfo = [];
      this.pageConfig.total = 0;
      return;
    }
    this.xn.loading.open();
    this.xn.dragon.post(this.currentTab.post_url, params).subscribe(x => {
      if (x.data && x.data.data && x.data.data.length) {
        this.listInfo = x.data.data;
        this.sumReceive = x.data.sumReceive || 0;
        this.sumChangePrice = x.data.sumChangePrice || 0;
        if (x.data.recordsTotal === undefined) {
          this.pageConfig.total = x.data.count;
        } else {
          this.pageConfig.total = x.data.recordsTotal;
        }
      } else if (x.data && x.data.rows && x.data.rows.length) {
        this.listInfo = x.data.rows;
        this.pageConfig.total = x.data.count;
        this.sumReceive = x.data.sumReceive || 0;
        this.sumChangePrice = x.data.sumChangePrice || 0;
      } else {
        // 固定值
        this.listInfo = [];
        this.pageConfig.total = 0;
        this.resetAllTradeInfo();
      }
    }, () => {
      // 固定值
      this.listInfo = [];
      this.pageConfig.total = 0;
      this.resetAllTradeInfo();
    }, () => {
      this.xn.loading.close();
    });
  }

  tradeChanges() {
    if (this.defaultValue === TabValue.First) {
      this.xn.dragon.post('/project_manage/pool/trade_change_tip', {capitalPoolId: this.capitalPoolId})
        .subscribe(x => {
          if (x.ret === 0 && x.data) {
            this.tradeStatusFlag = x.data.changeTip || false;
          }
        });
    }
  }

  /**
   * 分页处理
   */
  onPageChange(pageConfig: IPageConfig = {page: 1, first: 1, total: 0, pageSize: 10}) {
    this.pageConfig = Object.assign({}, this.pageConfig, pageConfig);
    if (this.defaultValue === TabValue.Second) {
      this.getHeadorSearch(this.currentSubTab);
    } else {
      this.onPage(this.pageConfig);
    }
  }

  /**
   *  搜索,默认加载第一页
   */
  public searchMsg() {
    this.resetSelectedInfo();
    if (this.defaultValue === TabValue.Second) {
      this.getHeadorSearch(this.currentSubTab);
    } else {
      this.onPage();
    }
  }

  // 滚动表头
  onScroll(ev: Event) {
    const el = ev.currentTarget as HTMLDivElement;
    this.headLeft = el.scrollLeft * -1;
  }

  ngAfterViewInit() {
    this.scrollbarWidth = this.browserService.scrollbarWidth;
    this.cdr.markForCheck();
  }

  /**
   * 查看回传文件 [批量]
   */
  public fileView(paramFiles) {
    XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonMfilesViewModalComponent, JsonTransForm(paramFiles))
      .subscribe();
  }

  /**
   * 查看合同
   * @param row any
   */
  public viewContract(row: any) {
    let params = row;
    if (typeof row === 'string') {
      const obj = JSON.parse(row);
      params = Array.isArray(obj) ? obj[0] : obj;
    }
    params.readonly = true;
    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      DragonPdfSignModalComponent,
      params
    ).subscribe();
  }

  /**
   * 交易文件列表搜索项根据接口返回动态设置
   * @param Tabconfig any
   */
  getHeadorSearch(Tabconfig: any) {
    const newCurrentsubTab = XnUtils.deepCopy(this.currentSubTab);
    this.xn.dragon.post('/project_manage/file_contract/list_search', {project_manage_id: this.projectId})
      .subscribe(y => {
        if (y.ret === 0) {

          y.data.forEach(z => {
            newCurrentsubTab.headText.push({
              label: z.label, value: z.bodyContract, show: true, type: 'contract',
              bodyContractYyj: z.bodyContractYyj, templateFlag: z.templateFlag
            });
          });
          y.data.forEach(z => {
            newCurrentsubTab.searches.push({
              title: z.label, checkerId: z.searchContract, type: 'select', required: false, sortOrder: 10, show: true,
              options: {ref: z.selectFlag},
            });
          });
          newCurrentsubTab.searches = newCurrentsubTab.searches.filter((x) => x.checkerId !== 'statusFactoringPayConfirm');
          this.onPage(this.pageConfig, newCurrentsubTab);
        }
      });
  }

  /**
   * 下载附件
   */
  public downloadSelectedAttach() {
    this.capitalSelecteds = this.selectedItems.map(x => x.mainFlowId);

    const hasSelect = this.hasSelectRow();
    const params = {hasSelect};
    XnModalUtils.openInViewContainer(this.xn, this.vcr, GjDownloadModalComponent, params)
      .subscribe(x => {
        if (!!x) {
          this.xn.loading.open();
          const param = {
            fileTypeKey: {},
            isClassify: x.isClassify,
            mainFlowIdList: [],
          } as any;
          if (x.downloadRange === DownloadRange.All) {
            param.mainFlowIdList = this.listInfo.map(y => y.mainFlowId);
          } else {
            param.mainFlowIdList = this.capitalSelecteds;
          }
          x.chooseFile.split(',').forEach(y => param.fileTypeKey[y] = true);
          this.xn.api.dragon.download('/list/main/download_deal_flies', param).subscribe((v: any) => {
            this.xn.loading.close();
            this.xn.api.dragon.save(v._body, '资产池附件.zip');
          });
        }
      });
  }

  /**
   * 判断是否已勾选交易
   */
  private hasSelectRow() {
    const selectedRows = this.listInfo.filter(x => x.checked && x.checked === true);
    return !!selectedRows && selectedRows.length > 0;
  }

  /** 推送回执 */
  pushReceipt() {
    if (this.selectedItems.length === 0) {
      this.xn.msgBox.open(false, '请选择交易');
      return;
    }
    const selectArr = this.selectedItems.map((x) => x.mainFlowId);
    this.xn.msgBox.open(true, [
      `是否要推送以下交易？（共${selectArr.length}笔）`,
      ...selectArr
    ], () => {
      this.xn.loading.open();
      // 构建阐述
      const param = {
        mainFlowIdList: this.selectedItems.map(m => m.mainFlowId)
      };
      this.xn.api.dragon.post('/sub_system/cdr_system/project_push', param)
        .subscribe(
          () => {
            const html = `<h4>推送回执到项目公司成功</h4>`;
            this.xn.msgBox.open(false, [html], () => {
              this.getHeadorSearch(this.currentSubTab);
              this.selectedItems = [];
            });
          },
          () => {
            this.xn.loading.close();
          });
    });
  }

  /**
   * 上传文件
   */
  public uploadContract(row, head) {
    const params = {
      title: `上传${head.label}`,
      checker: [
        {
          title: `${head.label}`, checkerId: 'proveImg', type: 'mfile',
          options: {
            filename: `${head.label}`,
            fileext: 'jpg, jpeg, png, pdf',
            picSize: '500'
          }, memo: '请上传图片、PDF'
        },
      ]
    };
    XnModalUtils.openInViewContainer(this.xn, this.vcr, NewFileModalComponent, params).subscribe(v => {
      this.xn.loading.open();
      if (v === null) {
        this.xn.loading.close();
        return;
      }
      const param = {
        fileList: v.files,
        mainFlowId: row.mainFlowId,
        yyjTableName: head.bodyContractYyj,
      };
      const url = '/project_manage/file_contract/upload_file';
      this.xn.api.dragon.post(url, param).subscribe(() => {
        this.xn.loading.close();
        if (this.defaultValue === TabValue.Second) {
          this.getHeadorSearch(this.currentSubTab);
        } else {
          this.onPage(this.pageConfig);
        }
      });
    });
  }

  /**
   * 重置
   */
  public reset() {
    this.resetSelectedInfo();
    for (const key in this.arrObjs) {
      if (this.arrObjs.hasOwnProperty(key)) {
        delete this.arrObjs[key];
      }
    }
    this.buildCondition(this.searches);
    this.searchMsg(); // 清空之后自动调一次search
  }

  /**
   *  子标签tab切换，加载列表
   */
  public handleSubTabChange(paramSubTabValue: SubTabValue) {
    if (this.subDefaultValue !== paramSubTabValue) {
      this.selectedItems = [];
      this.selectSumReceive = 0;
      this.selectSumChangePrice = 0;
      this.listInfo = [];
      this.naming = '';
      this.sorting = '';
      this.pageConfig = {pageSize: 10, first: 0, total: 0, page: 1};
      this.subDefaultValue = paramSubTabValue;
      this.onPage();
    }
  }

  /**
   *  列表头样式
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
   */
  public onSort(sort: string) {
    if (this.sorting === sort) {
      this.naming = this.naming === SortType.DESC ? SortType.ASC : SortType.DESC;
    } else {
      this.sorting = sort;
      this.naming = SortType.ASC;
    }
    if (this.defaultValue === TabValue.Second) {
      this.getHeadorSearch(this.currentSubTab);
    } else {
      this.onPage();
    }
  }

  /**
   *  格式化数据
   */
  public jsonTransForm(data) {
    return JsonTransForm(data);
  }

  /**
   * 搜索条件是否显示
   */
  show() {
    this.displayShow = !this.displayShow;
  }

  /**
   *  查看文件信息
   */
  public viewFiles(paramFile) {
    const params = JSON.parse(paramFile);
    XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonMfilesViewModalComponent, params).subscribe();
  }

  /**
   *  判读列表项是否全部选中
   */
  public isAllChecked(): boolean {
    return !(this.listInfo.some(x => !x.checked || x.checked && x.checked === false) || this.listInfo.length === 0);
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
   *  查看合同，只读
   */
  public showContract(con) {
    const params = Object.assign({}, con, {readonly: true});
    XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonPdfSignModalComponent, params).subscribe(() => {
    });
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
   * 搜索项值格式化
   */
  private buildCondition(searches) {
    const tmpTime = {
      beginTime: this.beginTime,
      endTime: this.endTime
    };
    const objList = [];
    this.timeId = $.extend(true, [], this.searches.filter(v => v.type === 'quantum').map(v => v.checkerId));
    for (const item of searches) {
      const obj = {} as any;
      obj.title = item.title;
      obj.checkerId = item.checkerId;
      obj.required = false;
      obj.type = item.type;
      obj.number = item.number;
      if (item.checkerId === 'type' || item.checkerId === 'contractType') {
        item.options.ref = 'dragonContracttype';
      }
      obj.options = item.options;
      obj.show = item.show;
      if (item.checkerId === this.timeId[0]) {
        obj.value = JSON.stringify(tmpTime);
      } else {
        obj.value = this.arrObjs[item.checkerId];
      }
      objList.push(obj);
    }
    this.shows = $.extend(true, [], objList.sort((a, b) => a.number - b.number)); // 深拷贝，并排序;
    XnFormUtils.buildSelectOptions(this.shows);
    this.buildChecker(this.shows);
    this.form = XnFormUtils.buildFormGroup(this.shows);
    const time = this.searches.filter(v => v.type === 'quantum');
    const timeCheckId = time[0] && time[0].checkerId;
    this.nowTimeCheckId = timeCheckId;
    this.form.valueChanges.subscribe((v) => {
      // 时间段
      const changeId = v[timeCheckId];
      // delete v[timeCheckId];
      if (changeId !== '' && this.nowTimeCheckId) {
        const paramsTime = JSON.parse(changeId);
        const beginTime = paramsTime.beginTime;
        const endTime = paramsTime.endTime;
        // 保存每次的时间值。
        this.preChangeTime.unshift({begin: beginTime, end: endTime});
        // 默认创建时间
        this.beginTime = beginTime;
        this.endTime = endTime;
        if (this.preChangeTime.length > 1) {
          if (this.preChangeTime[1].begin === this.beginTime &&
            this.preChangeTime[1].end === this.endTime) {
            // return;
          } else {
            this.beginTime = beginTime;
            this.endTime = endTime;
            this.onPage();
          }
        }
      }
      const arrObj = {};
      for (const item in v) {
        if (v.hasOwnProperty(item) && v[item] !== '') {
          const searchFilter = this.searches.filter(v1 => v1 && v1.base === 'number').map(c => c.checkerId);
          if (searchFilter.indexOf(item) >= 0) {
            arrObj[item] = Number(v[item]);
          } else {
            arrObj[item] = v[item];
          }
        }
      }
      this.arrObjs = $.extend(true, {}, arrObj); // 深拷贝;要进行搜索的变量
      this.onUrlData();
    });
  }

  /**
   *  全选
   */
  public checkAll() {
    if (!this.isAllChecked()) {
      this.listInfo.forEach(item => item.checked = true);
      this.selectedItems = XnUtils.distinctArray2([...this.selectedItems, ...this.listInfo], 'mainFlowId');
    } else {
      this.listInfo.forEach(item => item.checked = false);
      this.selectedItems = [];
    }
    this.selectSumReceive = this.selectedItems
      .reduce((accumulator, currentValue) => accumulator + Number(currentValue.receive ? currentValue.receive : 0), 0)
      .toFixed(2);
    this.selectSumChangePrice = this.selectedItems
      .reduce((accumulator, currentValue) => accumulator + Number(currentValue.changePrice ? currentValue.changePrice : 0), 0)
      .toFixed(2);
  }

  /**
   * 单选
   */
  public singleChecked(paramItem) {
    if (!!paramItem.checked) {
      paramItem.checked = false;
      this.selectedItems = this.selectedItems.filter(x => x.mainFlowId !== paramItem.mainFlowId);
    } else {
      paramItem.checked = true;
      this.selectedItems.push(paramItem);
      this.selectedItems = XnUtils.distinctArray2(this.selectedItems, 'mainFlowId'); // 去除相同的项
    }
    this.selectSumReceive = this.selectedItems
      .reduce((accumulator, currentValue) => accumulator + Number(currentValue.receive ? currentValue.receive : 0), 0)
      .toFixed(2);
    this.selectSumChangePrice = this.selectedItems
      .reduce((accumulator, currentValue) => accumulator + Number(currentValue.changePrice ? currentValue.changePrice : 0), 0)
      .toFixed(2);
  }

  /**
   * 构建参数
   */
  private buildParams() {
    // 分页处理
    let params: any;
    if (this.defaultValue === TabValue.First || this.defaultValue === TabValue.Third) {
      params = {
        capitalPoolId: this.capitalPoolId,
        type: this.TabTypeMap.get(this.defaultValue),
        pageNo: this.pageConfig.page,
        pageSize: this.pageConfig.pageSize
      };
    } else if (this.defaultValue === TabValue.Second) {
      params = {
        start: this.pageConfig.first,
        length: this.pageConfig.pageSize,
        project_manage_id: this.projectId,
        headquarters: this.headquarters,
        capitalPoolId: this.capitalPoolId,
      };
    } else if (this.defaultValue === TabValue.Fourth) {
      params = {};
    } else if (this.defaultValue === TabValue.Fifth) {
      params = {
        capitalPoolId: this.capitalPoolId,
        type: this.TabTypeMap.get(this.defaultValue),
        pageNo: this.pageConfig.page,
        pageSize: this.pageConfig.pageSize
      };
    }

    // 排序处理
    if (this.sorting && this.naming) {
      if (this.defaultValue === TabValue.First || this.defaultValue === TabValue.Third) {
        const asc = this.naming === SortType.DESC ? -1 : 1;
        params.order = [{
          name: this.listFieldOrderParam.get(this.sorting), // 要排序的名称
          asc, // 是否是升序 -1表示降序 1表示升序
        }];
      } else {
        params.order = [this.sorting + ' ' + this.naming];
      }
    }
    // 搜索处理
    if (this.searches.length > 0) {
      for (const search of this.searches) {
        if (!XnUtils.isEmpty(this.arrObjs[search.checkerId])) {
          if (search.checkerId === 'transactionStatus') {
            const obj = JSON.parse(this.arrObjs[search.checkerId]);
            params.isProxy = Number(obj.isProxy);
            params.status = Number(obj.status);
          } else if (search.checkerId === 'isHeadPreDate') {
            const HeadPreDate = JSON.parse(this.arrObjs[search.checkerId]);
            if (HeadPreDate.isPriorityLoanDate === 0) {
              params.headDate = HeadPreDate.isPriorityLoanDate;
            } else if (HeadPreDate.isPriorityLoanDate === 1) {
              params.headDate = HeadPreDate.isPriorityLoanDate;
              params.beginTime = HeadPreDate.priorityLoanDateStart;
              params.endTime = HeadPreDate.priorityLoanDateEnd;
            }
          } else if (search.checkerId === 'beforeDate') {
            const obj = JSON.parse(this.arrObjs[search.checkerId]);
            params.beforeDate = Number(obj.beginTime);
            params.afterDate = Number(obj.endTime);
          } else if (search.checkerId === 'surveyStatus') {
            // lawSurveyList  律所尽调状态列表  managerSurveyList 管理人尽调状态列表
            const arr = this.arrObjs[search.checkerId] || [];
            if (arr && arr.length) {
              const lawSurveyList = arr.filter(x => Number(x) <= 5).map(y => Number(y));
              const managerSurveyList = arr.filter(x => Number(x) > 5).map(y => Number(y - 5));
              if (lawSurveyList && lawSurveyList.length) {
                params.lawSurveyList = lawSurveyList;
              }
              if (managerSurveyList && managerSurveyList.length) {
                params.managerSurveyList = managerSurveyList;
              }
            }
          } else {
            params[search.checkerId] = this.arrObjs[search.checkerId];
          }
        }
      }
    }
    return params;
  }

  /**
   * 构建表单项
   */
  private buildChecker(stepRows) {
    for (const row of stepRows) {
      XnFormUtils.convertChecker(row);
    }
  }

  /**
   * 回退操作
   */
  private onUrlData() {
    const urlData = this.xn.user.getUrlData(this.xn.router.url);
    if (urlData && urlData.pop) {
      this.pageConfig = urlData.data.pageConfig || this.pageConfig;
      this.beginTime = urlData.data.beginTime || this.beginTime;
      this.endTime = urlData.data.endTime || this.endTime;
      this.arrObjs = urlData.data.arrObjs || this.arrObjs;
    } else {
      this.xn.user.setUrlData(this.xn.router.url, {
        pageConfig: this.pageConfig,
        beginTime: this.beginTime,
        endTime: this.endTime,
        arrObjs: this.arrObjs,
      });
    }
  }

  /**
   * 返回上一页
   */
  navBack() {
    if (this.isMachineenter === true) {
      this.xn.user.navigateBack();
    } else {
      this.xn.router.navigate(['/abs-gj/assets-management/projectPlan-management'], {
        queryParams: {
          title: this.title.split('>')[1] + '>' + this.title.split('>')[2],
          projectId: this.projectId,
          headquarters: this.headquarters,
          paging: this.queryParams.backPageNumber,
          defaultValue: this.queryParams.backDefaultValue
        }
      });
    }
  }

  /**
   * 行按钮组事件
   * @param paramBtnOperate 按钮操作配置
   */
  public handleHeadClick(paramBtnOperate: ButtonConfigModel) {
    if (paramBtnOperate.operate === 'generate_Contract') {
      // 生成合同
      if (this.selectedItems.length === 0) {
        this.xn.msgBox.open(false, '请选择交易');
        return;
      }
      this.generateContacts();
    } else if (paramBtnOperate.operate === 'add_transaction') {
      // 添加交易
      this.addTransaction();
    } else if (paramBtnOperate.operate === 'return_file') {
      // 回传文件
      this.turnaroundFile();
    } else if (paramBtnOperate.operate === 'contract_sign') {
      // 生成并签署合同
      if (this.selectedItems.length === 0) {
        this.xn.msgBox.open(false, '请选择交易');
        return;
      }
      this.signContacts();
    } else if (paramBtnOperate.operate === 'transaction_changes') {
      // 交易变动记录
      const params: SingleListParamInputModel = {
        ...ProjectManagerCapitalList.transactionChangesConfig.searches,
        data: this.selectedItems || [],
        total: this.selectedItems.length || 0,
        inputParam: {
          capitalPoolId: this.capitalPoolId
        },
        rightButtons: [{label: '确定', value: 'submit'}]
      };
      XnModalUtils.openInViewContainer(this.xn, this.vcr, SingleSearchListModalComponent, params).subscribe();
      this.xn.dragon.post('/project_manage/pool/update_change_pool', {capitalPoolId: this.capitalPoolId})
        .subscribe(() => {
          this.tradeStatusFlag = false;
        });
    } else if (paramBtnOperate.operate === 'batch_information') {
      // 批量补充信息
      if (this.selectedItems.length === 0) {
        this.xn.msgBox.open(false, '请选择交易');
        return;
      }
      this.batchModify();
    } else if (paramBtnOperate.operate === 'remove_transaction') {
      // 移除交易
      if (this.selectedItems.length === 0) {
        this.xn.msgBox.open(false, '请选择交易');
        return;
      }
      const params = {
        selectedItems: this.selectedItems,
        capitalPoolName: this.capitalPoolName,
        capitalPoolId: this.capitalPoolId,
        type: RemoveAction.Remove,
        post_url: '/pool/remove'
      };
      XnModalUtils.openInViewContainer(this.xn, this.vcr, VankeDeleteTransactionEditModalComponent, params)
        .subscribe(() => {
          this.selectedItems = [];
          setTimeout(() => {
            this.onPage({page: 1, first: 0});
          }, 1000);
        });
    } else if (paramBtnOperate.operate === 'download_file') {
      // 下载附件
      this.downloadSelectedAttach();
    } else if (paramBtnOperate.operate === 'export_file') {
      // 导出清单
      this.exportCapital();
    } else if (paramBtnOperate.operate === 'capital_sample') {
      // 抽样
      if (!this.listInfo.length) {
        this.xn.msgBox.open(false, '此资产池内暂无交易，不能发起抽样，请先添加交易');
        return;
      }
      this.capitalSample();
    } else if (paramBtnOperate.operate === 'data_analyse') {
      // 数据分析
      this.dataAnalyse();
    } else if (paramBtnOperate.operate === 'specialAsset_mark') {
      // 特殊资产标记
      this.specialAssetMark();
    } else if (paramBtnOperate.operate === 'start_change') {
      // 发起变更
      this.startChange();
    }
  }

  /**
   * 获取生成合同url
   */
  private returnContractUrl(type: SignAction) {
    return {
      generate: '/sub_system/cdr_system/cdr_generate_second_contract',
      update: '/contract/second_contract_info/update_second_contract',
      type,
    };
  }

  /**
   * 生成并签署合同
   */
  signContacts() {
    this.xn.dragon.post('/contract/second_contract_info/create_sign_second_contract', {project_manage_id: this.projectId})
      .subscribe(c => {
        if (c.ret === 0) {
          const fileList = c.data;
          XnModalUtils.openInViewContainer(this.xn, this.vcr, VankeCapitalPoolGeneratingContractModalComponent, {fileList})
            .subscribe(x => {
              if (!!x) {
                this.xn.loading.open();
                const params = {
                  capitalPoolId: this.capitalPoolId,
                  mainIds: this.selectedItems.map((r) => r.mainFlowId),
                  secondTemplate: x[0],
                };
                const url = this.returnContractUrl(SignAction.Sign);
                this.doGenerateOrSign(params, url, x[0].templateFlag);
              }
            });
        }
      });
  }

  /**
   * 生成合同
   */
  public generateContacts() {
    this.xn.dragon.post('/contract/second_contract_info/create_second_contract', {project_manage_id: this.projectId})
      .subscribe(x => {
        if (x.ret === 0) {
          const fileList = x.data;
          XnModalUtils.openInViewContainer(this.xn, this.vcr, VankeCapitalPoolGeneratingContractModalComponent, {fileList})
            .subscribe(z => {
              if (!!z) {
                this.xn.loading.open();
                // 准备参数
                const params = {
                  capitalPoolId: this.capitalPoolId,
                  mainIds: this.selectedItems.map((r) => r.mainFlowId),
                  secondTemplate: z[0],
                };

                const url = this.returnContractUrl(SignAction.NogSign);
                this.doGenerateOrSign(params, url, z[0].templateFlag);
              }
            });
        }
      });
  }

  /**
   * 回传文件
   */
  public turnaroundFile() {
    const params: EditParamInputModel = {
      title: '回传文件',
      checker: [{
        title: '文件',
        checkerId: 'returnFile',
        type: 'mfile-return',
        required: 1,
        options: {fileext: 'jpg,jpeg,png,pdf,zip'},
        value: '',
      }] as CheckersOutputModel[],
      options: {capitalPoolId: this.capitalPoolId},
      buttons: ['取消', '上传']
    };
    XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonOcrEditModalComponent, params).subscribe(() => {
      this.getHeadorSearch(this.currentSubTab);
    });
  }

  /**
   * 项目公司退回
   * @param item any
   */
  viewReturnInfo(item: any) {
    const params: EditParamInputModel = {
      title: '退回原因',
      checker: [
        {
          title: '退回原因',
          checkerId: 'returnMsg',
          type: 'textarea',
          required: 0,
          options: {readonly: true},
          value: item.returnReason || ''
        },
      ] as CheckersOutputModel[],
      buttons: ['取消']
    };
    XnModalUtils.openInViewContainer(this.xn, this.vcr, EditModalComponent, params)
      .subscribe();
  }

  /**
   * 合同弹窗--可签署或不签署
   * @param params 入参
   * @param urls 接口url
   * @param templateFlag any
   */
  private doGenerateOrSign(params: any, urls: any, templateFlag?: any) {
    this.xn.api.dragon.post(urls.generate, params).subscribe(con => {
      this.xn.loading.close();
      const contracts = con.data.contractList;
      const result = JSON.parse(JSON.stringify(contracts));
      result.isProxy = IsProxyDef.CDR;
      if (result.length) {

        result.forEach(x => {
          if (!x.config) {
            x.config = {text: ''};
          }

          x.config.text = '（盖章）';

          // 是否只读
          if (urls.type === SignAction.NogSign) {
            x.readonly = true;
            x.isNoSignTitle = true;
            x.caSignType = SignAction.NogSign;
          }
        });
        XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonFinancingContractModalComponent, result)
          .subscribe(x => {
            if (x === 'ok') {
              const p = con.data;
              if (templateFlag) { p.templateFlag = templateFlag; }
              this.xn.loading.open();
              this.xn.dragon.post(urls.update, p).subscribe(() => {
                this.xn.loading.close();
                if (this.defaultValue === TabValue.Second) {
                  this.getHeadorSearch(this.currentSubTab);
                } else {
                  this.onPage(this.pageConfig);
                }
              });
            }
          });
      }
    });
  }

  /**
   * 查看交易详情
   */
  viewProgress(mainFlowId) {
    this.xn.router.navigate([`abs-gj/main-list/detail/${mainFlowId}`]);
  }

  /**
   * 查看业务详情
   * @param mainFlowId string
   */
  viewDetail(mainFlowId: string) {
    this.tooltip$.next(mainFlowId);
  }

  /**
   * 查看业务详情接口调用
   * @param mainFlowId string
   */
  viewDetailFunc(mainFlowId: string) {
    this.params.checker = ProjectManagerCapitalList.businessDetails.checkers;
    this.params.checker.forEach((x) => x.data = '');
    this.xn.dragon.post('/project_manage/file_contract/business_detail', {mainFlowId}).subscribe(x => {
      if (x.ret === 0) {
        this.params.checker.forEach((obj) => {
          if (obj.value === 'type') {
            obj.data = x.data[0].type === Number(Channel.ABS)
              ? 'ABS业务'
              : x.data[0].type === Number(Channel.Refactoring) ? '再保理' : '非标';

          } else if (obj.value === 'freezeOne') {
            obj.data = x.data[0].freezeOne === FreezeStatus.NotFrozen ? '未冻结' : '已冻结';

          } else if (obj.value === 'headPreDate' || obj.value === 'factoringEndDate' || obj.value === 'realLoanDate' || obj.value === 'priorityLoanDate') {
            obj.data = x.data[0][obj.value] ? moment(x.data[0][obj.value]).format('YYYY-MM-DD') : '';

          } else {
            obj.data = x.data[0][obj.value] || '';
          }
        });
      }
    });
  }

  /**
   * 查看尽调意见
   * @param item any
   * @param advise 尽调意见
   * @param firstAdvise 初审尽调意见
   * @param surveyMan 尽调人
   * @param firstSurveyMan 初审尽调人
   */
  viewSurveyInfo(item: any, advise: string, firstAdvise: string, surveyMan: string, firstSurveyMan: string) {
    const params: EditParamInputModel = {
      title: '查看尽调意见',
      checker: [
        {
          title: '类型',
          checkerId: 'surveyType',
          type: 'text', required: 0,
          options: {readonly: true}, value: item[advise] ? '终审尽调意见' : '初审尽调意见'
        },
        {
          title: '尽调意见',
          checkerId: 'surveyInfo',
          type: 'textarea',
          required: 0,
          options: {readonly: true},
          value: item[advise] || item[firstAdvise]
        },
        {
          title: '尽调人',
          checkerId: 'surveyPerson',
          type: 'text',
          required: 0,
          options: {readonly: true},
          value: item[surveyMan] || item[firstSurveyMan]
        },
      ] as CheckersOutputModel[],
      buttons: ['确定']
    };
    XnModalUtils.openInViewContainer(this.xn, this.vcr, EditModalComponent, params)
      .subscribe();
  }

  /**
   * 导出清单
   *  hasSelect 导出选中项
   *  导出全部交易
   */
  public exportCapital() {
    const params = this.selectRowAndDifferentCompany();
    XnModalUtils.openInViewContainer(this.xn, this.vcr, CapitalPoolExportListModalComponent, params)
      .subscribe(x => {
        if (!!x) {
          this.xn.loading.open();
          const param = {
            headquarters: this.headquarters,
            mainFlowIdList: (+x.scope === SelectRange.All || +x.scope === SelectRange.Sample)
              ? undefined
              : this.selectedItems.map(y => y.mainFlowId),
            capitalPoolId: this.capitalPoolId,
          } as any;
          if (+x.scope === SelectRange.Sample) {
            /** 仅抽样业务 */
            param.isSample = 1;
          }
          if (Number(x.contentType) === SelectContent.Default) {
            this.xn.api.dragon.download('/project_manage/file_contract/down_excel', param).subscribe((v: any) => {
                this.xn.api.dragon.save(v._body, '资产池清单.xlsx');
                this.xn.loading.close();
              },
              () => {
                this.xn.loading.close();
              });
          } else {
            this.xn.api.dragon
              .download('/project_manage/file_contract/receivables_excel_download', param)
              .subscribe(
                (v: any) => {
                  this.xn.api.dragon.save(v._body, '应收账款录入表清单.xlsx');
                  this.xn.loading.close();
                },
                () => {
                  this.xn.loading.close();
                }
              );
          }
        }
      });
  }

  /**
   * 行按钮组事件
   * @param item 当前行数据
   * @param btn 按钮操作配置
   */
  public handleRowClick(item: any, btn: ButtonConfigModel) {
    if (btn.operate === 'sub_start_survey') {
      // 发起尽调
      const flowId: FlowId = item.flowId;
      if ([FlowId.GjFinancingPre, FlowId.GjFinancing].includes(flowId)) {
        this.xn.msgBox.open(false, `供应商尚未上传资料，暂时无法尽调，请稍候再试`);
        return '';
      }
      // 经办人（管理人或律所角色）
      const rolesArr = this.xn.user.roles.filter((x) => {
        return x === 'operator';
      });
      if (!(rolesArr && rolesArr.length)) {
        this.xn.msgBox.open(false, '您好，您的权限不够，仅【业务经办人】可进行操作');
        return '';
      } else {
        this.xn.router.navigate([`/abs-gj/record/new/sub_law_manager_survey`],
          {
            queryParams: {
              id: 'sub_law_manager_survey',
              relate: 'mainFlowId',
              relateValue: item.mainFlowId,
            }
          });
      }
    } else if (btn.operate === 'sub_dispose_special_capital') {
      // 处置特殊资产
      // 1 管理人角色、保理商角色
      const rolesArr = this.xn.user.roles.filter((x) => {
        return x === 'operator';
      });
      if (!(rolesArr && rolesArr.length)) {
        this.xn.msgBox.open(false, '您好，您的权限不够，仅【业务经办人】可进行操作');
        return '';
      } else {
        this.xn.router.navigate([`/abs-gj/record/new/sub_special_asset_dispose`],
          {
            queryParams: {
              id: 'sub_special_asset_dispose',
              relate: 'mainFlowId',
              relateValue: item.mainFlowId,
            }
          });
      }
    }
  }

  /**
   * 批量补充
   */
  public batchModify() {
    if (this.selectedItems.length < 1) {
      this.xn.msgBox.open(false, '请选择交易');
      return false;
    }
    const param = {mainList: this.selectedItems};
    this.localStorageService.setCacheValue('batchModifyMainList', param);
    const formCapitalPool = {...this.queryParams}; // 资产管理标识
    this.xn.router.navigate(['/abs-gj/capital-pool/batch-modify'], {
      queryParams: formCapitalPool
    });
  }

  /**
   * 选择交易处理
   */
  private selectRowAndDifferentCompany() {
    const selectedRows = this.listInfo.filter(
      x => x.checked && x.checked === true
    );
    return {
      hasSelect: !!selectedRows && selectedRows.length > 0,
      selectedCompany: CompanyName.CDR,
      capitalType: CapitalType.New,
      capitalFlag: ExportOrigin.ZCC,
    };
  }

  /**
   * 添加交易
   */
  addTransaction() {
    this.xn.router.navigate([`/abs-gj/assets-management/enter-pool`], {
      queryParams: {
        projectName: this.fitProject,
        capitalPoolId: this.capitalPoolId,
        capitalPoolName: this.capitalPoolName,
        headquarters: this.headquarters,
      }
    });
  }

  // 抽样
  capitalSample() {
    this.xn.dragon.post('/sample/get_sample_sign', {capitalPoolId: this.capitalPoolId}).subscribe(x => {
      if (x.ret === 0 && x.data) {
        if (x.data.lastMainFlowIdList && x.data.lastMainFlowIdList.length) {
          this.localStorageService.caCheMap.delete('assetSampleList');
          this.localStorageService.setCacheValue('assetSampleList', JSON.stringify(x.data.lastMainFlowIdList));
        }
        if (x.data.isCapitalPoolSample) {
          const params: EditParamInputModel = {
            title: '该资产池已存在抽样资产，请确认是否继续抽样？',
            checker: [
              {title: '抽样类型', checkerId: 'selectSample', type: 'radio', required: 1, options: {ref: 'selectSample'}}
            ] as CheckersOutputModel[],
            buttons: ['取消', '继续抽样']
          };
          XnModalUtils.openInViewContainer(this.xn, this.vcr, EditModalComponent, params).subscribe(v => {
            if (v === null) {
              return;
            } else {
              // 抽样页面
              this.xn.router.navigate(['/abs-gj/assets-management/capital-sample'], {
                queryParams: {
                  isCapitalPoolSample: x.data.isCapitalPoolSample,
                  selectSample: v.selectSample,
                  totalCount: this.pageConfig.total,
                  sumReceive: this.sumReceive,
                  ...this.queryParams
                }
              });
            }
          });
        } else {
          // 抽样页面
          this.xn.router.navigate(['/abs-gj/assets-management/capital-sample'], {
            queryParams: {
              isCapitalPoolSample: x.data.isCapitalPoolSample,
              // selectSample: -1,
              totalCount: this.pageConfig.total,
              sumReceive: this.sumReceive,
              ...this.queryParams
            }
          });
        }
      }
    });

  }

  /** 数据分析 */
  dataAnalyse() {
    this.xn.router.navigate(['/abs-gj/assets-management/capital-data-analyse'], {
      queryParams: {
        totalCount: this.pageConfig.total,
        sumReceive: this.sumReceive,
        ...this.queryParams
      }
    });
  }

  // 特殊资产标记
  specialAssetMark() {
    if (this.selectedItems.length === 0) {
      this.xn.msgBox.open(false, '请选择交易');
      return;
    } else if (this.selectedItems.length > 1) {
      this.xn.msgBox.open(false, `特殊资产标记一次只能操作单笔交易`);
      return false;
    }
    const mainFlowIds = this.selectedItems.map(x => x.mainFlowId);
    const rolesArr = this.xn.user.roles.filter((x) => {
      return x === 'operator';
    });
    if (!(rolesArr && rolesArr.length)) {
      this.xn.msgBox.open(false, '您好，您的权限不够，仅【业务经办人】可进行操作');
    } else {
      this.xn.router.navigate([`/abs-gj/record/new/sub_special_asset_sign`],
        {
          queryParams: {
            id: 'sub_special_asset_sign',
            relate: 'mainFlowId',
            relateValue: mainFlowIds.toString(),
          }
        });
    }
  }

  // 发起变更
  startChange() {
    const mainIds = this.selectedItems.map(x => x.mainFlowId);
    if (this.selectedItems.length === 0) {
      this.xn.msgBox.open(false, '请选择交易');
      return;
    }

    const isOk = this.selectedItems.some((x) => x.flowId === FlowId.GjSupplierSign);
    if (isOk) {
      const msg = this.selectedItems
        .filter((x) => x.flowId === FlowId.GjSupplierSign)
        .map((y) => y.mainFlowId)
        .join('、');
      this.xn.msgBox.open(false, `交易${msg}还没有完成供应商签署合同，不能发起变更发行流程`);
      return;
    }

    const params = {hasSelect: this.hasSelectRow(), selectedCompany: CompanyName.CDR};
    XnModalUtils.openInViewContainer(this.xn, this.vcr, CapitalChangeProcessModalComponent, params).subscribe(x => {
      if (!!x && x.scope) {
        const flowId = +x.scope === SelectRange.All ? 'sub_change_start' : 'sub_change_capital';
        this.xn.router.navigate([`/abs-gj/record/new/${flowId}`], {
          queryParams: {
            id: flowId,
            relate: 'mainIds',
            relateValue: mainIds,
          }
        });
      }
    });
  }
}

/** remove动作 */
enum RemoveAction {
  /** 移入 */
  MoveIn = 1,
  /** 移除 */
  Remove = 2,
}

/** 签合同动作 */
enum SignAction {
  /** 签 */
  Sign    = 2,
  /** 不签 */
  NogSign = 1,
}

/** 导出清单来源 */
enum ExportOrigin {
  /** 拟入池 */
  NRC = 1,
  /** 资产池 */
  ZCC = 2,
}
