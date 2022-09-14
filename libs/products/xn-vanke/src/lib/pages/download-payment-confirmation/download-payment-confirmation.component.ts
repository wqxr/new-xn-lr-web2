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
 * 1.0                 yutianbao          下载付确          2020-05-06
 * **********************************************************************
 */

import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BankManagementService } from 'libs/console/src/lib/bank-management/bank-mangement.service';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { ButtonConfigModel, SubTabListOutputModel, TabListOutputModel } from 'libs/shared/src/lib/config/list-config-model';
import CommUtils from 'libs/shared/src/lib/public/component/comm-utils';
import { DragongetCustomFiledComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/custom-field-modal.component';
import { DragongetCustomListComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/custom-list-modal.component';
import { DragonMfilesViewModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/mfiles-view-modal.component';
import { DragonPdfSignModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/pdf-sign-modal.component';
import { SingleListParamInputModel, SingleSearchListModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/single-searchList-modal.component';
import { JsonTransForm } from 'libs/shared/src/lib/public/pipe/xn-json.pipe';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { fromEvent } from 'rxjs';

declare const moment: any;
@Component({
  selector: 'app-download-comfirm-component',
  templateUrl: `./download-payment-confirmation.component.html`,
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
        border-collapse: separate;
        border-spacing: 0;
    }
    .table-display {
        margin: 0;
    }
    `]
})
export class DragonDownloadPaymentsComponent implements OnInit {
  tabConfig: any;
  // 默认激活第一个标签页 {do_not,do_down}
  label = 'do_not';
  public defaultValue = 'A';  // 默认激活第一个标签页
  displayShow = true;
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
  public scroll_x = 0; // 滚动条滚动距离
  public FixedHead: number[] = []; // 需要固定的表格列
  public FixedHeadNubmer = 0; // 固定表格列数量

  sorting = ''; // 共享该变量
  naming = ''; // 共享该变量
  heads: any[];
  public currentSubTab: SubTabListOutputModel = new SubTabListOutputModel(); // 当前子标签页
  public subDefaultValue = 'DOING'; // 默认子标签页
  public formModule = 'dragon-input';
  subResize: any;
  headLeft = 0;

  constructor(private xn: XnService,
    private vcr: ViewContainerRef, private er: ElementRef,
    public bankManagementService: BankManagementService,
    private cdr: ChangeDetectorRef,
    private loading: LoadingService,
    private router: ActivatedRoute,
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
      this.paging = 1;
      this.pageConfig = { pageSize: 10, first: 0, total: 0 };
    }
    this.defaultValue = paramTabValue;
    this.subDefaultValue = 'DOING'; // 重置子标签默认
    this.onPage({ page: this.paging });
  }

  /**
    * @param e  page: 新页码、 pageSize: 页面显示行数、first: 新页面之前的总行数、pageCount : 页码总数 customType:自定义类型
    * @summary 采购融资，地产abs  请求api有区别，采购融资：avenger 、地产abs：api
    */
  public onPage(e?: { page: number, first?: number, pageSize?: number, pageCount?: number }) {
    this.selectedItems = [];
    this.paging = e.page || 1;
    this.onUrlData(); // 导航回退取值
    this.pageConfig = Object.assign({}, this.pageConfig, e);
    // 页面配置
    const find = this.tabConfig.tabList.find(tab => tab.value === this.defaultValue);
    this.currentTab = !!find ? find : new TabListOutputModel();
    // 子页面配置
    const subFind = this.currentTab.subTabList.find(sub => sub.value === this.subDefaultValue);
    this.currentSubTab = !!subFind ? subFind : new SubTabListOutputModel();

    // 自定义列表字段或搜索项
    this.asyncFunc().then((result: any) => {
      this.heads = result.newHeads;
      this.searches = result.newSearches;
      this.buildShow(this.searches);
      // 构建参数
      const params = this.buildParams(this.currentSubTab.params, this.currentTab.value);
      if (this.currentTab.post_url === '') {
        // 固定值
        this.listInfo = [];
        this.pageConfig.total = 0;
        return;
      }
      this.xn.loading.open();
      // 采购融资 ：avenger,  地产abs ：api
      this.xn.dragon.post(this.currentTab.post_url, params).subscribe(x => {
        if (x.data && x.data.data && x.data.data.length) {
          this.listInfo = x.data.data;
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
          this.pageConfig.total = 0;
        }
        this.cdr.markForCheck();
      }, () => {
        // 固定值
        this.listInfo = [];
        this.pageConfig.total = 0;
      }, () => {
        this.xn.loading.close();
      });
    }, () => {
      // error
    });
  }

  /**
   * 处理自定义字段或搜索项
   */
  public customSetField() {
    const heads = CommUtils.getListFields(this.currentSubTab.headText);
    const searches = this.currentSubTab.searches;
    const customList = [this.currentSubTab.headNumber, this.currentSubTab.searchNumber];
    return new Promise((resolve, reject) => {
      this.xn.dragon.post('/trade/get_column', { statusList: customList }).subscribe(res => {
        const resObj = {
          newHeads: heads,
          newSearches: searches,
        };
        if (res.ret === 0 && res.data && res.data.data) {
          if (!res.data.data.length) {
            resObj.newHeads = heads;
            resObj.newSearches = searches;
          }
          res.data.data.forEach(x => {
            if (x.status === this.currentSubTab.headNumber) {
              if (!x.column) {
                resObj.newHeads = heads;

              } else {
                resObj.newHeads = [];
                const colArr = x.column || '[]';
                this.FixedHeadNubmer = x.lockCount || 0;
                JSON.parse(colArr).forEach((y) => {
                  heads.forEach((z: any) => {
                    if (y === z.value) {
                      resObj.newHeads.push(z);
                    }
                  });
                });
                // resObj.newHeads = heads.filter((head) => colArr.includes(head.value));
              }
            }
            if (x.status === this.currentSubTab.searchNumber) {
              if (!x.column) {
                resObj.newSearches = searches;
              } else {
                resObj.newSearches = [];
                const searchArr = x.column || '[]';
                JSON.parse(searchArr).forEach((y) => {
                  searches.forEach((z: any) => {
                    if (y === z.checkerId) {
                      resObj.newSearches.push(z);
                    }
                  });
                });
                // resObj.newSearches = searches.filter((search) => searchArr.includes(search.checkerId));
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
    this.paging = 1;
    this.onPage({ page: this.paging, first: 0 });
  }

  /**
   * 重置
   */
  public reset() {
    this.selectedItems = [];
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
  *  滚动表头
  *  scrollLeft 滚动条的水平位置
  *  scrollWidth 元素的宽度且包括滚动部分及滚动条的宽度
  *  offsetWidth 元素可见区域的宽度 + 元素边框宽度（如果有滚动条还要包括滚动条的宽度）
  */
  onScroll($event: any) {
    this.headLeft = $event.srcElement.scrollLeft * -1;
    const FixHead = []; // 冻结的列Dom对象数组
    let headNumber = this.FixedHeadNubmer + 2;

    while (headNumber >= 3) { // 获取冻结列Dom对象
      const Column = $('.height').find(`.head-height tr th:nth-child(${headNumber}),.table-height tr td:nth-child(${headNumber})`);
      FixHead.unshift(Column);
      headNumber--;
    }

    const ColumFirst = $('.height').find('.head-height tr th:nth-child(1),.table-height tr td:nth-child(1)'); // 勾选列
    const ColumTwo = $('.height').find('.head-height tr th:nth-child(2),.table-height tr td:nth-child(2)'); // 序号列
    // let ColumLast = $(".height").find(".head-height tr th:last-child,.table-height tr td:last-child"); // 操作列
    if ($event.srcElement.scrollLeft !== this.scroll_x) {
      this.scroll_x = $event.srcElement.scrollLeft;
      const lastHead_X = -($event.srcElement.scrollWidth - $event.srcElement.offsetWidth) + $event.srcElement.scrollLeft;
      if (FixHead.length > 0) { // 固定冻结的列
        FixHead.forEach(v => {
          v.each((index, col: any) => {
            col.style.transform = 'translateX(' + (this.scroll_x) + 'px)'; // 50 --->序号列的宽度
            col.style.backgroundColor = '#fff';
          });
        });
      }
      ColumFirst.each((index, col: any) => { // 固定第一列
        col.style.transform = 'translateX(' + this.scroll_x + 'px)';
        col.style.backgroundColor = '#fff';
      });
      ColumTwo.each((index, col: any) => { // 固定第二列
        col.style.transform = 'translateX(' + (this.scroll_x) + 'px)';
        col.style.backgroundColor = '#fff';
      });
      // ColumLast.each((index, col: any) => { // 固定最后一列
      //     col.style.transform = "translateX(" + lastHead_X + "px)";
      //     col.style.backgroundColor = "#fff";
      // });
    }
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
              this.timeStorage[timeCheck].endTime = paramsTime.endTime;
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
      this.listInfo.forEach(item => item.checked = true);
      this.selectedItems = XnUtils.distinctArray2([...this.selectedItems, ...this.listInfo], 'id');
    } else {
      this.listInfo.forEach(item => item.checked = false);
      this.selectedItems = [];
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
      this.selectedItems = this.selectedItems.filter((x: any) => x.id !== paramItem.id);
    } else {
      paramItem.checked = true;
      this.selectedItems.push(paramItem);
      this.selectedItems = XnUtils.distinctArray2(this.selectedItems, 'id'); // 去除相同的项
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
      verifyPayConfimStatus: flag
    };
    // 排序处理
    if (this.sorting && this.naming) {
      // params.order = [this.sorting + ' ' + this.naming];
      const asc = this.naming === 'desc' ? -1 : 1;
      params.order = [{
        name: DownloadQrsListOrderEnum[this.sorting], // 要排序的名称
        asc, // 是否是升序 -1表示降序 1表示升序
      }];
    }
    // 搜索处理
    if (this.searches.length > 0) {
      for (const search of this.searches) {
        if (!XnUtils.isEmpty(this.arrObjs[search.checkerId])) {
          if (search.checkerId === 'expiredDate') {
            const obj = JSON.parse(this.arrObjs[search.checkerId]);
            params.expiredDateStart = Number(obj.beginTime);
            params.expiredDateEnd = Number(obj.endTime);
          } else if (search.checkerId === 'financingType') {
            const val = JSON.parse(this.arrObjs[search.checkerId]);
            params.productType = Number(val.proxy);  // 产品类型 1=ABS 2=再保理 99=非标
            if (!!val.status) {
              params.bankType = Number(val.status); // 银行类型 0=无 1=光大 2=招行 3=邮储 4=农行 5=国寿财富
            }
          } else if (search.checkerId === 'discountRate') {
            params.isDiscountRate = Number(this.arrObjs[search.checkerId]);  // 是否有资产转让折扣率 0=无 1=有
          } else if (search.checkerId === 'numberList') {
            params.preInvoiceNum = this.arrObjs[search.checkerId];  // 发票号码
          } else if (search.checkerId === 'sumInvoiceAmount') {
            params.preInvoiceAmount = this.arrObjs[search.checkerId];  // 发票金额
          } else {
            params[search.checkerId] = this.arrObjs[search.checkerId];
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
  private onUrlData(data?) {
    const urlData = this.xn.user.getUrlData(this.xn.router.url);
    if (urlData && urlData.pop) {
      this.paging = urlData.data.paging || this.paging;
      this.pageConfig = urlData.data.pageConfig || this.pageConfig;
      this.timeStorage = urlData.timeStorage || this.timeStorage;
      this.arrObjs = urlData.data.arrObjs || this.arrObjs;
      this.label = urlData.data.label || this.label;
    } else {
      this.xn.user.setUrlData(this.xn.router.url, {
        paging: this.paging,
        pageConfig: this.pageConfig,
        timeStorage: this.timeStorage,
        arrObjs: this.arrObjs,
        label: this.label
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
    // paramFile = '[{"fileId":"U100006_10026_QAODJF_017510101_00","fileName":"微信图片_20200507103417.jpg","filePath":"U100006_10026_20200521T174027_017510101_00.jpg"}]';
    const files = JSON.parse(paramFile);
    files.forEach(x => {
      x.isAvenger = false;
    });
    XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonMfilesViewModalComponent, files).subscribe();
  }

  /**
 *  买方确认函（万科电子版）file
 * @param paramFile 文件信息
 */
  public viewVankeFiles(paramFile: any) {
    paramFile.isAvenger = true;
    XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonMfilesViewModalComponent, [paramFile]).subscribe();
  }

  /**
   *  查看更多发票
   * @param paramItem
   */
  public viewMore(paramItem, uuid: string, isProxy: any) {
    this.xn.dragon.post('/sub_system/vanke_system/vanke_invoice_list', { uuid }).subscribe(x => {
      // 打开弹框
      const params: SingleListParamInputModel = {
        title: '发票详情',
        get_url: '',
        get_type: '',
        multiple: null,
        heads: [
          { label: '发票代码', value: 'code', type: 'text' },
          { label: '发票号码', value: 'number', type: 'text' },
          { label: '发票含税金额', value: 'invoiceAmt', type: 'money' },
          { label: '发票转让金额', value: 'invTransAmt', type: 'money' },
          // { label: '发票文件', value: 'invoiceFile',type: 'file' },
        ],
        searches: [],
        key: 'invoiceCode',
        data: x.data.data || [],
        total: x.data.data.length || 0,
        inputParam: {},
        rightButtons: [{ label: '确定', value: 'submit' }]
      };
      XnModalUtils.openInViewContainer(this.xn, this.vcr, SingleSearchListModalComponent, params).subscribe(v => {
        if (v === null) {
          return;
        }
      });

    });
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
      XnModalUtils.openInViewContainer(this.xn, this.vcr, DragongetCustomListComponent, params).subscribe(v => {
        if (v && v.action === 'ok') {
          // this.cdr.markForCheck();
          this.onPage({ page: this.paging });
        }
      });
    }
  }

  /**
   * 人工校验
   * @param paramBtnOperate 按钮操作配置
   *
   */
  public batchOperate(paramBtnOperate: ButtonConfigModel, type: string) {
    if (this.selectedItems && this.selectedItems.length > 0) {
      const mainFlowIds = this.selectedItems.map((x: any) => x.mainFlowId);
      if (type === 'manualVerify') {
        // 人工校验
        const rolesArr = this.xn.user.roles.filter((x) => {
          return x;
        });
        if (!(rolesArr && rolesArr.length)) {
          this.xn.msgBox.open(false, '您好，您的权限不够，仅【财务经办人】、【财务复核人】可进行操作');
        } else {
          this.xn.router.navigate([`/logan/record/new/`], {
            queryParams: {
              id: 'sub_vanke_system_hand_verify',
              relate: 'mainIds',
              relateValue: mainFlowIds
            }
          });
        }
      } else if (type === 'qrsDownload') {
        // 下载付确
        if (mainFlowIds.length > 50) {
          this.xn.msgBox.open(false, `每次最多只支持勾选50笔交易，请重新勾选`);
          return false;
        }
        XnUtils.checkLoading(this);
        this.xn.dragon.post('/sub_system/download_pay_confirm/download', { mainFlowIdList: mainFlowIds }).subscribe(res => {
          this.loading.close();
          if (res.ret === 0 && res.data && res.data.data && res.data.data.length > 0) {
            // 打开弹框
            const params: SingleListParamInputModel = {
              title: '付确下载结果',
              get_url: '',
              get_type: '',
              multiple: null,
              heads: [
                { label: '一线单据编号', value: 'billNumber', type: 'text' },
                { label: '交易ID', value: 'mainFlowId', type: 'text' },
                { label: '付确下载结果', value: 'result', type: 'payConfimDownload' },
                { label: '原因', value: 'msg', type: 'text' },
              ],
              searches: [
                { title: '交易ID', checkerId: 'mainFlowId', type: 'text', required: false, sortOrder: 1 },
                { title: '付确下载结果', checkerId: 'result', type: 'select', options: { ref: 'payConfimDownload' }, required: false, base: 'number', sortOrder: 2 },
              ],
              key: 'billNumber',
              data: res.data.data || [],
              total: res.data.data.length || 0,
              inputParam: {},
              rightButtons: [{ label: '确定', value: 'submit' }]
            };
            XnModalUtils.openInViewContainer(this.xn, this.vcr, SingleSearchListModalComponent, params).subscribe(v => {
              this.onPage({ page: this.paging });
            });
          }
          // this.onPage({ page: this.paging });
        });

      }
    } else {
      this.xn.msgBox.open(false, '请先选择交易');
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
}

/**
 * 排序列表
 */
export enum DownloadQrsListOrderEnum {
  /**保理融资到期日 */
  expiredDate = 1,
  /**应收账款金额 */
  financingAmount = 2,
  /**付确编号 */
  transNumber = 3,
  /**一线单据编号*/
  billNumber = 4,
  /**融资单唯一标志码*/
  uuid = 5,
  /**交易id */
  mainFlowId = 6,
}
/**
 * 新万科模式
 */
export enum newVankeType {
  // 交易未开始0 { label: '中止', value: 99 },  { label: '退单', value: 100 },
  vanke_financing_pre = 201,
  vanke_financing = 202,
  vanke_platform_verify = 203,
  vanke_factoring_risk = 204,
  vanke_financing_sign = 205,
  vanke_factoring_passback = 206,

  wait_verification_500 = 5,
  verificating_500 = 6,
  factoring_sign_500 = 7,
  wait_loan_500 = 8,
  loaded_500 = 9,
  repayment_500 = 10
}
