/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\vanke\src\lib\pages\vanke-home-comm-list\home-comm-list.component.ts
 * @summary：万科待办列表页面
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                 hucongying          init           2021-08-24
 ***************************************************************************/

import {
  Component,
  OnInit,
  ViewContainerRef,
  Input,
  EventEmitter,
  Output,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  CommonPage,
  PageTypes,
} from 'libs/shared/src/lib/public/component/comm-page';
import { FormGroup } from '@angular/forms';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { PublicCommunicateService } from 'libs/shared/src/lib/services/public-communicate.service';
import DragonCommBase from 'libs/shared/src/lib/public/component/comm-dragon-base';
import CommBase from 'libs/shared/src/lib/public/component/comm-base';
import CommUtils from 'libs/shared/src/lib/public/component/comm-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { FileViewModalComponent } from 'libs/shared/src/lib/public/modal/file-view-modal.component';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { VankeDataSourceEnum, ViewButtonType } from 'libs/shared/src/lib/config/enum';
import { PointService } from 'libs/shared/src/lib/services/point.service';
declare const $: any;

/**
 *  万科首页列表
 */
@Component({
  selector: 'vanke-home-comm-list-component',
  templateUrl: './home-comm-list.component.html',
  styleUrls: ['./home-comm-list.component.css'],
})
export class VankeHomeCommListComponent extends CommonPage implements OnInit {
  @Input() supers: any;
  total = 0;
  rows: any[] = [];
  words = '';
  sorting = ''; // 共享该变量
  naming = ''; // 共享该变量
  beginTime: any;
  endTime: any;

  heads: any[];
  searches: any[];
  shows: any[];
  base: any;
  mainForm: FormGroup;
  timeId = [];
  tolerance = [];
  nowTimeCheckId = '';
  searchArr = [];
  showBtn: false;
  pageInfo: any; // 表格
  superConfig: any;
  tab = '';
  preChangeTime: any[] = [];
  public supplierOperateAppId: any;
  displayShow = true;
  modal: any;

  constructor(
    public xn: XnService,
    public vcr: ViewContainerRef,
    public route: ActivatedRoute,
    public communicateService: PublicCommunicateService,
    public hwModeService: HwModeService,
    private pointService: PointService
  ) {
    super(PageTypes.List);
  }

  ngOnInit() {
    this.superConfig = this.supers.label;
    this.tab =
      this.supers.value === 'VankeTodo' ? 'dragonTodo' : this.supers.value; // 具体列表项
    this.pageInfo = this.superConfig.list[this.tab];
    if (
      this.supers.value === 'dragonTodo' ||
      this.supers.value === 'VankeTodo'
    ) {
      this.base = new DragonCommBase(this, this.superConfig);
    } else {
      this.base = new CommBase(this, this.superConfig);
    }
    this.heads = CommUtils.getListFields(this.superConfig.fields);
    this.searches = CommUtils.getSearchFields(this.superConfig.fields);
    this.buildShow(this.searches);
    setTimeout(() => {
      this.onPage({ page: this.pageInfo.paging });
    });
  }

  /**
   *  @param event
   *       event.page: 新页码
   *       event.pageSize: 页面显示行数
   *       event.first: 新页面之前的总行数,下一页开始下标
   *       event.pageCount : 页码总数
   */
  public onPage(event: any): void {
    this.pageInfo.paging = event.page || 1;
    this.pageInfo.pageSize = event.pageSize || this.pageInfo.pageSize;
    // 后退按钮的处理
    this.onUrlData();
    this.pageInfo.first = (this.pageInfo.paging - 1) * this.pageInfo.pageSize;
    const params = this.buildParams();
    this.base.onList(params);
  }

  /**
   *  排序
   * @param sort
   */
  public onSort(sort: string): void {
    // 如果已经点击过了，就切换asc 和 desc
    if (this.sorting === sort) {
      this.naming = this.naming === 'desc' ? 'asc' : 'desc';
    } else {
      this.sorting = sort;
      this.naming = 'asc';
    }

    this.onPage(this.pageInfo.paging);
  }

  public onSortClass(checkerId: string): string {
    if (checkerId === this.sorting) {
      return 'sorting_' + this.naming;
    } else {
      return 'sorting';
    }
  }

  public onTextClass(type) {
    if (type === 'money') {
      return 'text-right';
    } else if (type === 'list-title') {
      return 'list-title';
    } else if (type === 'long-title') {
      return 'long-title';
    } else {
      return '';
    }
  }

  public onSearch(): void {
    this.pageInfo.paging = 1;
    this.onPage(this.pageInfo.paging);
  }

  public onBtnShow(btn, row): boolean {
    return btn.can(this, row);
  }

  public onBtnEdit(btn, row): boolean {
    return btn.edit(row, this.xn);
  }

  public onBtnClick(btn, row): void {
    this.doProcess(row);
    // btn.click(this.base, row, this.xn, this.vcr);
  }

  public onCssClass(status) {
    return status === 1 ? 'active' : '';
  }

