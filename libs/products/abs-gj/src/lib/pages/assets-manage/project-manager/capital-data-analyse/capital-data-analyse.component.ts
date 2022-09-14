/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\abs-gj\src\lib\pages\assets-manage\project-manager\capital-data-analyse\capital-data-analyse.component.ts
 * @summary：capital-data-analyse.component.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-12-15
 ***************************************************************************/
import XnFlowUtils from '../../../../../../../../shared/src/lib/common/xn-flow-utils';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewContainerRef
} from '@angular/core';
import { debounceTime } from 'rxjs/operators';
import { fromEvent, Subscription } from 'rxjs';
import { XnFormUtils } from '../../../../../../../../shared/src/lib/common/xn-form-utils';
import { XnService } from '../../../../../../../../shared/src/lib/services/xn.service';
import { HwModeService } from '../../../../../../../../shared/src/lib/services/hw-mode.service';
import { XnUtils } from '../../../../../../../../shared/src/lib/common/xn-utils';
import { SortType } from '../../../../../../../../shared/src/lib/config/enum';
import CapitalDataAnalyseConfig from './capital-data-analyse.config';

declare var $: any;

@Component({
  selector: 'lib-capital-data-analyse-gj',
  templateUrl: './capital-data-analyse.component.html',
  styleUrls: ['./capital-data-analyse.component.css']
})
export class GjCapitalDataAnalyseComponent implements OnInit, OnDestroy {
  public mainForm: FormGroup;  // 表单类
  public rows: any[] = [];  // 表单数据
  public formModule = 'dragon-input';

  public tableListData: any = {}; // 表格数据
  public rowsData: any = {}; // 资产池概况数据

  public tableConfigAll?: any[];  // 表格配置项
  public svrConfig?: any;  // 控件配置项
  public queryParams: any; // 路由数据
  public scroll$: Subscription;  // scroll事件
  public processBarConfig: any;  // 右侧导航配置
  // 分页配置
  public pageConfig = {
    contractTypeList: {
      total: 0,  // 总数据量
      size: 5,  // 每页显示数量
      pageArr: [],
      currentPage: 1, // 当前页码,
      pageSizeOptions: [5, 10, 20, 30, 50, 100]
    },
    receiveList: {
      total: 0,
      size: 5,
      pageArr: [],
      currentPage: 1,
      pageSizeOptions: [5, 10, 20, 30, 50, 100]
    },
    projectAreaList: {
      total: 0,
      size: 5,
      pageArr: [],
      currentPage: 1,
      pageSizeOptions: [5, 10, 20, 30, 50, 100]
    },
    debtUnitAreaList: {
      total: 0,
      size: 5,
      pageArr: [],
      currentPage: 1,
      pageSizeOptions: [5, 10, 20, 30, 50, 100]
    },
    projectBusinessList: {
      total: 0,
      size: 5,
      pageArr: [],
      currentPage: 1,
      pageSizeOptions: [5, 10, 20, 30, 50, 100]
    },
    paymentDaysList: {
      total: 0,
      size: 5,
      pageArr: [],
      currentPage: 1,
      pageSizeOptions: [5, 10, 20, 30, 50, 100]
    },
    debtUnitList: {
      total: 0,
      size: 5,
      pageArr: [],
      currentPage: 1,
      pageSizeOptions: [5, 10, 20, 30, 50, 100]
    },
    projectList: {
      total: 0,
      size: 5,
      pageArr: [],
      currentPage: 1,
      pageSizeOptions: [5, 10, 20, 30, 50, 100]
    },
  };
  private naming = '';  // 共享该变量 列css样式
  private sorting = '';  // 共享该变量 列排序

  Pagination = Pagination;

  constructor(
    private xn: XnService,
    private vcr: ViewContainerRef,
    private cdr: ChangeDetectorRef,
    private router: ActivatedRoute,
    public hwModeService: HwModeService
  ) {}

  ngOnInit() {
    this.router.queryParams.subscribe(params => {
      if (XnUtils.isEmptyObject(params)) {
        return;
      }
      this.queryParams = {...params};
      this.doShow();
    });
    // 监听页面滚动条事件
    this.scroll$ = fromEvent($('xn-content-body'), 'scroll')
      .pipe(debounceTime(200))
      .subscribe(() => {
        this.windowScroll();
      });
  }

