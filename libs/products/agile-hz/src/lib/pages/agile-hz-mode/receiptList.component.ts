/**
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：RecepitListComponent
 * @summary：项目公司回执签署页面
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                hucongying        雅居乐-恒泽数据对接       2021-01-05
 * **********************************************************************
 */

import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { ActivatedRoute } from '@angular/router';
import { InvoiceDataViewModalComponent } from 'libs/shared/src/lib/public/modal/invoice-data-view-modal.component';
import { JsonTransForm } from 'libs/shared/src/lib/public/pipe/xn-json.pipe';
import { FileViewModalComponent } from 'libs/shared/src/lib/public/modal/file-view-modal.component';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { applyFactoringTtype, SignTypeEnum } from 'libs/shared/src/lib/config/select-options';
import { DragonPdfSignModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/pdf-sign-modal.component';
import { ElementRef } from '@angular/core';
import { fromEvent } from 'rxjs';
import { EditParamInputModel } from '../../share/modal/edit-modal.component';
import { CheckersOutputModel } from 'libs/shared/src/lib/config/checkers';
import { DragonOcrEditModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/dragon-ocr-edit-modal.component';
import { DragonFinancingContractModalComponent } from '../../../../../../shared/src/lib/public/dragon-vanke/modal/dragon-asign-contract.modal';
import { ContractSignStatus } from '../../share/enums';

declare const $: any;

@Component({
  templateUrl: `./receiptList.component.html`,
  styles: [`
    .title {
      width: 100px;
    }

    .label {
      font-weight: normal;
      flex: 1;
    }

    .flex {
      display: flex;
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

    .center-block {
      clear: both;
      border-bottom: 1px solid #ccc;
      width: 43.9%;
      height: 1px;
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

    .height {
      overflow-x: hidden;
      clear: both;
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
export class RecepitListComponent implements OnInit {
  tabConfig: any;
  // 默认激活第一个标签页 {do_not, done}
  label = 'do_not';
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
  paging = 1; // 共享该变量
  beginTime: any;
  endTime: any;
  timeId = [];
  nowTimeCheckId = '';
  // 上次搜索时间段
  preChangeTime: any[] = [];

  sorting = ''; // 共享该变量
  naming = ''; // 共享该变量
  displayShow = true;
  headLeft: number;
  public subResize: any;
  public scrollX = 0;   // 滚动条滚动距离

  /** 是否处于 ‘已签署’ tab页，true -> 是 */
  get onSignedTab() {
    return this.label === 'done';
  }

  constructor(
    private xn: XnService,
    private route: ActivatedRoute,
    private vcr: ViewContainerRef,
    public hwModeService: HwModeService,
    private router: ActivatedRoute,
    private er: ElementRef,
  ) {}

  ngOnInit(): void {
    this.router.data.subscribe(x => {
      this.tabConfig = x;
      this.initData(this.label, true);
    });
    this.subResize = fromEvent(window, 'resize').subscribe((event) => {
      this.formResize();
    });
  }

  // ngAfterViewInit() {
  //   this.formResize();
  // }
  //
  // ngOnDestroy() {
  //   // 在组件生命周期销毁里取消事件，防止出现页面多次执行之后卡顿
  //   if (this.subResize) {
  //     this.subResize.unsubscribe();
  //   }
  // }

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
      options: {capitalPoolId: ''},
      buttons: ['取消', '上传']
    };
    XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonOcrEditModalComponent, params).subscribe(v => {
      this.onPage({page: this.paging});
    });
  }

  /**
   *  查看文件信息
   */
  public viewFiles(paramFile) {
    XnModalUtils.openInViewContainer(this.xn, this.vcr, FileViewModalComponent, paramFile).subscribe();
  }

  /**
   *  加载信息
   */
  public initData(val: string, init?: boolean) {
    if (this.label === val && !init) { return; }
    this.label = val;
    this.selectedItems = []; // 切换标签页是清空选中的项
    this.naming = '';
    this.sorting = '';
    this.paging = 1;
    this.pageConfig = {pageSize: 10, first: 0, total: 0};
    for (const key in this.arrObjs) {
      if (this.arrObjs.hasOwnProperty(key)) {
        delete this.arrObjs[key];
      }
    }
    this.onPage({page: this.paging});
  }

  /**
   * @param e  event.page: 新页码 <br> event.pageSize: 页面显示行数<br>event.first: 新页面之前的总行数<br>event.pageCount : 页码总数
   */
  public onPage(e?) {
    this.selectedItems = [];
    this.paging = e.page || 1;
    this.onUrlData(); // 导航回退取值
    this.pageConfig = Object.assign({}, this.pageConfig, e);
    // 页面配置
    this.currentTab = this.tabConfig.tabList.find((x: any) => x.value === this.label); // 当前标签页
    this.searches = this.currentTab.searches; // 当前标签页的搜索项
    this.buildShow(this.searches);
    // 构建参数
    const params = this.buildParams();
    if (this.currentTab.get_url === '') {
      // 固定值
      this.data = [];
      this.pageConfig.total = 0;
      return;
    }
    this.xn.loading.open();
    this.xn.dragon.post(this.currentTab.get_url, params).subscribe(x => {
      if (x.data && x.data.data && x.data.data.length) {
        this.data = x.data.data;
        this.pageConfig.total = x.data.count;
      } else {
        // 固定值
        this.data = [];
        this.pageConfig.total = 0;
      }
    }, () => {
      // 固定值
      this.data = [];
      this.pageConfig.total = 0;
    }, () => {
      this.xn.loading.close();
    });
  }

  /**
   *  搜索,默认加载第一页
   */
  public searchMsg() {
    this.selectedItems = [];
    this.paging = 1;
    this.onPage({page: this.paging});
  }

  /**
   * 重置
   */
  public reset() {
    this.selectedItems = [];
    this.paging = 1;
    this.pageConfig = {pageSize: 10, first: 0, total: 0};
    this.form.reset(); // 清空
    for (const key in this.arrObjs) {
      if (this.arrObjs.hasOwnProperty(key)) {
        delete this.arrObjs[key];
      }
    }
    this.buildCondition(this.searches);
    this.searchMsg(); // 清空之后自动调一次search
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

  show() {
    this.displayShow = !this.displayShow;
  }

  /**
   *  按当前列排序
   */
  public onSort(sort: string) {
    if (this.sorting === sort) {
      this.naming = this.naming === 'desc' ? 'asc' : 'desc';
    } else {
      this.sorting = sort;
      this.naming = 'asc';
    }
    this.onPage({page: 1});
  }

  /**
   *  发票字符串转数组格式
   */
  public arrayLength(invoiceValue: string | null | undefined): any[] {
    if (!invoiceValue) {
      return [];
    } else {
      return invoiceValue.split(',');
    }
  }

  /**
   *  查看更多发票
   */
  public viewMore(item) {
    if (typeof item === 'string') {
      item = JSON.parse(item);
    }
    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      InvoiceDataViewModalComponent,
      item
    ).subscribe(() => {
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
      delete v[timeCheckId];
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
            this.paging = 1;
            this.onPage({page: this.paging});
          }
        }
      }
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
   * 构建参数
   */
  private buildParams() {
    // 分页处理
    const params: any = {
      pageNo: this.paging,
      pageSize: this.pageConfig.pageSize,
      ...this.currentTab.params,
    };
    // 搜索处理
    if (this.searches.length > 0) {
      for (const search of this.searches) {
        if (!XnUtils.isEmpty(this.arrObjs[search.checkerId])) {
          if (search.checkerId === 'productType') {
            const val = JSON.parse(this.arrObjs[search.checkerId]);
            params.type = Number(val.proxy);
            if (!!val.status) {
              params.selectBank = Number(val.status);
            }
          } else if (search.checkerId === 'receive') {
            let receive = '';
            this.arrObjs[search.checkerId].split(',').forEach(v => { receive += v; });
            params.receive = Number(receive);
          } else {
            params[search.checkerId] = this.arrObjs[search.checkerId];
          }
        }
      }
    }
    params.factoringAppId = `${applyFactoringTtype.广州恒泽商业保理有限公司}`;
    return params;
  }

  private buildChecker(stepRows) {
    for (const row of stepRows) {
      XnFormUtils.convertChecker(row);
    }
  }

  /**
   * 回退操作
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
        label: this.label
      });
    }
  }

  /**
   *  滚动表头
   *  scrollLeft 滚动条的水平位置
   *  scrollWidth 元素的宽度且包括滚动部分及滚动条的宽度
   *  offsetWidth 元素可见区域的宽度 + 元素边框宽度（如果有滚动条还要包括滚动条的宽度）
   */
  onScroll($event: any) {
    this.headLeft = $event.srcElement.scrollLeft * -1;
    const ColumFirst = $('.height').find('.head-height tr th:nth-child(1),.table-height tr td:nth-child(1)');  // 勾选列
    if ($event.srcElement.scrollLeft !== this.scrollX) {
      this.scrollX = $event.srcElement.scrollLeft;
      ColumFirst.each((index, col: any) => { // 固定第一列
        col.style.transform = 'translateX(' + this.scrollX + 'px)';
        col.style.backgroundColor = '#fff';
      });

    }
  }

  /**
   *  判断数据类型
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
   */
  public jsonTransForm(data) {
    return JsonTransForm(data);
  }

  /**
   *  查看合同，只读
   */
  public showContract(con, readonly?: boolean) {
    const params = Object.assign({}, con, {readonly: this.onSignedTab || readonly});
    XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonPdfSignModalComponent, params).subscribe(() => {
    });
  }

  /** 已签署， true -> 已签署 */
  isSign(head: any, item: any): boolean {
    // head 里存在 bodyContractYyj 字段 && 合同“已”签署 && 不是“05”号合同
    return head.bodyContractYyj && item[head.bodyContractYyj] === ContractSignStatus.Signed
      && head.value !== 'second_yjl_xs_05_contract';
  }

  /** 未签署， true -> 未签署 */
  noSign(head: any, item: any) {
    // head 里存在 bodyContractYyj 字段 && 合同“未”签署 && 不是“05”号合同
    return head.bodyContractYyj && item[head.bodyContractYyj] === ContractSignStatus.NoSign &&
      head.value !== 'second_yjl_xs_05_contract';
  }

  /** 不需要签署的文件 */
  noNeedSign(head: any) {
    return head.value === 'second_yjl_xs_05_contract';
  }

  /**
   *  判读列表项是否全部选中
   */
  public isAllChecked(): boolean {
    return !(this.data.some(x => !x.checked || x.checked && x.checked === false) || this.data.length === 0);
  }

  /**
   *  全选
   */
  public checkAll() {
    if (!this.isAllChecked()) {
      this.data.forEach(item => item.checked = true);
      this.selectedItems = XnUtils.distinctArray2([...this.selectedItems, ...this.data], 'mainFlowId');
    } else {
      this.data.forEach(item => item.checked = false);
      this.selectedItems = [];
    }
  }

  /**
   * 单选
   */
  public singelChecked(e, item) {
    if (item.checked && item.checked === true) {
      item.checked = false;
      this.selectedItems = this.selectedItems.filter((x: any) => x.mainFlowId !== item.mainFlowId);
    } else {
      item.checked = true;
      this.selectedItems.push(item);
      this.selectedItems = XnUtils.distinctArray2(this.selectedItems, 'mainFlowId'); // 去除相同的项
    }
  }

  /**
   *  表头按钮组
   */
  public handleHeadClick(btn) {
    switch (btn.operate) {
      // 批量签署
      case 'batchSign':
        const contracts = this.formatContracts();
        this.signContract(contracts);
        break;
    }
  }

  /**
   * 单个签署操作
   * @param contract 合同
   * @param tableName table的字段名
   * @param item table行数据，用来获取mainFlowId
   */
  clickContract(contract: any, tableName: string, item: any) {
    const contracts = [
      {
        ...contract,
        mainFlowId: item.mainFlowId,
        yyjTableName: tableName,
        caSignType: SignTypeEnum.bjcaSignType,
        isNoSignTitle: false,
        readonly: false,
      }
    ];
    this.signContract(contracts);
  }

  /**
   * 批量签署数据整理
   * @return contract any[]
   */
  formatContracts() {
    return this.selectedItems
      .map((c: any) => {
        return [
          this.jsonTransForm(c.second_yjl_xs_01_contract)
            .map((d: any) => ({
              ...d,
              yyjTableName: 'second_yjl_xs_01_contract',
              mainFlowId: c.mainFlowId,
              isSign: this.isSign({bodyContractYyj: 'second_yjl_xs_01_contractStatus'}, c)
            })),
          this.jsonTransForm(c.second_yjl_xs_03_contract)
            .map((d: any) => ({
              ...d,
              yyjTableName: 'second_yjl_xs_03_contract',
              mainFlowId: c.mainFlowId,
              isSign: this.isSign({bodyContractYyj: 'second_yjl_xs_03_contractStatus'}, c)
            })),
          this.jsonTransForm(c.second_yjl_xs_07_contract)
            .map((d: any) => ({
              ...d,
              yyjTableName: 'second_yjl_xs_07_contract',
              mainFlowId: c.mainFlowId,
              isSign: this.isSign({bodyContractYyj: 'second_yjl_xs_07_contractStatus'}, c)
            })),
        ];
      })
      .reduce((p: any[], c: any[]) => {
        return Array.prototype.concat.apply(p, c);
      }, [])
      .filter((c: any) => !c.isSign)
      .map((c: any) => {
        return {
          ...c,
          caSignType: SignTypeEnum.bjcaSignType,
          isNoSignTitle: false,
          readonly: false,
        };
      });
  }

  /**
   *  打开签署弹框
   */
  signContract(contracts: any[]) {
    contracts.forEach(element => {
      if (!element.config) {
        element.config = {
          text: ''
        };
      }
    });
    contracts.forEach(x => {
      if (x.label === '应收账款转让合同') {
        x.config.text = '保理商(盖章)';
      } else if (x.label === '应收账款转让登记协议') {
        x.config.text = '乙方公章';
      } else {
        x.config.text = '（盖章）';
      }
    });
    XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonFinancingContractModalComponent, contracts)
      .subscribe(x => {
        if (x === 'ok') {
          this.onPage({page: this.paging});
        }
      });
  }
}