  public onBtnClickEvent(btn, row, event): void {
    btn.click(this, row, event, this.xn);
  }

  /**
   *  清空搜索内容
   */
  public clearSearch() {
    for (const key in this.pageInfo.arrObjs) {
      if (this.pageInfo.arrObjs.hasOwnProperty(key)) {
        delete this.pageInfo.arrObjs[key];
      }
    }

    this.buildCondition(this.searches);
    this.onSearch(); // 清空之后自动调一次search
  }

  /**
   * 查看交易流程
   * @param paramMainFlowId
   */
  public viewProcess(paramMainFlowId: string) {
    this.xn.router.navigate([`vanke/main-list/detail/${paramMainFlowId}`]);
  }

  /**
   *  查看处理流程
   * @param record  流程记录信息
   */
  public doProcess(record: any) {
    console.log('doProcess record', record)
    // 埋点-统计上传资料初审点击次数
    if (['vanke_financing', 'vanke_abs_step_financing'].includes(record.flowId) && record.nowProcedureId === 'operate') {
      this.pointService.setPoint({itemName: ViewButtonType.UploadDataOperate, mainFlowId: record.mainFlowId})
    }
    // 埋点-统计签署合同初审点击次数
    if (['vanke_financing_sign', 'vanke_abs_step_financing_sign'].includes(record.flowId) && record.nowProcedureId === 'operate') {
      this.pointService.setPoint({itemName: ViewButtonType.SignContractOperate, mainFlowId: record.mainFlowId})
    }
    // 流程已完成 或者账号没有权限查看流程
    if (
      (record.status !== 1 && record.status !== 0) ||
      !XnUtils.getRoleExist(
        record.nowRoleId,
        this.xn.user.roles,
        record.proxyType
      )
    ) {
      if (record.proxyType === undefined) {
        this.xn.router.navigate([
          `/console/record/todo/view/${record.recordId}`,
        ]);
      } else {
        this.xn.router.navigate([
          ViewFlowSetEnum[record.proxyType] + record.recordId,
        ]);
      }
    } else {
      if (
        record.flowId === 'financing7' ||
        record.flowId === 'financing_bank7' ||
        record.flowId.indexOf('financing_factoring7') >= 0 ||
        record.flowId.indexOf('financing_supplier7') >= 0
      ) {
        // 银行流程（保证付款 + 商品融资）
        this.xn.router.navigate([
          `/console/bank/record/todo/edit/${record.recordId}`,
        ]);
      } else {
        if (record.proxyType === undefined) {
          this.xn.router.navigate([
            `/console/record/todo/view/${record.recordId}`,
          ]);
        } else {
          if (record.flowId === 'sub_dragon_book_change') {
            // 台账修改预录入
            this.xn.router.navigate([
              '/machine-account/record/sub_dragon_book_change/edit/' +
                record.recordId,
            ]);
          } else if (
            record.flowId === 'sub_bank_push_supplier_sign' ||
            record.flowId === 'sub_bank_push_platform_sign' ||
            record.flowId === 'sub_bank_platform_add_file' ||
            record.flowId === 'sub_bank_platform_change_file'
          ) {
            this.xn.router.navigate([
              '/console/bank-puhuitong/record/edit/' + record.recordId,
            ]);
          } else {
            // 此处跳转至set中对应的id值的路由path
            this.xn.router.navigate([
              EditFlowSetEnum[record.proxyType] + record.recordId,
            ]);
          }
        }
      }
    }
  }

