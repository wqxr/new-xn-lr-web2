import { Component, OnInit, ViewContainerRef, ElementRef, ChangeDetectorRef, OnDestroy, AfterViewInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import XnFlowUtils from 'libs/shared/src/lib/common/xn-flow-utils';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import BusinessStateConfig from '../../logic/business-state';
import { forkJoin, fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
@Component({
  selector: 'oct-business-state-list',
  templateUrl: './business-state-list.component.html',
  styleUrls: ['./business-state-list.component.css']
})
export class OctBusinessStateListComponent implements OnInit, AfterViewInit, OnDestroy {
  // @Input() inputParams: any;
  public mainForm: FormGroup;  // 表单类
  public rows: any[] = [];  // 表单数据
  public formModule: string = 'dragon-input';

  public tableListData: any = {}; // 表格数据
  public rowsData: any = {}; // 资产池概况数据

  public tableConfigAll?: any[];  // 表格配置项
  public svrConfig?: any;  // 控件配置项
  public queryParams: any; // 路由数据
  public subscribeScoll: any;  // scroll事件
  public processBarConfig: any;  // 右侧导航配置
  public changeDate: number | string = (new Date()).getTime();
  // 分页配置
  public pageConfig = {
    shareholderInfo: {
      total: 0,  // 总数据量
      size: 5,  // 每页显示数量
      pageArr: [], // 总页数数组
      currentPage: 1  // 当前页码
    },
    executedPersonInfo: {
      total: 0,
      size: 5,
      pageArr: [],
      currentPage: 1
    },
    refereeInfo: {
      total: 0,
      size: 5,
      pageArr: [],
      currentPage: 1
    },
    courtAnnounceInfo: {
      total: 0,
      size: 5,
      pageArr: [],
      currentPage: 1
    },
    holdCourtInfo: {
      total: 0,
      size: 5,
      pageArr: [],
      currentPage: 1
    },
    filingInfo: {
      total: 0,
      size: 5,
      pageArr: [],
      currentPage: 1
    },
    abnormalBusinessInfo: {
      total: 0,
      size: 5,
      pageArr: [],
      currentPage: 1
    },
    changeLogs: {
      total: 0,
      size: 5,
      pageArr: [],
      currentPage: 1
    },
  };

  constructor(private xn: XnService, private vcr: ViewContainerRef, private cdr: ChangeDetectorRef,
              private router: ActivatedRoute, private er: ElementRef, public hwModeService: HwModeService) {
  }

  ngOnInit() {
    // this.router.params.subscribe((params: Params) => {
    //   if (XnUtils.isEmptyObject(params)) {
    //     return;
    //   }
    //   this.doShow();
    // });

    this.router.queryParams.subscribe(params => {
      if (XnUtils.isEmptyObject(params)) {
        return;
      }
      this.queryParams = { ...params };
      this.doShow();
    });
    // 若以modal打开则作此操作
    // this.queryParams = { ...this.inputParams };
    // this.doShow();

    // 监听页面滚动条事件
    this.subscribeScoll = fromEvent($('.xn-content-body'), 'scroll')
      .pipe(debounceTime(200)).subscribe((event) => {
        this.WindowScroll(event);
      });
  }

  ngAfterViewInit() {
  }

  // 在组件生命周期销毁里取消事件，防止出现页面多次执行之后卡顿
  ngOnDestroy() {
    if (this.subscribeScoll) {
      this.subscribeScoll.unsubscribe();
    }
  }

  /**
   * 处理数据
   */
  private doShow() {
    // console.log("queryParams", this.queryParams);
    const params = {
      appId: this.queryParams.appId || ''
    };
    const observables = [
      this.xn.dragon.post('/shanghai_bank/sh_company_eciinfo/geteciinfo', params),
      this.xn.dragon.post('/shanghai_bank/sh_company_eciinfo/getShareholderInfo', params),
      this.xn.dragon.post('/shanghai_bank/sh_company_eciinfo/searchZhiXing', params),
      this.xn.dragon.post('/shanghai_bank/sh_company_eciinfo/searchJudgmentDoc', params),
      this.xn.dragon.post('/shanghai_bank/sh_company_eciinfo/searchCourtAnnouncement', params),
      this.xn.dragon.post('/shanghai_bank/sh_company_eciinfo/searchCourtNotice', params),
      this.xn.dragon.post('/shanghai_bank/sh_company_eciinfo/caseFiling', params),
      this.xn.dragon.post('/shanghai_bank/sh_company_eciinfo/exceptionCheck', params),
      this.xn.dragon.post('/shanghai_bank/sh_company_eciinfo/eciChange', params),
    ];
    this.xn.loading.open();
    forkJoin(observables).subscribe(([basicInfoRes, shareholderInfoRes, executedPersonInfoRes, refereeInfoRes, courtAnnounceInfoRes,
      holdCourtInfoRes, filingInfoRes, abnormalBusinessInfoRes, changeLogsRes]) => {
        // this.changeDate = '';
      if (basicInfoRes && basicInfoRes.ret === 0) {
        this.rowsData = { ...basicInfoRes.data};
      }
      this.buildRows();
      this.tableListData = {
        shareholderInfo: shareholderInfoRes && shareholderInfoRes.ret === 0 ? shareholderInfoRes.data : [],
        courtAnnounceInfo: courtAnnounceInfoRes && courtAnnounceInfoRes.ret === 0 ? courtAnnounceInfoRes.data : [],
        abnormalBusinessInfo: abnormalBusinessInfoRes && abnormalBusinessInfoRes.ret === 0 && abnormalBusinessInfoRes.data.Data
        ? abnormalBusinessInfoRes.data.Data : [],
        filingInfo: filingInfoRes && filingInfoRes.ret === 0 ? filingInfoRes.data : [],
        refereeInfo: refereeInfoRes && refereeInfoRes.ret === 0 ? refereeInfoRes.data : [],
        holdCourtInfo: holdCourtInfoRes && holdCourtInfoRes.ret === 0 ? holdCourtInfoRes.data : [],
        changeLogs: changeLogsRes && changeLogsRes.ret === 0 ? changeLogsRes.data : [],
        executedPersonInfo: executedPersonInfoRes && executedPersonInfoRes.ret === 0 ? executedPersonInfoRes.data : [],
      };
      // 表格信息
      this.buildTable();
    }, (err: any) => {
      console.error('error', err);
    }, () => {
      this.xn.loading.close();
    });
    // 右侧导航栏配置
    this.processBarConfig = BusinessStateConfig.barConfig;
  }

  /**
   *  根据配置渲染form
   */
  private buildRows(): void {
    const config = BusinessStateConfig.setRowsValue(this.rowsData);
    // config['params'] = this.queryParams;
    this.svrConfig = XnFlowUtils.handleSvrConfig(config);
    this.rows = this.svrConfig.checkers;
    this.mainForm = XnFormUtils.buildFormGroup(this.rows);
  }

  /**
   *  根据配置渲染table
   */
  private buildTable(): void {
    this.tableConfigAll = BusinessStateConfig.tableListAll;
    this.onPage('shareholderInfo');
    this.onPage('executedPersonInfo');
    this.onPage('refereeInfo');
    this.onPage('courtAnnounceInfo');
    this.onPage('holdCourtInfo');
    this.onPage('filingInfo');
    this.onPage('abnormalBusinessInfo');
    this.onPage('changeLogs');
  }

  /**
   * 描点点击事件
   * @param nav
   * @param e
   * @param index
   */
  public onNavClick(nav: { id: string, value: string, divCss: string, aCss: string }, event: any, index: number) {
    event.preventDefault();
    event.stopPropagation();
    this.setCss(nav.id);
    document.getElementById(nav.id).scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' });
  }

  /**
   * 监测页面滚动监听事件
   * $(...).offset().top 获取要定位元素距离浏览器顶部的距离
   * @param event
   */
  public WindowScroll(event: any) {
    let allScrollTop = [];
    this.processBarConfig.forEach((item) => {
      allScrollTop.push({
        top: $(`#${item.id}`).offset().top,
        id: item.id
      });
    });
    // 升序排序
    allScrollTop.sort((a, b) => a.top - b.top);
    // 过滤出top为正的数据
    let positiveScrollTop = allScrollTop.filter((x) => x.top >= 48);
    let id = positiveScrollTop[0] ? positiveScrollTop[0].id : '';
    this.setCss(id);
  }

  /**
   * 设置导航样式
   * @param targetId
   */
  public setCss(targetId: string) {
    this.processBarConfig.forEach((obj) => {
      if (obj.id === targetId) {
        obj['divCss'] = true;
        obj['aCss'] = true;
      } else {
        obj['divCss'] = false;
        obj['aCss'] = false;
      }
    });
  }

  /**
   * 返回
   * @param event
   */
  public onGoBack(event: any) {
    this.onCancel();
  }

  /**
   *  取消并返回
   */
  public onCancel() {
    this.xn.router.navigate([`/bank-shanghai/record/todo/edit/${this.queryParams.recordId}`]);
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
    if (!this.isPageDisabled(checkerId, 'prev')){
      this.pageConfig[checkerId].currentPage = this.pageConfig[checkerId].currentPage - 1;
      this.onPage(checkerId);
    }
  }

  /**
   * 选择页码
   * @param checkerId
   * @param pages 传入的页码
   */
  public selectPage(checkerId: string, pages: number) {
    this.pageConfig[checkerId].currentPage = pages;
    this.onPage(checkerId);
  }

  /**
   * 判断页码是否已选中
   * @param checkerId
   * @param pages 传入的页码
   */
  public isPageActive(checkerId: string, pages: number) {
    return this.pageConfig[checkerId].currentPage === pages;
  }

  /**
   * 判断页码是否已选中
   * @param checkerId
   * @param label 区分分页按钮
   */
  public isPageDisabled(checkerId: string, label: string) {
    if (label === 'first' || label === 'prev') {
      return this.pageConfig[checkerId].currentPage <= 1;
    } else if (label === 'next' || label === 'last') {
      return this.pageConfig[checkerId].currentPage >= this.pageConfig[checkerId].pageArr.length;
    }
  }

  /**
   * 下一页
   * @param checkerId 表格标识
   */
  public nextPage(checkerId: string) {
    if (!this.isPageDisabled(checkerId, 'next')){
      this.pageConfig[checkerId].currentPage = this.pageConfig[checkerId].currentPage + 1;
      this.onPage(checkerId);
    }
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
   * @param checkerId
   */
  onPage(checkerId: string) {
    let param = {
      start: (this.pageConfig[checkerId].currentPage - 1) * this.pageConfig[checkerId].size,
      length: this.pageConfig[checkerId].size,
    };
    let tableList = this.deepCopy(this.tableListData[checkerId], []);
    this.pageConfig[checkerId].total = this.tableListData[checkerId].length || 0;
    let pageLimit = Math.ceil(this.tableListData[checkerId].length / this.pageConfig[checkerId].size);
    this.pageConfig[checkerId].pageArr = Array.from({ length: pageLimit }, (item, index) => index + 1);

    let listObj = {};
    // let rateCount = { receiveSum: this.rowsData.receiveSum, count: this.rowsData.count };
    listObj[checkerId] = tableList.slice(param.start, param.start + param.length);
    // this.tableConfigAll = BusinessStateConfig.setTableValue(listObj, rateCount);
    this.tableConfigAll = BusinessStateConfig.setTableValue(listObj);
  }

  deepCopy(obj, c?: any) {
    c = c || {};
    for (let i in obj) {
      if (!!obj[i] && typeof obj[i] === 'object') {
        c[i] = obj[i].constructor === Array ? [] : {};
        this.deepCopy(obj[i], c[i]);
      } else {
        c[i] = obj[i];
      }
    }
    return c;
  }

}
