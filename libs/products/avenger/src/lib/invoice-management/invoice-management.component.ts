/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：comfirm-information-index-component
 * @summary：多标签页列表项 根据tab-pane.ts中的配置
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 wangqing          开票管理         2019-09-19
 * **********************************************************************
 */

import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { StorageService } from 'libs/shared/src/lib/services/storage.service';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { JsonTransForm } from 'libs/shared/src/lib/public/pipe/xn-json.pipe';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import {
  TabListOutputModel,
  SubTabListOutputModel,
  ButtonConfigModel,
} from 'libs/shared/src/lib/config/list-config-model';
import CommUtils from 'libs/shared/src/lib/public/component/comm-utils';
import { AvengerInvoiceShowModalComponent } from '../shared/components/modal/avenger-invoice-show-modal.component';
import { AvengerPdfSignModalComponent } from 'libs/shared/src/lib/public/avenger/modal/pdf-sign-modal.component';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { HeadquartersTypeEnum } from 'libs/shared/src/lib/config/select-options';
import {
  SingleListParamInputModel,
  SingleSearchListModalComponent,
} from 'libs/shared/src/lib/public/dragon-vanke/modal/single-searchList-modal.component';
import { OrgType } from 'libs/shared/src/lib/config/enum/common-enum';
@Component({
  selector: 'app-invoice-management-component',
  templateUrl: `./invoice-management.component.html`,
  styles: [
    `
      .item-box {
        position: relative;
        display: flex;
        margin-bottom: 10px;
      }
      .item-label label {
        min-width: 150px;
        padding-right: 8px;
        font-weight: normal;
        line-height: 34px;
        text-align: right;
      }
      .item-control {
        flex: 1;
      }
      .item-control select {
        width: 100%;
      }
      .operate-btn {
        min-width: 90px;
      }
      .input-check {
        width: 100px;
      }
      .table-head .sorting,
      .table-head .sorting_asc,
      .table-head .sorting_desc {
        /*position: relative;*/
        cursor: pointer;
      }
      .table-head .sorting:after,
      .table-head .sorting_asc:after,
      .table-head .sorting_desc:after {
        font-family: 'Glyphicons Halflings';
        opacity: 0.5;
      }
      .table-head .sorting:after {
        content: '\\e150';
        opacity: 0.2;
      }
      .table-head .sorting_asc:after {
        content: '\\e155';
      }
      .table-head .sorting_desc:after {
        content: '\\e156';
      }
      ul.sub-ul {
        margin-bottom: 5px;
        border-bottom: 1px solid #3c8dbc;
      }
      ul.sub-ul > li > a {
        padding: 5px 35px;
        border-top: none;
        background-color: #f2f2f2;
      }
      ul.sub-ul > li.active > a {
        background-color: #3c8dbc;
      }
      .center-block {
        clear: both;
        border-bottom: 1px solid #ccc;
        width: 43.9%;
        height: 1px;
      }
      .showClass {
        width: 12.5%;
        margin: 0 auto;
        border: 1px solid #ccc;
        text-align: center;
        border-top: 0px;
        clear: both;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
      }
    `,
  ],
})
export class DragonInvoiceManagementComponent implements OnInit {
  tabConfig: any;
  // 默认激活第一个标签页 {do_not,do_down}
  label = 'do_not';
  public defaultValue = 'A'; // 默认激活第一个标签页

  // 数据
  data: any[] = [];
  // 页码配置
  pageConfig = {
    pageSize: 10,
    first: 0,
    total: 0,
  };
  // 搜索项
  shows: any[] = [];
  form: FormGroup;
  searches: any[] = []; // 面板搜索配置项项
  selectedItems: any[] = []; // 选中的项
  currentTab: any; // 当前标签页
  displayShow = true;

  arrObjs = {} as any; // 缓存后退的变量
  paging = 0; // 共享该变量
  beginTime: any;
  endTime: any;
  timeId = [];
  nowTimeCheckId = '';
  // 上次搜索时间段
  preChangeTime: any[] = [];
  public listInfo: any[] = []; // 数据

