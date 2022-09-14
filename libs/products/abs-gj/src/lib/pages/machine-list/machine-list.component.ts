/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\abs-gj\src\lib\pages\machine-list\machine-list.component.ts
 * @summary：machine-list.component.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-11-26
 ***************************************************************************/
import { XnModalUtils } from '../../../../../../shared/src/lib/common/xn-modal-utils';
import {
  ButtonConfigModel,
  SubTabListOutputModel,
  TabConfigModel,
  TabListOutputModel
} from '../../../../../../shared/src/lib/config/list-config-model';
import { ExportListModalComponent } from '../../../../../../shared/src/lib/public/modal/export-list-modal.component';
import { FormGroup } from '@angular/forms';
import MachineIndexTabConfig, { SubTabParam } from './machine-list.config';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
  ViewContainerRef
} from '@angular/core';
import {
  AvengerInvoiceShowModalComponent
} from '../../../../../avenger/src/lib/shared/components/modal/avenger-invoice-show-modal.component';
import { CustomSearchNumber } from '../../../../../../shared/src/lib/config/select-options';
import { ActivatedRoute } from '@angular/router';
import CommUtils from '../../../../../../shared/src/lib/public/component/comm-utils';
import {
  DragongetCustomFiledComponent
} from '../../../../../../shared/src/lib/public/dragon-vanke/modal/custom-field-modal.component';
import { LocalStorageService } from '../../../../../../shared/src/lib/services/local-storage.service';
import {
  DragonPdfSignModalComponent
} from '../../../../../../shared/src/lib/public/dragon-vanke/modal/pdf-sign-modal.component';
import {
  BusinessMatchmakerChooseComponent
} from '../../../../../../shared/src/lib/public/dragon-vanke/modal/business-choose-matchmaker-modal.component';
import { CheckersOutputModel } from '../../../../../../shared/src/lib/config/checkers';
import { JsonTransForm } from '../../../../../../shared/src/lib/public/pipe/xn-json.pipe';
import {
  DragongetCustomListComponent
} from '../../../../../../shared/src/lib/public/dragon-vanke/modal/custom-list-modal.component';
import {
  MachineInvoiceListComponent
} from '../../../../../../shared/src/lib/public/dragon-vanke/modal/machine-invoice-list-modal.component';
import {
  MachineCustomFieldService
} from '../../../../../../shared/src/lib/services/machine-custom-search-field.service';
import {
  DragonMfilesViewModalComponent
} from '../../../../../../shared/src/lib/public/dragon-vanke/modal/mfiles-view-modal.component';
import { XnFormUtils } from '../../../../../../shared/src/lib/common/xn-form-utils';
import { XnService } from '../../../../../../shared/src/lib/services/xn.service';
import { HwModeService } from '../../../../../../shared/src/lib/services/hw-mode.service';
import { BrowserService } from '../../../../../../shared/src/lib/services/browser.service';
import CommBase from '../comm-base';
import {
  AuditorTypeEnum,
  CompanyAppId,
  DownloadRange,
  FlowId,
  IsProxyDef,
  OrgTypeEnum,
  ProgressStep,
  RetreatType,
  SortType,
  SubTabValue,
  TabValue,
  TradeStatus,
  YesOrNo,
  ZdStatus
} from '../../../../../../shared/src/lib/config/enum';
import { XnUtils } from '../../../../../../shared/src/lib/common/xn-utils';
import { EditModalComponent } from '../../../../../../shared/src/lib/public/dragon-vanke/modal/edit-modal.component';
import {
  SingleSearchListModalComponent
} from '../../../../../../shared/src/lib/public/dragon-vanke/modal/single-searchList-modal.component';
import * as _ from 'lodash';
import { ToolKitService } from '../../services/tool-kit.service';
import { IPageConfig, ISortParam } from '../../interfaces';
import { IsBackUpOptions } from 'libs/shared/src/lib/config/options/abs-gj.options';
import { GjDownloadModalComponent } from '../../components/download-modal/download-modal.component';

@Component({
  selector: 'lib-machine-list-gj',
  templateUrl: `./machine-list.component.html`,
  styleUrls: ['./machine-list.component.css']
})
export class GjMachineListComponent implements OnInit, AfterViewInit {
  private arrObjs = {} as any;  // 缓存后退的变量
  private beginTime: any;
  private endTime: any;
  private timeId = [];
  private nowTimeCheckId = '';
  private preChangeTime: any[] = []; // 上次搜索时间段,解决默认时间段搜索请求两次
  private sorting = ''; // 共享该变量 列排序
  private searches: CheckersOutputModel[] = []; // 面板搜索配置项暂存
  tabConfig: TabConfigModel = new TabConfigModel(); // 当前列表配置
  currentTab: TabListOutputModel = new TabListOutputModel(); // 当前标签页
  currentSubTab: SubTabListOutputModel = new SubTabListOutputModel(); // 当前子标签页
  listInfo: any[] = []; // 数据
  shows: CheckersOutputModel[] = [];  // 搜索项
  searchForm: FormGroup; // 搜索表单组
  formModule = 'dragon-input';
  selectedItems: any[] = []; // 选中的项
  newSelectItems: any[] = [];
  newHeads: any[] = []; // 后端返回的自定义table列表
  base: CommBase;
  valueDate: string;
  heads: any[];
  roleId: string[] = [];
  displayShow = true;
  searchShow: CheckersOutputModel[] = []; // 搜索项
  headLeft = 0;
  selectedReceivables = 0;   // 所选交易的应收账款金额汇总
  selectedPayableAmounts = 0;   // 所选交易的转让价款汇总
  allReceivables = 0;   // 所有交易的应收账款金额汇总
  allPayableAmounts = 0;   // 所有交易的转让价款汇总
  scrollX = 0;   // 滚动条滚动距离
  fixedHeadNumber = 0;   // 固定表格列数量
  // 自定义筛选条件status传值范围定义
  customSearchNumber: number = CustomSearchNumber.XN_LOGAN;
  @ViewChild('tables') tables: ElementRef;
  private projectCompany = this.xn.user.orgName;
  private orgType = this.xn.user.orgType;

