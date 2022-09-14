/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：MachineListComponent
 * @summary：金地-台账列表
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 hucongying      金地数据对接        2020-12-03
 * **********************************************************************
 */

import { Component, OnInit, ViewContainerRef, AfterViewInit, ChangeDetectorRef, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TabConfigModel, TabListOutputModel, SubTabListOutputModel, ButtonConfigModel, ListHeadsFieldOutputModel } from 'libs/shared/src/lib/config/list-config-model';
import CommBase from 'libs/shared/src/lib/public/component/comm-base';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import CommUtils from 'libs/shared/src/lib/public/component/comm-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { JsonTransForm } from 'libs/shared/src/lib/public/pipe/xn-json.pipe';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import MachineIndexTabConfig, { SubTabEnum, ApiProxyEnum } from './machine-list.config';
import { CheckersOutputModel } from 'libs/shared/src/lib/config/checkers';
import { DragonPdfSignModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/pdf-sign-modal.component';
import { DownloadAttachmentsModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/download-attachments-modal.component';
import { ExportListModalComponent } from 'libs/shared/src/lib/public/modal/export-list-modal.component';
import * as _ from 'lodash';
import { MfilesViewModalComponent } from 'libs/shared/src/lib/public/modal/mfiles-view-modal.component';
import { DragongetCustomListComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/custom-list-modal.component';
import { EditModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/edit-modal.component';
import { MachineInvoiceListComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/machine-invoice-list-modal.component';
import { BusinessMatchmakerChooseComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/business-choose-matchmaker-modal.component';
import { AvengerInvoiceShowModalComponent } from 'libs/products/avenger/src/lib/shared/components/modal/avenger-invoice-show-modal.component';
import { fromEvent } from 'rxjs';
import { applyFactoringTtype, CustomSearchNumber, HeadquartersTypeEnum } from 'libs/shared/src/lib/config/select-options';
import { JdDataChangeModalComponent } from '../../share/modal/jd-dataChange-modal.component'
import { PdfSignModalComponent } from 'libs/shared/src/lib/public/modal/pdf-sign-modal.component';
import { MachineCustomFieldService } from 'libs/shared/src/lib/services/machine-custom-search-field.service';
import { DragongetCustomFiledComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/custom-field-modal.component';
import { SingleSearchListModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/single-searchList-modal.component';
import { IsProxyDef } from 'libs/shared/src/lib/config/enum/common-enum';
declare const moment: any;
declare const $: any;

@Component({
  templateUrl: `./machine-list.component.html`,
  styleUrls: ['./machine-list.component.css']
})
// tslint:disable-next-line: whitespace
export class MachineListComponent implements OnInit, AfterViewInit, OnDestroy {
  private arrObjs = {} as any;  // 缓存后退的变量
  private sortObjs = [];         // 缓存后退的排序项
  private paging = 1;          // 共享该变量
  private beginTime: any;
  private endTime: any;
  private timeId = [];
  private nowTimeCheckId = '';
  private preChangeTime: any[] = [];               // 上次搜索时间段,解决默认时间段搜索请求两次
  private sorting = '';               // 共享该变量 列排序
  private naming = '';               // 共享该变量 列css样式
  private subTabEnum = SubTabEnum;       // 子标签参数映射枚举
  private apiProxyEnum = ApiProxyEnum;

  private searches: CheckersOutputModel[] = [];                                    // 面板搜索配置项暂存
  public tabConfig: TabConfigModel = new TabConfigModel();                  // 当前列表配置
  public currentTab: TabListOutputModel = new TabListOutputModel();              // 当前标签页
  public currentSubTab: SubTabListOutputModel = new SubTabListOutputModel();           // 当前子标签页
  public defaultValue = 'B';                                   // 默认激活第一个标签页
  public subDefaultValue = 'DOING';                               // 默认子标签页
  public listInfo: any[] = [];                                    // 数据
  public pageConfig = { pageSize: 10, first: 0, total: 0 };  // 页码配置
  public shows: CheckersOutputModel[] = [];                                    // 搜索项
  public searchForm: FormGroup;                           // 搜索表单组
  public formModule = 'dragon-input';
  public selectedItems: any[] = [];       // 选中的项
  public oldSelectItems: any[] = [];
  public newSelectItems: any[] = [];
  public newHeads: any[] = [];  // 后端返回的自定义table列表
  base: CommBase;
  loanDate: string;
  approvalMemo: string;
  valueDate: string;
  // is_jindie = -1; 暂时无用
  businessinvoice = false;
  heads: any[];
  roleId: string[] = [];
  displayShow = true;
  searchShow: CheckersOutputModel[] = [];     // 搜索项
  headLeft = 0;
  headstest = false;
  // 资产池传入数据 exp {capitalId: "CASH_POOLING_4", type: "2"}
  public formCapitalPool: any = {
    capitalId: 'CASH_POOLING_100',
    isProxy: 56,
  };
  public selectedReceivables = 0;   // 所选交易的应收账款金额汇总
  public selectedPayableAmounts = 0;   // 所选交易的转让价款汇总
  public allReceivables = 0;   // 所有交易的应收账款金额汇总
  public allPayableAmounts = 0;   // 所有交易的转让价款汇总
  public scrollX = 0;   // 滚动条滚动距离
  public FixedHead: number[] = [];  // 需要固定的表格列
  public FixedHeadNubmer = 0;   // 固定表格列数量
  public subResize: any;
  public machineType: number;
  // 自定义筛选条件status传值范围定义
  public customSearchNumber: number = CustomSearchNumber.GEMDALE;
  @ViewChild('tables') tables: ElementRef;
  private projectCompany = this.xn.user.orgName;
  private orgType = this.xn.user.orgType;

  constructor(
    public xn: XnService,
    private vcr: ViewContainerRef,
    private cdr: ChangeDetectorRef,
    private router: ActivatedRoute,
    private er: ElementRef,
    public hwModeService: HwModeService,
    public localStorageService: LocalStorageService,
    public MachineCustomFieldService: MachineCustomFieldService) {
  }

  ngOnInit(): void {
    if (this.xn.user.orgType === 3) {
      this.tabConfig = MachineIndexTabConfig.getConfig().machineAccount;
    } else if (this.xn.user.orgType === 99) {
      this.tabConfig = MachineIndexTabConfig.getConfig().platmachineAccount;
    } else {
      this.tabConfig = MachineIndexTabConfig.getConfig().suppliermachineAccount;
    }
    this.initData();

    this.subResize = fromEvent(window, 'resize').subscribe(() => {
      this.formResize();
    });

  }

  ngAfterViewInit() {
    this.formResize();
  }
  ngOnDestroy() {
    // 在组件生命周期销毁里取消事件，防止出现页面多次执行之后卡顿
    if (this.subResize) {
      this.subResize.unsubscribe();
    }
  }
  formResize() {
    const scrollContainer = $(`<div class="custom-scrollbar" style="box-sizing: border-box;
            position: absolute;height: 100px;width: 100px;top: -3000px;left: -3000px;
            overflow: scroll;z-index: 1000;overflow-y: scroll;"></div>`).prependTo($('body'));
    const scrollContent = $(`<div class="inner" style="box-sizing: border-box;
            height: 200px;"></div>`).appendTo(scrollContainer);
    // 滚动条的宽度
    const scrollBarWidth1 = scrollContainer.outerWidth(true) - scrollContent.outerWidth(true);
    scrollContainer.remove();
    $('.head-height', this.er.nativeElement).attr('style', `width: calc(100% - ${scrollBarWidth1}px`);
  }

  /**
   *  查看线上数据信息
   * @param
   * @param
   */
  toViewOnlineData(item) {
    const params = {
      title: '金地接口获取数据情况',
      type: 'platmachineAccount',
      defaultValue: 'B',
      mainFlowId: item.mainFlowId,
      billNumber: ''
    };
    XnModalUtils.openInViewContainer(this.xn, this.vcr, JdDataChangeModalComponent, params).subscribe(() => {
    });
  }

  /**
   *  金地数据对接情况
   * @param params
   * @param
   */
  toViewVankeData(item) {
    const params = {
      title: '金地数据对接情况',
      type: 'platmachineAccount',
      defaultValue: 'A',
      mainFlowId: item.mainFlowId
    };
    XnModalUtils.openInViewContainer(this.xn, this.vcr, JdDataChangeModalComponent, params).subscribe(() => {
    });
  }

  /**
   *  标签页，加载列表信息
   * @param paramTabValue this.subDefaultValue
   * @param init 是否为初始加载，true 不检查切换属性值与当前标签值
   */
  public async initData(paramTabValue?: string) {

    this.subDefaultValue = paramTabValue || 'DOING'; // 重置子标签默认
    // 页面配置
    const find = this.tabConfig.tabList.find(tab => tab.value === this.defaultValue);
    this.currentTab = !!find ? find : new TabListOutputModel();

    // 子页面配置
    const subFind = this.currentTab.subTabList.find(sub => sub.value === this.subDefaultValue);
    this.currentSubTab = !!subFind ? subFind : new SubTabListOutputModel();
    this.searches = this.currentSubTab.searches; // 当前标签页的搜索项

    // 自定义搜索项
    const newSearches = await this.MachineCustomFieldService.getCustomField(this.customSearchNumber, this.currentSubTab.searches);
    this.searches = XnUtils.deepClone(newSearches)
    this.buildShow(this.searches);
    this.onPage({ page: this.paging });
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
        const newSearches = await this.MachineCustomFieldService.getCustomField(this.customSearchNumber, this.currentSubTab.searches);
        this.searches = XnUtils.deepClone(newSearches)
        this.buildShow(this.searches);
      }
    });
  }

  // 自定义列表
  getCustomlist() {
    const params = {
      FixedNumber: this.FixedHeadNubmer,
      headText: JSON.stringify(this.currentSubTab.headText),
      selectHead: JSON.stringify(this.newHeads),
      status: this.currentSubTab.params
    };
    XnModalUtils.openInViewContainer(this.xn, this.vcr, DragongetCustomListComponent, params).
      subscribe((x: any[]) => {
        this.onPage({ page: this.paging });
      });

  }

  show() {
    this.displayShow = !this.displayShow;
  }

  /**
   *  子标签tab切换，加载列表
   * @param paramSubTabValue
   */
  public async handleSubTabChange(paramSubTabValue: string) {

    if (this.subDefaultValue === paramSubTabValue) {
      return;
    } else {
      this.selectedItems = [];
      this.selectedReceivables = 0;
      this.selectedPayableAmounts = 0;
      this.listInfo = [];
      this.naming = '';
      this.sorting = '';
      this.paging = 1;
      this.pageConfig = { pageSize: 10, first: 0, total: 0 };
      // 重置全局变量
    }
    this.subDefaultValue = paramSubTabValue;
    const subFind = this.currentTab.subTabList.find(sub => sub.value === this.subDefaultValue);
    this.currentSubTab = !!subFind ? subFind : new SubTabListOutputModel();

    // 自定义搜索项
    const newSearches = await this.MachineCustomFieldService.getCustomField(this.customSearchNumber, this.currentSubTab.searches);
    this.searches = XnUtils.deepClone(newSearches)
    this.buildShow(this.searches);
    this.onPage({ page: this.paging });
  }


  /**
   *  滚动表头
   *  scrollLeft 滚动条的水平位置
   *  scrollWidth 元素的宽度且包括滚动部分及滚动条的宽度
   *  offsetWidth 元素可见区域的宽度 + 元素边框宽度（如果有滚动条还要包括滚动条的宽度）
   */
  onScroll($event: any) {

    this.headLeft = $event.srcElement.scrollLeft * -1;
    const FixHead = []; // 冻结的列Dom对象数组
    let headNumber = this.FixedHeadNubmer + 2;

    while (headNumber >= 2) { // 获取冻结列Dom对象
      const Column = $('.height').find(`.head-height tr th:nth-child(${headNumber}),.table-height tr td:nth-child(${headNumber})`);
      FixHead.unshift(Column);
      headNumber--;
    }

    const ColumFirst = $('.height').find('.head-height tr th:nth-child(1),.table-height tr td:nth-child(1)');  // 勾选列
    const ColumLast = $('.height').find('.head-height tr th:last-child,.table-height tr td:last-child');      // 操作列
    if ($event.srcElement.scrollLeft !== this.scrollX) {
      this.scrollX = $event.srcElement.scrollLeft;
      const lastHeadX = -($event.srcElement.scrollWidth - $event.srcElement.offsetWidth) + $event.srcElement.scrollLeft;
      if (FixHead.length > 0) { // 固定冻结的列
        FixHead.forEach(v => {
          v.each((index, col: any) => {
            col.style.transform = 'translateX(' + (this.scrollX) + 'px)';
            col.style.backgroundColor = col.style.backgroundColor ? col.style.backgroundColor : '#fff';
          });
        });
      }
      ColumFirst.each((index, col: any) => { // 固定第一列
        col.style.transform = 'translateX(' + this.scrollX + 'px)';
        col.style.backgroundColor = '#fff';
      });
      // 固定最后一列
      if (this.currentSubTab?.edit && this.currentSubTab?.edit?.rowButtons && this.currentSubTab?.edit?.rowButtons.length) {
        ColumLast.each((index, col: any) => {
          col.style.transform = 'translateX(' + lastHeadX + 'px)';
          col.style.backgroundColor = '#fff';
        });
      }

    }
  }

  /**
   * @param e  page: 新页码、 pageSize: 页面显示行数、first: 新页面之前的总行数、pageCount : 页码总数
   * @summary 采购融资，地产abs  请求api有区别，采购融资：avenger 、地产abs：api
   */
  public onPage(e?: { page: number, first?: number, pageSize?: number, pageCount?: number },) {
    this.selectedItems = [];
    this.paging = e.page || 1;
    this.onUrlData(); // 导航回退取值
    if (this.sortObjs.length !== 0) {
      this.sorting = DragonTradeListOrderEnum[this.sortObjs[0].name];
      this.naming = machineAccountSort[this.sortObjs[0].asc];
    }
    this.pageConfig = Object.assign({}, this.pageConfig, e);

    // 构建参数
    const params = this.buildParams(this.currentSubTab.params);
    if (this.currentTab.post_url === '') {
      // 固定值
      this.listInfo = [];
      this.pageConfig.total = 0;
      return;
    }
    this.selectedItems = [];
    this.selectedReceivables = 0;
    this.selectedPayableAmounts = 0;
    this.xn.loading.open();
    // 采购融资 ：avenger,  地产abs
    // 增加orgType判断增加参数传递, 过滤项目公司
    if (this.orgType === 201) {
      params.projectCompany = this.projectCompany;
    }
    this.xn[this.apiProxyEnum[this.defaultValue]].post(this.currentTab.post_url, params).subscribe(
      x => {
        this.newHeads = [];
        this.FixedHeadNubmer = x.data.lockCount || 0;
        if (x.data.column === null) {
          this.heads = CommUtils.getListFields(this.currentSubTab.headText);
          this.newHeads = this.heads;
        } else {
          this.heads = CommUtils.getListFields(this.currentSubTab.headText);
          JSON.parse(x.data.column).forEach((y, index) => {
            this.heads.forEach((z: any) => {
              if (y === z.value) { this.newHeads.push(z) }
            });
          });
          this.heads = this.newHeads;
          this.cdr.markForCheck();
        }
        if (x.data && x.data.data && x.data.data.length) {
          x.data.data.forEach(obj => {
            if (obj.isProxy !== 56) {
              obj.color = '#D9D9D9';
            }
          });
          this.listInfo = x.data.data;
          this.allReceivables = x.data.sumReceive || 0;
          this.allPayableAmounts = x.data.sumChangePrice || 0;
          if (x.data.recordsTotal === undefined) {
            this.pageConfig.total = x.data.count;
          } else {
            this.pageConfig.total = x.data.recordsTotal;
          }
          if (x.data.roles !== undefined) {
            this.roleId = x.data.roles;
          }
        } else if (x.data && x.data.lists && x.data.lists.length) {
          this.listInfo = x.data.lists;
          this.pageConfig.total = x.data.count;
          this.allReceivables = x.data.sumReceive || 0;
          this.allPayableAmounts = x.data.sumChangePrice || 0;
        } else {
          // 固定值
          this.listInfo = [];
          this.pageConfig.total = 0;
          this.allReceivables = 0;
          this.allPayableAmounts = 0;
        }
        this.cdr.markForCheck();
        // this.operateMoney();
      },
      () => {
        // 固定值
        this.listInfo = [];
        this.selectedItems = [];
        this.selectedReceivables = 0;
        this.selectedPayableAmounts = 0;
        this.pageConfig.total = 0;
        this.allReceivables = 0;
        this.allPayableAmounts = 0;
        this.FixedHeadNubmer = 0;
      },
      () => {
        setTimeout(() => {
          this.getLast();
        }, 300);
        this.xn.loading.close();
      });
  }

  /**
   *  搜索,默认加载第一页
   */
  public searchMsg() {
    this.selectedItems = [];
    this.selectedReceivables = 0;
    this.selectedPayableAmounts = 0;
    this.paging = 1;
    this.onPage({ page: this.paging });
  }

  // 固定最后一列
  getLast() {
    const newTables = $(this.tables.nativeElement);
    newTables.scrollLeft(20);
    this.cdr.markForCheck();
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
        this.xn.router.navigate(['/new-gemdale/assets-management/capital-pool'], {
          queryParams: {
            title: '项目管理-金地>' + (x.data.type === 1 ? 'ABS储架项目' : '再保理银行项目') + '>'
              + x.data.projectName + '-' + x.data.headquarters,
            projectId: x.data.project_manage_id,
            headquarters: x.data.headquarters,
            fitProject: x.data.projectName,
            capitalPoolId: x.data.capitalPoolId,
            capitalPoolName: x.data.capitalPoolName,
            isMachineenter: true,
          }
        });
      } else if (x.ret === 0 && !x.data.capitalPoolId) {
        this.onPage({ page: this.paging });
      }
    });
  }

  /**
   *  查看发票文件信息
   * @param item 列表Item
   */
  public viewInvoiceFiles(item: any) {
    this.xn.avenger.post('/file/getNuonuoType', { id: item.nuonuoid, mainFlowId: item.mainFlowId }).subscribe(x => {
      if (x.ret === 0 && x.data) {
        let params = {} as any;
        if (!!x.data.isPerson && x.data.isPerson === 1) {
          // 上传文件调用的是采购融资的接口，isAvenger为true
          const files = x.data.c_urL ? XnUtils.parseObject(x.data.c_urL, []) : [];
          files.forEach((file: any) => {
            file.isAvenger = true;
          });
          params = {
            file: JSON.stringify(files),
            isAvenger: true,
            isInvoice: false,
            isPerson: x.data.isPerson,
            mainFlowId: item.mainFlowId
          };
        } else {
          params = {
            file: JSON.stringify([{ fileId: item.nuonuoid + '.pdf', filePath: item.mainFlowId }]),
            isAvenger: true,
            isInvoice: true
          };
        }
        XnModalUtils.openInViewContainer(this.xn, this.vcr, AvengerInvoiceShowModalComponent, params).subscribe();
      }
    });

  }

  /**
   * 重置
   */
  public reset() {
    this.selectedItems = [];
    this.selectedReceivables = 0;
    this.selectedPayableAmounts = 0;
    // this.searchForm.reset(); // 清空
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
   * @param paramsKey
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
   * @param sort
   */
  public onSort(sort: string) {
    if (this.sorting === sort) {
      this.naming = this.naming === 'desc' ? 'asc' : 'desc';
    } else {
      this.sorting = sort;
      this.naming = 'asc';
    }
    this.sortObjs = [
      {
        name: DragonTradeListOrderEnum[this.sorting],
        asc: machineAccountSort[this.naming],
      }
    ];
    this.onPage({ page: this.paging });
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
        this.selectedReceivables = Number((this.selectedReceivables + item.receive).toFixed(2));         // 勾选交易总额
        this.selectedPayableAmounts = Number((this.selectedPayableAmounts + item.changePrice).toFixed(2));
      });
    } else {
      this.listInfo.forEach(item => item.checked = false);
      this.selectedItems = [];
      this.selectedReceivables = 0;
      this.selectedPayableAmounts = 0;
    }
  }

  /**
   * 单选
   * @param paramItem
   * @param index
   */
  public singleChecked(paramItem) {
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
   * @param paramContractInfo
   */
  public showContract(paramContractInfo, isProxy?) {
    const params = Object.assign({}, paramContractInfo, { readonly: true });
    const modalComponent = isProxy === 14 ? PdfSignModalComponent : DragonPdfSignModalComponent;
    XnModalUtils.openInViewContainer(this.xn, this.vcr, modalComponent, params).subscribe(() => { });

  }

  /**
   *  查看更多发票
   * @param paramItem
   */
  public viewMore(paramItem, mainFlowId: string, isProxy: any) {
    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      MachineInvoiceListComponent,
      { mainFlowId }
    ).subscribe(() => { });
  }

  /**
   *  查看文件信息
   * @param paramFile
   */
  public viewFiles(paramFile, isProxy) {
    if (typeof paramFile === 'string') {
      paramFile = JSON.parse(paramFile);
    }
    XnModalUtils.openInViewContainer(this.xn, this.vcr, MfilesViewModalComponent, paramFile).subscribe();
  }

  /**
   *  判断数据类型
   * @param paramValue
   */
  public judgeDataType(paramValue: any): boolean {
    if (typeof Array.isArray === 'function') {
      return Array.isArray(paramValue);
    } else {
      return Object.prototype.toString.call(paramValue) === '[object Array]';
    }
  }

  /**
   *  格式化数据
   * @param paramData
   */
  public jsonTransForm(paramData) {
    return JsonTransForm(paramData);
  }

  /**
   *  判断数据是否长度大于显示最大值
   * @param paramFileInfos
   */
  public arrayLength(paramFileInfos: any) {
    if (!paramFileInfos) {
      return false;
    }
    let obj = [];
    if (JSON.stringify(paramFileInfos).includes('[')) {
      obj = typeof paramFileInfos === 'string'
        ? JSON.parse(paramFileInfos)
        : paramFileInfos;
    } else {
      obj = typeof paramFileInfos === 'string'
        ? paramFileInfos.split(',')
        : [paramFileInfos];
    }
    return obj;
  }

  public stringLength(paramsString: string) {
    return paramsString.length;
  }

  /**
   * 新增备注
   * @param mainFlowId 交易id（可选）有值代表是行操作，没有值代表批量操作
   * @returns void
   */
  addMark(mainFlowId?: string): void {
    const mainFlowIdList = mainFlowId ? [mainFlowId] : this.selectedItems.map(v => v.mainFlowId);
    let checkers = [
      {
        title: '备注信息',
        checkerId: 'remark',
        type: 'text-area',
        required: true,
        options: { readonly: false, inputMaxLength: 100 },
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
        if (v === null) { return; }
        this.xn.loading.open();
        this.xn.dragon.post('/trade/set_remark', { mainFlowIdList, ...v, }).subscribe(x => {
          this.xn.loading.close()
          if (x.ret === 0) {
            this.xn.msgBox.open(false, '新增备注成功！', () => {
              this.selectedItems = [];
              this.onPage({ page: this.paging });
            })
          }
        }, (err) => {
          console.error(err);
          this.xn.loading.close()
        }, () => {
          this.xn.loading.close()
        });
      });
  }

  /**
   * 查看备注
   * @param mainFlowId 交易id
   * @returns void
   */
  getMemo(mainFlowId: string): void {
    this.xn.loading.open()
    this.xn.dragon.post('/trade/get_remark_list', { mainFlowId }).subscribe(x => {
      this.xn.loading.close()
      if (x.ret === 0) {
        const params = {
          get_url: '',
          multiple: false,
          title: '查看备注信息',
          heads: [
            { label: '创建时间', value: 'createTime', type: 'dateTime' },
            { label: '备注人', value: 'userName', type: 'text' },
            { label: '备注内容', value: 'remark', type: 'text' },
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
                this.addMark(mainFlowId)
              }
            }
          ],
          rightButtons: [{ label: '确定', value: 'submit' }],
        };
        // 打开备注信息弹窗
        XnModalUtils.openInViewContainer(this.xn, this.vcr, SingleSearchListModalComponent, params).subscribe();
      }
    }, (err) => {
      console.error(err);
      this.xn.loading.close();
    }, () => {
      this.xn.loading.close();
    });

  }

  /**
   * 建议入池/取消建议入池
   * @param paramBtnOperate 按钮配置项
   */
  setPoolAdvise(paramBtnOperate: ButtonConfigModel): void {
    this.xn.loading.open()
    this.xn.dragon.post(
      paramBtnOperate.post_url,
      { mainFlowIdList: this.selectedItems.map(v => v.mainFlowId), poolAdviseType: paramBtnOperate.flag, }
    ).subscribe(x => {
      this.xn.loading.close();
      if (x.ret === 0) {
        this.xn.msgBox.open(false, '操作成功！', () => {
          this.selectedItems = [];
          this.onPage({ page: this.paging });
        })
      }
    }, (err) => {
      this.xn.loading.close();
    }, () => {
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
      options: { ref: 'checkPriorityType' },
      required: 1
    }];
    const params = {
      checker: checkers,
      title: '设置审核优先级',
      buttons: ['取消', '确定'],
    };
    this.openEditModal(paramBtnOperate, params)
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
      options: { ref: 'loanPriorityType' },
      required: 1
    }];
    const params = {
      checker: checkers,
      title: '设置放款优先级',
      buttons: ['取消', '确定'],
    };
    this.openEditModal(paramBtnOperate, params)
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
        options: { minDate: true, format: 'YYYY-MM-DD' }, // 只能选择今天及之后的日期
        value: '',
      },
    ];
    const params = {
      checker: checkers,
      title: '设置预计放款时间',
      buttons: ['取消', '确定'],
    };
    this.openEditModal(paramBtnOperate, params)
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
            v.planLoanTime = new Date(v.planLoanTime).getTime()
          }
          this.xn.loading.open()
          this.xn.dragon.post(
            paramBtnOperate.post_url,
            { mainFlowIdList: this.selectedItems.map(v => v.mainFlowId), ...v, }
          ).subscribe(x => {
            this.xn.loading.close();
            if (x.ret === 0) {
              this.xn.msgBox.open(false, '设置成功！', () => {
                this.selectedItems = [];
                this.onPage({ page: this.paging });
              });
            }
          }, (err) => {
            console.error(err);
            this.xn.loading.close()
          }, () => {
            this.xn.loading.close()
          });
        } else {
          return;
        }
      });
  }

  /**
   *  表头按钮组事件
   * @param paramBtnOperate
   */
  public handleHeadClick(paramBtnOperate: ButtonConfigModel) {
    switch (paramBtnOperate.operate) {
      // 下载附件
      case 'download_file':
        this.downloadFile(paramBtnOperate)
        break;
      // 导出清单
      case 'export_file':
        this.downloadApprovallist(paramBtnOperate)
        break;
      // 中登登记
      case 'sub_zhongdeng_register':
        this.subZhongdengRegister()
        break;
      // 调整签署方式
      case 'change-signType':
        this.setSigntype()
        break;
      // 退单流程
      case 'reject-program':
        this.rejectProgram()
        break;
      // 补充信息
      case 'add-data':
        this.batchModify()
        break;
      // 修改协助处理人(平台)
      case 'edit-helpHandler':
        this.editHelpHandler()
        break;
      // 新增备注
      case 'add-mark':
        this.addMark()
        break;
      // 建议入池
      case 'set-pool-advise':
        this.setPoolAdvise(paramBtnOperate)
        break;
      // 取消建议入池
      case 'del-pool-advise':
        this.setPoolAdvise(paramBtnOperate)
        break;
      // 设置审核优先级
      case 'set-check-priority':
        this.setCheckPriority(paramBtnOperate)
        break;
      // 设置放款优先级
      case 'set-loan-priority':
        this.setLoanPriority(paramBtnOperate)
        break;
      // 设置预计放款时间
      case 'set-plan-loan':
        this.setPlanLoan(paramBtnOperate)
        break;

      default:
        break;
    }
  }

  // 导出清单
  downloadApprovallist(paramItem: any) {
    const params = { hasSelect: !!this.selectedItems && this.selectedItems.length > 0 };
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
      const newParam = {
        status: this.subTabEnum[this.subDefaultValue],
        mainFlowIdList: [],
        type: '',
      };
      if (x.exportList === 'all') {
        newParam.type = 'all';
        newParam.mainFlowIdList = [];
      } else if (x.exportList === 'selected') {
        newParam.type = 'selected';
        newParam.mainFlowIdList = this.selectedItems.map(c => c.mainFlowId);
      }

      if (newParam.type === 'all' || (newParam.type === 'selected' && this.selectedItems.length > 0)) {
        const paramsTotal = Object.assign({}, this.buildParams(this.currentSubTab.params), newParam);
        this.xn.dragon.download(paramItem.post_url, paramsTotal).subscribe((con: any) => {
          this.xn.api.save(con._body, '台账列表清单.xlsx');
          this.xn.loading.close();
        });
      }

    });
  }

  /**
   * 下载附件
   * @param paramBtnOperate
   */
  downloadFile(paramBtnOperate: ButtonConfigModel) {
    const selectedRows = this.listInfo.filter(
      (x: any) => x.checked && x.checked === true
    );
    const params = {
      hasSelect: !!selectedRows && selectedRows.length > 0,
      selectedCompany: '金地（集团）股份有限公司',
      listInfo: this.listInfo,
      selectedItems: this.selectedItems
    };
    XnModalUtils.openInViewContainer(this.xn, this.vcr, DownloadAttachmentsModalComponent, params).subscribe(data => {
      if (data !== '') {
        this.xn.loading.open();
        const oldMainFlowId = this.listInfo.filter(y => y.isProxy !== IsProxyDef['JD_ABS']);          // 老业务
        const newMainFlowId = this.listInfo.filter(z => z.isProxy === IsProxyDef['JD_ABS']);
        this.oldSelectItems = this.selectedItems.filter(x => (x.isProxy !== IsProxyDef['JD_ABS']));   // 老业务
        this.newSelectItems = this.selectedItems.filter((x: any) => x.isProxy === IsProxyDef['JD_ABS']);
        const newparam = {
          mainFlowIdList: [],
          fileTypeKey: {},
          isClassify: data.isClassify
        };                                                       // 新业务参数
        const oldparam = { mainIdList: [], chooseFile: '' };                                                           // 老业务参数
        oldparam.chooseFile = data.oldchooseFile ? data.oldchooseFile.split(',').filter(c => c !== '') : '';
        const rObj = {};
        data.chooseFile.split(',').forEach(x => {
          rObj[x] = true;
        });
        newparam.fileTypeKey = rObj;
        if (data.downloadRange === 'all') {
          newparam.mainFlowIdList = newMainFlowId.map(c => c.mainFlowId);
          oldparam.mainIdList = oldMainFlowId.map(c => c.mainFlowId);
        } else if (data.downloadRange === 'selected') {
          if (this.selectedItems.length === 0) {
            this.xn.msgBox.open(false, '未选择交易');
            return;
          }
          newparam.mainFlowIdList = this.newSelectItems.map(c => c.mainFlowId);
          oldparam.mainIdList = this.oldSelectItems.map((x: any) => x.mainFlowId);
        }
        if ((data.downloadRange === 'all' && newMainFlowId.length > 0)
          || (data.downloadRange === 'selected' && this.newSelectItems.length > 0)) {
          this.xn.dragon.download(paramBtnOperate.post_url, newparam).subscribe((v: any) => {
            this.xn.loading.close();
            const reader = new FileReader();
            reader.onload = () => {
              try {
                const content = JSON.parse(`${reader.result}`); // 内容就在这里
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
        if ((data.downloadRange === 'all' && oldMainFlowId.length > 0) || (data.downloadRange === 'selected' && this.oldSelectItems.length > 0)) {
          this.xn.api.download('/custom/vanke_v5/contract/load_attachment', oldparam).subscribe((v: any) => {
            this.xn.loading.close();
            const reader = new FileReader();
            reader.onload = () => {
              try {
                const content = JSON.parse(`${reader.result}`); // 内容就在这里
                if (content.ret === 1000) {
                  this.xn.msgBox.open(false, content.msg);
                }
              } catch (e) {
                this.xn.api.save(v._body, '老ABS业务附件.zip');
              }
            };
            reader.readAsText(v._body);
          });
        }

      }

    });
  }

  /**
   * 中登登记
   * @param
   */
  subZhongdengRegister() {
    if (this.selectedItems.length < 1) {
      this.xn.msgBox.open(false, '请选择交易');
      return false;
    }
    this.oldSelectItems = this.selectedItems.filter(x => (x.isProxy === 14)); // 老业务
    if (this.oldSelectItems.length > 0) {
      return this.xn.msgBox.open(false,
        [
          '您选择的交易，存在' + this.oldSelectItems.length + '笔旧ABS交易',
          ...this.oldSelectItems.map(o => o.mainFlowId),
          '不能进行"中登登记"操作'
        ]);
    }
    this.xn.router.navigate([`/machine-account/zhongdeng/new`],
      {
        queryParams: {
          relate: 'mainIds',
          relateValue: this.selectedItems.map((x: any) => x.mainFlowId)
        }
      });
  }

  /**
   * 调整签署方式
   */
  public setSigntype() {
    if (this.selectedItems.length < 1) {
      this.xn.msgBox.open(false, '请选择交易');
      return false;
    }
    this.oldSelectItems = this.selectedItems.filter(x => (x.isProxy === 14)); // 老业务
    if (this.oldSelectItems.length > 0) {
      return this.xn.msgBox.open(false,
        [
          '您选择的交易，存在' + this.oldSelectItems.length + '笔旧ABS交易',
          ...this.oldSelectItems.map(o => o.mainFlowId),
          '不能进行"调整签署方式"操作'
        ]);
    }
    const checkers = [{
      title: '交易信息',
      checkerId: 'mainFlowIdList',
      type: 'set-signType',
      options: { readonly: true },
      value: this.selectedItems
    }, {
      title: '签署方式',
      checkerId: 'signType',
      type: 'select',
      required: 1,
      options: { ref: 'signType_jd' },
    }];
    const params = {
      checker: checkers,
      title: '签署方式弹窗',
      buttons: ['取消', '确定'],
    };
    XnModalUtils.openInViewContainer(this.xn, this.vcr, EditModalComponent, params)
      .subscribe((v) => {
        if (v === null) {
          return;
        } else {
          v.mainFlowIdList = this.selectedItems.map(c => c.mainFlowId);
          v.signType = Number(v.signType);
          this.xn.dragon.post('/trade/set_sign_type', v).subscribe(x => {
            if (x.ret === 0) {
              this.onPage({ page: this.paging });
              this.selectedItems = [];
            }
          });
        }
      });

  }

  /**
  * 批量补充
  */
  public batchModify() {
    if (this.selectedItems.length < 1) {
      this.xn.msgBox.open(false, '请选择交易');
      return false;
    }
    this.oldSelectItems = this.selectedItems.filter(x => (x.isProxy === 14)); // 老业务
    if (this.oldSelectItems.length > 0) {
      return this.xn.msgBox.open(false,
        [
          '您选择的交易，存在' + this.oldSelectItems.length + '笔旧ABS交易',
          ...this.oldSelectItems.map(o => o.mainFlowId),
          '不能进行"补充信息"操作'
        ]);
    }
    const param = { mainList: this.selectedItems };
    this.newSelectItems.map((sel) => sel.headquarters = sel.headquarters);
    this.localStorageService.setCacheValue('batchModifyMainList', param);
    const formCapitalPool = { isDemoList: true, ... this.formCapitalPool }; // 台账标识
    this.xn.router.navigate(['/new-gemdale/batch-modify'], {
      queryParams: formCapitalPool
    });

  }

  /**
   * 退单流程
   * @param
   */
  rejectProgram() {
    if (this.selectedItems.length < 1) {
      this.xn.msgBox.open(false, '请选择交易');
      return false;
    }
    this.oldSelectItems = this.selectedItems.filter(x => (x.isProxy === 14)); // 老业务
    if (this.oldSelectItems.length > 0) {
      return this.xn.msgBox.open(false,
        [
          '您选择的交易，存在' + this.oldSelectItems.length + '笔旧ABS交易',
          ...this.oldSelectItems.map(o => o.mainFlowId),
          '不能进行"退单"操作'
        ]);
    }
    // 新业务的退单流程
    const mainIds = this.selectedItems.map(c => c.mainFlowId);
    this.xn.router.navigate([`/new-gemdale/record/new/`],
      {
        queryParams: {
          id: 'sub_factoring_jd_retreat',
          relate: 'mainIds',
          relateValue: mainIds,
        }
      });
  }

  /**
  * 修改协助处理人
  * @param
  */
  editHelpHandler() {
    if (this.selectedItems.length < 1) {
      this.xn.msgBox.open(false, '请选择交易');
      return false;
    }
    this.oldSelectItems = this.selectedItems.filter(x => (x.isProxy === 14)); // 老业务
    if (this.oldSelectItems.length > 0) {
      return this.xn.msgBox.open(false,
        [
          '您选择的交易，存在' + this.oldSelectItems.length + '笔旧ABS交易',
          ...this.oldSelectItems.map(o => o.mainFlowId),
          '不能进行"修改协助处理人"操作'
        ]);
    }
    const mainFlowIdList = this.selectedItems.map(x => {
      return x.mainFlowId;
    });
    const params = {
      type: 'select-helpUserName',
      roleId: 'operator',
      mainFlowIdList
    };
    XnModalUtils.openInViewContainer(this.xn, this.vcr, BusinessMatchmakerChooseComponent, params)
      .subscribe((v) => {
        this.onPage({ page: this.paging });
        this.selectedItems = [];
      });
  }

  /**
   * 行按钮组事件
   * @param paramItem 当前行数据
   * @param paramBtnOperate 按钮操作配置
   * @param i 下标
   */
  public handleRowClick(paramItem, paramBtnOperate: ButtonConfigModel) {
    if (paramBtnOperate.operate === 'addData') {
      const checkers = [{
        title: '交易ID',
        checkerId: 'mainFlowId',
        type: 'text',
        options: { readonly: true },
        value: paramItem.mainFlowId
      }, {
        title: '后补资料',
        checkerId: 'backUpFiles',
        type: 'dragonMfile',
        required: 0,
        checked: false,
        options: { fileext: 'jpg, jpeg, png, pdf' },
        value: paramItem.backUpFiles || ''
      }, {
        title: '是否需后补资料',
        checkerId: 'isBackUp',
        type: 'radio',
        required: false,
        options: { ref: 'defaultRadio' },
        value: paramItem.isBackUp
      }];
      const params = {
        checker: checkers,
        title: '后补资料弹窗',
        buttons: ['取消', '确定'],
      };
      XnModalUtils.openInViewContainer(this.xn, this.vcr, EditModalComponent, params)
        .subscribe((v) => {

          if (v === null) {
            return;
          } else {
            v.isBackUp = v.isBackUp === '1' ? 1 : 2;
            v.mainFlowId = paramItem.mainFlowId;
            this.xn.dragon.post('/trade/set_back_up', v).subscribe(x => {
              if (x.ret === 0) {
                this.onPage({ page: this.paging });
                this.selectedItems = [];
              }
            });

          }
        });

    } else {
      paramBtnOperate.click(paramItem, this.xn, this.hwModeService);
    }
  }

  /**
   * 构建搜索项
   * @param searches
   */
  private buildShow(searches) {
    this.shows = [];
    this.onUrlData();
    this.buildCondition(searches);
  }

  // 台账中登登记权限
  public openZhongdeng() {
    return this.xn.user.orgType === 99 && this.subDefaultValue === 'DOING'
      && (this.xn.user.roles.includes('operator') || this.xn.user.roles.includes('reviewer'));
  }

  // 中止交易权限
  public stopControl(paramItem) {
    let allTabFlag = this.rowAuthJudge(paramItem, 'DOING') || this.rowAuthJudge(paramItem, 'TODO');
    return (this.xn.user.orgType === 99 || this.xn.user.orgType === 3)
      && (this.xn.user.roles.includes('operator') && allTabFlag || this.xn.user.roles.includes('reviewer')
        && allTabFlag && (paramItem.tradeStatus > 6 || paramItem.tradeStatus === 4));
  }

  // 修改备注信息
  changeRemark(item: any) {
    // return this.subDefaultValue === 'DOING';
    return this.rowAuthJudge(item, 'DOING');
  }
  // 进入审核页面权限
  public openView(item: any) {
    return this.xn.user.orgType === 99 && (this.xn.user.roles.includes('operator') || this.xn.user.roles.includes('reviewer'));
  }

  /**
   * 金地对接数据进入审核页面权限
   * @param info 行信息
   */
  jdDockOpenView(info: any): boolean {
    if (info.pauseStatus === 1) { // 平台审核-初审-暂停
      return true;
    }
    if (info.acceptState === 2) { // 平台审核-复核-等待受理
      return true;
    }
    return false;
  }

  /**
   * 搜索项值格式化
   * @param searches
   */
  private buildCondition(searches) {
    const tmpTime = {
      beginTime: this.beginTime,
      endTime: this.endTime
    };
    const objList = [];
    this.timeId = $.extend(true, [], this.searches.filter(v => v.type === 'quantum').map(v => v.checkerId));
    for (let i = 0; i < searches.length; i++) {
      const obj = {} as any;
      obj.title = searches[i].title;
      obj.checkerId = searches[i].checkerId;
      obj.required = false;
      obj.type = searches[i].type;
      obj.sortOrder = searches[i].sortOrder;
      obj.options = searches[i].options;
      if (searches[i].checkerId === this.timeId[0]) {
        obj.value = JSON.stringify(tmpTime);
      } else {
        obj.value = this.arrObjs[searches[i].checkerId];
      }
      objList.push(obj);
    }
    this.shows = $.extend(true, [], objList); // 深拷贝;

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
        const beginTime = parseInt(paramsTime.beginTime);
        const endTime = parseInt(paramsTime.endTime);
        // 保存每次的时间值。
        this.preChangeTime.unshift({ begin: beginTime, end: endTime });
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
            this.paging = 1;
            this.onPage({ page: this.paging });
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
      this.arrObjs = $.extend(true, {}, arrObj); // 深拷贝;要进行搜索的变量
      this.onUrlData();

    });
  }

  /**
   * 构建列表请求参数
   */
  private buildParams(addparams: number) {

    let params = null;
    if (addparams !== undefined) {
      params = {
        pageNo: this.paging,
        pageSize: this.pageConfig.pageSize,
        status: Number(addparams),
      };

    }

    // 分页处理

    // 排序处理
    if (this.sortObjs.length !== 0) {
      params.order = [
        {
          name: this.sortObjs[0].name,
          asc: this.sortObjs[0].asc,
        }
      ];
    }
    // 搜索处理
    if (this.searches.length > 0) {
      for (const search of this.searches) {

        if (!XnUtils.isEmpty(this.arrObjs[search.checkerId])) {
          if (search.checkerId === 'transactionStatus') {
            const obj = JSON.parse(this.arrObjs[search.checkerId]);
            params.flowId = obj.tradeStatus;
            params.isProxy = obj.isProxy;
            if (this.subDefaultValue === 'ALL' && String(obj.tradeStatus) === '99' || String(obj.tradeStatus) === '100') {
              params.tradeStatus = 99
              params.retreatStatus = String(obj.tradeStatus) === '99' ? 0 : 4
              delete params.flowId
              delete params.isProxy
            }
          } else if (search.checkerId === 'isPriorityLoanDate') {
            const priorityLoanDate = JSON.parse(this.arrObjs[search.checkerId]);
            if (priorityLoanDate.isPriorityLoanDate <= 0) {
              params.isPriorityLoanDate = priorityLoanDate.isPriorityLoanDate;
            } else {
              params.priorityLoanDateStart = priorityLoanDate.priorityLoanDateStart;
              params.priorityLoanDateEnd = priorityLoanDate.priorityLoanDateEnd;
              params.isPriorityLoanDate = priorityLoanDate.isPriorityLoanDate;
            }
          } else if (search.checkerId === 'isHeadPreDate') {
            const priorityLoanDate = JSON.parse(this.arrObjs[search.checkerId]);
            if (priorityLoanDate.isPriorityLoanDate <= 0) {
              params.isHeadPreDate = priorityLoanDate.isPriorityLoanDate;
            } else {
              params.headPreDateStart = priorityLoanDate.priorityLoanDateStart;
              params.headPreDateEnd = priorityLoanDate.priorityLoanDateEnd;
              params.isHeadPreDate = priorityLoanDate.isPriorityLoanDate;
            }
          } else if (search.checkerId === 'productType') {
            const val = JSON.parse(this.arrObjs[search.checkerId]);
            params.type = Number(val.proxy);
            if (!!val.status) {
              params.selectBank = Number(val.status);
            }
          } else if (search.checkerId === 'receive') { // 应收账款金额搜索过滤处理
            let receive = '';
            this.arrObjs[search.checkerId].split(',').forEach(v => {
              receive += v;
            });
            params.receive = Number(receive);
          } else if (search.checkerId === 'valueDate') {
            const date = JSON.parse(this.arrObjs[search.checkerId]);
            params.valueDateStart = date.beginTime;
            params.valueDateEnd = date.endTime;
          } else if (search.checkerId === 'tradeTime') {  // 交易流程各个步骤的时
            const data = JSON.parse(this.arrObjs[search.checkerId]);
            if (!!data.flowId) {
              params.flowId = data.flowId;
              params.isProxy = 56;
            }
            if (!!data.time) {
              params.operatorTimeStart = JSON.parse(data.time).beginTime;
              params.operatorTimeEnd = JSON.parse(data.time).endTime;
            }
          } else {
            params[search.checkerId] = this.arrObjs[search.checkerId];
            if (search.type === 'text') {
              params[search.checkerId] = this.arrObjs[search.checkerId].trim();
            }
          }
        }
      }
    }
    // 列表子标签页，构建参数 ,当且子标签状态有大于2中时,添加状态参数
    if (this.currentTab.subTabList.length >= 2) {
      if (this.subDefaultValue === 'ALL') {
        params.selectAll = 1;
      }
      params.status = this.subTabEnum[this.subDefaultValue];
    }
    params.headquarters = HeadquartersTypeEnum[2];
    params.factoringAppId = `${applyFactoringTtype['深圳市柏霖汇商业保理有限公司']}`;
    return params;
  }

  private buildChecker(stepRows) {
    for (const row of stepRows) {
      XnFormUtils.convertChecker(row);
    }
  }

  /**
   * 回退操作，路由存储
   * @param data
   */
  private onUrlData() {
    const urlData = this.xn.user.getUrlData(this.xn.router.url);
    if (urlData && urlData.pop) {
      this.paging = urlData.data.paging || this.paging;
      this.pageConfig = urlData.data.pageConfig || this.pageConfig;
      this.beginTime = urlData.data.beginTime || this.beginTime;
      this.endTime = urlData.data.endTime || this.endTime;
      this.arrObjs = urlData.data.arrObjs || this.arrObjs;
      this.sortObjs = urlData.data.sortObjs || this.sortObjs;
      this.defaultValue = urlData.data.defaultValue || this.defaultValue;
      this.subDefaultValue = urlData.data.subDefaultValue || this.subDefaultValue;
    } else {
      this.xn.user.setUrlData(this.xn.router.url, {
        paging: this.paging,
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
   * @param item
   * @param type
   */
  rowAuthJudge(item: any, type: string): Boolean {
    return FlowIdObj[type.toString()].indexOf(item.flowId) > -1;
  }

  // 进入审核页面
  handmore(item: any) {
    let isOk = false;
    if (item.nowProcedureId === '@end') {
      this.xn.router.navigate([`/new-gemdale/record/todo/view//${item.recordId}`]);
    }
    this.roleId.forEach(x => {
      if (_.startsWith(x, item.nowProcedureId.slice(0, 4))) {
        isOk = true;
      }
    });
    if (!isOk) {
      return;
    } else {
      if (item.nowProcedureId === 'operate' || item.nowProcedureId === 'review') {
        if (item.flowId === 'jd_platform_verify' && item.zhongdengStatus === 1) {
          this.xn.msgBox.open(false, '该流程中登登记处于登记中,不可处理');
          return;
        } else {
          this.xn.router.navigate([`/new-gemdale/record/todo/edit/${item.recordId}`]);
        }
      } else {
        this.xn.router.navigate([`/new-gemdale/record/todo/view//${item.recordId}`]);
      }
    }
  }

  /**
   * 查看中登登记
   * @param item
   */
  public viewProgess(item) {
    this.xn.router.navigate([`/machine-account/zhongdeng/record/${item.zhongdengRegisterId}/${item.zhongdengStatus}`]);
  }


}
enum DragonTradeListOrderEnum {
  mainFlowId = 1,
  tradeDate = 2,
  receive = 3,
  changePrice = 4,
  discountRate = 5,
  payConfirmId = 6,
  isChangeAccount = 7,
  priorityLoanDate = 8,
  isRegisterSupplier = 9,
  tradeStatus = 10,
  isLawOfficeCheck = 11,
  supplierRegisterDate = 12,
  factoringEndDate = 13,
  zhongdengStatus = 14,
  realLoanDate = 15,
}
enum machineAccountSort {
  asc = 1,
  desc = -1

}



export const FlowIdObj = {
  'DOING': ['jd_financing_pre', 'jd_financing', 'jd_platform_verify'],
  'TODO': ['jd_factoring_risk', 'jd_confirm_receive', 'jd_financing_sign', 'jd_factoring_passback',
    'wait_verification_500', 'verificating_500', 'factoring_sign_500', 'wait_loan_500'],
  'DONE': ['loaded_500'],
  'SPECIAL': [],
  'stop': ['99', '100']
};