  /**
   *  查看文件信息
   * @param paramFile
   */
  public viewFiles(paramFile) {
    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      FileViewModalComponent,
      JSON.parse(paramFile)
    ).subscribe();
  }
  /**
   *  构建查询参数
   */
  private buildParams() {
    // 分页处理
    const params: any = {
      start: (this.pageInfo.paging - 1) * this.pageInfo.pageSize,
      length: this.pageInfo.pageSize,
      beginTime: this.beginTime,
      endTime: this.endTime,
    };
    // 排序处理
    if (this.sorting && this.naming) {
      params.order = [this.sorting + ' ' + this.naming];
    }

    // 搜索处理
    if (this.searches.length > 0) {
      for (const search of this.searches) {
        if (!XnUtils.isEmpty(this.pageInfo.arrObjs[search.checkerId])) {
          params[search.checkerId] = this.pageInfo.arrObjs[search.checkerId];
        }
      }
    }

    // 产品标识,产品id或者待办类别
    params.productIdent = this.superConfig?.productIdent;
    // isPerson: 区分是否是个人待办的标识
    params.isPerson = this.superConfig?.isPerson
      ? this.superConfig.isPerson
      : undefined;

    return params;
  }

  private buildShow(searches) {
    this.shows = [];
    this.onUrlData();
    this.buildCondition(searches);
  }

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
      if (!(searches[i].selectOptions instanceof Array)) {
        obj.options = { ref: searches[i].selectOptions };
      } else {
        obj.selectOptions = searches[i].selectOptions;
      }

      if (searches[i].checkerId === this.timeId[0]) {
        obj.value = JSON.stringify(tmpTime);
      } else {
        obj.value = this.pageInfo.arrObjs[searches[i].checkerId];
      }
      objList.push(obj);
    }

    this.shows = $.extend(
      true,
      [],
      objList.sort(function (a, b) {
        return a.number - b.number;
      })
    ); // 深拷贝;
    XnFormUtils.buildSelectOptions(this.shows);
    this.buildChecker(this.shows);
    this.mainForm = XnFormUtils.buildFormGroup(this.shows);
    const time = this.searches.filter((v) => v.type === 'quantum');
    this.tolerance = $.extend(
      true,
      [],
      this.searches
        .filter((v) => v.type === 'tolerance')
        .map((v) => v.checkerId)
    );

    const forSearch = this.searches
      .filter((v) => v.type !== 'quantum')
      .map((v) => v && v.checkerId);
    this.searchArr = $.extend(true, [], forSearch); // 深拷贝;
    const timeCheckId = time[0] && time[0].checkerId;
    this.nowTimeCheckId = timeCheckId;

    this.mainForm.valueChanges.subscribe((v) => {
      const changeId = v[timeCheckId];
      delete v[timeCheckId];
      if (changeId !== '' && this.nowTimeCheckId) {
        const paramsTime = JSON.parse(changeId);
        const beginTime = paramsTime.beginTime;
        const endTime = paramsTime.endTime;

        // 保存每次的时间值。
        this.preChangeTime.unshift({ begin: beginTime, end: endTime });
        console.log('选择时间段', this.preChangeTime);
        // 默认创建时间
        this.beginTime = beginTime;
        this.endTime = endTime;
        if (this.preChangeTime.length > 1) {
          if (
            this.preChangeTime[1].begin === this.beginTime &&
            this.preChangeTime[1].end === this.endTime
          ) {
            // nothing
          } else {
            this.pageInfo.paging = 1;
            this.pageInfo.first =
              (this.pageInfo.paging - 1) * this.pageInfo.pageSize;
            this.rows.splice(0, this.rows.length);
            const params = this.buildParams();
            this.base.onList(params);
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
      this.pageInfo.arrObjs = $.extend(true, {}, arrObj); // 深拷贝;要进行搜索的变量
      this.onUrlData();
    });
  }

  private buildChecker(stepRows) {
    for (const row of stepRows) {
      XnFormUtils.convertChecker(row);
    }
  }

  /**
   *  跳转回退
   * @param data
   */
  private onUrlData(data?) {
    const urlData = this.xn.user.getUrlData(this.xn.router.url);
    if (urlData && urlData.pop) {
      this.pageInfo.paging =
        (urlData.data[`pageInfo_${this.tab}`] &&
          urlData.data[`pageInfo_${this.tab}`].paging) ||
        this.pageInfo.paging;
      this.pageInfo.pageSize =
        (urlData.data[`pageInfo_${this.tab}`] &&
          urlData.data[`pageInfo_${this.tab}`].pageSize) ||
        this.pageInfo.pageSize;
      this.sorting = urlData.data.sorting || this.sorting;
      this.naming = urlData.data.naming || this.naming;
      this.words = urlData.data.words || this.words;
      this.beginTime = urlData.data.beginTime || this.beginTime;
      this.endTime = urlData.data.endTime || this.endTime;
      this.pageInfo.arrObjs =
        (urlData.data[`pageInfo_${this.tab}`] &&
          urlData.data[`pageInfo_${this.tab}`].arrObjs) ||
        this.pageInfo.arrObjs;
    } else {
      this.xn.user.setUrlData(this.xn.router.url, {
        pageInfo_todo: this.superConfig.list.todo,
        pageInfo_sysMsg: this.superConfig.list.sysMsg,
        pageInfo_payMsg: this.superConfig.list.payMsg,
        pageInfo_avengerTodo: this.superConfig.list.avengerTodo,
        sorting: this.sorting,
        naming: this.naming,
        words: this.words,
        beginTime: this.beginTime,
        endTime: this.endTime,
      });
    }
  }
  show() {
    this.displayShow = !this.displayShow;
  }

  /**
   * 万科提单数据源判断
   * @param rowData 行数据
   * @returns
   */
  isOnLineData(rowData: any) {
    return rowData?.wkType === VankeDataSourceEnum.ON_LINE;
  }
}

/** 编辑流程路由跳转枚举 */
export enum EditFlowSetEnum {
  /** 老流程 */
  '/console/record/todo/edit/' = 0,
  /** 老流程 */
  '/console/record/avenger/todo/edit/' = 1,
  /** 万科流程 */
  '/vanke/record/todo/edit/' = 2,
}

/** 查看流程路由跳转枚举 */
export enum ViewFlowSetEnum {
  /** 老流程 */
  '/console/record/todo/view/' = 0,
  /** 老流程 */
  '/console/record/avenger/todo/view/' = 1,
  /** 万科流程 */
  '/vanke/record/todo/view/' = 2,
}