  /** 浏览器滚动条宽度，默认 8px */
  scrollbarWidth = 8;
  /** 页码配置 */
  pageConfig: IPageConfig = {pageSize: 10, first: 0, total: 0, page: 1};
  /** 标签页 默认 B */
  defaultValue = TabValue.Second;
  /** 子标签页 默认 DOING */
  subDefaultValue = SubTabValue.DOING;
  /** 判断是否数组 */
  judgeDataType = XnUtils.isArray;
  /** 排序参数映射 */
  sortParamMap: Map<SortType, 1 | -1> = new Map([
    [SortType.DESC, -1],
    [SortType.ASC, 1],
  ]);
  /** 排序请求参数 */
  private sortObjs: ISortParam[] = [];
  /** 排序类型名字 */
  private naming: SortType | '';
  /** 配置的表格头 */
  @ViewChildren('thsTemp') thsTemp: QueryList<ElementRef>;
  /** 配置的表格内容 */
  @ViewChildren('trsTemp') trsTemp: QueryList<ElementRef>;
  /** 中止类型 */
  RetreatType = RetreatType;
  /** 业务状态 */
  TradeStatus = TradeStatus;
  /** 机构类型 */
  OrgTypeEnum = OrgTypeEnum;

  constructor(
    public xn: XnService,
    private vcr: ViewContainerRef,
    private cdr: ChangeDetectorRef,
    private router: ActivatedRoute,
    private er: ElementRef,
    public hwModeService: HwModeService,
    public toolKitSrv: ToolKitService,
    public localStorageService: LocalStorageService,
    public machineCustomFieldSrv: MachineCustomFieldService,
    private browserService: BrowserService,
  ) {}

  ngOnInit(): void {

    if (this.xn.user.orgType === OrgTypeEnum.FACTORING) {
      this.tabConfig = MachineIndexTabConfig.getConfig().factoring;
    } else if (this.xn.user.orgType === OrgTypeEnum.PLATFORM) {
      this.tabConfig = MachineIndexTabConfig.getConfig().platform;
    } else {
      this.tabConfig = MachineIndexTabConfig.getConfig().other;
    }
    this.initData();
  }

  ngAfterViewInit() {
    this.scrollbarWidth = this.browserService.scrollbarWidth;
    this.cdr.markForCheck();
  }

  /** 标签页，加载列表信息 */
  async initData() {
    this.subDefaultValue = SubTabValue.DOING; // 重置子标签默认
    // 页面配置
    const find = this.tabConfig.tabList.find(tab => tab.value === this.defaultValue);
    this.currentTab = !!find ? find : new TabListOutputModel();

    // 子页面配置
    const subFind = this.currentTab.subTabList.find(sub => sub.value === this.subDefaultValue);
    this.currentSubTab = !!subFind ? subFind : new SubTabListOutputModel();
    this.searches = this.currentSubTab.searches; // 当前标签页的搜索项

    // 自定义搜索项
    const newSearches = await this.machineCustomFieldSrv.getCustomField(this.customSearchNumber, this.currentSubTab.searches);
    this.searches = XnUtils.deepClone(newSearches);
    this.buildShow(this.searches);
    this.onPage();
  }

  /**
   * 自定义筛选条件
   */
  getCustomSearch() {
    const params = {
      title: '自定义筛选条件',
      label: 'checkerId',
      type: 1,
      headText: JSON.stringify(this.currentSubTab.searches),
      selectHead: JSON.stringify(this.searches),
      selectField: this.heads,
      status: this.customSearchNumber
    };
    XnModalUtils.openInViewContainer(this.xn, this.vcr, DragongetCustomFiledComponent, params).subscribe(async v => {
      if (v && v.action === 'ok') {
        // 重置搜索项值
        this.selectedItems = [];
        for (const key in this.arrObjs) {
          if (this.arrObjs.hasOwnProperty(key)) {
            delete this.arrObjs[key];
          }
        }
        // 自定义搜索项
        const newSearches = await this.machineCustomFieldSrv.getCustomField(this.customSearchNumber, this.currentSubTab.searches);
        this.searches = XnUtils.deepClone(newSearches);
        this.buildShow(this.searches);
      }
    });
  }

  // 自定义列表
  getCustomlist() {
    const params = {
      FixedNumber: this.fixedHeadNumber,
      headText: JSON.stringify(this.currentSubTab.headText),
      selectHead: JSON.stringify(this.newHeads),
      status: this.currentSubTab.params
    };
    XnModalUtils.openInViewContainer(this.xn, this.vcr, DragongetCustomListComponent, params)
      .subscribe(() => {
        this.onPage(this.pageConfig);
      });

  }

  show() {
    this.displayShow = !this.displayShow;
  }

  /** 子标签tab切换，加载列表 */
  async handleSubTabChange(subTabValue: SubTabValue) {

    if (this.subDefaultValue !== subTabValue) {
      this.cleanSelected();
      this.listInfo = [];
      this.naming = '';
      this.sorting = '';
      this.pageConfig = {pageSize: 10, first: 0, total: 0, page: 1};

      this.subDefaultValue = subTabValue;
      const subFind = this.currentTab.subTabList.find(sub => sub.value === this.subDefaultValue);
      this.currentSubTab = !!subFind ? subFind : new SubTabListOutputModel();

      // 自定义搜索项
      const newSearches = await this.machineCustomFieldSrv.getCustomField(this.customSearchNumber, this.currentSubTab.searches);
      this.searches = XnUtils.deepClone(newSearches);
      this.buildShow(this.searches);
      this.onPage();
    }
  }