  sorting = ''; // 共享该变量
  naming = ''; // 共享该变量
  heads: any[];
  public currentSubTab: SubTabListOutputModel = new SubTabListOutputModel(); // 当前子标签页
  public subDefaultValue = 'NOINVOICE'; // 默认子标签页
  // public formModule: string = 'dragon-input';
  public formModule = 'avenger-input';
  public selectedReceivables = 0; // 所选交易的应收账款金额汇总
  public selectedPayableAmounts = 0; // 所选交易的转让价款汇总
  public allReceivables = 0; // 所有交易的应收账款金额汇总
  public allPayableAmounts = 0; // 所有交易的转让价款汇总
  public changePriceName = '转让价款';
  private differComp: any[] = [];
  constructor(
    private xn: XnService,
    private vcr: ViewContainerRef,
    public hwModeService: HwModeService,
    private router: ActivatedRoute,
    private session: StorageService
  ) {}

  ngOnInit(): void {
    this.router.data.subscribe((x) => {
      this.tabConfig = x;
      this.initData(this.defaultValue, true);
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
   *  格式化数据
   * @param data
   */
  public jsonTransForm(data) {
    return JsonTransForm(data);
  }
  show() {
    this.displayShow = !this.displayShow;
  }
  /**
   *  查看文件信息
   * @param item
   */
  public viewFiles(item: any) {
    let params = {} as any;
    if (!!item.isPerson && item.isPerson === 1) {
      // 上传文件调用的是采购融资的接口，isAvenger为true
      const files = item.c_url ? XnUtils.parseObject(item.c_url, []) : [];
      files.forEach((file: any) => {
        file.isAvenger = true;
      });
      params = {
        file: JSON.stringify(files),
        isAvenger: true,
        isInvoice: false,
        isPerson: item.isPerson,
        mainFlowId: item.mainFlowId,
      };
    } else {
      params = {
        file: JSON.stringify([
          { fileId: item.nuonuoid + '.pdf', filePath: item.mainFlowId },
        ]),
        isAvenger: true,
        isInvoice: true,
      };
    }
    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      AvengerInvoiceShowModalComponent,
      params
    ).subscribe();
  }

  /**
   *  标签页，加载列表信息
   * @param paramTabValue
   * @param init 是否为初始加载，true 不检查切换属性值与当前标签值
   */
  public initData(paramTabValue: string, init?: boolean) {
    if (this.defaultValue === paramTabValue && !init) {
      return;
    } else {
      // 重置全局变量
      this.selectedItems = [];
      this.listInfo = [];
      this.naming = '';
      this.sorting = '';
      this.paging = 1;
      this.allReceivables = 0;
      this.allPayableAmounts = 0;
      this.pageConfig = { pageSize: 10, first: 0, total: 0 };
    }
    this.defaultValue = paramTabValue;
    this.subDefaultValue = 'NOINVOICE'; // 重置子标签默认
    this.onPage({ page: this.paging });
  }

  /**
   * @param e  page: 新页码、 pageSize: 页面显示行数、first: 新页面之前的总行数、pageCount : 页码总数
   * @summary 采购融资，地产abs  请求api有区别，采购融资：avenger 、地产abs：api
   */
  public onPage(e?: {
    page: number;
    first?: number;
    pageSize?: number;
    pageCount?: number;
  }) {
    this.paging = e.page || 1;
    this.onUrlData(); // 导航回退取值
    this.pageConfig = Object.assign({}, this.pageConfig, e);
    // 页面配置
    const find = this.tabConfig.tabList.find(
      (tab) => tab.value === this.defaultValue
    );
    this.currentTab = !!find ? find : new TabListOutputModel();
    // 子页面配置
    const subFind = this.currentTab.subTabList.find(
      (sub) => sub.value === this.subDefaultValue
    );
    this.currentSubTab = !!subFind ? subFind : new SubTabListOutputModel();
    this.heads = CommUtils.getListFields(this.currentSubTab.headText);
    this.searches = this.currentSubTab.searches; // 当前标签页的搜索项
    this.buildShow(this.searches);
    // 构建参数
    const params = this.buildParams(this.currentSubTab.params);
    if (this.currentSubTab.params !== 0) {
      this.changePriceName = '转让价差';
    } else {
      this.changePriceName = '转让价款';
    }

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
    // 采购融资 ：avenger,  地产abs ：api
    // params 增加 factoringName 当前登录的保理商名称
    params.factoringName =
      this.session.getData('orgType') === OrgType.Factoring
        ? this.session.getData('orgName')
        : null;
    this.xn.avenger.post(this.currentTab.post_url, params).subscribe(
      (x) => {
        if (x.data && x.data.data && x.data.data.data.length) {
          this.listInfo = x.data.data.data;
          this.pageConfig.total = x.data.data.count;
          this.allReceivables = x.data.receivableAll || 0;
          this.allPayableAmounts = x.data.changePriceAll || 0;
        } else if (x.data && x.data.lists && x.data.lists.length) {
          this.listInfo = x.data.lists;
          this.pageConfig.total = x.data.count;
        } else {
          // 固定值
          this.listInfo = [];
          this.pageConfig.total = 0;
          this.allReceivables = x.data.receivableAll || 0;
          this.allPayableAmounts = x.data.changePriceAll || 0;
        }
        if (this.currentSubTab.params !== 0) {
          this.allPayableAmounts = x.data.receivableAll - x.data.changePriceAll;
        } else {
          this.allPayableAmounts = x.data.changePriceAll || 0;
        }
      },
      () => {
        // 固定值
        this.listInfo = [];
        this.pageConfig.total = 0;
        this.selectedReceivables = 0;
        this.selectedPayableAmounts = 0;
        this.allReceivables = 0;
        this.allPayableAmounts = 0;
      },
      () => {
        this.xn.loading.close();
      }
    );
  }

  /**
   *  搜索,默认加载第一页
   */
  public searchMsg() {
    this.selectedItems = [];
    this.selectedReceivables = 0;
    this.selectedPayableAmounts = 0;
    this.paging = 1;
    this.onPage({ page: this.paging, first: 0 });
  }

  /**
   * 重置
   */
  public reset() {
    this.selectedItems = [];
    this.selectedReceivables = 0;
    this.selectedPayableAmounts = 0;
    // this.form.reset(); // 清空
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
   * @param paramSubTabValue
   */
  public handleSubTabChange(paramSubTabValue: string) {
    if (this.subDefaultValue === paramSubTabValue) {
      return;
    } else {
      this.selectedItems = [];
      this.listInfo = [];
      this.selectedReceivables = 0;
      this.selectedPayableAmounts = 0;
      this.naming = '';
      this.sorting = '';
      this.paging = 1;
      this.pageConfig = { pageSize: 10, first: 0, total: 0 };
      // 重置全局变量
    }
    this.subDefaultValue = paramSubTabValue;
    this.onPage({ page: this.paging });
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
    this.onPage({ page: 1 });
  }

  /**
   *  判读列表项是否全部选中
   */
  public isAllChecked(): boolean {
    return !(
      this.listInfo.some(
        (x) => !x.checked || (x.checked && x.checked === false)
      ) || this.listInfo.length === 0
    );
  }

  /**
   * 计算表格合并项
   * currentSubTab.headText.length + 可选择1 + 序号1 + 行操作+1
   */
  public calcAttrColspan(): number {
    let nums: number = this.currentSubTab.headText.length + 1;
    const boolArray = [
      this.currentSubTab.canChecked,
      this.currentSubTab.edit &&
        this.currentSubTab.edit.rowButtons &&
        this.currentSubTab.edit.rowButtons.length > 0,
    ];
    nums += boolArray.filter((arr) => arr === true).length;
    return nums;
  }

  /**
   *  查看合同，只读
   * @param con
   */
  public showContract(con) {
    const params = Object.assign({}, con, { readonly: true });
    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      AvengerPdfSignModalComponent,
      params
    ).subscribe(() => {});
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

  /**
   * 搜索项值格式化
   * @param searches
   */
  private buildCondition(searches) {
    const tmpTime = {
      beginTime: this.beginTime,
      endTime: this.endTime,
    };
    const objList = [];
    this.timeId = $.extend(
      true,
      [],
      this.searches.filter((v) => v.type === 'quantum').map((v) => v.checkerId)
    );
    for (let i = 0; i < searches.length; i++) {
      const obj = {} as any;
      obj.title = searches[i].title;
      obj.checkerId = searches[i].checkerId;
      obj.required = false;
      obj.type = searches[i].type;
      obj.number = searches[i].number;
      obj.options = searches[i].options;
      if (searches[i].checkerId === this.timeId[0]) {
        obj.value = JSON.stringify(tmpTime);
      } else {
        obj.value = this.arrObjs[searches[i].checkerId];
      }
      objList.push(obj);
    }
    this.shows = $.extend(
      true,
      [],
      objList.sort(function (a, b) {
        return a.number - b.number;
      })
    ); // 深拷贝，并排序;
    XnFormUtils.buildSelectOptions(this.shows);
    this.buildChecker(this.shows);
    this.form = XnFormUtils.buildFormGroup(this.shows);
    const time = this.searches.filter((v) => v.type === 'quantum');
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
        this.preChangeTime.unshift({ begin: beginTime, end: endTime });
        // 默认创建时间
        this.beginTime = beginTime;
        this.endTime = endTime;
        if (this.preChangeTime.length > 1) {
          if (
            this.preChangeTime[1].begin === this.beginTime &&
            this.preChangeTime[1].end === this.endTime
          ) {
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
          const searchFilter = this.searches
            .filter((v1) => v1 && v1.base === 'number')
            .map((c) => c.checkerId);
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
      this.listInfo.forEach((item) => (item.checked = true));
      this.selectedReceivables = 0;
      this.selectedPayableAmounts = 0;
      this.selectedItems = XnUtils.distinctArray2(
        [...this.selectedItems, ...this.listInfo],
        'mainFlowId'
      );
      this.selectedItems.forEach((item) => {
        this.selectedReceivables = Number(
          (this.selectedReceivables + item.receivable).toFixed(2)
        ); // 勾选交易总额
        this.selectedPayableAmounts = Number(
          (this.selectedPayableAmounts + item.changePrice).toFixed(2)
        );
      });
    } else {
      this.listInfo.forEach((item) => (item.checked = false));
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
  public singleChecked(paramItem, index) {
    if (paramItem.checked && paramItem.checked === true) {
      paramItem.checked = false;
      this.selectedItems = this.selectedItems.filter(
        (x: any) => x.mainFlowId !== paramItem.mainFlowId
      );
      this.selectedReceivables = Number(
        (this.selectedReceivables - paramItem.receivable).toFixed(2)
      ); // 勾选交易总额
      this.selectedPayableAmounts = Number(
        (this.selectedPayableAmounts - paramItem.changePrice).toFixed(2)
      );
    } else {
      paramItem.checked = true;
      this.selectedItems.push(paramItem);
      this.selectedItems = XnUtils.distinctArray2(
        this.selectedItems,
        'mainFlowId'
      ); // 去除相同的项
      this.selectedReceivables = Number(
        (this.selectedReceivables + paramItem.receivable).toFixed(2)
      ); // 勾选交易总额
      this.selectedPayableAmounts = Number(
        (this.selectedPayableAmounts + paramItem.changePrice).toFixed(2)
      );
    }
  }
  /**
   * 构建参数
   */
  private buildParams(flag) {
    // 分页处理
    const params: any = {
      nuonuostatus: flag,
      pageNo: this.paging,
      pageSize: this.pageConfig.pageSize,
    };
    // 排序处理
    if (this.sorting && this.naming) {
      // params.order = [this.sorting + ' ' + this.naming];
      const asc = this.naming === 'desc' ? -1 : 1;
      params.order = [
        {
          name: NuoNuoTradeListOrderEnum[this.sorting], // 要排序的名称
          asc, // 是否是升序 -1表示降序 1表示升序
        },
      ];
    }
    // 搜索处理
    if (this.searches.length > 0) {
      for (const search of this.searches) {
        if (!XnUtils.isEmpty(this.arrObjs[search.checkerId])) {
          if (search.checkerId === 'transactionStatus') {
            const obj = JSON.parse(this.arrObjs[search.checkerId]);
            params.isProxy = Number(obj.proxy);
            params.tradeStatus = Number(obj.status);
          } else if (search.checkerId === 'valueDate') {
            const obj = JSON.parse(this.arrObjs[search.checkerId]);
            params.valueDateStart = obj.beginTime;
            params.valueDateEnd = obj.endTime;
          } else {
            params[search.checkerId] = this.arrObjs[search.checkerId];
          }
        }
      }
    }
    return params;
  }

  private buildChecker(stepRows) {
    for (const row of stepRows) {
      XnFormUtils.convertChecker(row);
    }
  }

  /**
   * 回退操作
   * @param data
   */
  private onUrlData(data?) {
    const urlData = this.xn.user.getUrlData(this.xn.router.url);
    if (urlData && urlData.pop) {
      this.paging = urlData.data.paging || this.paging;
      this.pageConfig = urlData.data.pageConfig || this.pageConfig;
      this.beginTime = urlData.data.beginTime || this.beginTime;
      this.endTime = urlData.data.endTime || this.endTime;
      this.arrObjs = urlData.data.arrObjs || this.arrObjs;
      this.label = urlData.data.label || this.label;
    } else {
      this.xn.user.setUrlData(this.xn.router.url, {
        paging: this.paging,
        pageConfig: this.pageConfig,
        beginTime: this.beginTime,
        endTime: this.endTime,
        arrObjs: this.arrObjs,
        label: this.label,
      });
    }
  }

  /**
   * 行按钮组事件
   * @param paramItem 当前行数据
   * @param paramBtnOperate 按钮操作配置
   * @param i 下标
   */
  public handleHeadClick(paramBtnOperate: ButtonConfigModel) {
    if (this.selectedItems && this.selectedItems.length > 0) {
      let JudgeCondition = [];
      let msg = '';
      const statusOk = this.selectedItems.every((x) => {
        return [5, 6].includes(x.status);
      });
      if (!statusOk) {
        this.xn.msgBox.open(
          false,
          `交易状态为已放款、已回款的业务可发起${
            paramBtnOperate.operate === 'sub_nuonuocs_blue' ? '开票' : '作废'
          }申请流程`
        );
        return;
      }
      if (
        paramBtnOperate.operate === 'sub_nuonuocs_blue' ||
        paramBtnOperate.operate === 'sub_nuonuocs_offline'
      ) {
        JudgeCondition = [0, 2, 4];
        msg = '仅开票状态为未开票、开票失败、作废成功的业务可发起开票申请流程';
      } else if (paramBtnOperate.operate === 'sub_nuonuocs_red') {
        JudgeCondition = [1, 5];
        msg = '仅开票状态为开票成功、作废失败的业务可发起作废申请流程';
      }
      const isOk = this.selectedItems.every((x) => {
        return JudgeCondition.includes(x.nuonuoStatus);
      });
      if (!isOk && JudgeCondition.length > 0) {
        this.xn.msgBox.open(false, msg);
        return;
      }
      const mainFlowIds = this.selectedItems.map((x: any) => x.mainFlowId);
      if (paramBtnOperate.operate === 'sub_nuonuocs_blue') {
        this.filterTransaction();
      } else if (paramBtnOperate.operate === 'update_invoice_status') {
        this.xn.loading.open();
        const nuonuoid = this.selectedItems.map((x) => x.nuonuoid);
        this.xn.api.avenger
          .post('/nuonuo/syncNuonuoStatus', { nuonuoids: nuonuoid })
          .subscribe((x) => {
            if (x.ret === 0) {
              this.xn.loading.close();
              this.onPage({ page: this.paging });
            }
          });
      } else {
        paramBtnOperate.click(this.xn, mainFlowIds);
      }
    } else {
      this.xn.msgBox.open(false, '请先选择交易');
    }
  }

  filterTransaction() {
    this.differComp = this.selectedItems.filter(
      (x) => x.debtUnit !== x.debtUnitName
    );
    this.differComp.forEach((x) => (x.checked = false));
    if (this.differComp.length > 0) {
      const params: SingleListParamInputModel = {
        title: '开票信息比较',
        get_url: '',
        get_type: '',
        multiple: 'check',
        info: '下列清单开票信息与放款信息不一致，确认后将以‘开票信息企业名称‘进行开票',
        heads: [
          { label: '开票信息企业名称', value: 'debtUnit', type: 'text' },
          { label: '放款信息企业名称', value: 'debtUnitName', type: 'text' },
        ],
        searches: [],
        key: 'mainFlowId',
        data: this.differComp || [],
        total: this.differComp.length,
        inputParam: {},
        options: {},
        rightButtons: [
          { label: '确定', value: 'submit' },
          { label: '取消', value: 'cancel' },
        ],
      };
      XnModalUtils.openInViewContainer(
        this.xn,
        this.vcr,
        SingleSearchListModalComponent,
        params
      ).subscribe((x) => {
        const sameItems = this.selectedItems.filter(
          (x) => x.debtUnit === x.debtUnitName
        );
        if (x.action === 'ok') {
          const newMainFlowIds = [...sameItems, ...x.value];
          const mainFlowIds = newMainFlowIds.map((x) => x.mainFlowId);
          this.openInvoice(mainFlowIds);
        } else {
          const mainFlowIds = sameItems.map((x) => x.mainFlowId);
          if (mainFlowIds.length > 0) {
            this.openInvoice(mainFlowIds);
          }
        }
      });
    } else {
      const mainFlowIds = this.selectedItems.map((x: any) => x.mainFlowId);
      this.openInvoice(mainFlowIds);
    }
  }

  // 开票流程
  openInvoice(mainFlows: string[]) {
    const rolesArr = this.xn.user.roles.filter((x) => {
      return x === 'financeOperator' || x === 'financeReviewer';
    });
    if (!(rolesArr && rolesArr.length)) {
      this.xn.msgBox.open(
        false,
        '您好，您的权限不够，仅【财务经办人】、【财务复核人】可进行操作'
      );
    } else {
      this.xn.router.navigate(
        [`/console/record/avenger/new/sub_nuonuocs_blue`],
        {
          queryParams: {
            id: 'sub_nuonuocs_blue',
            relate: 'mainIds',
            relateValue: mainFlows,
          },
        }
      );
    }
  }
  /**
   *
   * @param paramsValue 进入资产池  --资产池名称
   */
  enterCapitalPool(paramsValue) {
    const params = {
      mainFlowId: paramsValue,
    };
    this.xn.dragon
      .post('/trade/get_mainflowid_pool_info', params)
      .subscribe((x) => {
        if (x.ret === 0 && x.data.capitalPoolId !== '') {
          if (x.data.headquarters === HeadquartersTypeEnum[5]) {
            this.xn.router.navigate(['/logan/capital-pool/trading-list'], {
              queryParams: {
                capitalId: x.data.capitalPoolId,
                capitalPoolName: x.data.capitalPoolName,
                isProxy: 52,
                type: 1,
                currentPage: 1,
                isLocking: 0,
                storageRack: 'lg-2',
                fromProject: true,
              },
            });
          } else if (x.data.headquarters === HeadquartersTypeEnum[1]) {
            this.xn.router.navigate(['/vanke/assets-management/capital-pool'], {
              queryParams: {
                title:
                  '项目管理-万科>' +
                  (x.data.type === 1 ? 'ABS储架项目' : '再保理银行项目') +
                  '>' +
                  x.data.projectName +
                  '-' +
                  x.data.headquarters,
                projectId: x.data.project_manage_id,
                headquarters: x.data.headquarters,
                fitProject: x.data.projectName,
                capitalPoolId: x.data.capitalPoolId,
                capitalPoolName: x.data.capitalPoolName,
                isMachineenter: true,
              },
            });
          }
        } else if (x.ret === 0 && !x.data.capitalPoolId) {
          this.onPage({ page: this.paging });
        }
      });
  }
}
/**
 * 排序列表
 * 具体调试参考表
 */
enum NuoNuoTradeListOrderEnum {
  mainFlowId = 1,
  projectCompany = 2,
  debtUnit = 3,
  payConfirmId = 4,
  receivable = 5,
  changePrice = 6,
  discountRate = 7,
  status = 8,
  factoringEndDate = 9,
  nuonuoStatus = 10,
  nuonuodate = 11,
}
