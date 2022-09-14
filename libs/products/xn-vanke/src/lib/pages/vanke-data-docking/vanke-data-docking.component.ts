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
 * 1.0                 wangqing          万科数据对接列表     2020-05-015
 * **********************************************************************
 */

import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BankManagementService } from 'libs/console/src/lib/bank-management/bank-mangement.service';
import XnFlowUtils from 'libs/shared/src/lib/common/xn-flow-utils';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { CheckersOutputModel } from 'libs/shared/src/lib/config/checkers';
import { XnSortTypeEnum } from 'libs/shared/src/lib/config/enum';
import { ButtonConfigModel, SubTabListOutputModel, TabListOutputModel } from 'libs/shared/src/lib/config/list-config-model';
import { HeadquartersTypeEnum } from 'libs/shared/src/lib/config/select-options';
import CommUtils from 'libs/shared/src/lib/public/component/comm-utils';
import { DragongetCustomFiledComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/custom-field-modal.component';
import { DragongetCustomListComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/custom-list-modal.component';
import { EditModalComponent, EditParamInputModel } from 'libs/shared/src/lib/public/dragon-vanke/modal/edit-modal.component';
import { DragonMfilesViewModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/mfiles-view-modal.component';
import { DragonPdfSignModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/pdf-sign-modal.component';
import { SingleListParamInputModel, SingleSearchListModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/single-searchList-modal.component';
import { VankeDataChangeModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/vanke-dataChange-modal.component';
import { JsonTransForm } from 'libs/shared/src/lib/public/pipe/xn-json.pipe';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { fromEvent } from 'rxjs';
import { DOCKING_SORT_VALUE, LIST_SORT_TYPE } from 'libs/shared/src/lib/config/constants';

declare const $: any;
@Component({
  selector: 'vanke-data-docking',
  templateUrl: `./vanke-data-docking.component.html`,
  styles: [`
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
        text-align:right;
    }
    .item-control {
        flex: 1;
    }
    .item-control select {
        width: 100%
    }
    .operate-btn {
        min-width: 90px;
    }
    .input-check {
        width: 100px;
    }

    .table-head .sorting, .table-head .sorting_asc, .table-head .sorting_desc {
        /*position: relative;*/
        cursor: pointer
    }
    .table-head .sorting:after, .table-head .sorting_asc:after, .table-head .sorting_desc:after {
        font-family: 'Glyphicons Halflings';
        opacity: 0.5;
    }
    .table-head .sorting:after {
        content: "\\e150";
        opacity: 0.2
    }
    .table-head .sorting_asc:after {
        content: "\\e155"
    }
    .table-head .sorting_desc:after {
        content: "\\e156"
    }
    ul.sub-ul {
        margin-bottom: 5px;
        border-bottom: 1px solid #3c8dbc;
    }
    ul.sub-ul > li > a {
        padding: 5px 35px;
        border-top: none;
        background-color: #F2F2F2;
    }
    ul.sub-ul > li.active > a {
        background-color: #3c8dbc;
    }
    .center-block{
        clear: both;
        border-bottom: 1px solid #ccc;
        width: 43.9%;
        height: 1px;
    }
    .showClass{
        width: 12.5%;
        margin: 0 auto;
        border: 1px solid #ccc;
        text-align: center;
        border-top: 0px;
        clear:both;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
    }
    .height {
        overflow-x: hidden;
        clear:both;
    }
    .relative {
        position: relative
    }
    .head-height {
        position: relative;
        overflow: hidden;
    }
    .table-height {
        max-height: 600px;
        overflow: scroll;
    }
    .table {
        table-layout: fixed;
        width: 3000px;
    }
    .table-display {
        margin: 0;
    }
    `]
})
export class VankeDatalockingComponent implements OnInit {
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
  public scroll_x = 0; // 滚动条滚动距离
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
  public currentSubTab: SubTabListOutputModel = new SubTabListOutputModel(); // 当前子标签页
  public subDefaultValue = 'DOING'; // 默认子标签页
  public formModule = 'dragon-input';
  public selectedReceivables = 0; // 所选交易的应收账款金额汇总
  public allReceivables = 0; // 所有交易的应收账款金额汇总
  @ViewChild('tables') tables: ElementRef;

  subResize: any;

  constructor(private xn: XnService,
    private vcr: ViewContainerRef,
    public bankManagementService: BankManagementService,
    private cdr: ChangeDetectorRef,
    private router: ActivatedRoute,
    private er: ElementRef,
    public hwModeService: HwModeService,
    private localStorageService: LocalStorageService) {
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
     *  金地数据对接情况
     * @param item 行内容
     */
  toViewVankeData(item: any) {
    const params = {
      title: '万科数据对接情况',
      type: 'platVerify',
      defaultValue: 'C',
      mainFlowId: item.mainFlowId ? item.mainFlowId : undefined,
      billNumber: item.billNumber
    };
    XnModalUtils.openInViewContainer(this.xn, this.vcr, VankeDataChangeModalComponent, params).subscribe(() => {
    });
  }

  /**
    *  标签页，加载列表信息
    * @param paramTabValue
    * @param init 是否为初始加载，true 不检查切换属性值与当前标签值
    */
  public async initData(paramTabValue: string, init?: boolean) {

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
    this.onUrlData(); // 导航回退取值
    // 页面配置
    const find = this.tabConfig.tabList.find(tab => tab.value === this.defaultValue);
    this.currentTab = !!find ? find : new TabListOutputModel();
    // 子页面配置
    const subFind = this.currentTab.subTabList.find(sub => sub.value === this.subDefaultValue);
    this.currentSubTab = !!subFind ? subFind : new SubTabListOutputModel();
    this.heads = CommUtils.getListFields(this.currentSubTab.headText);
    this.searches = this.currentSubTab.searches;
    // 自定义列表字段或搜索项
    await this.asyncFunc().then((result: any) => {
      this.heads = result.newHeads;
      this.searches = result.newSearches;
      this.buildShow(this.searches);
    })
    this.onPage({ page: this.paging });
  }

  /**
    * @param e  page: 新页码、 pageSize: 页面显示行数、first: 新页面之前的总行数、pageCount : 页码总数 customType:自定义类型
    * @param scorllWidth 滚动条滚动距离
    * @summary 采购融资，地产abs  请求api有区别，采购融资：avenger 、地产abs：api
    */
  public onPage(
    e?: { page: number, first?: number, pageSize?: number, pageCount?: number },
    scrollWidth?: number
    ) {
    this.selectedItems = [];
    this.paging = e.page || 1;
    this.onUrlData(); // 导航回退取值
    if (this.sortObjs.length !== 0) {
      this.sorting = this.sortObjs[0].name;
      this.naming = this.sortObjs[0].asc;
    }
    this.pageConfig = Object.assign({}, this.pageConfig, e);

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
        this.listInfo = x.data.data;
        this.allReceivables = x.data.sumFinancingAmount || 0;
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
      this.cdr.markForCheck();
    }, () => {
      // 固定值
      this.listInfo = [];
      this.selectedReceivables = 0;
      this.allReceivables = 0;
      this.pageConfig.total = 0;
    }, () => {
      XnUtils.scrollTable(this.tables, scrollWidth);
      this.xn.loading.close();
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
   * 处理自定义字段或搜索项
   */
  public customSetField() {

    const customList = [];
    // a、不同列表的筛选条件可分别配置；
    // b、配置后对单用户账号生效，不是对同企业下所有用户生效。
    // let params = {
    //     t: '',
    //     sign: '',
    //     user: '',   //单用户账号
    //     flag: ''   //验证成功 验证失败
    // };
    // ---------------------------------------------------------------
    customList.push(this.currentSubTab.headNumber);
    customList.push(this.currentSubTab.searchNumber);
    this.xn.loading.open();
    return new Promise((resolve, reject) => {
      this.xn.dragon.post('/trade/get_column', { statusList: customList }).subscribe(res => {
        this.xn.loading.close();
        const resObj = {
          newHeads: this.heads,
          newSearches: this.searches,
        };
        // resObj.newHeads = this.heads;
        // resObj.newSearches = this.searches;
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
                const headAll = CommUtils.getListFields(this.currentSubTab.headText);
                this.FixedHeadNubmer = x.lockCount || 0;
                JSON.parse(colArr).forEach((y) => {
                  headAll.forEach((z: any) => {
                    if (y === z.value) {
                      resObj.newHeads.push(z);
                    }
                  });
                });
                // resObj.newHeads = this.heads.filter((head) => colArr.includes(head.value));
              }

            }
            if (x.status === this.currentSubTab.searchNumber) {
              if (x.column === '') {
                resObj.newSearches = this.searches;
              } else {
                resObj.newSearches = [];
                const searchArr = x.column || [];
                const searchesAll = this.currentSubTab.searches;
                JSON.parse(searchArr).forEach((y) => {
                  searchesAll.forEach((z: any) => {
                    if (y === z.checkerId) {
                      resObj.newSearches.push(z);
                    }
                  });
                });
                // resObj.newSearches = this.searches.filter((search) => searchArr.includes(search.checkerId));
              }
            }
          });
          resolve(resObj);
        }

      }, (err) => {
        this.xn.loading.close();
        reject(err);
      }, () => {
        // complete
      });
    });
  }

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
    this.onPage({ page: this.paging});
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
      this.naming = this.naming === XnSortTypeEnum.DESC ? XnSortTypeEnum.ASC : XnSortTypeEnum.DESC;
    } else {
      this.sorting = sort;
      this.naming = XnSortTypeEnum.ASC;
    }

    this.sortObjs = [
      {
        name: this.sorting,
        asc: this.naming
      }
    ];
    const scrollWidth = (this.headLeft*-1) + 1;
    const { pageSize } = this.pageConfig;
    this.onPage({ page: this.paging, pageSize }, scrollWidth);
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
    XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonPdfSignModalComponent, params).subscribe(() => {
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

    for (let i = 0; i < searches.length; i++) {
      const obj = {} as any;
      obj.title = searches[i].title;
      obj.checkerId = searches[i].checkerId;
      obj.required = false;
      obj.type = searches[i].type;
      obj.number = searches[i].number;
      obj.options = searches[i].options;
      if (this.timeStorage.timeId.includes(searches[i].checkerId)) {
        const checkIndex = this.timeStorage.timeId.findIndex((time) => time === searches[i].checkerId);
        const tmpTime = this.timeStorage[this.timeStorage.timeId[checkIndex]];
        obj.value = JSON.stringify(tmpTime);
      } else {
        obj.value = this.arrObjs[searches[i].checkerId];
      }
      objList.push(obj);
    }
    this.shows = $.extend(true, [], objList.sort(function (a, b) {
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
  *  全选
  */
  public checkAll() {
    if (!this.isAllChecked()) {
      this.selectedReceivables = 0;
      this.listInfo.forEach(item => item.checked = true);
      this.selectedItems = XnUtils.distinctArray2([...this.selectedItems, ...this.listInfo], 'id');
      this.selectedItems.forEach(item => {
        this.selectedReceivables = Number((this.selectedReceivables + item.financingAmount).toFixed(2)); // 勾选交易总额
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
      this.selectedItems = this.selectedItems.filter((x: any) => x.id !== paramItem.id);
      this.selectedReceivables = Number((this.selectedReceivables - paramItem.financingAmount).toFixed(2)); // 勾选交易总额

    } else {
      paramItem.checked = true;
      this.selectedItems.push(paramItem);
      this.selectedItems = XnUtils.distinctArray2(this.selectedItems, 'id');
      this.selectedReceivables = Number((this.selectedReceivables + paramItem.financingAmount).toFixed(2)); // 勾选交易总额
      // 去除相同的项
    }
  }
  /**
   * 构建参数
   */
  private buildParams(flag, type) {
    // 分页处理
    const params: any = {
      pageNo: this.paging,
      pageSize: this.pageConfig.pageSize,
      type: flag,
    };
    // 排序处理
    if (this.sortObjs.length !== 0) {
      params.order = [
        {
          name: DOCKING_SORT_VALUE[this.sortObjs[0].name],
          asc: LIST_SORT_TYPE[this.sortObjs[0].asc],
        }
      ];
    }
    // 搜索处理
    if (this.searches.length > 0) {
      for (const search of this.searches) {
        if (!XnUtils.isEmpty(this.arrObjs[search.checkerId])) {

          switch (search.checkerId) {

            case 'expiredDate':          // 保理融资到期日
              let expiredDate = JSON.parse(this.arrObjs[search.checkerId]);
              params['expiredDateStart'] = Number(expiredDate['beginTime']);
              params['expiredDateEnd'] = Number(expiredDate['endTime']);
              break;

            case 'ccsAduitDatetime':     // 一线审核时间
              let ccsAduitDatetime = JSON.parse(this.arrObjs[search.checkerId]);
              params['ccsAduitDatetimeStart'] = Number(ccsAduitDatetime['beginTime']);
              params['ccsAduitDatetimeEnd'] = Number(ccsAduitDatetime['endTime']);
              break;

            case 'ccsApproveTime':       // 一线审批时间
              let ccsApproveTime = JSON.parse(this.arrObjs[search.checkerId]);
              params['ccsApproveTimeStart'] = Number(ccsApproveTime['beginTime']);
              params['ccsApproveTimeEnd'] = Number(ccsApproveTime['endTime']);
              break;

            case 'ccsZauditDate':        // 资金中心审核时间
              let ccsZauditDate = JSON.parse(this.arrObjs[search.checkerId]);
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

            case 'financingAmount':       // 应收账款金额搜索过滤处理
              let financingAmount = '';
              this.arrObjs[search.checkerId].split(',').forEach(v => {
                financingAmount += v;
              });
              params['financingAmount'] = financingAmount;
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
    XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonMfilesViewModalComponent, [paramFile]).subscribe();
  }

  /**
   * 表头按钮组事件
   * @param paramBtnOperate 按钮操作配置
   *
   */
  public handleHeadClick(paramBtnOperate: ButtonConfigModel) {
    switch (paramBtnOperate.operate) {
      // 自定义筛选条件
      case 'custom_search':
        this.customSearch()
        break;
      // 自定义页面字段
      case 'custom_field':
        this.customField()
        break;

      default:
        break;
    }
  }

  /**
   * 批量操作按钮组事件
   * @param paramBtnOperate 按钮操作配置
   *
   */
  public handleHeadBatchClick(paramBtnOperate: ButtonConfigModel) {
    if (this.selectedItems && this.selectedItems.length > 0) {
      const billNumberList = this.selectedItems.map((x: any) => x.billNumber);

      switch (paramBtnOperate.operate) {
        // 发起提单
        case 'vanke_financing_pre':
          this.financingPre(billNumberList)
          break;
        // 批量补充信息
        case 'bacth_info':
          this.bacthInfo()
          break;
        // 发起预审不通过
        case 'bacth_pass':
          this.bacthPass()
          break;
        // 人工校验失败
        case 'vaild_fail':
          this.vaildFail()
          break;
        // 校验成功
        case 'vaild_success':
          this.vaildSuccess()
          break;
        // 导出万科附件
        case 'download_vanke_file':
          this.downloadVankeFile()
          break;

        default:
          break;
      }
    } else {
      this.xn.msgBox.open(false, '请先选择交易');
    }
  }

  /**
   * 表格操作按钮
   * @param item 行信息
   * @param btn 按钮配置
   * @param i 下标
   */
  handleRowClick(item: any, btn: ButtonConfigModel, i: number) {
    switch (btn.operate) {
      // 同步万科文件
      case 'async_vanke_file':
        this.asyncVankeFile(item.billNumber)

      default:
        break;
    }
  }

  /**
   * 同步万科文件
   * @param billNumber
   */
  asyncVankeFile(billNumber: number) {
    this.xn.loading.open()
    this.xn.dragon.post('/sub_system/vanke_system/sync_vanke_file', { billNumber }).subscribe(x => {
      this.xn.loading.close()
      if (x.ret === 0) {
        this.xn.msgBox.open(false, '同步成功！', () => {
          this.onPage({ page: this.paging });
        })
      }
    });
  }

  /**
   * 自定义筛选条件
   * @param
   */
  customSearch() {
    const params = {
      title: '自定义筛选条件',
      label: 'checkerId',
      type: 1,
      headText: JSON.stringify(this.currentSubTab.searches),
      selectHead: JSON.stringify(this.searches),
      selectField: this.heads,
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
        // 自定义列表字段或搜索项
        this.asyncFunc().then((result: any) => {
          this.searches = result.newSearches;
          this.buildShow(this.searches);
        })
      }
    });
  }

  /**
   * 自定义页面字段
   * @param
   */
  customField() {
    const params = {
      title: '自定义页面字段',
      label: 'value',
      type: 2,
      headText: JSON.stringify(this.currentSubTab.headText),
      selectHead: JSON.stringify(this.heads),
      status: this.currentSubTab.headNumber,
      FixedNumber: this.FixedHeadNubmer
    };
    XnModalUtils.openInViewContainer(this.xn, this.vcr, DragongetCustomListComponent, params).subscribe(v => {
      if (v && v.action === 'ok') {
        this.newHeads[this.defaultValue] = this.deepCopy(v.value, []);
        // 自定义列表字段或搜索项
        this.asyncFunc().then((result: any) => {
          this.heads = result.newHeads;
          this.cdr.markForCheck();
        })
      }
    });
  }

  /**
  * 万科发起提单
  * @param billNumber数组
  */
  financingPre(billNumberList: number[]) {
    const msgs = this.vankePreConditionJudge(this.selectedItems);
    if (msgs.length > 0) {
      this.xn.msgBox.open(false, msgs);
    } else {
      this.xn.router.navigate([`/logan/record/new/vanke_financing_pre/${HeadquartersTypeEnum[1]}`],
        {
          queryParams: {
            productType: '',
            selectBank: '0',
            fitProject: '',
            billNumberList,
          }
        });
    }
  }

  /**
  * 批量补充信息
  * @param
  */
  bacthInfo() {
    const params: EditParamInputModel = {
      title: '批量补充信息',
      checker: [{
        title: '已选交易',
        checkerId: 'batchInfo',
        type: 'table-common',
        required: 0,
        value: JSON.stringify(this.selectedItems),
      },
      {
        title: '补充信息',
        checkerId: 'dockingInfo',
        type: 'checkbox',
        options: { ref: 'vankeDockingInfo' },
        required: false,
        number: 4,
        value: '',
      },
      {
        title: '资产转让折扣率',
        checkerId: 'discountRate',
        type: 'number-control',
        options: { size: { min: 0, max: 100 }, showWhen: ['dockingInfo', '1'] },
        required: false,
        number: 3,
        value: '',
      },
      {
        title: '渠道价格',
        checkerId: 'channelPrice',
        type: 'number-control',
        options: { size: { min: -1, max: 100 } },
        required: false,
        number: 3,
        value: '',
      },

      ] as CheckersOutputModel[],
      buttons: ['取消', '确定'],
      size: 'xxlg'
    };
    XnModalUtils.openInViewContainer(this.xn, this.vcr, EditModalComponent, params).subscribe(v => {
      if (v) {
        const params = {
          billNumberList: this.selectedItems.map(x => x.billNumber),
        };
        if (v.discountRate) {
          params['discountRate'] = Number(v.discountRate);
        }
        if (v.channelPrice) {
          params['channelPrice'] = Number(v.channelPrice);
        }

        this.xn.dragon.post('/sub_system/vanke_system/vanke_batch_modify', params).subscribe(x => {
          if (x.ret === 0) {
            this.onPage({ page: this.paging });
          }
        });
      }

    });
  }

  /**
  * 人工校验失败
  * @param
  */
  vaildFail() {
    const idList = this.selectedItems.map((x: any) => x.id);
    const params: EditParamInputModel = {
      title: '人工校验失败',
      checker: [
        {
          title: '校验失败类型',
          checkerId: 'verifyArr',
          type: 'select',
          options: { ref: 'VankeVerifyType', },
          required: 1,
          base: 'number'
        },
        {
          title: '其他原因',
          checkerId: 'otherDesc',
          type: 'text-area',
          required: 0,
        },
      ] as CheckersOutputModel[],
      buttons: ['取消', '确定'],
    };
    XnModalUtils.openInViewContainer(this.xn, this.vcr, EditModalComponent, params).subscribe(v => {
      if (v) {
        // 人工校验不通过
        this.xn.dragon.post('/sub_system/vanke_system/hand_verify_nopass',
          {
            idList,
            handVerifyStr: JSON.stringify(
              {
                verifyArr: [v.verifyArr],
                otherDesc: v.otherDesc
              }
            )
          }
        ).subscribe(x => {
          if (x.ret === 0) {
            this.onPage({ page: this.paging });
          }
        });
      }

    });
  }

  /**
  * 发起预审不通过
  * @param
  */
  bacthPass() {
    this.xn.router.navigate([`/logan/record/new`],
      {
        queryParams: {
          id: 'sub_vanke_system_check_reject',
          relate: 'idList',
          relateValue: this.selectedItems.map((x: any) => x.id),
        }
      });
  }

  /**
  * 校验成功
  * @param
  */
  vaildSuccess() {
    const idList = this.selectedItems.map((x: any) => x.id);
    // 发起人工校验成功
    this.xn.dragon.post('/sub_system/vanke_system/hand_verify_pass',
      { idList }
    ).subscribe(x => {
      if (x.ret === 0) {
        this.onPage({ page: this.paging });
      }
    });
  }

  /**
  * 导出万科附件
  * @param
  */
  downloadVankeFile() {
    this.xn.loading.open()
    const billNumberList = this.selectedItems.map((x: any) => x.billNumber);
    this.xn.dragon.download('/sub_system/vanke_system/download_vanke_file',
      { billNumberList }
    ).subscribe(v => {
      this.xn.loading.close()
      this.xn.dragon.save(v._body, '万科数据对接附件.zip')
    });
  }

  /**
   * 发起提单预录入条件判断
   * @param selectedItems 已选交易
   */
  public vankePreConditionJudge(selectedItems: any[]): string[] {
    const productType = selectedItems.map(y => {
      return { productType: y.productType };
    });
    const bankType = selectedItems.map(y => {
      return { bankType: y.bankType };
    });

    const channelType = XnUtils.distinctArray2(productType, 'productType');
    const channelBank = XnUtils.distinctArray2(bankType, 'bankType');
    const noDiscountRate = selectedItems.filter(x => !x.discountRate).map(y => y.billNumber);
    const noMarketName = selectedItems.filter(x => !x.marketName);
    const noOperatorName = selectedItems.filter(x => !x.operatorName);
    const cityCompany = XnUtils.distinctArray2(noMarketName.map(y => ({ cityCompany: y.cityCompany })), 'cityCompany');
    const city = XnUtils.distinctArray2(noOperatorName.map(y => ({ city: y.city })), 'city');
    let msg = [], index = 0;
    if (!(channelType.length === 1 && channelBank.length === 1)) {
      // 非同一渠道业务
      index++;
      msg.push(...[
        `${index}、所选业务不是同一渠道，无法发起提单`
      ]);
    }
    if (noDiscountRate.length > 0) {
      index++;
      msg.push(...[
        `${index}、以下交易无“资产转让折扣率”，无法发起提单，请先补充信息，一线单据编号为：`,
        ...noDiscountRate
      ]);
    }
    if (noMarketName.length > 0) {
      index++;
      msg.push(...[
        `${index}、以下申请付款单位归属城市未配置市场部对接人，请到“业务对接人配置功能”中完成配置：`,
        cityCompany.map(y => y.cityCompany).join(' ')
      ]);
    }
    if (noOperatorName.length > 0) {
      index++;
      msg.push(...[
        `${index}、以下收款单位城市未配置运营部对接人，请到“业务对接人配置功能”中完成配置：`,
        city.map(y => y.city).join(' ')
      ]);
    }
    return msg;
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
  /**
 *  查看更多发票
 * @param paramItem
 */
  public viewMore(paramItem, uuid: string, isProxy: any) {

    // this.xn.dragon.post('/sub_system/vanke_system/vanke_invoice_list', { uuid: uuid }).subscribe(x => {
    // 打开弹框
    const params: SingleListParamInputModel = {
      title: '发票详情',
      get_url: '/sub_system/vanke_system/vanke_invoice_list',
      get_type: 'dragon',
      multiple: null,
      heads: [
        { label: '发票代码', value: 'code', type: 'text' },
        { label: '发票号码', value: 'number', type: 'text' },
        { label: '发票含税金额', value: 'invoiceAmt', type: 'money' },
        // { label: '发票转让金额', value: 'invTransAmt', type: 'money' },
        { label: '发票开具时间', value: 'invoiceDate', type: 'date' },
        { label: '发票文件', value: 'fileName', type: 'singleFile' },
        { label: '文件下载失败原因', value: 'downLoadFailMsg', },
      ],
      searches: [],
      key: 'invoiceCode',
      data: [],
      total: 0,
      inputParam: { uuid },
      rightButtons: [{ label: '确定', value: 'submit' }],
      options: {
        paramsType: 1   // 1 区分接口入参分页参数
      }
    };
    XnModalUtils.openInViewContainer(this.xn, this.vcr, SingleSearchListModalComponent, params).subscribe(v => {
      if (v === null) {
        return;
      }
    });

    // });

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
    let ColumLast = $(".height").find(".head-height tr th:last-child,.table-height tr td:last-child"); // 操作列
    if ($event.srcElement.scrollLeft !== this.scroll_x) {
      this.scroll_x = $event.srcElement.scrollLeft;
      const lastHead_X = -($event.srcElement.scrollWidth - $event.srcElement.offsetWidth) + $event.srcElement.scrollLeft;
      if (FixHead.length > 0) { // 固定冻结的列
        FixHead.forEach(v => {
          v.each((index, col: any) => {
            col.style.transform = 'translateX(' + (this.scroll_x) + 'px)';
            col.style.backgroundColor = '#fff';
          });
        });
      }
      ColumFirst.each((index, col: any) => { // 固定第一列
        col.style.transform = 'translateX(' + this.scroll_x + 'px)';
        col.style.backgroundColor = '#fff';
      });
      ColumLast.each((index, col: any) => { // 固定最后一列
        col.style.transform = "translateX(" + lastHead_X + "px)";
        col.style.backgroundColor = "#fff";
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
}
enum DragonVankeSystemOrderEnum {
  expiredDate = 1,
  financingAmount = 2,
  transNumber = 3,
  billNumber = 4,
  mainFlowId = 5
}
enum VankeAccountSort {
  asc = 1,
  desc = -1

}