  getTableRowEls() {
    /** 左侧固定列 */
    let leftFixed = [];
    /** 右侧固定列 */
    let rightFixed = [];
    /** 默认固定【选择】【序号】两个列，从第三列开始动态控制 */
    const lock = 2 + this.fixedHeadNumber;
    this.trsTemp.forEach((c) => {
      const {leftFixed: left, rightFixed: right} = this.needFixedEls(lock, c.nativeElement.children);
      leftFixed = leftFixed.concat(left);
      rightFixed = rightFixed.concat(right);
    });

    const {leftFixed: thLeft, rightFixed: thRight} = this.needFixedEls(lock, this.thsTemp.first.nativeElement.children);
    leftFixed = leftFixed.concat(thLeft);
    rightFixed = rightFixed.concat(thRight);

    return {leftFixed, rightFixed};
  }

  needFixedEls(lock: number, children: HTMLCollection) {
    let l = lock;
    const leftFixed = [];
    const rightFixed = [];
    const child = Array.prototype.slice.call(children);

    while (l > 0) {
      leftFixed.push(child.find((d, i) => i === l - 1));
      l--;
    }

    rightFixed.push(child[child.length - 1]);

    return {leftFixed, rightFixed};
  }

  /**
   *  滚动表头
   *  scrollLeft 滚动条的水平位置
   *  scrollWidth 元素的宽度且包括滚动部分及滚动条的宽度
   *  offsetWidth 元素可见区域的宽度 + 元素边框宽度（如果有滚动条还要包括滚动条的宽度）
   */
  onScroll($event: Event) {
    const el = $event.currentTarget as HTMLDivElement;

    this.headLeft = el.scrollLeft * -1;

    const {leftFixed, rightFixed} = this.getTableRowEls();

    if (el.scrollLeft !== this.scrollX) {
      this.scrollX = el.scrollLeft;
      const lastHeadX = -(el.scrollWidth - el.offsetWidth) + el.scrollLeft;

      leftFixed.forEach((c) => {
        c.style.transform = 'translateX(' + (this.scrollX) + 'px)';
        c.style.backgroundColor = '#fff';
      });

      rightFixed.forEach((c) => {
        c.style.transform = 'translateX(' + lastHeadX + 'px)';
        c.style.backgroundColor = '#fff';
      });
    }
  }

  onPage(pageConfig: IPageConfig = {pageSize: 10, page: 1, first: 0}) {
    this.pageConfig = Object.assign(this.pageConfig, pageConfig);
    this.selectedItems = [];
    this.onUrlData(); // 导航回退取值
    if (this.sortObjs.length !== 0) {
      this.sorting = DragonTradeListOrderEnum[this.sortObjs[0].name];

      for (const item of this.sortParamMap.entries()) {
        if (item[1] === this.sortObjs[0].asc) {
          this.naming = item[0];
        }
      }
    }

    // 构建参数
    const params = this.buildParams();

    if (this.currentTab.post_url === '') {
      this.listInfo = [];
      this.pageConfig.total = 0;
      return;
    }

    this.cleanSelected();
    this.xn.loading.open();

    this.xn.dragon.post(this.currentTab.post_url, params)
      .subscribe(x => {
        this.newHeads = [];
        this.fixedHeadNumber = x.data.lockCount || 0;
        this.heads = CommUtils.getListFields(this.currentSubTab.headText);

        if (x.data.column === null) {
          this.newHeads = this.heads;
        } else {
          JSON.parse(x.data.column).forEach((y) => {
            this.heads.forEach((z: any) => {
              if (y === z.value) {
                this.newHeads.push(z);
              }
            });
          });
          this.heads = this.newHeads;
          this.cdr.markForCheck();
        }

        if (x.data && x.data.data) {
          this.listInfo = x.data.data || [];
          this.allReceivables = x.data.sumReceive || 0;
          this.allPayableAmounts = x.data.sumChangePrice || 0;
          if (x.data.recordsTotal == null) {
            this.pageConfig.total = x.data.count;
          } else {
            this.pageConfig.total = x.data.recordsTotal;
          }
          if (x.data.roles !== undefined) {
            this.roleId = x.data.roles;
          }
        }

        setTimeout(() => {
          this.scrollTableLeft();
          this.xn.loading.close();
        }, 300);
        this.cdr.markForCheck();
      }, () => {
        this.xn.loading.close();
      });
  }

  /**
   *  搜索,默认加载第一页
   */
  searchMsg() {
    this.cleanSelected();
    this.onPage();
  }

  /** 清除所选数据 */
  cleanSelected() {
    this.selectedItems = [];
    this.selectedReceivables = 0;
    this.selectedPayableAmounts = 0;
  }

  /** 滚动表格 1px */
  scrollTableLeft() {
    this.tables.nativeElement.scrollLeft = 1;
    this.cdr.markForCheck();
  }

  /**
   * 进入资产池
   * @param paramsValue 资产池名称
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

  /**
   *  查看发票文件信息
   * @param item any
   */
  viewInvoiceFiles(item: any) {
    this.xn.avenger.post('/file/getNuonuoType', {id: item.nuonuoid, mainFlowId: item.mainFlowId}).subscribe(x => {
      if (x.ret === 0 && x.data) {
        let params;
        if (!!x.data.isPerson && x.data.isPerson === 1) {
          // 上传文件调用的是采购融资的接口，isAvenger为true
          const files = x.data.c_urL ? XnUtils.parseObject(x.data.c_urL, []) : [];
          files.forEach((file: any) => {
            file.isAvenger = true;
          });
          params = {
            file: JSON.stringify(files),
            isInvoice: false,
            isPerson: x.data.isPerson,
            mainFlowId: item.mainFlowId
          };
        } else {
          params = {
            file: JSON.stringify([{fileId: item.nuonuoid + '.pdf', filePath: item.mainFlowId}]),
            isInvoice: true
          };
        }
        params.isAvenger = true;

        XnModalUtils.openInViewContainer(this.xn, this.vcr, AvengerInvoiceShowModalComponent, params).subscribe();
      }
    });

  }

