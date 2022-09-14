/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：drawing-list.component
 * @summary：多标签页列表项 根据tab-pane.ts中的配置
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 yutianbao        供应商待提现列表     2020-05-015
 * **********************************************************************
 */

import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BankManagementService } from 'libs/console/src/lib/bank-management/bank-mangement.service';
import { AvengerInvoiceShowModalComponent } from 'libs/products/avenger/src/lib/shared/components/modal/avenger-invoice-show-modal.component';
import { ShEditModalComponent } from 'libs/products/bank-shanghai/src/lib/share/modal/edit-modal.component';
import { ShangHaiMfilesViewModalComponent } from 'libs/products/bank-shanghai/src/lib/share/modal/mfiles-view-modal.component';
import { ShangHaiPdfSignModalComponent } from 'libs/products/bank-shanghai/src/lib/share/modal/pdf-sign-modal.component';
import { ShSingleListParamInputModel, ShSingleSearchListModalComponent } from 'libs/products/bank-shanghai/src/lib/share/modal/single-searchList-modal.component';
import { ShDataChangeModalComponent } from 'libs/products/bank-shanghai/src/lib/share/modal/vanke-dataChange-modal.component';
import XnFlowUtils from 'libs/shared/src/lib/common/xn-flow-utils';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { SelectItemsModel } from 'libs/shared/src/lib/config/checkers';
import { IsProxyDef } from 'libs/shared/src/lib/config/enum';
import { ButtonConfigModel, SubTabListOutputModel, TabListOutputModel } from 'libs/shared/src/lib/config/list-config-model';
import { EnumShBankExtStatus, EnumShBankTradeStatus, extStatusToStatus, SelectOptions, ShInterFaceErrStatus, ShInterFaceStepStatus } from 'libs/shared/src/lib/config/select-options';
import CommUtils from 'libs/shared/src/lib/public/component/comm-utils';
import { DragongetCustomFiledComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/custom-field-modal.component';
import { DragongetCustomListComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/custom-list-modal.component';
import { EditParamInputModel } from 'libs/shared/src/lib/public/dragon-vanke/modal/edit-modal.component';
import { JsonTransForm } from 'libs/shared/src/lib/public/pipe/xn-json.pipe';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'oct-drawing-list',
  templateUrl: './drawing-list.component.html',
  styleUrls: ['./drawing-list.component.css']
})
export class OctShanghaiSupplierDrawingListComponent implements OnInit {
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
  btnProcessing: boolean = false;

  constructor(private xn: XnService, private vcr: ViewContainerRef, public bankManagementService: BankManagementService,
    private cdr: ChangeDetectorRef, private router: ActivatedRoute, private er: ElementRef,
    private localStorageService: LocalStorageService, public hwModeService: HwModeService) {
  }

