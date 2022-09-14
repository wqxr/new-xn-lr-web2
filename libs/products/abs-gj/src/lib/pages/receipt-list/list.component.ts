/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\abs-gj\src\lib\pages\receipt-list\receipt-list.component.ts
 * @summary：receipt-list.component.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-11-24
 ***************************************************************************/
import { XnModalUtils } from '../../../../../../shared/src/lib/common/xn-modal-utils';
import { CommonPage } from '../../../../../../shared/src/lib/public/component/comm-page';
import {
  DragonFinancingContractModalComponent
} from '../../../../../../shared/src/lib/public/dragon-vanke/modal/dragon-asign-contract.modal';
import {
  ReceiptSignReturnModalComponent
} from '../../../../../../shared/src/lib/public/dragon-vanke/modal/receipt-sign-return-modal.component';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { LoadingService } from '../../../../../../shared/src/lib/services/loading.service';
import { ActivatedRoute } from '@angular/router';
import CommUtils from '../../../../../../shared/src/lib/public/component/comm-utils';
import {
  DragonPdfSignModalComponent
} from '../../../../../../shared/src/lib/public/dragon-vanke/modal/pdf-sign-modal.component';
import { XnService } from '../../../../../../shared/src/lib/services/xn.service';
import { map } from 'rxjs/operators';
import CommBase from '../comm-base';
import { XnUtils } from '../../../../../../shared/src/lib/common/xn-utils';
import { CompanyAppId, IsProxyDef, PageTypes, SortType } from 'libs/shared/src/lib/config/enum';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { IPageConfig } from '../../interfaces';
import ReceiptList from './receipt-list';

@Component({
  selector: 'lib-receipt-list-gj',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.less']
})
export class GjReceiptListComponent extends CommonPage implements OnInit {
  rows: any[] = [];

  sorting = ''; // 共享该变量
  naming = ''; // 共享该变量
  heads: any[];
  base: CommBase;
  public allChecked = false; // 全选，取消全选
  // 复核角色
  public isReviewer = false;

  /** 默认展示列表 一次回执待签署 */
  listType: ListType = ListType.FirstWait;
  ListType = ListType;
  /** 查询条件 */
  searchModel: any = {};
  showFields: FormlyFieldConfig[];
  /** 页码配置 */
  pageConfig: IPageConfig = {pageSize: 10, page: 1, first: 0, total: 0};
  /** 页面类型 */
  type: PageTypes = PageTypes.List;
  /** 业务模式 */
  isProxy = IsProxyDef.CDR;

  /** 是否处于【待签署】类标签中 */
  get inWaitTab() {
    return [ListType.FirstWait, ListType.SecondWait, ListType.ChangeWait].includes(this.listType);
  }

  refreshDataAfterAttachComponent = () => this.onPage(this.pageConfig);

  constructor(
    public xn: XnService,
    public vcr: ViewContainerRef,
    public route: ActivatedRoute,
    private loadingService: LoadingService
  ) {
    super(PageTypes.List);
    this.isReviewer = this.xn.user.roles.includes('reviewer');
  }