  /**
   * 重置
   */
  reset() {
    this.cleanSelected();
    for (const key in this.arrObjs) {
      if (this.arrObjs.hasOwnProperty(key)) {
        delete this.arrObjs[key];
      }
    }
    this.sortObjs = [];
    this.sorting = '';
    this.naming = '';
    this.buildCondition(this.searches);
    this.searchMsg(); // 清空之后自动调一次search
  }


  /**
   *  列表头样式
   * @param paramsKey string
   */
  onSortClass(paramsKey: string): string {
    if (paramsKey === this.sorting) {
      return 'sorting_' + this.naming;
    } else {
      return 'sorting';
    }
  }

  /**
   * 当前列排序
   * @param sort string
   */
  onSort(sort: string) {
    if (this.sorting === sort) {
      this.naming = this.naming === SortType.DESC ? SortType.ASC : SortType.DESC;
    } else {
      this.sorting = sort;
      this.naming = SortType.ASC;
    }
    this.sortObjs = [
      {
        name: DragonTradeListOrderEnum[this.sorting],
        asc: this.sortParamMap.get(this.naming),
      }
    ];
    this.onPage(this.pageConfig);
  }

  /**
   * 计算表格合并项
   * currentSubTab.headText.length + 可选择1 + 序号1 + 行操作+1
   */
  calcAttrColspan(): number {
    let nums: number = this.currentSubTab.headText.length + 1;
    const boolArray = [this.currentSubTab.canChecked,
      this.currentSubTab.edit && this.currentSubTab.edit.rowButtons && this.currentSubTab.edit.rowButtons.length > 0];
    nums += boolArray.filter(arr => arr === true).length;
    return nums;
  }

  /**
   *  判断列表项是否全部选中
   */
  isAllChecked(): boolean {
    return !(this.listInfo.some(x => !x.checked || x.checked && x.checked === false) || this.listInfo.length === 0);
  }

  /**
   *  全选
   */
  checkAll() {
    if (!this.isAllChecked()) {
      this.listInfo.forEach(item => item.checked = true);
      this.selectedItems = XnUtils.distinctArray2([...this.selectedItems, ...this.listInfo], 'mainFlowId');
      this.selectedReceivables = 0;
      this.selectedPayableAmounts = 0;
      this.selectedItems.forEach(item => {
        this.selectedReceivables = Number((this.selectedReceivables + item.receive).toFixed(2));         // 勾选交易总额
        this.selectedPayableAmounts = Number((this.selectedPayableAmounts + item.changePrice).toFixed(2));
      });
    } else {
      this.listInfo.forEach(item => item.checked = false);
      this.cleanSelected();
    }
  }

  /**
   * 单选
   * @param paramItem any
   */
  singleChecked(paramItem) {
    if (paramItem.checked && paramItem.checked === true) {
      paramItem.checked = false;
      this.selectedItems = this.selectedItems.filter((x: any) => x.mainFlowId !== paramItem.mainFlowId);
      this.selectedReceivables = Number((this.selectedReceivables - paramItem.receive).toFixed(2));         // 勾选交易总额
      this.selectedPayableAmounts = Number((this.selectedPayableAmounts - paramItem.changePrice).toFixed(2));
    } else {
      paramItem.checked = true;
      this.selectedItems.push(paramItem);
      this.selectedItems = XnUtils.distinctArray2(this.selectedItems, 'mainFlowId');                  // 去除相同的项
      this.selectedReceivables = Number((this.selectedReceivables + paramItem.receive).toFixed(2));         // 勾选交易总额
      this.selectedPayableAmounts = Number((this.selectedPayableAmounts + paramItem.changePrice).toFixed(2));
    }

  }