  ngOnInit(): void {
    this.router.data.subscribe(x => {
      this.tabConfig = x;
      this.initData(this.defaultValue, true);
    });
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
        ...result.newHeads,
        ...this.currentSubTab.headText.filter((x: any) => ['vankeDataSource', 'shInterfaceStatus'].includes(x.value))
      ];
      this.searches = [
        ...result.newSearches,
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
        name: DragonVankeSystemOrderEnum[XnUtils.string2FirstUpper(this.sorting)],
        asc: VankeAccountSort[XnUtils.string2FirstUpper(this.naming)],
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
      } else if (['wkType'].includes(obj.checkerId)){
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
      isProxy: IsProxyDef.OCT_SH,
      tradeStatus: EnumShBankTradeStatus.bank_finish,
      statusEx: EnumShBankExtStatus.withdrawal,
      wkType: 1
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
        if (['wkType'].includes(search.checkerId)){
          params['wkType'] = Number(search.value);
        }
        if (!XnUtils.isEmpty(this.arrObjs[search.checkerId])) {
          switch (search.checkerId) {
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
              if (!!mainStatus){
                params['tradeStatus'] = Number(mainStatus);
                params['statusEx'] = SelectOptions.get('tradeStatus_so').find((x: any) => x.value === tradeStatusKey)?.extValue || [];
              }
              if (!XnUtils.isEmptys(subStatus, [0])){
                const extToStatus = extStatusToStatus[tradeStatusKey];
                params['tradeStatus'] = Number(extToStatus);
                params['statusEx'] = SelectOptions.get('tradeStatus_so').find((x: any) => x.value === tradeStatusKey)?.extValue || [];
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

  /**
   * 表头批量操作按钮组事件
   * @param paramBtnOperate 按钮操作配置
   *
   */
  public handleHeadBatchClick(paramBtnOperate: ButtonConfigModel) {
    // TODO
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
  public viewInvoiceMore(item: {invoiceNum: string | string[], mainFlowId: string, isProxy: any}) {
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
      inputParam: { mainFlowId: item.mainFlowId},
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
      // 供应商操作
      case 'drawing':
        status = [1].includes(this.xn.user.orgType) && [EnumShBankTradeStatus.bank_finish].includes(Number(item.tradeStatus))
          && [EnumShBankExtStatus.withdrawal].includes(Number(item.statusEx));
        break;
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
    if (btn.operate === 'drawing') {
      // 提现
      if(!this.btnProcessing) {
        this.supplierDrawing(item);
      }
    } else {
      btn.click(item, this.xn, this.hwModeService);
    }
  }

  /**
   * 供应商提现
   */
  async supplierDrawing(item: any) {
    this.btnProcessing = true;
    const resInfo = await this.xn.dragon.post('/shanghai_bank/sh_bank_gateway/getEAccountInfo', {mainFlowId: item.mainFlowId}).toPromise();
    if (resInfo && resInfo.ret === 0 && resInfo.data){
      let calcArr = [
        { row: [
            { key: 'withdrawalBalanceLabel', type: 'label', val: '提现金额', class: "col-md-2"},
            { key: 'equal', type: 'symbol', val: '', class: "col-symbol"},
            { key: 'receiveLabel', type: 'label', val: '应收账款金额', class: "col-md-2"},
            { key: 'minus', type: 'symbol', val: '', class: "col-symbol"},
            { key: 'changeEndLabel', type: 'label', val: '融资利息', class: "col-md-2"},
            { key: 'minus', type: 'symbol', val: '', class: "col-symbol"},
            { key: 'serviceFeeLabel', type: 'label', val: '服务费', class: "col-md-2"},
          ]
        },
        { row: [
            { key: 'withdrawalBalance', type: 'val', val: resInfo.data?.withdrawalBalance || '', class: "col-md-2"},
            { key: 'equal', type: 'symbol', val: '=', class: "col-symbol"},
            { key: 'receive', type: 'val', val: resInfo.data?.receive || '', class: "col-md-2"},
            { key: 'minus', type: 'symbol', val: '-', class: "col-symbol"},
            { key: 'changeEnd', type: 'val', val: resInfo.data?.changeEnd || '', class: "col-md-2"},
            { key: 'minus', type: 'symbol', val: '-', class: "col-symbol"},
            { key: 'serviceFee', type: 'val', val: resInfo.data?.serviceFee || '', class: "col-md-2"},
          ]
        },
        {
          row: [
              { key: 'factoringDaysLabel', type: 'label', val: '计息天数', class: "col-md-2"},
              { key: 'equal', type: 'label', val: '', class: "col-symbol"},
              { key: 'factoringEndDateLabel', type: 'label', val: '应收账款到期日', class: "col-md-2"},
              { key: 'minus', type: 'label', val: '', class: "col-symbol"},
              { key: 'factoringStartDateLabel', type: 'label', val: '起息日（到账日）', class: "col-md-2"},
          ]
        },
        { row: [
            { key: 'factoringDays', type: 'val', val: resInfo.data?.factoringDays || '', class: "col-md-2"},
            { key: 'equal', type: 'label', val: '=', class: "col-symbol"},
            { key: 'factoringEndDate', type: 'date', val: XnUtils.formatDate(resInfo.data?.factoringEndDate || 0), class: "col-md-2"},
            { key: 'minus', type: 'label', val: '-', class: "col-symbol"},
            { key: 'factoringStartDate', type: 'date', val: XnUtils.formatDate(resInfo.data?.factoringStartDate || 0), class: "col-md-2"},
          ]
        },
        {
          row: [
              { key: 'changeEndLabel', type: 'label', val: '融资利息', class: "col-md-2"},
              { key: 'equal', type: 'label', val: '', class: "col-symbol"},
              { key: 'receiveLabel', type: 'label', val: '应收账款金额', class: "col-md-2"},
              { key: 'multip', type: 'label', val: '', class: "col-symbol"},
              { key: 'discountRateLabel', type: 'label', val: '融资利率', class: "col-md-2"},
              { key: 'multip', type: 'label', val: '', class: "col-symbol"},
              { key: 'factoringDaysLabel', type: 'label', val: '计息天数', class: "col-md-2"},
              { key: 'divide', type: 'label', val: '', class: "col-symbol"},
              { key: 'yearFactoringDaysLabel', type: 'label', val: '年计息天数', class: "col-md-2"},
          ]
        },
        { row: [
            { key: 'changeEnd', type: 'val', val: resInfo.data?.changeEnd || '', class: "col-md-2"},
            { key: 'equal', type: 'label', val: '=', class: "col-symbol"},
            { key: 'receive', type: 'val', val: resInfo.data?.receive || '', class: "col-md-2"},
            { key: 'multip', type: 'label', val: '×', class: "col-symbol"},
            { key: 'discountRate', type: 'val', val: resInfo.data?.discountRate || '', class: "col-md-2"},
            { key: 'multip', type: 'label', val: '×', class: "col-symbol"},
            { key: 'factoringDays', type: 'val', val: resInfo.data?.factoringDays || '', class: "col-md-2"},
            { key: 'divide', type: 'label', val: '÷', class: "col-symbol"},
            { key: 'yearFactoringDays', type: 'val', val: resInfo.data?.yearFactoringDays || '', class: "col-md-2"},
          ]
        },
        {
          row: [
              { key: 'serviceFeeLabel', type: 'label', val: '服务费', class: "col-md-2"},
              { key: 'equal', type: 'label', val: '', class: "col-symbol"},
              { key: 'receiveLabel', type: 'label', val: '应收账款金额', class: "col-md-2"},
              { key: 'multip', type: 'label', val: '', class: "col-symbol"},
              { key: 'feeRateLabel', type: 'label', val: '服务费率', class: "col-md-2"},
              { key: 'multip', type: 'label', val: '', class: "col-symbol"},
              { key: 'factoringDaysLabel', type: 'label', val: '计息天数', class: "col-md-2"},
              { key: 'add', type: 'label', val: '', class: "col-symbol"},
              { key: 'yearFactoringDaysLabel', type: 'label', val: '年计息天数', class: "col-md-2"},
          ]
        },
        { row: [
            { key: 'serviceFee', type: 'val', val: resInfo.data?.serviceFee || '', class: "col-md-2"},
            { key: 'equal', type: 'label', val: '=', class: "col-symbol"},
            { key: 'receive', type: 'val', val: resInfo.data?.receive || '', class: "col-md-2"},
            { key: 'multip', type: 'label', val: '×', class: "col-symbol"},
            { key: 'feeRate', type: 'val', val: resInfo.data?.feeRate || '', class: "col-md-2"},
            { key: 'multip', type: 'label', val: '×', class: "col-symbol"},
            { key: 'factoringDays', type: 'val', val: resInfo.data?.factoringDays || '', class: "col-md-2"},
            { key: 'add', type: 'label', val: '÷', class: "col-symbol"},
            { key: 'yearFactoringDays', type: 'val', val: resInfo.data?.yearFactoringDays || '', class: "col-md-2"},
          ]
        },
      ];
      const checkers = [
      {
        title: '总余额', checkerId: 'amount', type: 'input-number', required: false,
        options: { readonly: true, unit: '元', currency: true },
        value: XnUtils.isEmptys(resInfo.data.amount, [0]) ? '' : resInfo.data.amount
      }, {
        title: '可提现金额', checkerId: 'withdrawalBalance', type: 'input-number', required: false,
        options: { readonly: true, unit: '元', currency: true },
        value: XnUtils.isEmptys(resInfo.data.withdrawalBalance, [0]) ? '' : resInfo.data.withdrawalBalance
      }, {
        title: ' ', checkerId: 'calcExpression', type: 'withdraw-calc', required: false,
        options: { },
        value: JSON.stringify(calcArr)
      }, {
        title: '收款单位户名', checkerId: 'supplierName', type: 'special-text', required: false, options: { readonly: false },
        value: resInfo.data.bindAcctName || ''
      }, {
        title: '开户行名称', checkerId: 'bankName', type: 'special-text', required: false, options: { readonly: false },
          value: resInfo.data.bindAcctBank || ''
      }, {
        title: '收款单位账号', checkerId: 'debtUnitAccount', type: 'special-text', required: false, options: { readonly: false },
        value: resInfo.data.bindAccount || ''
      }, {
        title: '提现手机号', checkerId: 'phone', type: 'special-text', required: false, options: { readonly: false }, placeholder: '请输入',
        value: resInfo.data.operatorMobile || ''
      }, {
        title: '短信验证码', checkerId: 'code', type: 'sms-input', required: true, options: { others: {mainFlowId: item.mainFlowId} },
        validators: JSON.stringify({
          minlength: 6, maxlength: 6, number: true, sms: { name: 'phone', error: '提现手机号码有误，请联系管理员' }
        }),
      }];
      const params: EditParamInputModel = {
        checker: checkers,
        title: '提现',
        buttons: ['取消', '确定'],
        size: 'xxlg'
      };
      XnModalUtils.openInViewContainer(this.xn, this.vcr, ShEditModalComponent, params).subscribe((v) => {
        console.log('supplierDrawing====', v);
        this.btnProcessing = false;
        if (!!v) {
          const param = {
            mainFlowId: item.mainFlowId,
            dynamicCode: v.code
          };
          this.xn.dragon.post('/shanghai_bank/sh_bank_gateway/prattwhitneyWithdraw', param).subscribe(x => {
            if (x && x.ret === 0) {
              this.xn.msgBox.open(false, '提现成功', () => {
                this.selectedItems = [];
                this.onPage({ page: this.paging });
              });
            }
          });
        }
      });
    }
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
    let targetMainStatus = SelectOptions.get('tradeStatus_so').find((x: SelectItemsModel) => x.value === EnumShBankTradeStatus[Number(tradeStatus)]);
    let targetExtStatus = SelectOptions.get('tradeStatus_so').find((x: SelectItemsModel) => (x.extValue as number[]).includes(Number(statusEx)));
    let statusLabel = !!targetMainStatus ? targetMainStatus?.label : !!targetExtStatus ? targetExtStatus?.label : '';
    return statusLabel;
  }

  /**
   * @description: 获取上银接口状态
   * @param {any} statusEx
   * @return {*}
   */
  getShInterfaceStatus(item: {statusEx: number, requestStatus: any}): number {
    const statusExs = item.statusEx || 0;
    return !!ShInterFaceErrStatus.includes(Number(statusExs)) ||
      (!!ShInterFaceStepStatus.includes(Number(statusExs)) && [null].includes(item.requestStatus)) ? 2 : 1;
  }

}

enum DragonVankeSystemOrderEnum {
    MainFlowId = 1,
    TradeDate = 2,
    Receive = 3,
    ChangePrice = 4,
    DiscountRate = 5,
    PayConfirmId = 6,
    IsChangeAccount = 7,
    PriorityLoanDate = 8,
    IsRegisterSupplier = 9,
    TradeStatus = 10,
    IsLawOfficeCheck = 11,
    SupplierRegisterDate = 12,
    FactoringEndDate = 13,
    ZhongdengStatus = 14,
    RealLoanDate = 15,
    // 新增
    ServiceRate = 16,
    ValueDate = 17,
    CcsAduitDatetime = 18,
    CcsApproveTime = 19,
    CcsZauditDate = 20,
}

enum VankeAccountSort {
  Asc = 1,
  Desc = -1
}
