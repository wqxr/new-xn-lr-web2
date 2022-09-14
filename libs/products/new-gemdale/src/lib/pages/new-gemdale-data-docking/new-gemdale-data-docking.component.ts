/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：new-gemdale-data-docking.component
 * @summary：金地数据对接列表
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                hucongying        金地数据对接       2020-11-30
 * **********************************************************************
 */

import { Component, OnInit, ViewContainerRef, ChangeDetectorRef, ElementRef, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { TabListOutputModel, SubTabListOutputModel, ButtonConfigModel } from 'libs/shared/src/lib/config/list-config-model';
import CommUtils from 'libs/shared/src/lib/public/component/comm-utils';
import { SingleListParamInputModel } from 'libs/shared/src/lib/public/dragon-vanke/modal/single-searchList-modal.component';
import XnFlowUtils from 'libs/shared/src/lib/common/xn-flow-utils';
import { HeadquartersTypeEnum } from 'libs/shared/src/lib/config/select-options';
import { fromEvent } from 'rxjs';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { NewGemdaleSingleSearchListModalComponent } from '../../share/modal/single-searchList-modal.component';
import { NewGemdalegetCustomListComponent } from '../../share/modal/custom-list-modal.component';
import { NewGemdalegetCustomFiledComponent } from '../../share/modal/custom-field-modal.component';
import { EditModalComponent } from '../../share/modal/edit-modal.component';
import { JdDataChangeModalComponent } from '../../share/modal/jd-dataChange-modal.component';

declare const moment: any;
declare const $: any;
@Component({
  templateUrl: `./new-gemdale-data-docking.component.html`,
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
      border-collapse: separate;
      border-spacing: 0;
    }
    .table-display {
      margin: 0;
    }
    `]
})
export class NewGemdaleDatalockingComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('tables') tables: ElementRef;
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
  searches: any[] = [];  // 面板搜索配置项项
  selectedItems: any[] = [];  // 选中的项

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
    timeId: [], // 时间checker项id
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

  sorting = '';  // 共享该变量
  naming = '';  // 共享该变量
  heads: any[];
  public currentSubTab: SubTabListOutputModel = new SubTabListOutputModel();  // 当前子标签页
  public subDefaultValue = 'DOING'; // 默认子标签页
  public formModule = 'dragon-input';
  public selectedReceivables = 0; // 所选交易的应收账款金额汇总
  public allReceivables = 0; // 所有交易的应收账款金额汇总

  subResize: any;

  constructor(
    private xn: XnService,
    private vcr: ViewContainerRef,
    private cdr: ChangeDetectorRef,
    private router: ActivatedRoute,
    private er: ElementRef,
    public hwModeService: HwModeService) {
  }

  ngOnInit(): void {
    this.router.data.subscribe(x => {
      this.tabConfig = x;
      this.initData(this.defaultValue);
    });
    this.subResize = fromEvent(window, 'resize').subscribe(() => {
      this.formResize();
    });
  }
  /**
   * 标签页，加载列表信息
   * @param  paramTabValue 初始默认值 this.defaultValue
   * @param  init? 是否为初始加载，true 不检查切换属性值与当前标签值
   */
  public initData(paramTabValue: string) {
    this.defaultValue = paramTabValue || 'DOING';
    this.subDefaultValue = 'DOING';
    // 重置全局变量
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
    // 重置子标签默认
    this.onPage({ page: this.paging });
  }

  /**
   * 页面列表查询
   * @param e  page: 新页码、 pageSize: 页面显示行数、first: 新页面之前的总行数、pageCount : 页码总数 customType:自定义类型
   * @param showChecked 是否显示已勾选的交易
   * @summary 采购融资，地产abs  请求api有区别，采购融资：avenger 、地产abs：api
   */
  public onPage(e?: { page: number, first?: number, pageSize?: number, pageCount?: number }, showChecked?: boolean) {
    if (!showChecked) { this.selectedItems = []; }
    this.paging = e.page || 1;
    this.onUrlData(); // 导航回退取值
    if (this.sortObjs.length !== 0) {
      this.sorting = NewGemadelSystemOrderEnum[this.sortObjs[0].name];
      this.naming = NewGemadelAccountSort[this.sortObjs[0].asc];
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
      this.heads = result.newHeads;
      this.searches = result.newSearches;
      this.buildShow(this.searches);
      // 构建参数
      const params = this.buildParams(this.currentSubTab.params);
      this.xn.loading.open();
      // 采购融资 ：avenger,  地产abs ：api
      this.xn.dragon.post(this.currentTab.post_url, params).subscribe(
        x => {
          this.selectedReceivables = 0;
          if (x.data && x.data.data && x.data.data.length) {
            this.listInfo = x.data.data;
            this.allReceivables = x.data.sumFinancingAmount || 0;
            this.pageConfig.total = x.data.count;
            if (showChecked) {
              this.listInfo.forEach(v =>
                this.selectedItems.forEach(t => { if (t.billNumber === v.billNumber) { v.checked = true; } })
              );
              this.selectedItems = this.listInfo.filter(v => v.checked);
            }
          } else {
            // 固定值
            this.listInfo = [];
            this.allReceivables = 0;
            this.pageConfig.total = 0;
          }
          this.cdr.markForCheck();
        },
        () => {
          // 固定值
          this.listInfo = [];
          this.selectedReceivables = 0;
          this.allReceivables = 0;
          this.pageConfig.total = 0;
        },
        () => {
          setTimeout(() => {
            this.getLast();
          }, 300);
          this.xn.loading.close();
        });
    });
  }
  // 固定最后一列
  getLast() {
    const newTables = $(this.tables.nativeElement);
    newTables.scrollLeft(20);
    this.cdr.markForCheck();
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
   * @param paramSubTabValue 123
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
   * @param paramsKey qw
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
   * @param sort paixuncanshu
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
        name: NewGemadelSystemOrderEnum[this.sorting],
        asc: NewGemadelAccountSort[this.naming],
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
   * 构建搜索项
   * @param searches searches
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
   * @param searches 123
   */
  private buildCondition(searches) {
    const objList = [];
    this.timeStorage.timeId = $.extend(true, [], this.searches.filter(v => v.type === 'quantum').map(v => v.checkerId));

    for (const search of searches) {
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
      } else {
        obj.value = this.arrObjs[search.checkerId];
      }
      objList.push(obj);
    }
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
   * @param paramItem 获取的item
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
  private buildParams(flag) {
    // 分页处理
    const params: any = {
      pageNo: this.paging,
      pageSize: this.pageConfig.pageSize,
      type: flag, // 列表类型 0=当前数据列表 1=所有数据列表
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
        if (!XnUtils.isEmpty(this.arrObjs[search.checkerId])) {

          switch (search.checkerId) {

            case 'transactionStatus': // 交易状态
              params.flowId = this.arrObjs[search.checkerId];
              if (this.subDefaultValue === 'ALL' && String(this.arrObjs[search.checkerId]) === String(NewGemdaleStatus.Suspension)
                || String(this.arrObjs[search.checkerId]) === String(NewGemdaleStatus.Chargeback)) {
                params.tradeStatus = NewGemdaleStatus.Suspension;
                params.retreatStatus = String(this.arrObjs[search.checkerId]) === String(NewGemdaleStatus.Suspension) ? 0 : 4;
                delete params.flowId;
                delete params.isProxy;
              }
              break;

            case 'versionsTime':          // 获取数据时间
              const versionsTime = JSON.parse(this.arrObjs[search.checkerId]);
              params.versionsStartTime = Number(versionsTime.beginTime); // 开始时间
              params.versionsEndTime = Number(versionsTime.endTime); // 结束时间
              break;

            case 'expiredDateTime':          // 保理融资到期日
              const expiredDateTime = JSON.parse(this.arrObjs[search.checkerId]);
              params.expiredDateStartTime = Number(expiredDateTime.beginTime); // 开始时间
              params.expiredDateEndTime = Number(expiredDateTime.endTime); // 结束时间
              break;

            case 'financingAmount':       // (融资金额)搜索过滤处理
              let financingAmount = '';
              this.arrObjs[search.checkerId].split(',').forEach(v => {
                financingAmount += v;
              });
              params.financingAmount = Number(financingAmount);
              break;

            case 'isSponsor':       // 是否发起提单 0=未发起 1=已发起
              params[search.checkerId] = Number(this.arrObjs[search.checkerId]);
              break;

            default:
              params[search.checkerId] = this.arrObjs[search.checkerId];
              if (search.type === 'text') {
                params[search.checkerId] = this.arrObjs[search.checkerId].trim();
              }
              break;
          }

        }
      }
    }
    return params;
  }

  /**
   * 回退操作
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
   * 展开收起搜索
   */
  show() {
    this.displayShow = !this.displayShow;
  }

  /**
   * 表头按钮组事件
   * @param paramBtnOperate 按钮操作配置
   *
   */
  public handleHeadClick(paramBtnOperate: ButtonConfigModel) {
    if (paramBtnOperate.operate === 'custom_search') {
      // 自定义筛选条件
      const params = {
        title: '自定义筛选条件',
        label: 'checkerId',
        type: 1,
        headText: JSON.stringify(this.currentSubTab.searches),
        selectHead: JSON.stringify(this.searches),
        selectField: this.heads,
        status: this.currentSubTab.searchNumber
      };
      XnModalUtils.openInViewContainer(this.xn, this.vcr, NewGemdalegetCustomFiledComponent, params).subscribe(v => {
        if (v && v.action === 'ok') {
          this.newSearches[this.defaultValue] = XnUtils.deepCopy(v.value, []);
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
      const params = {
        title: '自定义页面字段',
        label: 'value',
        type: 2,
        headText: JSON.stringify(this.currentSubTab.headText),
        selectHead: JSON.stringify(this.heads),
        status: this.currentSubTab.headNumber,
        FixedNumber: this.FixedHeadNubmer
      };
      XnModalUtils.openInViewContainer(this.xn, this.vcr, NewGemdalegetCustomListComponent, params).subscribe(v => {
        if (v && v.action === 'ok') {
          this.newHeads[this.defaultValue] = XnUtils.deepCopy(v.value, []);
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
    if (paramBtnOperate.operate === 'export_data') { // 数据导出
      return this.exportData(); // 数据导出
    }
    if (this.selectedItems && this.selectedItems.length > 0) {
      switch (paramBtnOperate.operate) {
        // 发起提单
        case 'jd_financing_pre':
          this.newGemdaleFinancingPre();
          break;
        // 补充信息
        case 'further_information':
          this.furtherInformation();
          break;
        // 发起审核失败
        case 'reject_deal':
          this.rejectDeal();
          break;
        // 下载附件
        case 'download_file':
          this.downloadFile();
          break;

        default:
          break;
      }
    } else {
      this.xn.msgBox.open(false, '请先选择交易');
    }
  }

  /**
   * 发起提单
   */
  newGemdaleFinancingPre() {
    const billNumberList = this.selectedItems.map((x: any) => x.billNumber); // 融资单号列表
    const msg = [];
    const verifyStatusFail = this.selectedItems.filter(x => x.verifyStatus === 2); // verifyStatus 1=校验成功 2=校验失败
    let index = 0;
    if (verifyStatusFail.length > 0) {
      index++;
      msg.push(...[
        `${index}、以下交易为校验失败状态，无法发起提单，融资单号为：`, verifyStatusFail.map(y => y.billNumber).join('，')
      ]);
    }
    if (msg.length > 0) {
      return this.xn.msgBox.open(false, msg);
    }

    this.xn.router.navigate([`/new-gemdale/record/new/jd_financing_pre/${HeadquartersTypeEnum[2]}`],
      {
        queryParams: {
          billNumberList,
        }
      });
  }

  /**
   * 补充信息
   */
  furtherInformation() {
    const billNumberList = this.selectedItems.map((x: any) => x.billNumber); // 融资单号列表
    const checkers = [
      {
        title: '资产转让折扣率',
        checkerId: 'discountRate',
        type: 'number-control',
        options: { size: { min: 0, max: 100 } },
        required: 1,
      },
      {
        title: '保理融资到期日',
        checkerId: 'factoringEndDate',
        type: 'date',
        required: 1,
      },
    ];
    const params = {
      checker: checkers,
      title: '补充提单信息',
      buttons: ['取消', '确定'],
    };

    XnModalUtils.openInViewContainer(this.xn, this.vcr, EditModalComponent, params)
      .subscribe((v) => {
        if (v === null) {
          return;
        } else {
          v.factoringEndDate = moment(v.factoringEndDate).valueOf();
          v.discountRate = Number(v.discountRate);
          const param = { ...v, billNumberList };
          this.xn.dragon.post('/sub_system/jd_system/jd_batch_modify', param).subscribe(x => {
            if (x.ret === 0) {
              this.xn.msgBox.open(false, '补充信息成功');
              this.onPage({ page: this.paging }, true);
            }
          });

        }
      });
  }

  /**
   * 发起审核失败
   */
  rejectDeal() {
    const idList = this.selectedItems.map((x: any) => x.billNumber);
    this.xn.router.navigate([`/new-gemdale/record/new`],
      {
        queryParams: {
          id: 'sub_jd_check_fail',
          relateValue: idList
        }
      });
  }

  /**
   * 下载附件
   */
  downloadFile() {
    if (this.selectedItems.length > 10) { return this.xn.msgBox.open(false, '一次最多支持下载10笔交易'); }
    const billNumberList = this.selectedItems.map(v => v.billNumber); // 融资单号列表
    this.xn.loading.open();
    this.xn.dragon.download('/sub_system/jd_system/jd_file_download', { billNumberList })
      .subscribe(x => {
        this.xn.loading.close();
        this.xn.dragon.save(x._body, '金地付款单相关文件.zip');
      }, () => {
        this.xn.loading.close();
      });
  }
  /**
   * 数据导出
   */
  exportData() {
    if (this.selectedItems.length > 10) { return this.xn.msgBox.open(false, '一次最多支持下载10笔交易'); }
    const params = this.buildParams(this.currentSubTab.params);
    delete params.pageNo;
    delete params.pageSize;
    if (this.selectedItems.length > 0) {
      const idList = this.selectedItems.map(v => v.id);  // 记录id列表
      params.idList = idList;
    }
    this.xn.loading.open();
    this.xn.dragon.download('/sub_system/jd_system/jd_excel_download', params)
      .subscribe(x => {
        this.xn.loading.close();
        this.xn.dragon.save(x._body, '金地对接数据清单.xlsx');
      }, () => {
        this.xn.loading.close();
      });
  }

  /**
   *  金地数据对接情况
   * @param item 行内容
   */
  toViewJdData(item: any) {
    const params = {
      title: '金地数据对接情况',
      type: item.mainFlowId ? 'platmachineAccount' : 'platVerify',
      defaultValue: item.mainFlowId ? 'A' : 'C',
      mainFlowId: item.mainFlowId,
      billNumber: item.billNumber
    };
    XnModalUtils.openInViewContainer(this.xn, this.vcr, JdDataChangeModalComponent, params).subscribe(() => {
    });
  }

  /**
   *  判断数据是否长度大于显示最大值
   * @param paramFileInfos files
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
   * @param billNumber 融资单号
   */
  public viewMore(billNumber: string) {
    // 打开弹框
    const params: SingleListParamInputModel = {
      title: '发票详情',
      get_url: '/sub_system/jd_system/jd_invoice_list',
      get_type: 'dragon',
      multiple: null,
      heads: [
        { label: '融资单号', value: 'billNumber', type: 'text' },
        { label: '发票代码', value: 'invoiceCode', type: 'text' },
        { label: '发票号码', value: 'invoiceNumber', type: 'text' },
        { label: '发票含税金额', value: 'money', type: 'money' },
        { label: '发票不含税金额', value: 'taxFreeMoney', type: 'money' },
        { label: '开票日期', value: 'billingDate', type: 'date' },
        { label: '发票类型', value: 'invoiceType', type: 'text' },
        { label: '发票状态', value: 'invoiceStatus', type: 'text' },
        { label: '校验码', value: 'checkCode', type: 'text' },
        { label: '销售方', value: 'saler', type: 'text' },
        { label: '销方税号', value: 'sellerTaxNumber', type: 'text' },
        { label: '购买方', value: 'payer', type: 'text' },
        { label: '购方税号', value: 'purchaseTaxNumber', type: 'text' },
        { label: '税率', value: 'taxRate', type: 'text' },
        { label: '税额', value: 'invoiceTax', type: 'text' },
        { label: '发票备注', value: 'remark', type: 'text' },
      ],
      searches: [],
      key: 'invoiceCode',
      data: [],
      total: 0,
      inputParam: { billNumber },
      rightButtons: [{ label: '确定', value: 'submit' }],
      options: {
        paramsType: 1   // 1 区分接口入参分页参数
      }
    };
    XnModalUtils.openInViewContainer(this.xn, this.vcr, NewGemdaleSingleSearchListModalComponent, params).subscribe(v => {
      if (v === null) { return; }
    });
  }

  /**
   *  查看审核记录
   * @param billNumber 融资单号
   */
  public viewApproveList(billNumber: string) {
    // 打开弹框
    const params: SingleListParamInputModel = {
      title: '审核记录列表',
      get_url: '/sub_system/jd_system/jd_audit_list',
      get_type: 'dragon',
      multiple: null,
      heads: [
        { label: '融资单号', value: 'billNumber', type: 'text' },
        { label: '审批时间', value: 'approveTime', type: 'date' },
        { label: '步骤描述', value: 'approveStep', type: 'text' },
        { label: '操作者', value: 'operatorStr', type: 'text' },
        { label: '处理结果类别', value: 'approveType', type: 'text' },
        { label: '处理意见', value: 'approveResult', type: 'text' },
      ],
      searches: [],
      key: 'pk_father',
      data: [],
      total: 0,
      inputParam: { billNumber },
      rightButtons: [{ label: '确定', value: 'submit' }],
      options: {
        paramsType: 1   // 1 区分接口入参分页参数
      }
    };
    XnModalUtils.openInViewContainer(this.xn, this.vcr, NewGemdaleSingleSearchListModalComponent, params).subscribe(v => {
      if (v === null) { return; }
    });
  }

  /**
   *  查看附件
   * @param billNumber 融资单号
   */
  public viewExitList(billNumber: string) {
    // 打开弹框
    const params: SingleListParamInputModel = {
      title: '查看附件',
      get_url: '/sub_system/jd_system/jd_file_list',
      get_type: 'dragon',
      multiple: null,
      heads: [
        { label: '融资单号', value: 'billNumber', type: 'text' },
        { label: '文件ID', value: 'fileId', type: 'text' },
        { label: '文件名称', value: 'fileName', type: 'text' },
        { label: '文件类型', value: 'fileType', type: 'fileType' },
        // 1=形象进度 2=产值文件 3=结算文件 4=送货单 5=三方验收单 6=付款申请单 99=付款申请单相关文件的压缩文件包
        { label: '文件形式', value: 'fileNature', type: 'fileNature' },
        // 1=鲜章原件扫描件 2=电子签章文件
        // { label: '文件地址', value: 'fileUrl', type: 'exturl' },
      ],
      searches: [],
      key: 'pk_father',
      data: [],
      total: 0,
      inputParam: { billNumber },
      rightButtons: [{ label: '确定', value: 'submit' }],
      options: {
        paramsType: 1   // 1 区分接口入参分页参数
      }
    };
    XnModalUtils.openInViewContainer(this.xn, this.vcr, NewGemdaleSingleSearchListModalComponent, params).subscribe(v => {
      if (v === null) { return; }
    });
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

    const ColumFirst = $('.height').find('.head-height tr th:nth-child(1),.table-height tr td:nth-child(1)'); // 勾选列
    const ColumLast = $('.height').find('.head-height tr th:last-child,.table-height tr td:last-child');  // 操作列
    if ($event.srcElement.scrollLeft !== this.scrollX) {
      this.scrollX = $event.srcElement.scrollLeft;
      const lastHeadX = -($event.srcElement.scrollWidth - $event.srcElement.offsetWidth) + $event.srcElement.scrollLeft;
      if (FixHead.length > 0) { // 固定冻结的列
        FixHead.forEach(v => {
          v.each((index, col) => {
            col.style.transform = 'translateX(' + (this.scrollX) + 'px)';
            col.style.backgroundColor = '#fff';
          });
        });
      }
      // 固定第一列
      ColumFirst.each((index, col) => {
        col.style.transform = 'translateX(' + this.scrollX + 'px)';
        col.style.backgroundColor = '#fff';
      });
      // 固定最后一列
      ColumLast.each((index, col) => {
        col.style.transform = 'translateX(' + lastHeadX + 'px)';
        col.style.backgroundColor = '#fff';
      });
    }
  }
  /**
   * 编辑条目
   * @param item 列表数据
   */
  handleEdit(item: any) {
    const id = item?.id;
    /**
     * id id必填
     * projectCompanyName 项目公司
     * receiptCompanyName 收款单位
     * bankAccountName 付款人
     * payCompanyName 付款单位
     */
    const checkers = [
      {
        title: '项目公司',
        checkerId: 'projectCompanyName',
        type: 'text',
        required: false,
        options: { readonly: false, inputMaxLength: 100 },
        value: item.projectCompanyName || ''
      },
      {
        title: '收款单位',
        checkerId: 'receiptCompanyName',
        type: 'text',
        required: false,
        options: { readonly: false, inputMaxLength: 100 },
        value: item.receiptCompanyName || ''
      },
      {
        title: '收款人',
        checkerId: 'bankAccountName',
        type: 'text',
        required: false,
        options: { readonly: false, inputMaxLength: 100 },
        value: item.bankAccountName || ''
      },
      {
        title: '付款单位',
        checkerId: 'payCompanyName',
        type: 'text',
        required: false,
        options: { readonly: false, inputMaxLength: 100 },
        value: item.payCompanyName || ''
      },
    ];
    const params = {
      checker: checkers,
      title: '信息编辑',
      buttons: ['取消', '确定'],
    };
    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      EditModalComponent,
      params
    ).subscribe(res => {
      if (res === null) { return; }
      const data = {
        id,
        projectCompanyName: res?.projectCompanyName || '',
        receiptCompanyName: res?.receiptCompanyName || '',
        bankAccountName: res?.bankAccountName || '',
        payCompanyName: res?.payCompanyName || ''
      };
      this.xn.dragon.post('/sub_system/jd_system/update_jd_financing_list', data).subscribe(re => {
        this.xn.msgBox.open(false, '更新成功！');
        this.initData(this.defaultValue);
      });
    });
  }
}
// 表头排序
enum NewGemadelSystemOrderEnum {
  versionsTime = 1,   // 数据更新时间
  financingAmount = 2,   // 融资金额
}
enum NewGemadelAccountSort {
  asc = 1,
  desc = -1
}
enum NewGemdaleStatus {
  Suspension = 99, // 中止
  Chargeback = 100 // 退单
}