  ngOnInit() {
    this.route.data.subscribe(superConfig => {
      this.base = new CommBase(this, superConfig);
      this.heads = CommUtils.getListFields(superConfig.fields);
      this.showFields = new ReceiptList().fieldConfig;
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

  getList(type: number) {
    this.listType = type;
    this.onPage();
  }

  // 查看交易流程
  public viewProcess(item: any) {
    this.xn.router.navigate([`abs-gj/main-list/detail/${item}`]);
  }

  /**
   * 是否已审核通过
   */
  public isAudited(item) {
    if (this.listType === ListType.FirstWait) {
      return item.signCheckPerson;
    } else if (this.listType === ListType.SecondWait) {
      return item.signCheckPersonTwo;
    } else if (this.listType === ListType.ChangeWait) {
      return item.signCheckPersonAdd;
    }
  }

  public audit(items?) {
    const selectedRows = items
      ? [items]
      : this.rows.filter(
        (x: any) => x.checked && x.checked === true && !this.isAudited(x)
      );

    if (!selectedRows || selectedRows.length === 0) {
      this.xn.msgBox.open(false, '没有需要审核通过的数据或者该数据已审核通过，不能执行此操作！');
      return;
    }

    const params = {
      mainFlowIds: selectedRows.map(r => r.mainFlowId),
      hasSign: this.listType
    };
    this.loadingService.open();
    this.xn.api.dragon
      .post(`/project_add_file/signPass`, params)
      .subscribe(() => {
        this.onPage(this.pageConfig);
        this.loadingService.close();
      });
  }

  public getLabel(input): string {
    return input
      ? typeof input === 'string'
        ? Object.prototype.toString.call(JSON.parse(input)) === '[object Object]'
          ? JSON.parse(input).label : JSON.parse(input)[0].label
        : input.label
      : '';
  }

  public viewContracts(row) {
    const params = typeof row === 'string' ? JSON.parse(row)[0] : row;

    params.readonly = true;
    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      DragonPdfSignModalComponent,
      params
    ).subscribe();
  }

  // 回退操作
  onUrlData() {
    const urlData = this.xn.user.getUrlData(this.xn.router.url);
    if (urlData && urlData.pop) {
      this.pageConfig = urlData.data.pageConfig || this.pageConfig;
      this.sorting = urlData.data.sorting || this.sorting;
      this.naming = urlData.data.naming || this.naming;
    } else {
      this.xn.user.setUrlData(this.xn.router.url, {
        sorting: this.sorting,
        naming: this.naming,
        pageConfig: this.pageConfig,
      });
    }
  }

  onPage(pageConfig: IPageConfig = {pageSize: 10, page: 1, first: 0}): void {
    this.pageConfig = Object.assign(this.pageConfig, pageConfig);
    this.onUrlData();
    const params = this.buildParams();
    this.base.onList(params);
  }

  buildParams() {
    // 分页处理
    const params: any = {
      start: this.pageConfig.first,
      length: this.pageConfig.pageSize,
      hasSign: this.listType,
      isProxy: IsProxyDef.CDR,
      factoringAppId: CompanyAppId.BLH,
    };

    // 搜索处理
    for (const key of Object.keys(this.searchModel)) {
      if (!XnUtils.isEmpty(this.searchModel[key])) {
        if (this.searchModel[key] === 'receive' || this.searchModel[key] === 'changePrice') {
          params[key] = String(this.searchModel[key]).replace(/\,/g, '');
        } else {
          params[key] = this.searchModel[key];
        }
      }
    }

    return params;
  }

  onSort(sort: string): void {
    if (this.sorting === sort) {
      this.naming = this.naming === SortType.DESC ? SortType.ASC : SortType.DESC;
    } else {
      this.sorting = sort;
      this.naming = SortType.ASC;
    }

    this.onPage();
  }

  onSortClass(checkerId: string): string {
    if (checkerId === this.sorting) {
      return 'sorting_' + this.naming;
    } else {
      return 'sorting';
    }
  }

  onTextClass(type) {
    return type === 'money' ? 'text-right' : '';
  }

  // 全选，取消全选
  public handleAllSelect() {
    this.allChecked = !this.allChecked;
    if (this.allChecked) {
      this.rows.map(item => (item.checked = true));
    } else {
      this.rows.map(item => (item.checked = false));
    }
  }

  // 选择框改变
  public inputChange(val: any) {
    val.checked = !(val.checked && val.checked === true);
    // 当数组中不具有clicked 且为false。没有找到则表示全选中。
    const find = this.rows.find(
      (x: any) => x.checked === undefined || x.checked === false
    );
    this.allChecked = !find;
  }


  /**
   * 退回
   */
  public signReturn(item) {
    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      ReceiptSignReturnModalComponent,
      {hasSign: this.listType}
    ).subscribe(x => {
      if (x !== '') {
        const params = {
          mainFlowId: item.mainFlowId,
          returnReason: x,
        };
        this.loadingService.open();
        this.xn.api.dragon.post('/project_add_file/signReturn', params)
          .subscribe(() => {
            this.onPage(this.pageConfig);
            this.loadingService.close();
          });
      }
    });
  }

  /**
   * 签署
   */
  public signContracts() {

    if (this.rows.every((x: any) => !x.checked)) {
      this.xn.msgBox.open(false, '没有需要签署的数据，不能执行此操作！');
      return;
    }

    const selectedRows = this.rows.filter(x => x.checked && this.isAudited(x));

    if (!selectedRows || selectedRows.length === 0) {
      this.xn.msgBox.open(false, '数据审核不通过，不能执行此操作！');
      return;
    }

    const params = {
      mainFlowIds: selectedRows.map(r => r.mainFlowId)
    };
    this.xn.api.dragon.post('/project_add_file/signContracts', params)
      .pipe(
        map(con => {
          this.xn.loading.close();
          const contracts = con.data.contracts;
          const result = JSON.parse(JSON.stringify(contracts));
          result.isProxy = this.isProxy;
          if (result.length) {
            result.forEach(tracts => {
              if (tracts.label.includes('债权转让及账户变更通知的补充说明【直接债务人模板】')) {
                tracts.config = {text: '(盖章)'};
              } else if (tracts.label.includes('债权转让及账户变更通知的补充说明')) {
                tracts.config = {text: '【项目公司】(盖章)'};
              } else {
                tracts.config = {text: '（盖章）'};
              }
            });
            XnModalUtils.openInViewContainer(
              this.xn,
              this.vcr,
              DragonFinancingContractModalComponent,
              result
            ).subscribe((x) => {
              if (!(x.action && x.action === 'cancel')) {
                this.xn.api.dragon.post('/project_add_file/updateContracts', {
                  contracts
                }).subscribe(() => {
                  this.onPage(this.pageConfig);
                });
              }
            });
          } else {
            this.xn.msgBox.open(false, '没有需要签署的合同，不能执行此操作！');
          }
        })
      ).subscribe();
  }

  againSignCons(paramCons: any): void {
    const contract = JSON.parse(paramCons);
    contract.isProxy = this.isProxy;
    if (contract.length === 0) {
      return this.xn.msgBox.open(false, '未找到需要补充签署的合同');
    }

    contract.forEach(tracts => {
      if (tracts.label.includes('债权转让及账户变更通知的补充说明')) {
        tracts.config = {text: '【项目公司】(盖章)'};
      } else {
        tracts.config = {text: '（盖章）'};

      }
    });
    XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonFinancingContractModalComponent, contract)
      .subscribe();

  }
}

/** 列表类型 */
enum ListType {
  /** 一次回执待签署 */
  FirstWait  = 1,
  /** 一次回执已签署 */
  FirstDone  = 2,
  /** 二次回执待签署 */
  SecondWait = 3,
  /** 二次回执已签署 */
  SecondDone = 4,
  /** 债权转让及账户变更通知的补充说明待签署 */
  ChangeWait = 5,
  /** 债权转让及账户变更通知的补充说明已签署 */
  ChangeDone = 6
}


