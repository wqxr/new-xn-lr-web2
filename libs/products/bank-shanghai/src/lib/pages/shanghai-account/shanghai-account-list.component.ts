/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：shanghai-account-list.component
 * @summary：多标签页列表项 根据tab-pane.ts中的配置
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 yutianbao        上海银行台账列表     2020-05-015
 * **********************************************************************
 */

import { Component, OnInit, ViewContainerRef, ChangeDetectorRef, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { BankManagementService } from 'libs/console/src/lib/bank-management/bank-mangement.service';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { JsonTransForm } from 'libs/shared/src/lib/public/pipe/xn-json.pipe';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { PdfSignModalComponent } from 'libs/shared/src/lib/public/modal/pdf-sign-modal.component';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { TabListOutputModel, SubTabListOutputModel, ButtonConfigModel } from 'libs/shared/src/lib/config/list-config-model';
import CommUtils from 'libs/shared/src/lib/public/component/comm-utils';
import { ShangHaiMfilesViewModalComponent } from '../../share/modal/mfiles-view-modal.component';
import { ShangHaiPdfSignModalComponent } from '../../share/modal/pdf-sign-modal.component';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { DragongetCustomFiledComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/custom-field-modal.component';
import { DragongetCustomListComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/custom-list-modal.component';
import { EditParamInputModel, ShEditModalComponent } from '../../share/modal/edit-modal.component';
import { fromEvent } from 'rxjs';
import XnFlowUtils from 'libs/shared/src/lib/common/xn-flow-utils';
import { ShangHaiBusinessMatchmakerChooseComponent } from '../../share/modal/business-choose-matchmaker-modal.component';
import { ShangHaiPushVankeModalComponent } from '../../share/modal/push-vanke-modal.component';
import { AvengerInvoiceShowModalComponent } from 'libs/products/avenger/src/lib/shared/components/modal/avenger-invoice-show-modal.component';
import ShangHaiAccountConfig from '../../logic/shanghai-account';
import { ShDataChangeModalComponent } from '../../share/modal/vanke-dataChange-modal.component';
import { SelectOptions, EnumShBankExtStatus, EnumShBankTradeStatus, extStatusToStatus, ShInterFaceErrStatus, ShInterFaceStepStatus, VankeExtStatus, Option } from 'libs/shared/src/lib/config/select-options';
import * as _ from 'lodash';
import { ShSingleSearchListModalComponent, ShSingleListParamInputModel } from '../../share/modal/single-searchList-modal.component';
import { ShanghaiFinancingContractModalComponent } from '../../share/modal/shanghai-asign-contract.modal.component';
import { map } from 'rxjs/operators';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { ModalSize } from 'libs/shared/src/lib/common/modal/components/modal';
import { SelectItemsModel } from 'libs/shared/src/lib/config/checkers';
import { IsProxyDef } from 'libs/shared/src/lib/config/enum';

@Component({
  selector: 'lib-shanghai-account-list',
  templateUrl: './shanghai-account-list.component.html',
  styleUrls: ['./shanghai-account-list.component.css']
})
export class ShanghaiAccountListComponent implements OnInit, AfterViewInit, OnDestroy {
  tabConfig: any;
  // 默认激活第一个标签页 {do_not,do_down}
  // label = 'do_not';
  public defaultValue = 'A';  // 默认激活第一个标签页
  displayShow = true;
  private sortObjs = []; // 缓存后退的排序项

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
  public scrollX = 0; // 滚动条滚动距离
  public FixedHead: number[] = []; // 需要固定的表格列
  public FixedHeadNubmer = 0; // 固定表格列数量
  headLeft = 0;
  arrObjs = {} as any; // 缓存后退的变量
  paging = 0; // 共享该变量
  timeStorage = {
    preDate: { beginTime: '', endTime: '' },
    factoringEndDate: { beginTime: '', endTime: '' },
    timeId: [],  // 时间checker项id
    preChangeTime: {
      preDate: [],
      factoringEndDate: [],
    }
  };
  public listInfo: any[] = []; // 数据
  public newHeads = {
    A: [],
    B: []
  }; // 后端返回的自定义table列表
  public newSearches = {
    A: [],
    B: []
  }; // 后端返回的自定义searches列表

  sorting = ''; // 共享该变量
  naming = ''; // 共享该变量
  heads: any[];
  roleId: string[] = [];
  public currentSubTab: SubTabListOutputModel = new SubTabListOutputModel(); // 当前子标签页
  public subDefaultValue = 'DOING'; // 默认子标签页
  public formModule = 'dragon-input';
  public selectedReceivables = 0; // 所选交易的应收账款金额汇总
  public allReceivables = 0; // 所有交易的应收账款金额汇总

  subResize: any;

  constructor(
    private xn: XnService,
    private vcr: ViewContainerRef,
    public bankManagementService: BankManagementService,
    private cdr: ChangeDetectorRef,
    private loading: LoadingService,
    private er: ElementRef,
    private localStorageService: LocalStorageService,
    public hwModeService: HwModeService) {
  }

  ngOnInit(): void {
    // this.router.data.subscribe(x => {
    // });
    this.tabConfig = ShangHaiAccountConfig.getConfig(AccountlistType[this.xn.user.orgType]);
    console.log(this.xn.user.orgType, AccountlistType[this.xn.user.orgType], this.tabConfig);
    this.initData(this.defaultValue, true);
    this.subResize = fromEvent(window, 'resize').subscribe(() => {
      this.formResize();
    });
  }

  /**
   *  标签页，加载列表信息
   * @param paramTabValue
   * @param init 是否为初始加载，true 不检查切换属性值与当前标签值
   */
  public initData(paramTabValue: string, init?: boolean) {

    if (this.defaultValue === paramTabValue && !init) {
      return;
    } else { // 重置全局变量
      this.selectedItems = [];
      this.listInfo = [];
      this.naming = '';
      this.sorting = '';
      this.sortObjs = [];
      this.paging = 1;
      this.pageConfig = { pageSize: 10, first: 0, total: 0 };
      for (const key in this.arrObjs) {
        if (this.arrObjs.hasOwnProperty(key)) {
          delete this.arrObjs[key];
        }
      }
    }
    this.defaultValue = paramTabValue;
    this.subDefaultValue = 'DOING'; // 重置子标签默认
    this.onPage({ page: this.paging });
  }

  /**
   * 列表查询
   * @param e  page: 新页码、 pageSize: 页面显示行数、first: 新页面之前的总行数、pageCount : 页码总数 customType:自定义类型
   * @summary 采购融资，地产abs  请求api有区别，采购融资：avenger 、地产abs：api
   */
  public onPage(e?: { page: number, first?: number, pageSize?: number, pageCount?: number }) {
    this.selectedItems = [];
    this.paging = e.page || 1;
    this.onUrlData(); // 导航回退取值
    if (this.sortObjs.length !== 0) {
      this.sorting = DragonVankeSystemOrderEnum[this.sortObjs[0].name];
      this.naming = VankeAccountSort[this.sortObjs[0].asc];
    }
    this.pageConfig = Object.assign({}, this.pageConfig, e);
    // 页面配置
    const find = this.tabConfig.tabList.find(tab => tab.value === this.defaultValue);
    this.currentTab = !!find ? find : new TabListOutputModel();
    // 子页面配置
    const subFind = this.currentTab.subTabList.find(sub => sub.value === this.subDefaultValue);
    this.currentSubTab = !!subFind ? subFind : new SubTabListOutputModel();
    this.heads = CommUtils.getListFields(this.currentSubTab.headText);
    this.searches = this.currentSubTab.searches;
    // 自定义列表字段或搜索项
    this.asyncFunc().then((result: any) => {
      this.heads = [
        ...result.newHeads.filter((x: any) => !(['vankeDataSource', 'shInterfaceStatus'].includes(x.value))),
        ...this.currentSubTab.headText.filter((x: any) => ['vankeDataSource', 'shInterfaceStatus'].includes(x.value))
      ];
      this.searches = [
        ...result.newSearches.filter((x: any) => !(['wkType'].includes(x.checkerId))),
        ...this.currentSubTab.searches.filter((x: any) => ['wkType'].includes(x.checkerId))
      ];
      this.buildShow(this.searches);
      // 构建参数
      const params = this.buildParams(this.currentSubTab.params, this.currentTab.value);
      if (this.currentTab.post_url === '') {
        // 固定值
        this.listInfo = [];
        this.selectedReceivables = 0;
        this.allReceivables = 0;
        this.pageConfig.total = 0;
        return;
      }
      this.xn.loading.open();
      // 采购融资 ：avenger,  地产abs ：api
      if (this.xn.user.orgType === 201) {
        params.projectCompany = this.xn.user.orgName;
      }
      this.xn.dragon.post(this.currentTab.post_url, params).subscribe(x => {
        this.selectedReceivables = 0;
        if (x.data && x.data.data && x.data.data.length) {
          x.data.data.map((item: any) => {  // 测试
            item.shInterfaceStatus = 2;
          });
          this.listInfo = x.data.data;
          this.allReceivables = x.data.sumFinancingAmount || x.data.sumReceive || 0;

          if (x.data.recordsTotal === undefined) {
            this.pageConfig.total = x.data.count;
          } else {
            this.pageConfig.total = x.data.recordsTotal;
          }
        } else if (x.data && x.data.lists && x.data.lists.length) {
          this.listInfo = x.data.lists;
          this.pageConfig.total = x.data.count;
        } else {
          // 固定值
          this.listInfo = [];
          this.allReceivables = 0;
          this.pageConfig.total = 0;
        }
        this.roleId = x.data.roles || [];
        this.cdr.markForCheck();
      }, () => {
        // 固定值
        this.listInfo = [];
        this.selectedReceivables = 0;
        this.allReceivables = 0;
        this.pageConfig.total = 0;
      }, () => {
        this.xn.loading.close();
      });
    }, () => {
      // error
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

  /**
   * 表格滚动条优化
   */
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
   * 处理自定义字段或搜索项
   */
  public customSetField() {
    const customList = [];
    // a、不同列表的筛选条件可分别配置 b、配置后对单用户账号生效，不是对同企业下所有用户生效
    customList.push(this.currentSubTab.headNumber);
    customList.push(this.currentSubTab.searchNumber);
    return new Promise((resolve, reject) => {
      this.xn.dragon.post('/trade/get_column', { statusList: customList }).subscribe(res => {
        const resObj = {
          newHeads: this.heads,
          newSearches: this.searches,
        };
        if (res.ret === 0 && res.data) {
          if (res.data.data.length === 0) {
            resObj.newHeads = this.heads;
            resObj.newSearches = this.searches;
          }
          const dataList = res.data.data;
          dataList.forEach(x => {
            if (x.status === this.currentSubTab.headNumber) {
              if (x.column === '') {
                resObj.newHeads = this.heads;

              } else {
                resObj.newHeads = [];
                const colArr = x.column || [];
                this.FixedHeadNubmer = x.lockCount || 0;
                JSON.parse(colArr).forEach((y) => {
                  this.heads.forEach((z: any) => {
                    if (y === z.value) {
                      resObj.newHeads.push(z);
                    }
                  });
                });
              }
            }
            if (x.status === this.currentSubTab.searchNumber) {
              if (x.column === '') {
                resObj.newSearches = this.searches;
              } else {
                resObj.newSearches = [];
                const searchArr = x.column || [];
                JSON.parse(searchArr).forEach((y) => {
                  this.searches.forEach((z: any) => {
                    if (y === z.checkerId) {
                      resObj.newSearches.push(z);
                    }
                  });
                });
              }
            }
          });
          resolve(resObj);
        }
      }, (err) => {
        reject(err);
      }, () => {
        // complete
      });
    });
  }

  /**
   * 查看校验结果
   */
  viewVerify(paramErr: string) {
    const errArray = [];
    paramErr = JSON.parse(paramErr);
    for (let i = 0; i < paramErr.length; i++) {
      const Errs = XnFlowUtils.formatRecordEveryStatus('VankeVerifyType', paramErr[i]);
      errArray.push(`${i + 1}、${Errs}`);
    }
    this.xn.msgBox.open(false, errArray);
  }

  /**
   * 查看人工校验失败类型
   */
  viewHandelVerify(paramErr: string) {
    const errArray = [];
    const otherDesc = JSON.parse(paramErr).otherDesc;
    paramErr = JSON.parse(paramErr).verifyArr;
    for (let i = 0; i < paramErr.length; i++) {
      const Errs = XnFlowUtils.formatRecordEveryStatus('VankeVerifyType', paramErr[i]);
      errArray.push(`${i + 1}、${Errs}---其他原因: ${otherDesc}`);
    }
    this.xn.msgBox.open(false, errArray);
  }

  /**
   * 执行异步操作
   */
  public async asyncFunc() {
    const customSetField = await this.customSetField();
    return customSetField;
  }

  /**
   *  搜索,默认加载第一页
   */
  public searchMsg() {
    this.selectedItems = [];
    this.selectedReceivables = 0;
    this.paging = 1;
    this.onPage({ page: this.paging, first: 0 });
  }

  /**
   * 重置
   */
  public reset() {
    this.naming = '';
    this.sorting = '';
    this.sortObjs = [];
    this.selectedItems = [];
    this.selectedReceivables = 0;
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
      this.naming = '';
      this.sorting = '';
      this.sortObjs = [];
      this.paging = 1;
      this.pageConfig = { pageSize: 10, first: 0, total: 0 };
      for (const key in this.arrObjs) {
        if (this.arrObjs.hasOwnProperty(key)) {
          delete this.arrObjs[key];
        }
      }
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
    this.sortObjs = [
      {
        name: DragonVankeSystemOrderEnum[this.sorting],
        asc: VankeAccountSort[this.naming],
      }
    ];
    this.onPage({ page: 1 });
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
   * @param con
   */
  public showContract(con) {
    const params = Object.assign({}, con, { readonly: true });
    XnModalUtils.openInViewContainer(this.xn, this.vcr, ShangHaiPdfSignModalComponent, params).subscribe(() => {
    });
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

  private buildChecker(stepRows) {
    for (const row of stepRows) {
      XnFormUtils.convertChecker(row);
    }
  }

  /**
   * 搜索项值格式化
   * @param searches
   */
  private buildCondition(searches) {
    const objList = [];
    this.timeStorage.timeId = $.extend(true, [], this.searches.filter(v => v.type === 'quantum').map(v => v.checkerId));

    // for (let i = 0; i < searches.length; i++) {
    searches.map((search: any, index: number) => {
      const obj = {} as any;
      obj.title = search.title;
      obj.checkerId = search.checkerId;
      obj.required = false;
      obj.type = search.type;
      obj.number = search.number;
      obj.options = search.options;
      if (this.timeStorage.timeId.includes(search.checkerId)) {
        const checkIndex = this.timeStorage.timeId.findIndex((time) => time === search.checkerId);
        const tmpTime = this.timeStorage[this.timeStorage.timeId[checkIndex]];
        obj.value = JSON.stringify(tmpTime);
      } else if (['wkType'].includes(obj.checkerId)) {
        obj.value = search.value;
      } else {
        obj.value = this.arrObjs[search.checkerId];
      }
      objList.push(obj);
    });
    this.shows = $.extend(true, [], objList.sort((a, b) => {
      return a.number - b.number;
    })); // 深拷贝，并排序;
    XnFormUtils.buildSelectOptions(this.shows);
    this.buildChecker(this.shows);
    this.form = XnFormUtils.buildFormGroup(this.shows);
    this.form.valueChanges.subscribe((v) => {
      // 时间段
      this.timeStorage.timeId.forEach((timeCheck) => {
        if (v[timeCheck] !== '' && timeCheck) {
          const paramsTime = JSON.parse(v[timeCheck]);
          // 保存每次的时间值。
          this.timeStorage.preChangeTime[timeCheck].unshift({ begin: paramsTime.beginTime, end: paramsTime.endTime });
          // 默认创建时间
          this.timeStorage[timeCheck].beginTime = paramsTime.beginTime;
          this.timeStorage[timeCheck].endTime = paramsTime.endTime;
          if (this.timeStorage.preChangeTime[timeCheck].length > 1) {
            if (this.timeStorage.preChangeTime[timeCheck][1].begin === this.timeStorage[timeCheck].beginTime &&
              this.timeStorage.preChangeTime[timeCheck][1].end === this.timeStorage[timeCheck].endTime) {
              // return;
            } else {
              this.timeStorage[timeCheck].beginTime = paramsTime.beginTime;
              this.timeStorage[timeCheck].beginTime = paramsTime.beginTime;
              this.paging = 1;
              this.onPage({ page: this.paging });
            }
          }
        }
      });
      const arrObj = {} as any;
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
   *  判读列表项是否全部选中
   */
  public isAllChecked(): boolean {
    return !(this.listInfo.some(x => !x.checked || x.checked && x.checked === false) || this.listInfo.length === 0);
  }

  /**
   * 全选
   */
  public checkAll() {
    if (!this.isAllChecked()) {
      this.selectedReceivables = 0;
      this.listInfo.forEach(item => item.checked = true);
      this.selectedItems = XnUtils.distinctArray2([...this.selectedItems, ...this.listInfo], 'mainFlowId');
      this.selectedItems.forEach(item => {
        this.selectedReceivables = Number((this.selectedReceivables + item.receive).toFixed(2)); // 勾选交易总额
      });
    } else {
      this.listInfo.forEach(item => item.checked = false);
      this.selectedItems = [];
      this.selectedReceivables = 0;
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
      this.selectedReceivables = Number((this.selectedReceivables - paramItem.receive).toFixed(2)); // 勾选交易总额

    } else {
      paramItem.checked = true;
      this.selectedItems.push(paramItem);
      this.selectedItems = XnUtils.distinctArray2(this.selectedItems, 'mainFlowId');
      this.selectedReceivables = Number((this.selectedReceivables + paramItem.receive).toFixed(2)); // 勾选交易总额
      // 去除相同的项
    }
  }

  /**
   * @description: 构建参数
   * @param {string} tabParam 区分tab页
   * @param {string} type tab页value值
   * @return {*}
   */
  private buildParams(tabParam: string | number, type?: string | number) {
    // 分页处理
    const params: any = {
      pageNo: this.paging,
      pageSize: this.pageConfig.pageSize,
      status: tabParam,
      isProxy: IsProxyDef.SH_BANK,
      wkType: 1  // 默认线上数据
    };

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
        if (['wkType'].includes(search.checkerId)) {
          params['wkType'] = Number(search.value);
        }
        if (!XnUtils.isEmpty(this.arrObjs[search.checkerId])) {
          switch (search.checkerId) {
            case 'tradeDate':          // 提单日期
              const tradeDate = JSON.parse(this.arrObjs[search.checkerId]);
              params['tradeDateStart'] = Number(tradeDate['beginTime']);
              params['tradeDateEnd'] = Number(tradeDate['endTime']);
              break;
            case 'expiredDate':          // 保理融资到期日
              const expiredDate = JSON.parse(this.arrObjs[search.checkerId]);
              params['expiredDateStart'] = Number(expiredDate['beginTime']);
              params['expiredDateEnd'] = Number(expiredDate['endTime']);
              break;
            case 'ccsAduitDatetime':     // 一线审核时间
              const ccsAduitDatetime = JSON.parse(this.arrObjs[search.checkerId]);
              params['ccsAduitDatetimeStart'] = Number(ccsAduitDatetime['beginTime']);
              params['ccsAduitDatetimeEnd'] = Number(ccsAduitDatetime['endTime']);
              break;
            case 'ccsApproveTime':       // 一线审批时间
              const ccsApproveTime = JSON.parse(this.arrObjs[search.checkerId]);
              params['ccsApproveTimeStart'] = Number(ccsApproveTime['beginTime']);
              params['ccsApproveTimeEnd'] = Number(ccsApproveTime['endTime']);
              break;
            case 'ccsZauditDate':        // 资金中心审核时间
              const ccsZauditDate = JSON.parse(this.arrObjs[search.checkerId]);
              params['ccsZauditDateStart'] = Number(ccsZauditDate['beginTime']);
              params['ccsZauditDateEnd'] = Number(ccsZauditDate['endTime']);
              break;
            case 'factoringStartDate':          // 起息日
              const factoringStartDate = JSON.parse(this.arrObjs[search.checkerId]);
              params['valueDateStart'] = Number(factoringStartDate['beginTime']);
              params['valueDateEnd'] = Number(factoringStartDate['endTime']);
              break;
            case 'financingType':
              const val = JSON.parse(this.arrObjs[search.checkerId]);
              params['productType'] = Number(val.proxy);
              if (!!val.status) {
                params['bankType'] = Number(val.status);
              }
              break;
            case 'receive':
              params['receive'] = this.arrObjs[search.checkerId].toString().replace(/[,]/g, '');
              break;
            case 'tradeStatus':       // 交易状态
              const tradeStatusKey = this.arrObjs[search.checkerId];
              const mainStatus = EnumShBankTradeStatus[tradeStatusKey];
              const subStatus = EnumShBankExtStatus[tradeStatusKey];
              if (!!mainStatus) {
                params['tradeStatus'] = Number(mainStatus);
                // params['statusEx'] = 0;
                params['statusEx'] = SelectOptions.get('tradeStatus_sh').find((x: any) => x.value === tradeStatusKey)?.extValue || [];
              }
              if (!XnUtils.isEmptys(subStatus, [0])) {
                const extToStatus = extStatusToStatus[tradeStatusKey];
                params['tradeStatus'] = Number(extToStatus);
                params['statusEx'] = SelectOptions.get('tradeStatus_sh').find((x: any) => x.value === tradeStatusKey)?.extValue || [];
              }
              break;

            default:
              params[search.checkerId] = this.arrObjs[search.checkerId];
              break;
          }
          if (search.type === 'text') {
            params[search.checkerId] = this.arrObjs[search.checkerId].trim();
          }
        }
      }
    }
    return params;
  }

  /**
   * 回退操作
   * @param data
   */
  private onUrlData() {
    const urlData = this.xn.user.getUrlData(this.xn.router.url);
    if (urlData && urlData.pop) {
      this.paging = urlData.data.paging || this.paging;
      this.pageConfig = urlData.data.pageConfig || this.pageConfig;
      this.timeStorage = urlData.timeStorage || this.timeStorage;
      this.arrObjs = urlData.data.arrObjs || this.arrObjs;
      this.defaultValue = urlData.data.defaultValue || this.defaultValue;
      this.subDefaultValue = urlData.data.subDefaultValue || this.subDefaultValue;
    } else {
      this.xn.user.setUrlData(this.xn.router.url, {
        paging: this.paging,
        pageConfig: this.pageConfig,
        timeStorage: this.timeStorage,
        arrObjs: this.arrObjs,
        defaultValue: this.defaultValue,
        subDefaultValue: this.subDefaultValue,
      });
    }
  }

  /**
   * 搜索项收缩栏是否显示
   */
  show() {
    this.displayShow = !this.displayShow;
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
  /**
   *  查看文件信息
   * @param paramFile
   */
  public viewFiles(paramFile) {
    paramFile.isAvenger = true;
    XnModalUtils.openInViewContainer(this.xn, this.vcr, ShangHaiMfilesViewModalComponent, [paramFile]).subscribe();
  }

  /**
   * 表头按钮组事件
   * @param paramBtnOperate 按钮操作配置
   *
   */
  public handleHeadClick(paramBtnOperate: ButtonConfigModel) {
    // let mainFlowIds = this.selectedItems.map((x: any) => x.mainFlowId);
    if (paramBtnOperate.operate === 'custom_search') {
      // 自定义筛选条件
      const forbidCustomFields = ['wkType'];  // 不支持自定义字段
      const params = {
        title: '自定义筛选条件',
        label: 'checkerId',
        type: 1,
        headText: JSON.stringify(this.currentSubTab.searches.filter((x: any) => !forbidCustomFields.includes(x.checkerId))),
        selectHead: JSON.stringify(this.searches.filter((x: any) => !forbidCustomFields.includes(x.checkerId))),
        selectField: this.heads.filter((x: any) => !forbidCustomFields.includes(x.value)),
        status: this.currentSubTab.searchNumber
      };
      XnModalUtils.openInViewContainer(this.xn, this.vcr, DragongetCustomFiledComponent, params).subscribe(v => {
        if (v && v.action === 'ok') {
          this.newSearches[this.defaultValue] = this.deepCopy(v.value, []);
          // 重置搜索项值
          this.selectedItems = [];
          for (const key in this.arrObjs) {
            if (this.arrObjs.hasOwnProperty(key)) {
              delete this.arrObjs[key];
            }
          }
          this.onPage({ page: this.paging });
        }
      });
    } else if (paramBtnOperate.operate === 'custom_field') {
      // 自定义页面字段
      const forbidCustomFields = ['vankeDataSource', 'shInterfaceStatus'];  // 不支持自定义字段
      const params = {
        title: '自定义页面字段',
        label: 'value',
        type: 2,
        headText: JSON.stringify(this.currentSubTab.headText.filter((x: any) => !forbidCustomFields.includes(x.value))),
        selectHead: JSON.stringify(this.heads.filter((x: any) => !forbidCustomFields.includes(x.value))),
        status: this.currentSubTab.headNumber,
        FixedNumber: this.FixedHeadNubmer
      };
      XnModalUtils.openInViewContainer(this.xn, this.vcr, DragongetCustomListComponent, params).subscribe(v => {
        if (v && v.action === 'ok') {
          this.newHeads[this.defaultValue] = this.deepCopy(v.value, []);
          // this.cdr.markForCheck();
          this.onPage({ page: this.paging });
        }
      });
    }
  }

  // 台账中登登记权限
  public showZhongdeng() {
    return this.xn.user.orgType === 99 && this.subDefaultValue === 'DOING' && (this.xn.user.roles.includes('operator')
      || this.xn.user.roles.includes('reviewer'));
  }

  /**
   * 表头批量操作按钮组事件
   * @param paramBtnOperate 按钮操作配置
   *
   */
  public handleHeadBatchClick(paramBtnOperate: ButtonConfigModel) {
    if (paramBtnOperate.operate === 'download_file') {
      // 下载附件
      this.downloadFile(paramBtnOperate);
    } else if (paramBtnOperate.operate === 'export_file') {
      // 导出清单
      this.downloadApprovallist(paramBtnOperate);
    } else if (paramBtnOperate.operate === 'sub_zhongdeng_register') {
      // 中登登记
      if (!this.selectedItems.length) {
        this.xn.msgBox.open(false, '请选择交易');
        return false;
      }
      const newSelectItems = this.selectedItems.filter((x: any) => x.isProxy === 14 || x.isProxy === 60); // 新业务的退单流程
      this.xn.router.navigate([`/machine-account/zhongdeng/new`], {
        queryParams: {
          relate: 'mainIds',
          relateValue: newSelectItems.map((x: any) => x.mainFlowId)
        }
      });
    } else if (paramBtnOperate.operate === 'batch_info') {
      // 批量补充信息
      if (!this.selectedItems.length) {
        this.xn.msgBox.open(false, '请选择交易');
        return false;
      }
      this.batchModify();
    } else if (paramBtnOperate.operate === 'execute_next_process') {
      // 执行下个流程
      if (!this.selectedItems.length) {
        this.xn.msgBox.open(false, '请选择交易');
      } else if (!!this.selectedItems.length && this.selectedItems.length > 1) {
        this.xn.msgBox.open(false, '只能操作单笔交易');
      } else if (!!this.selectedItems.length && this.selectedItems.length === 1) {
        this.executeNextProcess();
      }
    } else if (paramBtnOperate.operate === 'reject_program') {
      // 退单流程
      if (!this.selectedItems.length) {
        this.xn.msgBox.open(false, '请选择交易');
        return false;
      }
      const pauseItems = this.selectedItems.filter(x => (x.wkType === 1 && x.pauseStatus === 1)); // 万科线上数据-【平台审核-暂停】的交易
      if (!!pauseItems.length) { // 【平台审核-暂停】
        this.xn.msgBox.open(false, [
          '您选择的交易，存在' + pauseItems.length + '笔暂停交易',
          ...pauseItems.map(o => o.mainFlowId),
          '不能进行"退单流程"操作,请重新选择交易'
        ], () => {
        });
      } else {
        this.rejectProgram();
      }
    } else if (paramBtnOperate.operate === 'edit_helpHandler') {
      // 修改协助处理人(平台)
      if (!this.selectedItems.length) {
        this.xn.msgBox.open(false, '请选择交易');
        return false;
      }
      this.editHelpHandler();
    } else if (paramBtnOperate.operate === 'pushList_vanke') { // 向万科推送清单(保理商)
      if (!this.selectedItems.length) {
        this.xn.msgBox.open(false, '请选择交易');
        return false;
      }
      this.pushVankeData();
    } else if (paramBtnOperate.operate === 'sign_contract_plat_batch') { // 批量签署合同
      if (!this.selectedItems.length) {
        this.xn.msgBox.open(false, '请选择交易');
        return false;
      }
      // 待平台签署服务协议状态才能签
      const hasNotSignStep = this.selectedItems.some((x: any) => !([EnumShBankTradeStatus.bank_finish].includes(Number(x.tradeStatus))
        && [EnumShBankExtStatus.platform_sign_service_agreement].includes(Number(x.statusEx))));
      const notSignStepArr = this.selectedItems.filter((x: any) => !([EnumShBankTradeStatus.bank_finish].includes(Number(x.tradeStatus))
        && [EnumShBankExtStatus.platform_sign_service_agreement].includes(Number(x.statusEx)))).map((y: any) => y.mainFlowId);
      const signStepArr = this.selectedItems.filter((x: any) => !!([EnumShBankTradeStatus.bank_finish].includes(Number(x.tradeStatus))
        && [EnumShBankExtStatus.platform_sign_service_agreement].includes(Number(x.statusEx)))).map((y: any) => y.mainFlowId);
      if (!!hasNotSignStep) {
        this.xn.msgBox.open(false, [
          `交易状态为待链融签署《服务协议》的业务才能进行批量签署，`,
          `其中有${notSignStepArr.length}笔交易：`,
          ...notSignStepArr,
          `不能进行此操作`
        ]);
        return false;
      }
      this.signContractPlatBatch(signStepArr);
    }
  }

  /**
   * 下载附件
   */
  downloadFile(btn: ButtonConfigModel) {
    const selectedRows = this.listInfo.filter((x: any) => x.checked && x.checked === true);
    const hasSelect = !!selectedRows && selectedRows.length > 0;
    // 检查总部公司名称是否一致
    const isProxyArr = XnUtils.distinctArray(this.listInfo.map(c => c.isProxy)) || [];
    if (isProxyArr.length && isProxyArr.length > 1) {
      this.xn.msgBox.open(false, '筛选条件下，具有不同总部公司！');
      return;
    }
    // const selectedCompany = isProxyArr.length && isProxyArr.length === 1 ? HeadquartersTypeEnum[isProxyArr[0]] : '';
    const checkers = [{
      checkerId: 'downloadRange', name: 'downloadRange', required: true, type: 'radio', title: '下载范围',
      selectOptions: [
        { value: 'all', label: '当前筛选条件下的所有交易' },
        { value: 'selected', label: '勾选交易', disable: !hasSelect }
      ]
    }, {
      checkerId: 'chooseFile', name: 'chooseFile', required: true, type: 'checkbox', title: '下载内容',
      selectOptions: [
        { value: 1, label: '《付款确认书》' },
        { value: 9, label: '中登登记证明文件' },
        { value: 10, label: '查询证明文件' },
        { value: 11, label: '基础资料(指交易流程中上传的合同,发票等文件)' },
      ]
    }];

    const params: EditParamInputModel = {
      checker: checkers,
      title: '下载附件',
      buttons: ['取消', '下载'],
    };
    XnModalUtils.openInViewContainer(this.xn, this.vcr, ShEditModalComponent, params).subscribe(data => {
      if (!!data) {
        this.xn.loading.open();
        const newMainFlowId = this.listInfo.filter(z => z.isProxy === 14 || z.isProxy === 60);
        const newSelectItems = this.selectedItems.filter((x: any) => x.isProxy === 14 || x.isProxy === 60);
        const newparam = { mainFlowIdList: [], contentType: [] };  // 新业务参数
        newparam.contentType = data.chooseFile ? data.chooseFile.split(',').filter(c => c).map(x => Number(x)) : '';
        if (data.downloadRange === 'all') {
          newparam.mainFlowIdList = newMainFlowId.map(c => c.mainFlowId); // 刷选新万科业务
        } else if (data.downloadRange === 'selected') {
          if (!this.selectedItems.length) {
            this.xn.msgBox.open(false, '未选择交易');
            return;
          }
          newparam.mainFlowIdList = newSelectItems.map(c => c.mainFlowId);
        }
        // console.log(newparam);
        if ((data.downloadRange === 'all' && newMainFlowId.length) || (data.downloadRange === 'selected' && newSelectItems.length)) {
          this.xn.dragon.download(btn.post_url, newparam).subscribe((v: any) => {
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
      }
    });
  }

  // 导出清单
  downloadApprovallist(paramItem: any) {
    const hasSelect = this.selectedItems && this.selectedItems.length;
    const checkers = [
      {
        checkerId: 'exportList', name: 'exportList', required: true, type: 'radio', title: '导出清单范围',
        selectOptions: [
          { value: 'all', label: '当前列表所有交易' },
          { value: 'selected', label: '勾选交易', disable: !hasSelect }
        ]
      }
    ];
    const params: EditParamInputModel = {
      checker: checkers,
      title: '导出清单',
      buttons: ['取消', '下载'],
    };
    XnModalUtils.openInViewContainer(this.xn, this.vcr, ShEditModalComponent, params).subscribe(x => {
      if (!x) {
        return;
      }
      this.xn.loading.open();
      const newSelectItems = this.selectedItems.filter((x: any) => x.isProxy === 14 || x.isProxy === 60);
      const newParam = {
        headquarters: '万科',
        status: this.currentSubTab.params,
        mainFlowIdList: [],
        type: '',
      };
      if (x.exportList === 'all') {
        newParam.type = 'all';
        newParam.mainFlowIdList = [];
      } else if (x.exportList === 'selected') {
        newParam.type = 'selected';
        newParam.mainFlowIdList = newSelectItems.map(c => c.mainFlowId);
      }
      if (newParam.type === 'all' || (newParam.type === 'selected' && newSelectItems.length)) {
        const paramsTotal = Object.assign({}, this.buildParams(this.currentSubTab.params), newParam);
        this.xn.dragon.download(paramItem.post_url, paramsTotal).subscribe((con: any) => {
          this.xn.api.save(con._body, '台账列表清单.xlsx');
          this.xn.loading.close();
        });
      }
    });
  }

  /**
   * 执行下个流程--暂时不用
   */
  executeNextProcess() {
    const { tradeStatus, statusEx, flowId } = this.selectedItems.map(x => {
      return {
        tradeStatus: x.tradeStatus,
        statusEx: x.statusEx,
        flowId: x.flowId
      };
    })[0];
    // 交易状态处理
    const mainStatus = EnumShBankTradeStatus[Number(tradeStatus)];
    const subStatus = EnumShBankExtStatus[Number(statusEx)];
    let currentStatus = '';  // 当前交易状态标识
    let currentStatusLabel = '';  // 当前交易状态名
    if (!XnUtils.isEmptys(mainStatus)) {
      currentStatus = mainStatus;
    }
    if (!XnUtils.isEmptys(subStatus) && !XnUtils.isEmptys(statusEx)) {
      currentStatus = subStatus;
    }
    if (!XnUtils.isEmptys(currentStatus)) {
      currentStatusLabel = SelectOptions.getConfLabel('tradeStatus_sh_all', currentStatus.toString());
    }
    if (![3, 4].includes(tradeStatus) || [100, 101, 51].includes(statusEx)) {
      this.xn.msgBox.open(false, `交易状态为${currentStatusLabel}，不能进行此操作`);
      return false;
    }
    // 获取下一个交易状态名-即流程名
    const nextStatusLabel = SelectOptions.getConfLabel('tradeStatus_sh_all', nextFlowId[currentStatus.toString()]);  // 下一个交易状态名
    this.xn.msgBox.open(true, [
      `当前流程状态为：${currentStatusLabel}，是否确定执行下一流程？`,
      `下个流程状态：${nextStatusLabel}`
    ], () => {
      // 执行流程接口
      // this.xn.dragon.post('', {}).subscribe((res: any) => {
      //   if (res && res.ret === 0){
      //     this.onPage({ page: this.paging });
      //   }
      // });
    }, () => {
    });
  }

  /**
   * 批量补充
   */
  public batchModify() {
    const newSelectItems = this.selectedItems.filter((x: any) => x.isProxy === 14 || x.isProxy === 60); // 新业务
    const param = { batchList: newSelectItems };
    this.localStorageService.setCacheValue('batchList', JSON.stringify(param));
    this.xn.router.navigate(['/bank-shanghai/batch-add-info']);
  }

  /**
   * 修改协助处理人
   * @param
   */
  editHelpHandler() {
    const newSelectItems = this.selectedItems.filter((x: any) => x.isProxy === 14 || x.isProxy === 60); // 新业务
    const mainFlowIdList = newSelectItems.map(x => x.mainFlowId);
    const params = {
      type: 'select-helpUserName',
      roleId: 'operator',
      mainFlowIdList
    };
    XnModalUtils.openInViewContainer(this.xn, this.vcr, ShangHaiBusinessMatchmakerChooseComponent, params).subscribe((v) => {
      this.onPage({ page: this.paging });
      this.selectedItems = [];
    });
  }


  /**
   * 向万科推送清单
   * @param
   */
  pushVankeData() {
    const newSelectItems = this.selectedItems.filter((x: any) => x.isProxy === 14 || x.isProxy === 60); // 新业务
    const params = { selectedItems: newSelectItems };
    XnModalUtils.openInViewContainer(this.xn, this.vcr, ShangHaiPushVankeModalComponent, params).subscribe((v) => {
      if (v.action === 'ok') {
        this.onPage({ page: this.paging });
        this.selectedItems = [];
      }
    });
  }

  /**
   * 退单流程--平台审核 复核
   */
  rejectProgram() {
    const newSelectItems = this.selectedItems.filter((x: any) => x.isProxy === 14 || x.isProxy === 60); // 新业务的退单流程
    const mainIds = newSelectItems.map(c => c.mainFlowId);
    this.xn.router.navigate([`/bank-shanghai/record/new/`], {
      queryParams: {
        id: 'sub_sh_platform_check_retreat',
        relate: 'mainIds',
        relateValue: mainIds,
      }
    });
  }

  /**
   * @description: 待签署服务协议--平台
   * @param {*}
   * @return {*}
   */
  signContractPlatBatch(mainIds: string[]) {
    const params: any = {
      mainFlowIdList: mainIds,
    };
    XnUtils.checkLoading(this);
    this.xn.dragon.post('/sh_trade/platformSignList', params).subscribe((json: any) => {
      const contracts = json?.data || [];
      if (contracts && !contracts.length) {
        this.xn.msgBox.open(false, '无合同可签署');
        return false;
      } else if (contracts && !!contracts.length) {
        contracts.map((x: any) => {
          if (!x.config) {
            x['config'] = { text: '' };
          }
          if (x.label.includes('链融科技供应链金融服务平台服务合同')) {
            x['config']['text'] = '乙方（盖章）';
          } else {
            x['config']['text'] = '（盖章）';
          }
        });
        const contractObj = {
          // flowId: '',
          isProxy: 60,
          contracts,
        };
        XnModalUtils.openInViewContainer(this.xn, this.vcr, ShanghaiFinancingContractModalComponent, contractObj).subscribe(v => {
          console.log('signContractPlatBatch-------', v);
          if (v === 'ok') {
            // 提交接口
            const subParam = {
              mainFlowIds: mainIds
            };
            this.xn.dragon.post('/sh_bank_trade/service_sign_finish', subParam).subscribe({
              next: (res: any) => {
              },
              error: (err: any) => {
                console.log('err', err);
              },
              complete: () => {
                this.selectedItems = [];
                this.onPage({ page: this.paging });
              }
            });
          }
        });
      }
    });
  }

  /**
   * [string,string,...]或'string,string,...'数据类型转换--->any[]
   * @param data
   */
  public transToList(data: string | string[]) {
    if (!data) {
      return [];
    }
    let obj = [];
    if (JSON.stringify(data).includes('[')) {
      obj = typeof data === 'string'
        ? JSON.parse(data)
        : data;
    } else {
      obj = typeof data === 'string'
        ? data.split(',')
        : [data];
    }
    return obj;
  }

  /**
   * 查看更多发票
   */
  public viewInvoiceMore(item: { invoiceNum: string | string[], mainFlowId: string, isProxy: any }) {
    // 打开弹框
    const params: ShSingleListParamInputModel = {
      title: '发票详情',
      get_url: '/sh_trade/get_invoice_list',
      get_type: 'dragon',
      multiple: null,
      heads: [
        { label: '发票代码', value: 'invoiceCode', type: 'text' },
        { label: '发票号码', value: 'invoiceNum', type: 'text' },
        { label: '发票含税金额', value: 'invoiceAmount', type: 'money' },
        { label: '发票转让金额', value: 'transferMoney', type: 'money' }
      ],
      searches: [],
      key: 'invoiceCode',
      data: [],
      total: 0,
      inputParam: { mainFlowId: item.mainFlowId },
      rightButtons: [{ label: '确定', value: 'submit' }],
      options: {
        paramsType: 1   // 1 区分接口入参分页参数
      }
    };
    XnModalUtils.openInViewContainer(this.xn, this.vcr, ShSingleSearchListModalComponent, params).subscribe(v => {
      if (v === null) {
        return;
      }
    });
  }

  /**
   * 行操作权限判断-是否显示按钮
   * @param item
   * @param type
   */
  rowAuthJudge(item: any, type: string): boolean {
    let status = false;
    switch (type) {
      // 平台操作----状态待定
      case 'enter_verify':
        status = [99].includes(this.xn.user.orgType) && [EnumShBankTradeStatus.platform_verify].includes(Number(item.tradeStatus)) &&
          !(item.wkType.toString() === '1' && (item.pauseStatus.toString() === '1' || item.acceptState.toString() === '2'));
        break;
      case 'stop':
        status = [99].includes(this.xn.user.orgType) && ([EnumShBankTradeStatus.supplier_upload,
        EnumShBankTradeStatus.platform_verify, EnumShBankTradeStatus.bank_verify].includes(Number(item.tradeStatus)) ||
          [EnumShBankTradeStatus.bank_finish].includes(Number(item.tradeStatus)) &&
          (Number(item.statusEx) < EnumShBankExtStatus.loan_apply));
        break;
      case 'sign_contract_plat':
        status = [99].includes(this.xn.user.orgType) && [EnumShBankTradeStatus.bank_finish].includes(Number(item.tradeStatus))
          && [EnumShBankExtStatus.platform_sign_service_agreement].includes(Number(item.statusEx));
        break;
      case 'addData':
        status = [99].includes(this.xn.user.orgType);
        break;
      // 供应商操作
      case 'modify_remarks':
        status = [1].includes(this.xn.user.orgType) && ([EnumShBankTradeStatus.supplier_upload,
        EnumShBankTradeStatus.platform_verify, EnumShBankTradeStatus.bank_verify].includes(Number(item.tradeStatus)) ||
          [EnumShBankTradeStatus.bank_finish].includes(Number(item.tradeStatus)) &&
          (Number(item.statusEx) <= EnumShBankExtStatus.sign_financing_contract_timeout));
        break;
      // case 'sign_contract_supplier':  // 暂不显示 走流程签署
      //   status = [1].includes(this.xn.user.orgType) && ['4'].includes(String(item.tradeStatus))
      //     && ['1080'].includes(String(item.statusEx));
      //   break;
      // case 'drawing':  // 移到提现列表
      //   status = [1].includes(this.xn.user.orgType) && [EnumShBankTradeStatus.bank_finish].includes(Number(item.tradeStatus))
      //     && [EnumShBankExtStatus.withdrawal].includes(Number(item.statusEx));
      //   break;
      default:
        status = false;
        break;
    }
    return status;
  }

  /**
   * 行按钮disabled状态
   * @param item 行信息
   */
  disabledJudge(item: any, type: string): boolean {
    let status = false;
    switch (type) {
      // 平台操作
      case 'enter_verify':
        // 平台审核-初审-暂停  平台审核-复核-等待受理
        status = [99].includes(this.xn.user.orgType) && ((item.wkType.toString() === '1' && item.pauseStatus.toString() === '1')
          || (item.wkType.toString() === '1' && item.acceptState.toString() === '2'));
        break;
      // 供应商操作
      // case 'xxxx':
      //   status = '';
      //   break;
      default:
        status = false;
        break;
    }
    return status;
  }

  /**
   * 行按钮组事件
   * @param item 当前行数据
   * @param btn {label:string,operate:string,value:string,value2?:string}
   * @param i 下标
   */
  public handleRowClick(item: any, btn: ButtonConfigModel, i: number) {
    console.log('handleRowClick===', item, btn);
    if (btn.operate === 'addData') {
      // 后补资料
      this.addData(item);
    } else if (btn.operate === 'sign_contract_plat') {
      // 签署合同 待平台签署服务协议状态才能签
      const hasNotSignStep = !([EnumShBankTradeStatus.bank_finish].includes(Number(item.tradeStatus))
        && [EnumShBankExtStatus.platform_sign_service_agreement].includes(Number(item.statusEx)));
      if (!!hasNotSignStep) {
        this.xn.msgBox.open(false, `交易状态为【待链融签署《服务协议》】的业务才能进行此操作`);
        return false;
      }
      this.signContractPlatBatch([item.mainFlowId]);
    } else if (btn.operate === 'modify_remarks') {
      // 修改备注信息
      this.modifyRemarks(item, btn);
    } else if (btn.operate === 'enter_verify') {
      // 进入审核页面
      this.enterVerifyPage(item);
    } else {
      btn.click(item, this.xn, this.hwModeService);
    }
  }

  // 进入审核页面
  enterVerifyPage(item: any) {
    if (['@end'].includes(item.nowProcedureId)) {
      this.xn.router.navigate([`/bank-shanghai/record/todo/view/${item.recordId}`]);
      return false;
    }
    const isOk = this.roleId.some((x: any) => {
      return _.startsWith(x, item.nowProcedureId.slice(0, 4));
    });
    if (!!isOk) {
      if (['operate', 'review'].includes(item.nowProcedureId)) {
        if (item.flowId === 'sh_vanke_platform_verify' && item.zhongdengStatus === 1) {
          this.xn.msgBox.open(false, '该流程中登登记处于登记中,不可处理');
          return false;
        } else {
          this.xn.router.navigate([`/bank-shanghai/record/todo/edit/${item.recordId}`]);
        }
      } else {
        this.xn.router.navigate([`/bank-shanghai/record/todo/view/${item.recordId}`]);
      }
    }
  }

  /**
   * 后补资料
   */
  addData(item: any) {
    const checkers = [{
      title: '交易ID', checkerId: 'mainFlowId', type: 'text', options: { readonly: true }, value: item.mainFlowId
    }, {
      title: '后补资料', checkerId: 'backUpFiles', type: 'dragonMfile', required: 0, checked: false,
      options: { fileext: 'jpg, jpeg, png, pdf' }, value: item.backUpFiles || ''
    }, {
      title: '是否需后补资料', checkerId: 'isBackUp', type: 'radio', required: false, options: { ref: 'defaultRadio' },
      value: item.isBackUp
    }];
    const params = {
      checker: checkers,
      title: '后补资料弹窗',
      buttons: ['取消', '确定'],
    };
    XnModalUtils.openInViewContainer(this.xn, this.vcr, ShEditModalComponent, params).subscribe((v) => {
      if (!v) {
        return;
      } else {
        v.isBackUp = v.isBackUp === '1' ? 1 : 2;
        v.mainFlowId = item.mainFlowId;
        this.xn.dragon.post('/trade/set_back_up', v).subscribe(x => {
          if (x.ret === 0) {
            this.onPage({ page: this.paging });
            this.selectedItems = [];
          }
        });
      }
    });
  }

  /**
   * 签署合同-供应商  暂时不用
   */
  signContractSupplier(item: any) {
    let rolesArr = [];
    let needRoles = '';
    if (['operate'].includes(item.procedureId)) {
      rolesArr = this.xn.user.roles.filter((x: any) => {
        return ['operator', 'reviewer'].includes(x);
      });
      needRoles = `【业务经办人、业务复核人】`;
    } else if (['review'].includes(item.procedureId)) {
      rolesArr = this.xn.user.roles.filter((x: any) => {
        return ['reviewer'].includes(x);
      });
      needRoles = `【业务复核人】`;
    }
    if (!(rolesArr && rolesArr.length)) {
      this.xn.msgBox.open(false, `您好，您的权限不够，仅${needRoles}可进行操作`);
    } else {
      this.xn.router.navigate([`/bank-shanghai/record/todo/edit/${item.recordId}`]);
    }
  }

  /**
   * 修改备注信息
   */
  modifyRemarks(row: any, btn: ButtonConfigModel) {
    const checkers = [
      // {
      // title: '入池建议', checkerId: 'poolAdvise', type: 'select', required: false, options: { ref: 'entoCapitalSugest' },
      // value: row.poolAdvise
      // },
      {
        title: '备注状态', checkerId: 'memoStatus', type: 'select', required: false, options: { ref: 'memoStatus' },
        value: row.memoStatus
      }, {
        title: '备注信息', checkerId: 'memo', type: 'textarea', required: false, options: { readonly: false },
        value: row.memo
      }];
    const params: EditParamInputModel = {
      checker: checkers,
      title: '修改备注信息',
      buttons: ['取消', '确定'],
    };
    XnModalUtils.openInViewContainer(this.xn, this.vcr, ShEditModalComponent, params).subscribe((v) => {
      if (!!v) {
        this.xn.dragon.post(btn.post_url, { ...v, mainFlowId: row.mainFlowId }).subscribe(x => {
          if (x.ret === 0) {
            row.memo = v.memo;
            this.selectedItems = [];
            this.onPage({ page: this.paging });
          }
        });
      }
    });
  }

  /**
   *  查看线上数据信息
   * @param
   * @param
   */
  toViewOnlineData(item: any) {
    const params = {
      title: '万科接口获取数据情况',
      type: 'platmachineAccount',
      defaultValue: 'B',
      mainFlowId: item.mainFlowId
    };
    XnModalUtils.openInViewContainer(this.xn, this.vcr, ShDataChangeModalComponent, params).subscribe(() => {
    });
  }

  /**
   * @description: 上银接口状态--重新调用接口
   * @param {any} item 行数据
   * @return {*}
   */
  toCallInterfaceAgain(item: any) {
    // 打开弹框
    const params: ShSingleListParamInputModel = {
      title: '接口状态',
      get_url: '/shanghai_bank/sh_bank_gateway/getFailData',
      get_type: 'dragon',
      multiple: null,
      heads: [
        { label: '异常类型', value: 'status', type: 'interfaceErrType', width: '10%' },
        { label: '是否需要重新调用接口', value: 'isRequest', type: 'isRequest', width: '10%' },
        { label: '接口名称', value: 'taskType', type: 'shBankTaskTypes', width: '13%' },
        { label: '接口异常时间', value: 'updateTime', type: 'date', width: '12%' },
        { label: '异常内容', value: 'response', type: 'code', width: '60%' }
      ],
      searches: [],
      key: 'id',
      data: [],
      total: 0,
      inputParam: { mainFlowId: item.mainFlowId },  // 测试
      leftButtons: [{ label: '补充', value: 'addInfo' }],
      rightButtons: [{ label: '取消', value: 'cancel' }, { label: '重新调用接口', value: 'repeatRequst' }, { label: '执行下个流程', value: 'execute_next_process' }],
      options: {
        paramsType: 3
      }
    };
    XnModalUtils.openInViewContainer(this.xn, this.vcr, ShSingleSearchListModalComponent, params).subscribe(v => {
      if (v && v.action === 'ok') {
        // 重新调用接口
        const param = {
          mainFlowId: item.mainFlowId
        };
        this.xn.loading.open();
        this.xn.dragon.post('/shanghai_bank/sh_bank_gateway/repeatRequst', param).subscribe(x => {
          if (x && x.ret === 0) {
            this.xn.msgBox.open(false, '调用成功', () => {
              this.onPage({ page: this.paging });
            });
          }
        }, () => {
        }, () => {
          this.xn.loading.close();
        });
      } else if (v && v.action === 'addInfo') {
        // console.log('addInfo', v.value);
        let checkers = [
          // {
          //   title: ShInterfaceStatusLabel[v.value], checkerId: ShInterfaceStatus[v.value], type: 'two-input', required: true,
          //   options: { readonly: false }, value: '', memo: '只能手动输入，不可复制粘贴'
          // },
          {
            title: ShInterfaceStatusLabel[7], checkerId: ShInterfaceStatus[7], type: 'two-input', required: true,
            options: { readonly: false }, value: '', memo: '只能手动输入，不可复制粘贴'
          },
          {
            title: ShInterfaceStatusLabel[8], checkerId: ShInterfaceStatus[8], type: 'two-input', required: true,
            options: { readonly: false }, value: '', memo: '只能手动输入，不可复制粘贴'
          },
          {
            title: ShInterfaceStatusLabel[9], checkerId: ShInterfaceStatus[9], type: 'two-input', required: true,
            options: { readonly: false }, value: '', memo: '只能手动输入，不可复制粘贴',validators:{ number3: true }
          }
        ];
        this.xn.loading.open();
        this.xn.dragon.post('/shanghai_bank/sh_bank_gateway/getContractInfo', { mainFlowId: item.mainFlowId }).subscribe((resInfo: any) => {
          if (resInfo && resInfo.ret === 0) {
            this.xn.loading.close();
            checkers.map((item: any) => {
              item.value = resInfo.data[item.checkerId] || '';
            });
            const params: EditParamInputModel = {
              // size: ModalSize.Large,
              checker: checkers,
              title: `补充合同信息`,  // ${ShInterfaceStatusLabel[v.value]}
              buttons: ['取消', '确定'],
            };
            XnModalUtils.openInViewContainer(this.xn, this.vcr, ShEditModalComponent, params).subscribe((res) => {
              if (!!res) {
                const paramObj = {
                  ...res,
                  mainFlowId: item.mainFlowId
                };
                // 保存合同编号，调用【授信协议及合同查询接口】/调用【应收账款导入接口】
                this.xn.dragon.post('/sub_system/sh_vanke_system/hand_contract_info', paramObj).subscribe(json => {
                  if (json && json.ret === 0) {
                    this.onPage({ page: this.paging });
                  }
                });
              }
            });
          }
        }, (err: any) => {
          this.xn.loading.close();
          this.xn.msgBox.open(false, `${err}`, () => { });
        }, () => {
          this.xn.loading.close();
        });
      } else if (v && v.action === 'execute_next_process') {
        // 下推下一个状态
        this.xn.dragon.post('/shanghai_bank/sh_bank_gateway/goToSignFinancingContractStatus', { mainFlowId: item.mainFlowId }).subscribe(json => {
          if (json && json.ret === 0) {
            this.xn.msgBox.open(false, `${json.data}`, () => {
              this.onPage({ page: this.paging });
            });
          }
        });
      }
    });
  }

  /**
   * 查看中登登记
   * @param item
   */
  public viewProgess(item) {
    this.xn.router.navigate([`/machine-account/zhongdeng/record/${item.zhongdengRegisterId}/${item.zhongdengStatus}`]);
  }

  /**
   *  万科数据对接情况
   * @param params
   * @param
   */
  toViewVankeData(item) {
    const params = {
      title: '万科数据对接情况',
      type: 'platmachineAccount',
      defaultValue: 'A',
      mainFlowId: item.mainFlowId
    };
    XnModalUtils.openInViewContainer(this.xn, this.vcr, ShDataChangeModalComponent, params).subscribe(() => {
    });
  }

  /**
   *  查看发票文件信息
   * @param item
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

  isEmpty(val: any) {
    return ['null', 'NaN', 'undefined', '', '{}', '[]'].includes(String(val));
  }

  /**
   *  滚动表头
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

    const ColumFirst = $('.height').find('.head-height tr th:nth-child(1),.table-height tr td:nth-child(1)'); // 勾选列
    let ColumLast = $('.height').find('.head-height tr th:last-child,.table-height tr td:last-child'); // 操作列
    if ($event.srcElement.scrollLeft !== this.scrollX) {
      this.scrollX = $event.srcElement.scrollLeft;
      const lastHeadX = -($event.srcElement.scrollWidth - $event.srcElement.offsetWidth) + $event.srcElement.scrollLeft;
      if (FixHead.length > 0) { // 固定冻结的列
        FixHead.forEach(v => {
          v.each((index, col: any) => {
            col.style.transform = 'translateX(' + (this.scrollX) + 'px)';
            col.style.backgroundColor = '#fff';
          });
        });
      }
      ColumFirst.each((index, col: any) => { // 固定第一列
        col.style.transform = 'translateX(' + this.scrollX + 'px)';
        col.style.backgroundColor = '#fff';
      });
      ColumLast.each((index, col: any) => { // 固定最后一列
        col.style.transform = 'translateX(' + lastHeadX + 'px)';
        col.style.backgroundColor = '#fff';
      });
    }
  }

  private deepCopy(obj, c) {
    c = c || {};
    for (const i in obj) {
      if (typeof obj[i] === 'object') {
        c[i] = obj[i].constructor === Array ? [] : {};
        this.deepCopy(obj[i], c[i]);
      } else {
        c[i] = obj[i];
      }
    }
    return c;
  }

  /**
   *  上海银行状态--当前交易状态匹配
   * @param paramsCurrentStep
   * @param paramsKey
   */
  formatMainFlowStatus(tradeStatus: number, statusEx: number = 0): string {
    // const mainStatus = EnumShBankTradeStatus[Number(tradeStatus)];
    // const subStatus = EnumShBankExtStatus[Number(statusEx)];
    // let currentStatus = '';
    // if (!XnUtils.isEmptys(mainStatus)) {
    //   currentStatus = mainStatus;
    // }
    // if (!XnUtils.isEmptys(subStatus) && !XnUtils.isEmptys(statusEx)) {
    //   currentStatus = subStatus;
    // }
    // if (XnUtils.isEmptys(currentStatus)) {
    //   return '';
    // } else {
    //   return SelectOptions.getConfLabel('tradeStatus_sh_all', currentStatus.toString());
    // }

    let targetMainStatus = SelectOptions.get('tradeStatus_sh').find((x: SelectItemsModel) => x.value === EnumShBankTradeStatus[Number(tradeStatus)]);
    let targetExtStatus = SelectOptions.get('tradeStatus_sh').find((x: SelectItemsModel) => (x.extValue as number[]).includes(Number(statusEx)));
    let statusLabel = !!targetMainStatus ? targetMainStatus?.label : !!targetExtStatus ? targetExtStatus?.label : '';
    return statusLabel;
  }

  /**
   * @description: 获取上银接口状态
   * @param {any} statusEx
   * @return {*}
   */
  getShInterfaceStatus(item: { statusEx: number, requestStatus: any, taskUpdateTime: any }): number {
    const statusExs = item.statusEx || 0;
    const taskUpdateTime = item.taskUpdateTime || 0;
    return !!ShInterFaceErrStatus.includes(Number(statusExs)) ||
      (!!ShInterFaceStepStatus.includes(Number(statusExs)) && !VankeExtStatus.includes(Number(statusExs)) && [null].includes(item.requestStatus)) ? 2 :
      ([0, 1, 6].includes(item.requestStatus) && ((new Date()).getTime() - taskUpdateTime) > 1000 * 60 * 60 * 2) ? 3 : 1;
  }

}

enum DragonVankeSystemOrderEnum {
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
  // 新增
  serviceRate = 16,
  factoringStartDate = 17,
  ccsAduitDatetime = 18,
  ccsApproveTime = 19,
  ccsZauditDate = 20,
}

enum VankeAccountSort {
  asc = 1,
  desc = -1
}

enum AccountlistType {
  'supplierAccountlist' = 1,
  'platAccountlist' = 99,
  'supplierAccountlist2' = 201
}

// 执行下一流程使用--此功能暂不实现
const nextFlowId = {
  supplier_upload: 'platform_verify',
  platform_verify: 'bank_verify',
  bank_verify: 'bank_finish',
  // 新增状态处理
};

enum ShInterfaceStatus {
  agreement_no = 7,
  contract_id = 8,
  discount_rate = 9,
}
enum ShInterfaceStatusLabel {
  '授信协议编号' = 7,
  '合同编号' = 8,
  '融资利率' = 9,
}
enum ShInterfaceStatusUrl {
  '/sub_system/sh_vanke_system/hand_agreement_no' = 7,
  '/sub_system/sh_vanke_system/hand_contract_no' = 8
}