  // 在组件生命周期销毁里取消事件，防止出现页面多次执行之后卡顿
  ngOnDestroy() {
    if (this.scroll$) {
      this.scroll$.unsubscribe();
    }
  }

  /**
   * 处理数据
   */
  private doShow() {
    const params = {
      capitalPoolId: this.queryParams.capitalPoolId,
    };
    this.xn.loading.open();
    this.xn.dragon.post('/sample/pool_report', params).subscribe(json => {
      this.xn.loading.close();
      if (json && json.ret === 0 && json.data) {
        // 基础资产池概况
        const {
                capitalPoolName,
                receiveSum,
                count,
                projectCount,
                debtUnitCount,
                receiveMin,
                receiveMax,
                paymentDaysAverage,
                ...tableList
              } = json.data;
        this.rowsData = {
          capitalPoolName,
          receiveSum,
          count,
          projectCount,
          debtUnitCount,
          receiveMin,
          receiveMax,
          paymentDaysAverage
        };
        this.tableListData = tableList;
        this.buildRows();
        // 表格信息
        this.buildTable();
      }
    });

    // 右侧导航栏配置
    this.processBarConfig = CapitalDataAnalyseConfig.barConfig;
  }

  /**
   *  根据配置渲染form
   */
  private buildRows(): void {
    const config = CapitalDataAnalyseConfig.setRowsValue(this.rowsData);
    config.params = this.queryParams;
    this.svrConfig = XnFlowUtils.handleSvrConfig(config);
    this.rows = this.svrConfig.checkers;
    this.rows.forEach(x => {
      if (['receiveSum', 'receiveMin', 'receiveMax'].includes(x.checkerId)) { x.value = XnUtils.formatMoney(x.value); }
    });
    this.mainForm = XnFormUtils.buildFormGroup(this.rows);
  }

  /**
   *  根据配置渲染table
   */
  private buildTable(): void {
    this.tableConfigAll = CapitalDataAnalyseConfig.tableListAll;

    for (const item of Object.keys(this.pageConfig)) {
      this.onPage(item);
    }
  }

  onRppChange(item: any, arr: number, text: string) {
    item.size = arr;
    this.onPage(text);
  }

  onSortClass(paramsId) {
    if (paramsId === this.sorting) {
      return 'sorting_' + this.naming;
    } else {
      return 'sorting';
    }
  }

  /**
   *  按当前列排序
   */
  public onSort(paramId, paramData) {
    this.sorting = paramId;
    this.naming = this.naming === SortType.DESC ? SortType.ASC : SortType.DESC;
    if (this.naming === SortType.ASC) {
      paramData.sort((a, b) => {
        if (a.surplusRate) {
          return a.surplusRate - b.surplusRate;
        } else {
          return a.countRate - b.countRate;
        }
      });
    } else {
      paramData.sort((a, b) => {
        if (a.surplusRate) {
          return b.surplusRate - a.surplusRate;
        } else {
          return b.countRate - a.countRate;
        }
      });
    }
    this.cdr.markForCheck();
  }

  /**
   * 描点点击事件
   */
  public onNavClick(nav: { id: string, value: string, divCss: string, aCss: string }, event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.setCss(nav.id);
    document.getElementById(nav.id).scrollIntoView({behavior: 'smooth', block: 'start', inline: 'start'});
  }

  /**
   * 监测页面滚动监听事件
   * $(...).offset().top 获取要定位元素距离浏览器顶部的距离
   */
  public windowScroll() {
    const allScrollTop = [];
    this.processBarConfig.forEach((item) => {
      allScrollTop.push({
        top: $(`#${item.id}`).offset().top,
        id: item.id
      });
    });
    // 升序排序
    allScrollTop.sort((a, b) => a.top - b.top);
    // 过滤出top为正的数据
    const positiveScrollTop = allScrollTop.filter((x) => x.top >= 48);
    const id = positiveScrollTop[0] ? positiveScrollTop[0].id : '';
    this.setCss(id);
  }

  /**
   * 设置导航样式
   */
  public setCss(targetId: string) {
    this.processBarConfig.forEach((obj) => {
      if (obj.id === targetId) {
        obj.divCss = true;
        obj.aCss = true;
      } else {
        obj.divCss = false;
        obj.aCss = false;
      }
    });
  }

