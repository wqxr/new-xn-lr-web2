/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：home-comm-list.component.ts
 * @summary：控制台首页 [代办，系统消息，备付列表]
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          增加功能1         2019-05-15
 * **********************************************************************
 */

import {
  Component,
  OnInit,
  ViewContainerRef,
  Input,
  EventEmitter,
  Output,
} from '@angular/core';
import { XnService } from '../../services/xn.service';
import { ActivatedRoute } from '@angular/router';
import CommUtils from './comm-utils';
import CommBase from './comm-base';
import { XnFormUtils } from '../../common/xn-form-utils';
import { FormGroup } from '@angular/forms';
import { XnUtils } from '../../common/xn-utils';
import { CommonPage, PageTypes } from './comm-page';
import { XnModalUtils } from '../../common/xn-modal-utils';
import { PdfSignModalComponent } from '../modal/pdf-sign-modal.component';
import { PublicCommunicateService } from '../../services/public-communicate.service';
import DragonCommBase from './comm-dragon-base';
import { HwModeService } from '../../services/hw-mode.service';
import { AvengerPdfSignModalComponent } from 'libs/shared/src/lib/public/avenger/modal/pdf-sign-modal.component';
import { EditModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/edit-modal.component';
import {
  applyFactoringTtype,
  HeadquartersTypeEnum,
} from '../../config/select-options';
import NoticeCommBase from 'libs/products/home/src/lib/pages/angency-todolist/comm-notice-base';
import { FileViewModalComponent } from '../modal/file-view-modal.component';
import { DragonPdfSignModalComponent } from '../dragon-vanke/modal/pdf-sign-modal.component';
import { IsProxyDef, ProxyTypeEnum } from '../../config/enum';

/**
 *  首页列表
 */
@Component({
  selector: 'xn-home-comm-list-component',
  templateUrl: './home-comm-list.component.html',
  styleUrls: ['./home-comm-list.component.css'],
})
export class HomeCommListComponent extends CommonPage implements OnInit {
  @Input() supers: any;
  total = 0;
  // pageSize = 10;
  // first = 0;
  rows: any[] = [];
  words = '';
  sorting = ''; // 共享该变量
  naming = ''; // 共享该变量
  // paging = 0; // 共享该变量
  beginTime: any;
  endTime: any;
  // arrObjs = {} as any; // 缓存后退的变量

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
  public mask = '切换至已读列表';

  constructor(
    public xn: XnService,
    public vcr: ViewContainerRef,
    public route: ActivatedRoute,
    public communicateService: PublicCommunicateService,
    public hwModeService: HwModeService
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
      this.supers.value === 'VankeTodo' ||
      this.supers.value === 'TodoAngency' ||
      this.supers.value === 'countryGradenTodo'
    ) {
      this.base = new DragonCommBase(this, this.superConfig);
    } else if (this.supers.value === 'orgNoticeToDo') {
      this.base = new NoticeCommBase(this, this.superConfig);
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
    if (this.supers.value === 'sysMsg') {
      this.mask === '切换至已读列表'
        ? (params.status = 0)
        : (params.status = 1);
      this.mask === '切换至未读列表'
        ? (this.base.superConfig.showName = '已读消息')
        : (this.base.superConfig.showName = '未读消息');
    }
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
    btn.click(this.base, row, this.xn, this.vcr);
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
    this.xn.router.navigate([`console/main-list/detail/${paramMainFlowId}`]);
  }

  /**
   *  查看处理流程
   * @param record  流程记录信息
   */
  public doProcess(record: any) {
    if (this.xn.router.url.indexOf('xnvanke') >= 0) {
      record.factoringAppId = applyFactoringTtype['深圳市香纳商业保理有限公司'];
      record.isProxy = IsProxyDef.VANKE_ABS;
      record.proxyType = ProxyTypeEnum.XNVANKE;
    }

    if (record.flowId === '') {
      // 查看提醒
      this.xn.router.navigate([`console/view-remind`]);
    } else if (record.flowId === 'vanke_abs_step_platform_verify_operate') {
      // router to FileClassification 前往文件分类
      console.log('文件分类节点数据', record);
      this.xn.router.navigate([
        `/logan/record/file-classification/${record.mainFlowId}`,
      ]);
    } else if (record.flowId === 'sub_bgy_check_fail') {
      // 碧桂园发起审核失败流程
      record.proxyType = ProxyTypeEnum.COUNTRY_GRADEN;
      XnUtils.doProcess(record, this.xn);
    } else {
      XnUtils.doProcess(record, this.xn);
    }
  }

  /**
   * 系统消息读取
   * @param btn
   * @param base
   * @param rows
   */
  public onRead(btn, base, rows) {
    btn.title === '切换至未读列表'
      ? (btn.title = '切换至已读列表')
      : (btn.title = '切换至未读列表');
    btn.title === '切换至未读列表'
      ? (this.base.superConfig.showName = '已读消息')
      : (this.base.superConfig.showName = '未读消息');
    this.mask = btn.title;
    this.onPage(this.pageInfo.paging);
    /*const ids = this.rows.filter(item => item.status === 0).map(item => item.systemMessageId);
    if (ids.length === 0) {
        return;
    }

    this.xn.api.post('/message/read_msg', {
        systemMessageIds: ids
    }).subscribe(() => {
        // 刷新页面
        this.onPage(this.pageInfo.paging);
    });*/
  }

  /**
   * 查看合同
   * @param paramContract
   * @param row
   */
  public viewContract(mainFlowIds: string, paramContract, row) {
    if (
      mainFlowIds.endsWith('lg') ||
      mainFlowIds.endsWith('wk') ||
      mainFlowIds.endsWith('sh') ||
      mainFlowIds.endsWith('oct')
    ) {
      this.modal = AvengerPdfSignModalComponent;
    } else if (mainFlowIds[0].endsWith('cg')) {
      this.modal = AvengerPdfSignModalComponent;
    } else if (
      mainFlowIds.endsWith('bgy') ||
      mainFlowIds.endsWith('jd') ||
      mainFlowIds.endsWith('yjl') ||
      mainFlowIds.endsWith('hz')
    ) {
      this.modal = DragonPdfSignModalComponent;
    } else {
      this.modal = PdfSignModalComponent;
    }

    XnModalUtils.openInViewContainer(this.xn, this.vcr, this.modal, {
      ...paramContract,
      readonly: true,
    }).subscribe(() => {
      if (row.status !== 1) {
        this.xn.api
          .post('/message/read_msg', {
            systemMessageIds: [row.systemMessageId],
          })
          .subscribe(() => {
            // 更新状态
            row.status = 1;
            this.onPage({ page: this.pageInfo.paging });
          });
      }
    });
  }
  viewDetail(paramItrem) {
    const checkers = [
      {
        title: '标题',
        checkerId: 'title',
        type: 'text-area',
        value: paramItrem.msgType,
        options: { readonly: true, inputMaxLength: 255 },
        required: 1,
      },
      {
        title: '内容',
        checkerId: 'content',
        type: 'text-area',
        value: JSON.parse(paramItrem.msg).message,
        options: { readonly: true, inputMaxLength: 1000 },
        required: 0,
      },
    ];
    const params = {
      checker: checkers,
      title: '查看记录',
      buttons: ['取消'],
    };
    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      EditModalComponent,
      params
    ).subscribe((v) => {
      if (paramItrem.status !== 1) {
        this.xn.api
          .post('/message/read_msg', {
            systemMessageIds: [paramItrem.systemMessageId],
          })
          .subscribe(() => {
            // 更新状态
            paramItrem.status = 1;
          });
      }
    });
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
      if (this.supers.value === 'orgNoticeToDo') {
        // 中介机构-提醒待办查询过滤
        for (const search of this.searches) {
          if (!XnUtils.isEmpty(this.pageInfo.arrObjs[search.checkerId])) {
            params[search.checkerId] = this.pageInfo.arrObjs[search.checkerId];
          }
        }
        return params;
      }
      if (
        this.supers.value === 'dragonTodo' ||
        this.supers.value === 'VankeTodo' ||
        this.supers.value === 'TodoAngency' ||
        this.supers.value === 'certifytodo'
      ) {
        for (const search of this.searches) {
          if (!XnUtils.isEmpty(this.pageInfo.arrObjs[search.checkerId])) {
            params[search.checkerId] = this.pageInfo.arrObjs[search.checkerId];
          }
        }
      } else {
        if (!$.isEmptyObject(this.pageInfo.arrObjs)) {
          params.where = {
            _complex: {
              _logic: 'AND', // 搜索时是AND查询
            },
          };
        }
        if (this.supers.value === 'todoAgile') {
          // 保理通-雅居乐待办列表
          params.where = {
            channel: HeadquartersTypeEnum[6],
            _complex: {
              _logic: 'AND', // 搜索时是AND查询
            },
          };
        }
        if (this.supers.value === 'todoGemdale') {
          // 保理通-金地待办列表
          params.where = {
            channel: HeadquartersTypeEnum[2],
            _complex: {
              _logic: 'AND', // 搜索时是AND查询
            },
          };
        }
        for (const search of this.searches) {
          if (!XnUtils.isEmpty(this.pageInfo.arrObjs[search.checkerId])) {
            if (search.type && search.type === 'select') {
              params.where._complex[search.checkerId] =
                this.pageInfo.arrObjs[search.checkerId];
            } else if (search.checkerId === 'contractAmount') {
              params.where._complex[search.checkerId] = String(
                this.pageInfo.arrObjs[search.checkerId]
              ).replace(/[\,]/, '');
            } else if (search.checkerId === 'reviewType') {
              params.where._complex[search.checkerId] =
                this.pageInfo.arrObjs[search.checkerId].toString();
            } else {
              params.where._complex[search.checkerId] = [
                'like',
                `%${this.pageInfo.arrObjs[search.checkerId]}%`,
              ];
            }
          }
        }
      }
    }
    // 产品标识,产品id或者待办类别
    params.productIdent = this.superConfig?.productIdent;
    // isPerson: 区分是否是个人待办的标识
    params.isPerson = this.superConfig?.isPerson ? this.superConfig.isPerson : undefined

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
      // if(obj.selectOptions.length)
      // obj.selectOptions = searches[i].selectOptions;
      // console.log('selectOptions==>', obj.selectOptions)
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
}
