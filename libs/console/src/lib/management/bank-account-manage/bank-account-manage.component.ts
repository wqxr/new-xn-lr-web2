/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file
 * @summary:
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                  zigui             银行账号管理          2021-01-14
 * **********************************************************************
 */
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { BankManagementService } from 'libs/console/src/lib/bank-management/bank-mangement.service'; import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { SubTabListOutputModel, ButtonConfigModel } from 'libs/shared/src/lib/config/list-config-model';
import CommUtils from 'libs/shared/src/lib/public/component/comm-utils';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup} from '@angular/forms';
import { BankAccountAddModalComponent } from './bank-account-add-modal.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
@Component({
  templateUrl: `./bank-account-manage.component.html`,
  styleUrls: [`./bank-account-manage.component.less`],
})
export class BankAccountManageComponent implements OnInit {
  sorting = '';
  naming = '';
  paging = 1;
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
  cacheForm: any;
  currentTab: any; // 当前标签页
  listInfo: any[] = []; // 数据
  displayShow = false;

  heads: any[];
  public currentSubTab: SubTabListOutputModel = new SubTabListOutputModel(); // 当前子标签页
  public formModule = 'dragon-input';

  constructor(private xn: XnService,
              private vcr: ViewContainerRef,
              public bankManagementService: BankManagementService,
              private router: ActivatedRoute,
              public hwModeService: HwModeService,
              private $modal: NzModalService,
              private $message: NzMessageService,
  ) {

  }

  ngOnInit(): void {
    this.router.data.subscribe(tabConfig => {
      this.currentTab = tabConfig.tabList[0];
      this.currentSubTab = this.currentTab.subTabList[0];
      this.heads = CommUtils.getListFields(this.currentSubTab.headText);  // 当前表格表头项
      this.searches = this.currentSubTab.searches;  // 当前标签页的搜索项
      this.buildCondition(this.searches);
      this.onPage({ page: this.paging });
    });
  }
  /**
   * @param e  page: 新页码、 pageSize: 页面显示行数、first: 新页面之前的总行数、pageCount : 页码总数
   * @summary 采购融资，地产abs  请求api有区别，采购融资：avenger 、地产abs：api
   */
  onPage(e?: { page: number, first?: number, pageSize?: number, pageCount?: number }) {
    this.paging = e.page || 1;
    this.pageConfig = {...this.pageConfig, ...e};
    const params = this.buildParams();
    this.requestInterface(params);
  }
  resetList() {
    this.listInfo = [];
    this.pageConfig.total = 0;
  }
  // 查询列表数据
  requestInterface(params) {
    this.xn.loading.open();
    this.xn.api.post(this.currentTab.post_url, params).subscribe(x => {
      if (x?.data?.list?.length) {
        this.listInfo = x.data.list;
        this.pageConfig.total = x.data.count;
      } else {
        this.resetList();
      }
    }, () => {
      this.resetList();
    }, () => {
      this.xn.loading.close();
    });
  }
  /**
   * 重置
   */
  reset() {
    this.cacheForm = null;
    this.buildCondition(this.searches);
    this.onSearch();
  }

  /**
   * 查询
   */
  onSearch() {
    this.paging = 1;
    this.onPage({ page: this.paging, first: 0 });
  }

  /**
   * 新增、编辑、删除银行账户
   */
  onHandle(type: string, row: any = {}) {
    if (type === 'delete') {
      this.$modal.confirm({
        nzTitle: '提示',
        nzContent: '<b style="color: red;">确定删除该银行账户吗？</b>',
        nzOkType: 'primary',
        nzOnOk: () => {
          this.xn.api.post('/bank_info_list/delete', row).subscribe(v => {
              this.$message.success('删除成功！');
              this.onPage({ page: this.paging });
          });
        },
        nzOnCancel: () => {}
      });
      return;
    }
    BankAccountAddModalComponent.type = type;
    BankAccountAddModalComponent.current = row;
    XnModalUtils.openInViewContainer(this.xn, this.vcr, BankAccountAddModalComponent, {})
      .subscribe(v => {
        if (v) {
          this.onPage({ page: this.paging });
        }
      });
  }
  /**
   *  列表头样式
   * @param paramsKey
   */
  onSortClass(paramsKey: string): string {
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
  onSort(sort: string) {
    if (this.sorting === sort) {
      this.naming = this.naming === 'desc' ? 'asc' : 'desc';
    } else {
      this.sorting = sort;
      this.naming = 'asc';
    }
    this.onPage({ page: this.paging });
  }


  /**
   * 计算表格合并项
   * currentSubTab.headText.length + 可选择1 + 序号1 + 行操作+1
   */
  calcAttrColspan(): number {
    return this.currentSubTab.headText.length + 2;
  }


  /**
   * 搜索项值格式化
   * @param searches
   */
  buildCondition(searches) {
    this.shows = JSON.parse(JSON.stringify(searches));
    if (this.cacheForm) {
      this.shows.forEach(c => {
        c.value = this.cacheForm.value[c.checkerId] || '';
      });
    }
    XnFormUtils.buildSelectOptions(this.shows);
    this.buildChecker(this.shows);
    this.form = XnFormUtils.buildFormGroup(this.shows);
  }
  /**
   * 构建参数
   */
  buildParams() {
    // 分页处理
    let params: any = {
      start: (this.paging - 1) * this.pageConfig.pageSize,
      length: this.pageConfig.pageSize,
    };
    // 排序处理
    if (this.sorting && this.naming) {
      params.order = [this.sorting + ' ' + this.naming];
    }
    // 搜索处理
    for (const search of this.searches) {
      if (!XnUtils.isEmpty(this.form.value[search.checkerId])) {
        if (search.checkerId === 'address') {
          params = { ...params, ...JSON.parse(this.form.value[search.checkerId]) };
        } else {
          params[search.checkerId] = this.form.value[search.checkerId];
        }
      }
    }
    // params.headquarters = HeadquartersTypeEnum[10];
    // params.isProxy = 55;
    // params.factoringAppId = applyFactoringTtype.深圳市柏霖汇商业保理有限公司;
    return params;
  }

  private buildChecker(stepRows) {
    for (const row of stepRows) {
      XnFormUtils.convertChecker(row);
    }
  }
  /**
   * 头按钮组事件
   * @param paramItem 当前行数据
   * @param paramBtnOperate 按钮操作配置
   * @param i 下标
   */
  handleHeadClick(paramBtnOperate: ButtonConfigModel) {
    paramBtnOperate.click(this.xn);
  }
}