  /**
   * 下载分析结果-可将本页数据以 excel形式下载到本地，每个列表一个sheet
   */
  public onDownload() {
    this.xn.loading.open();
    this.xn.dragon.download('/sample/download_pool_report', {capitalPoolId: this.queryParams.capitalPoolId})
      .subscribe((v: any) => {
        this.xn.loading.close();
        this.xn.dragon.save(v._body, '分析结果.xlsx');
      }, () => {
        this.xn.loading.close();
      });
  }

  /**
   * 返回到基础资产列表
   */
  public onGoBack() {
    this.onCancel();
  }

  /**
   *  取消并返回
   */
  public onCancel() {
    this.xn.router.navigate(['/abs-gj/assets-management/capital-pool'], {
      queryParams: {
        ...this.queryParams
      }
    });
  }

  /**
   * 首页
   * @param checkerId 表格标识
   */
  public firstPage(checkerId: string) {
    this.pageConfig[checkerId].currentPage = 1;
    this.onPage(checkerId);
  }

  /**
   * 上一页
   * @param checkerId 表格标识
   */
  public previousPage(checkerId: string) {
    if (this.pageConfig[checkerId].pageArr.length < 2 ||
      this.pageConfig[checkerId].currentPage === this.pageConfig[checkerId].pageArr[0]) { return; }
    this.pageConfig[checkerId].currentPage = this.pageConfig[checkerId].currentPage - 1;
    this.onPage(checkerId);
  }

  /**
   * 选择页码
   * @param checkerId string
   * @param pages 传入的页码
   */
  public selectPage(checkerId: string, pages: number) {
    this.pageConfig[checkerId].currentPage = pages;
    this.onPage(checkerId);
  }

  /**
   * 判断页码是否已选中
   * @param checkerId string
   * @param pages 传入的页码
   */
  public isPageActive(checkerId: string, pages: number) {
    return this.pageConfig[checkerId].currentPage === pages;
  }

  /**
   * 判断页码是否已选中
   */
  public isPageDisabled(checkerId: string, label: Pagination) {
    if (label === Pagination.First || label === Pagination.Prev) {
      return this.pageConfig[checkerId].currentPage <= 1;
    } else if (label === Pagination.Next || label === Pagination.Last) {
      return this.pageConfig[checkerId].currentPage >= this.pageConfig[checkerId].pageArr.length;
    }
  }

  /**
   * 下一页
   * @param checkerId 表格标识
   */
  public nextPage(checkerId: string) {
    if (this.pageConfig[checkerId].pageArr.length < 2 ||
      this.pageConfig[checkerId].currentPage === this.pageConfig[checkerId].pageArr.slice(-1)[0]) { return; }
    this.pageConfig[checkerId].currentPage = this.pageConfig[checkerId].currentPage + 1;
    this.onPage(checkerId);
  }

  /**
   * 末页
   * @param checkerId 表格标识
   */
  public lastPage(checkerId: string) {
    this.pageConfig[checkerId].currentPage = this.pageConfig[checkerId].pageArr.length;
    this.onPage(checkerId);
  }

  /**
   * 页码改变触发
   * @param checkerId string
   */
  onPage(checkerId: string) {
    const param = {
      start: (this.pageConfig[checkerId].currentPage - 1) * this.pageConfig[checkerId].size,
      length: this.pageConfig[checkerId].size,
    };
    const tableList = XnUtils.deepCopy(this.tableListData[checkerId], []);
    this.pageConfig[checkerId].total = this.tableListData[checkerId].length || 0;
    const pageLimit = Math.ceil(this.tableListData[checkerId].length / this.pageConfig[checkerId].size);
    this.pageConfig[checkerId].pageArr = Array.from({length: pageLimit}, (item, index) => index + 1);

    const listObj = {};
    const rateCount = {receiveSum: this.rowsData.receiveSum, count: this.rowsData.count};
    listObj[checkerId] = tableList.slice(param.start, param.start + param.length);
    this.tableConfigAll = CapitalDataAnalyseConfig.setTableValue(listObj, rateCount);
  }
}

enum Pagination {
  /** 首页 */
  First = 'first',
  /** 尾页 */
  Last  = 'last',
  /** 上一页 */
  Prev  = 'prev',
  /** 下一页 */
  Next  = 'next'
}
