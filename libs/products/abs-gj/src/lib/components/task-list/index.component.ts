/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\abs-gj\src\lib\components\task-list\index.component.ts
 * @summary：index.component.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-11-23
 ***************************************************************************/

import { XnModalUtils } from '../../../../../../shared/src/lib/common/xn-modal-utils';
import { PublicCommunicateService } from '../../../../../../shared/src/lib/services/public-communicate.service';
import { FlowId, PageTypes, ProxyTypeEnum, SortType } from '../../../../../../shared/src/lib/config/enum';
import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import CommUtils from '../../../../../../shared/src/lib/public/component/comm-utils';
import DragonCommBase from '../../../../../../shared/src/lib/public/component/comm-dragon-base';
import { XnService } from '../../../../../../shared/src/lib/services/xn.service';
import { IToDoConfig } from '../../pages/home-task/home-task.config';
import { XnUtils } from '../../../../../../shared/src/lib/common/xn-utils';
import {
  FileViewModalComponent
} from '../../../../../../shared/src/lib/public/dragon-vanke/modal/file-view-modal.component';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { IPageConfig } from '../../interfaces';
import { ToolKitService } from '../../services/tool-kit.service';

@Component({
  selector: 'lib-todo-list-gj',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
})
export class GjTodoListComponent implements OnInit {
  @Input() supers: IToDoConfig;

  rows: any[] = [];
  sorting = '';
  naming = '';
  heads: any[];
  base: any;
  showBtn: false;

  /** 数据总数 */
  total = 0;
  /** 查询条件 */
  searchModel: any = {};
  showFields: FormlyFieldConfig[];
  /** 页码配置 */
  pageConfig: IPageConfig = {pageSize: 10, page: 1, first: 0, total: 0};
  /** 页面类型 */
  type: PageTypes = PageTypes.List;

  constructor(
    public xn: XnService,
    public vcr: ViewContainerRef,
    public route: ActivatedRoute,
    public communicateService: PublicCommunicateService,
    public toolKitSrv: ToolKitService,
  ) {}

  ngOnInit() {
    this.base = new DragonCommBase(this, this.supers);
    this.showFields = this.supers.fieldConfig;
    this.heads = CommUtils.getListFields(this.supers.heads);
    setTimeout(() => {
      this.onPage();
    });
  }

  /** 搜索条件查询 */
  onSearch(data: any) {
    this.searchModel = data;
    this.pageConfig.page = 1;
    this.pageConfig.first = 0;
    this.onPage(this.pageConfig);
  }

  /** 重置搜索项表单 */
  onReset() {
    this.onSearch({});
  }

  onPage(pageConfig: IPageConfig = {pageSize: 10, page: 1, first: 0}) {
    this.pageConfig = Object.assign(this.pageConfig, pageConfig);

    // 后退按钮的处理
    this.onUrlData();
    const params = this.buildParams();

    this.base.onList(params);
    this.pageConfig.total = this.total;
  }

  /** 排序 */
  public onSort(sort: string): void {
    if (this.sorting === sort) {
      this.naming = this.naming === SortType.DESC ? SortType.ASC : SortType.DESC;
    } else {
      this.sorting = sort;
      this.naming = SortType.ASC;
    }
    this.onPage();
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

  public onBtnShow(btn, row): boolean {
    return btn.can(this, row);
  }

  public onBtnEdit(btn, row): boolean {
    return btn.edit(row, this.xn);
  }

  /**
   *  查看处理流程
   * @param record  流程记录信息
   */
  public doProcess(record: any) {
    this.toolKitSrv.doProcess(record, this.xn);
  }

  /**
   *  查看文件信息
   * @param paramFile any
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
      start: this.pageConfig.first,
      length: this.pageConfig.pageSize,
      productIdent: this.supers.productIdent,
      isPerson: this.supers.isPerson ? true : undefined,
    };
    // 排序处理
    if (this.sorting && this.naming) {
      params.order = [this.sorting + ' ' + this.naming];
    }

    // 搜索处理
    for (const key of Object.keys(this.searchModel)) {
      if (!XnUtils.isEmpty(this.searchModel[key])) {
        params[key] = this.searchModel[key];
      }
    }

    return params;
  }

  /**
   *  跳转回退
   * @param data any
   */
  private onUrlData(data?) {
    const urlData = this.xn.user.getUrlData(this.xn.router.url);
    if (urlData && urlData.pop) {
      this.pageConfig = urlData.data.pageConfig || this.pageConfig;
      this.sorting = urlData.data.sorting || this.sorting;
      this.naming = urlData.data.naming || this.naming;
    } else {
      this.xn.user.setUrlData(this.xn.router.url, {
        pageConfig: this.pageConfig,
        sorting: this.sorting,
        naming: this.naming,
      });
    }
  }
}