  /**
   *  查看合同，只读
   * @param paramContractInfo any
   */
  showContract(paramContractInfo) {
    const params = Object.assign({}, paramContractInfo, {readonly: true});
    XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonPdfSignModalComponent, params)
      .subscribe();
  }

  /**
   *  查看更多发票
   * @param paramItem any
   * @param mainFlowId string
   */
  viewMore(paramItem, mainFlowId: string) {
    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      MachineInvoiceListComponent,
      {mainFlowId}
    ).subscribe();
  }

  /**
   *  查看文件信息
   * @param paramFile any
   */
  viewFiles(paramFile) {
    if (typeof paramFile === 'string') {
      paramFile = JSON.parse(paramFile);
    }
    XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonMfilesViewModalComponent, paramFile)
      .subscribe();
  }

  /**
   *  格式化数据
   * @param paramData any
   */
  jsonTransForm(paramData) {
    return JsonTransForm(paramData);
  }

  /**
   *  判断数据是否长度大于显示最大值
   * @param paramFileInfos any
   */
  arrayLength(paramFileInfos: any) {
    if (!paramFileInfos) {
      return [];
    }
    let obj;
    if (JSON.stringify(paramFileInfos).includes('[')) {
      obj = typeof paramFileInfos === 'string' ? JSON.parse(paramFileInfos) : paramFileInfos;
    } else {
      obj = typeof paramFileInfos === 'string' ? paramFileInfos.split(',') : [paramFileInfos];
    }
    return obj;
  }

  stringLength(paramsString: string) {
    return paramsString.length;
  }

  /**
   * 新增备注
   * @param mainFlowId 交易id（可选）有值代表是行操作，没有值代表批量操作
   * @returns void
   */
  addMark(mainFlowId?: string): void {
    const mainFlowIdList = mainFlowId ? [mainFlowId] : this.selectedItems.map(v => v.mainFlowId);
    const checkers = [
      {
        title: '备注信息',
        checkerId: 'remark',
        type: 'text-area',
        required: true,
        options: {readonly: false, inputMaxLength: 100},
        value: ''
      },
    ];
    const params = {
      checker: checkers,
      title: '新增备注',
      buttons: ['取消', '确定'],
    };
    XnModalUtils.openInViewContainer(this.xn, this.vcr, EditModalComponent, params)
      .subscribe((v) => {
        if (!!v) {
          this.xn.loading.open();
          this.xn.dragon.post('/trade/set_remark', {mainFlowIdList, ...v}).subscribe(() => {
            this.xn.loading.close();
            this.xn.msgBox.open(false, '新增备注成功！', () => {
              this.selectedItems = [];
              this.onPage(this.pageConfig);
            });
          }, () => {
            this.xn.loading.close();
          });
        }
      });
  }

  /**
   * 查看备注
   * @param mainFlowId 交易id
   * @returns void
   */
  getMemo(mainFlowId: string): void {
    this.xn.loading.open();
    this.xn.dragon.post('/trade/get_remark_list', {mainFlowId}).subscribe(x => {
      this.xn.loading.close();
      const params = {
        get_url: '',
        multiple: false,
        title: '查看备注信息',
        heads: [
          {label: '创建时间', value: 'createTime', type: 'dateTime'},
          {label: '备注人', value: 'userName', type: 'text'},
          {label: '备注内容', value: 'remark', type: 'text'},
        ],
        searches: [],
        key: '',
        data: x.data || [],
        total: x.data.length || 0,
        inputParam: {},
        leftButtons: [
          {
            label: '新增备注', value: 'customize',
            callBack: () => {
              this.addMark(mainFlowId);
            }
          }
        ],
        rightButtons: [{label: '确定', value: 'submit'}],
      };
      // 打开备注信息弹窗
      XnModalUtils.openInViewContainer(this.xn, this.vcr, SingleSearchListModalComponent, params).subscribe();
    }, (err) => {
      console.error(err);
      this.xn.loading.close();
    });
  }

  /**
   * 建议入池/取消建议入池
   * @param paramBtnOperate 按钮配置项
   */
  setPoolAdvise(paramBtnOperate: ButtonConfigModel): void {
    this.xn.loading.open();
    this.xn.dragon.post(paramBtnOperate.post_url,
      {mainFlowIdList: this.selectedItems.map(v => v.mainFlowId), poolAdviseType: paramBtnOperate.flag}
    ).subscribe(() => {
      this.xn.msgBox.open(false, '操作成功！', () => {
        this.selectedItems = [];
        this.onPage(this.pageConfig);
      });
      this.xn.loading.close();
    }, (err) => {
      console.error(err);
      this.xn.loading.close();
    });
  }

  /**
   * 设置审核优先级
   * @param paramBtnOperate 按钮配置项
   * @returns void
   */
  setCheckPriority(paramBtnOperate: ButtonConfigModel): void {
    const checkers = [{
      title: '优先级',
      checkerId: 'checkPriorityType',
      type: 'select',
      options: {ref: 'checkPriorityType'},
      required: 1
    }];
    const params = {
      checker: checkers,
      title: '设置审核优先级',
      buttons: ['取消', '确定'],
    };
    this.openEditModal(paramBtnOperate, params);
  }

  /**
   * 设置放款优先级
   * @param paramBtnOperate 按钮配置项
   * @returns void
   */
  setLoanPriority(paramBtnOperate: ButtonConfigModel): void {
    const checkers = [{
      title: '优先级',
      checkerId: 'loanPriorityType',
      type: 'select',
      options: {ref: 'loanPriorityType'},
      required: 1
    }];
    const params = {
      checker: checkers,
      title: '设置放款优先级',
      buttons: ['取消', '确定'],
    };
    this.openEditModal(paramBtnOperate, params);
  }

  /**
   * 设置预计放款时间
   * @param paramBtnOperate 按钮配置项
   * @returns void
   */
  setPlanLoan(paramBtnOperate: ButtonConfigModel): void {
    const checkers = [
      {
        title: '预计放款时间',
        checkerId: 'planLoanTime',
        type: 'date4',
        validators: {},
        required: 1,
        options: {minDate: true, format: 'YYYY-MM-DD'}, // 只能选择今天及之后的日期
        value: '',
      },
    ];
    const params = {
      checker: checkers,
      title: '设置预计放款时间',
      buttons: ['取消', '确定'],
    };
    this.openEditModal(paramBtnOperate, params);
  }

  /**
   * 打开EditModalComponent弹窗并发起请求
   * @param paramBtnOperate 按钮配置
   * @param params modal参数配置
   */
  openEditModal(paramBtnOperate: ButtonConfigModel, params: { checker: any[], title: string, buttons: string[] }) {
    XnModalUtils.openInViewContainer(this.xn, this.vcr, EditModalComponent, params)
      .subscribe((v) => {
        if (v) {
          if (v.planLoanTime) {
            v.planLoanTime = new Date(v.planLoanTime).getTime();
          }
          this.xn.loading.open();
          this.xn.dragon.post(paramBtnOperate.post_url, {mainFlowIdList: this.selectedItems.map(x => x.mainFlowId), ...v})
            .subscribe(x => {
              this.xn.loading.close();
              if (x.ret === 0) {
                this.xn.loading.close();
                this.xn.msgBox.open(false, '设置成功！', () => {
                  this.selectedItems = [];
                  this.onPage(this.pageConfig);
                });
              }
            }, () => {
              this.xn.loading.close();
            });
        } else {
          return;
        }
      });
  }

  /** 检查是否有勾选 */
  checkSelectedThen(fn?: () => void | any) {
    if (this.selectedItems.length < 1) {
      this.xn.msgBox.open(false, '未选择交易');
    } else {
      if (fn) { fn.call(this); }
    }
  }

  /**
   *  表头按钮组事件
   * @param paramBtnOperate ButtonConfigModel
   */
  handleHeadClick(paramBtnOperate: ButtonConfigModel) {
    if (paramBtnOperate.operate === 'download_file') {
      const selectedRows = this.listInfo.filter(x => x.checked && x.checked === true);
      const params = {
        hasSelect: !!selectedRows && selectedRows.length > 0,
      };

      XnModalUtils.openInViewContainer(this.xn, this.vcr, GjDownloadModalComponent, params)
        .subscribe(data => {
          if (data) {
            this.xn.loading.open();
            const newMainFlowId = this.listInfo.filter(z => z.isProxy === IsProxyDef.CDR);
            const newParam = {mainFlowIdList: [], fileTypeKey: {}, isClassify: data.isClassify};
            if (data.downloadRange === DownloadRange.All) {
              newParam.mainFlowIdList = newMainFlowId.map(c => c.mainFlowId);
            }
            if (data.downloadRange === DownloadRange.Selected) {
              if (this.selectedItems.length === 0) {
                this.xn.msgBox.open(false, '未选择交易');
                return;
              }
              newParam.mainFlowIdList = this.selectedItems.map(c => c.mainFlowId);
            }
            const rObj = {};
            data.chooseFile.split(',').forEach(x => rObj[x] = true);
            newParam.fileTypeKey = rObj;
            if ((data.downloadRange === DownloadRange.All && newMainFlowId.length > 0)
              || (data.downloadRange === DownloadRange.Selected && this.selectedItems.length > 0)) {
              this.xn.dragon.download(paramBtnOperate.post_url, newParam).subscribe((v: any) => {
                this.xn.loading.close();
                const reader = new FileReader();
                reader.onload = () => {
                  try {
                    const content = JSON.parse(`${reader.result}`);
                    if (content.ret === 1000) {
                      this.xn.msgBox.open(false, content.msg);
                    }
                  } catch (e) {
                    this.xn.api.save(v._body, '台账附件.zip');
                  }
                };
                reader.readAsText(v._body);
              });
            }
          }

        });

    }
    if (paramBtnOperate.operate === 'export_file') {
      this.downloadApprovallist(paramBtnOperate);
    }
    if (paramBtnOperate.operate === 'sub_zhongdeng_register') {
      this.checkSelectedThen(this.zDRegister);
    }
    if (paramBtnOperate.operate === 'add-data') {
      this.checkSelectedThen(this.batchModify);
    }
    if (paramBtnOperate.operate === 'change-signType') {
      this.checkSelectedThen(this.setSignType);
    }
    if (paramBtnOperate.operate === 'reject-program') {
      this.checkSelectedThen(this.rejectProgram);
    }
    if (paramBtnOperate.operate === 'add-mark') {
      // 新增备注
      this.addMark();
    }
    if (paramBtnOperate.operate === 'set-pool-advise') {
      // 建议入池
      this.setPoolAdvise(paramBtnOperate);
    }
    if (paramBtnOperate.operate === 'del-pool-advise') {
      // 取消建议入池
      this.setPoolAdvise(paramBtnOperate);
    }
    if (paramBtnOperate.operate === 'set-check-priority') {
      // 设置审核优先级
      this.setCheckPriority(paramBtnOperate);
    }
    if (paramBtnOperate.operate === 'set-loan-priority') {
      // 设置放款优先级
      this.setLoanPriority(paramBtnOperate);
    }
    if (paramBtnOperate.operate === 'set-plan-loan') {
      // 设置预计放款时间
      this.setPlanLoan(paramBtnOperate);
    }
  }

  /** 中登注册 */
  zDRegister() {
    this.xn.router.navigate([`/machine-account/zhongdeng/new`],
      {
        queryParams: {
          relate: 'mainIds',
          relateValue: this.selectedItems.map((x: any) => x.mainFlowId)
        }
      });
  }

  /** 批量补充 */
  batchModify() {
    const param = {mainList: this.selectedItems};
    this.localStorageService.setCacheValue('batchModifyMainList', param);
    this.xn.router.navigate(['/abs-gj/capital-pool/batch-modify'], {
      queryParams: {isDemoList: true}
    });
  }

  /**
   * 修改协助处理人
   */
  editHelpHandler() {
    const mainFlowIdList = this.selectedItems.map(x => {
      return x.mainFlowId;
    });
    const params = {
      type: 'select-helpUserName',
      roleId: 'operator',
      mainFlowIdList
    };
    XnModalUtils.openInViewContainer(this.xn, this.vcr, BusinessMatchmakerChooseComponent, params)
      .subscribe(() => {
        this.onPage(this.pageConfig);
        this.selectedItems = [];
      });
  }

  rejectProgram() {
    const mainIds = this.selectedItems.map(c => c.mainFlowId);
    this.xn.router.navigate([`/abs-gj/record/new/${FlowId.CMNRetreat}`],
      {
        queryParams: {
          id: FlowId.CMNRetreat,
          relate: 'mainIds',
          relateValue: mainIds,
        }
      });
  }

  /**
   * 行按钮组事件
   * @param paramItem 当前行数据
   * @param paramBtnOperate 按钮操作配置
   */
  handleRowClick(paramItem, paramBtnOperate: ButtonConfigModel) {
    if (paramBtnOperate.operate === 'addData') {
      const checkers = [{
        title: '交易ID',
        checkerId: 'mainFlowId',
        type: 'text',
        options: {readonly: true},
        value: paramItem.mainFlowId
      }, {
        title: '后补资料',
        checkerId: 'backUpFiles',
        type: 'dragonMfile',
        required: true,
        checked: false,
        options: {fileext: 'jpg, jpeg, png, pdf'},
        value: paramItem.backUpFiles || ''
      }, {
        title: '是否需后补资料',
        checkerId: 'isBackUp',
        type: 'radio',
        required: false,
        selectOptions: IsBackUpOptions,
        value: paramItem.isBackUp
      }];
      const params = {
        checker: checkers,
        title: '后补资料弹窗',
        buttons: ['取消', '确定'],
      };
      XnModalUtils.openInViewContainer(this.xn, this.vcr, EditModalComponent, params)
        .subscribe((v) => {
          if (!!v) {
            v.isBackUp = v.isBackUp ? Number(v.isBackUp) : YesOrNo.PnNo;
            v.mainFlowId = paramItem.mainFlowId;
            this.xn.dragon.post('/trade/set_back_up', v)
              .subscribe(() => {
                this.onPage(this.pageConfig);
                this.selectedItems = [];
              });
          }
        });

    } else {
      paramBtnOperate.click(paramItem, this.xn, this.hwModeService);
    }
  }

  /**
   * 构建搜索项
   * @param searches any
   */
  private buildShow(searches) {
    this.shows = [];
    this.onUrlData();
    this.buildCondition(searches);
  }

  // 台账中登登记权限
  openZhongdeng() {
    return this.xn.user.orgType === OrgTypeEnum.PLATFORM && this.subDefaultValue === SubTabValue.DOING
      && (this.xn.user.roles.includes(AuditorTypeEnum.OPERATOR) || this.xn.user.roles.includes(AuditorTypeEnum.REVIEWER));
  }

  // 台账修改预录入信息权限
  changeInfo(item: any) {
    const allTabFlag = this.rowAuthJudge(item, SubTabValue.DOING);
    return allTabFlag && this.xn.user.orgType === OrgTypeEnum.PLATFORM
      && this.xn.user.roles.includes(AuditorTypeEnum.OPERATOR);
  }

  stopControl(paramItem) {
    const allTabFlag = this.rowAuthJudge(paramItem, SubTabValue.DOING) || this.rowAuthJudge(paramItem, SubTabValue.TODO);
    return (this.xn.user.orgType === OrgTypeEnum.PLATFORM || this.xn.user.orgType === OrgTypeEnum.FACTORING)
      && (this.xn.user.roles.includes(AuditorTypeEnum.OPERATOR) && allTabFlag || this.xn.user.roles.includes(AuditorTypeEnum.REVIEWER)
        && allTabFlag && paramItem.tradeStatus !== TradeStatus.Stop);
  }

  setSignType() {
    const checkers = [{
      title: '交易信息',
      checkerId: 'mainFlowIdList',
      type: 'set-signType',
      options: {readonly: true},
      value: this.selectedItems
    }, {
      title: '签署方式',
      checkerId: 'signType',
      type: 'select',
      required: 1,
      options: {ref: 'signType'},
    }];
    const params = {
      checker: checkers,
      title: '签署方式弹窗',
      buttons: ['取消', '确定'],
    };
    XnModalUtils.openInViewContainer(this.xn, this.vcr, EditModalComponent, params)
      .subscribe((v) => {
        v.mainFlowIdList = this.selectedItems.map(c => c.mainFlowId);
        v.signType = Number(v.signType);
        this.xn.dragon.post('/trade/set_sign_type', v).subscribe(x => {
          this.onPage(this.pageConfig);
          this.selectedItems = [];
        });
      });
  }

  // 修改备注信息
  changeRemark(item: any) {
    return this.rowAuthJudge(item, SubTabValue.DOING);
  }

  // 进入审核页面权限
  openView() {
    return this.xn.user.orgType === OrgTypeEnum.PLATFORM && (this.xn.user.roles.includes('operator') || this.xn.user.roles.includes('reviewer'));
  }

  /**
   * 搜索项值格式化
   * @param searches any
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
      obj.selectOptions = item.selectOptions;
      if (item.checkerId === this.timeId[0]) {
        obj.value = JSON.stringify(tmpTime);
      } else {
        obj.value = this.arrObjs[item.checkerId];
      }
      objList.push(obj);
    }

    this.shows = XnUtils.deepClone(objList);  // 深拷贝，并排序;
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
            // return;
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

  /** 构建列表请求参数 */
  private buildParams() {
    const params: any = {
      pageNo: this.pageConfig.page,
      pageSize: this.pageConfig.pageSize,
      status: Number(this.currentSubTab.params),
    };

    // 排序处理
    if (this.sortObjs.length !== 0) {
      params.order = this.sortObjs;
    }
    // 搜索处理
    if (this.searches.length > 0) {
      for (const search of this.searches) {

        if (!XnUtils.isEmpty(this.arrObjs[search.checkerId])) {
          if (search.type === 'text') {
            params[search.checkerId] = this.arrObjs[search.checkerId].trim();
          }

          if (search.checkerId === 'transactionStatus') {
            params.flowId = this.arrObjs[search.checkerId];
            params.isProxy = IsProxyDef.CDR;
            if (this.subDefaultValue === SubTabValue.ALL && String(this.arrObjs[search.checkerId]) === '99'
              || String(this.arrObjs[search.checkerId]) === '100') {
              params.tradeStatus = 99;
              params.retreatStatus = String(this.arrObjs[search.checkerId]) === '99' ? 0 : 4;
              delete params.flowId;
              delete params.isProxy;
            }

          }
          if (search.checkerId === 'isPriorityLoanDate') {
            const priorityLoanDate = JSON.parse(this.arrObjs[search.checkerId]);
            if (priorityLoanDate.isPriorityLoanDate <= 0) {
              params.isPriorityLoanDate = priorityLoanDate.isPriorityLoanDate;
            } else {
              params.priorityLoanDateStart = priorityLoanDate.priorityLoanDateStart;
              params.priorityLoanDateEnd = priorityLoanDate.priorityLoanDateEnd;
              params.isPriorityLoanDate = priorityLoanDate.isPriorityLoanDate;
            }
          }
          if (search.checkerId === 'isHeadPreDate') {
            const priorityLoanDate = JSON.parse(this.arrObjs[search.checkerId]);
            if (priorityLoanDate.isPriorityLoanDate <= 0) {
              params.isHeadPreDate = priorityLoanDate.isPriorityLoanDate;
            } else {
              params.headPreDateStart = priorityLoanDate.priorityLoanDateStart;
              params.headPreDateEnd = priorityLoanDate.priorityLoanDateEnd;
              params.isHeadPreDate = priorityLoanDate.isPriorityLoanDate;
            }
          }
          if (search.checkerId === 'productType') {
            const val = JSON.parse(this.arrObjs[search.checkerId]);
            params.type = Number(val.proxy);
            if (!!val.status) {
              params.selectBank = Number(val.status);
            }
          }
          if (search.checkerId === 'receive') { // 应收账款金额搜索过滤处理
            params.receive = this.arrObjs[search.checkerId].replace(/,/g, '');
          }
          if (search.checkerId === 'valueDate') {
            const date = JSON.parse(this.arrObjs[search.checkerId]);
            params.valueDateStart = date.beginTime;
            params.valueDateEnd = date.endTime;
          }
          if (search.checkerId === 'tradeTime') {  // 交易流程各个步骤的时
            const data = JSON.parse(this.arrObjs[search.checkerId]);
            if (!!data.flowId) {
              params.flowId = data.flowId;
              params.isProxy = IsProxyDef.CDR;
            }
            if (!!data.time) {
              params.operatorTimeStart = JSON.parse(data.time).beginTime;
              params.operatorTimeEnd = JSON.parse(data.time).endTime;
            }
          }

          params[search.checkerId] = this.arrObjs[search.checkerId];
        }
      }
    }
    // 列表子标签页，构建参数 ,当且子标签状态有大于2中时,添加状态参数
    if (this.currentTab.subTabList.length >= 2) {
      if (this.subDefaultValue === SubTabValue.ALL) {
        params.selectAll = 1;
      }
      params.status = SubTabParam[this.subDefaultValue];
    }

    if (this.orgType === OrgTypeEnum.PROJECT_COMPANY) {
      params.projectCompany = this.projectCompany;
    }

    params.isProxy = IsProxyDef.CDR;
    params.factoringAppId = CompanyAppId.BLH;

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
      this.beginTime = urlData.data.beginTime || this.beginTime;
      this.pageConfig = urlData.data.pageConfig || this.pageConfig;
      this.arrObjs = urlData.data.arrObjs || this.arrObjs;
      this.sortObjs = urlData.data.sortObjs || this.sortObjs;
      this.defaultValue = urlData.data.defaultValue || this.defaultValue;
      this.subDefaultValue = urlData.data.subDefaultValue || this.subDefaultValue;
      this.endTime = urlData.data.endTime || this.endTime;
    } else {
      this.xn.user.setUrlData(this.xn.router.url, {
        pageConfig: this.pageConfig,
        beginTime: this.beginTime,
        endTime: this.endTime,
        arrObjs: this.arrObjs,
        sortObjs: this.sortObjs,
        defaultValue: this.defaultValue,
        subDefaultValue: this.subDefaultValue
      });
    }
  }

  /**
   * 行操作权限判断
   * @param item any
   * @param type string
   */
  rowAuthJudge(item: any, type: string): boolean {
    return FlowIdObj[type.toString()].indexOf(item.flowId) > -1;
  }

  // 导出清单
  downloadApprovallist(paramItem: any) {
    const params = {hasSelect: !!this.selectedItems && this.selectedItems.length > 0};
    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      ExportListModalComponent,
      params
    ).subscribe(x => {
      if (x === '') {
        return;
      }
      this.xn.loading.open();
      this.newSelectItems = this.selectedItems.filter((y: any) => y.isProxy === IsProxyDef.CDR);
      const newParam = {
        status: SubTabParam[this.subDefaultValue],
        mainFlowIdList: [],
        type: '',
      };
      if (x.exportList === DownloadRange.All) {
        newParam.type = DownloadRange.All;
      }
      if (x.exportList === DownloadRange.Selected) {
        newParam.type = DownloadRange.Selected;
        newParam.mainFlowIdList = this.newSelectItems.map(c => c.mainFlowId);
      }
      if (
        newParam.type === DownloadRange.All
        || (newParam.type === DownloadRange.Selected && this.newSelectItems.length > 0)
      ) {
        const paramsTotal = Object.assign({}, this.buildParams(), newParam);
        this.xn.dragon.download(paramItem.post_url, paramsTotal).subscribe((con: any) => {
          this.xn.api.save(con._body, '台账列表清单.xlsx');
          this.xn.loading.close();
        });
      }
    });
  }

  // 进入审核页面
  handMore(item: any) {
    let isOk = false;
    if (item.nowProcedureId === ProgressStep.End) {
      this.xn.router.navigate([`/abs-gj/record/todo/view/${item.recordId}`]);
    }
    this.roleId.forEach(x => {
      if (_.startsWith(x, item.nowProcedureId.slice(0, 4))) {
        isOk = true;
      }
    });
    if (isOk) {
      if (item.nowProcedureId === ProgressStep.Operate || item.nowProcedureId === ProgressStep.Review) {
        if (item.flowId === FlowId.GjPlatformVerify && item.zhongdengStatus === ZdStatus.REGISTER_PROGRESS) {
          this.xn.msgBox.open(false, '该流程中登登记处于登记中,不可处理');
        } else {
          this.xn.router.navigate([`/abs-gj/record/todo/edit/${item.recordId}`]);
        }
      } else {
        this.xn.router.navigate([`/abs-gj/record/todo/view/${item.recordId}`]);
      }
    }
  }

  /** 查看中登登记，中登相关页面都统一在 machine-account 路由下 */
  viewZDProgress(item) {
    this.xn.router.navigate([`/machine-account/zhongdeng/record/${item.zhongdengRegisterId}/${item.zhongdengStatus}`]);
  }
}

enum DragonTradeListOrderEnum {
  mainFlowId           = 1,
  tradeDate            = 2,
  receive              = 3,
  changePrice          = 4,
  discountRate         = 5,
  payConfirmId         = 6,
  isChangeAccount      = 7,
  priorityLoanDate     = 8,
  isRegisterSupplier   = 9,
  tradeStatus          = 10,
  isLawOfficeCheck     = 11,
  supplierRegisterDate = 12,
  factoringEndDate     = 13,
  zhongdengStatus      = 14,
  realLoanDate         = 15,
}

const FlowIdObj = {
  DOING: [FlowId.GjFinancingPre, FlowId.GjFinancing, FlowId.GjPlatformVerify, FlowId.GjSupplierSign],
  TODO: [FlowId.GjFactoringPassback, 'wait_verification_500', 'verificating_500', 'factoring_sign_500', 'wait_loan_500'],
  DONE: ['loaded_500'],
  SPECIAL: [],
  stop: ['99', '100']
};
