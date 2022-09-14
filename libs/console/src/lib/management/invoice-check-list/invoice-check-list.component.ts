/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file
 * @summary：根据invoice-check-list.data.ts中的配置
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                  zigui             发票查验          2021-01-08
 * **********************************************************************
 */
import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BankManagementService } from 'libs/console/src/lib/bank-management/bank-mangement.service';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { SubTabListOutputModel } from 'libs/shared/src/lib/config/list-config-model';
import CommUtils from 'libs/shared/src/lib/public/component/comm-utils';
import { DragongetCustomListComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/custom-list-modal.component';
import { JsonTransForm } from 'libs/shared/src/lib/public/pipe/xn-json.pipe';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  templateUrl: `./invoice-check-list.component.html`,
  styleUrls: [`./invoice-check-list.component.less`],
})
export class InvoiceCheckListComponent implements OnInit {
  @ViewChild('tplContent') tplContent;
  sorting = '';
  naming = '';
  paging = 1;
  // 页码配置
  pageConfig = {
    pageSize: 10,
    first: 0,
    total: 0,
  };
  tempForm = null;
  // 搜索项
  shows: any[] = [];
  form: FormGroup;
  searches: any[] = []; // 面板搜索配置项项
  cacheForm: any;
  currentTab: any; // 当前标签页
  list: any[] = []; // 数据
  displayShow = false;
  isAllSelected = false;
  selectedItems = [];
  heads: any[];
  newHeads: any[] = [];                          // 后端返回的自定义table列表
  fixedHeadNumber = 0;
  currentSubTab: SubTabListOutputModel = new SubTabListOutputModel(); // 当前子标签页
  formModule = 'dragon-input';
  exportType = 0; // 导出类型
  listInfo = [];
  isAdmin = false;
  constructor(private xn: XnService,
    private vcr: ViewContainerRef,
    public bankManagementService: BankManagementService,
    private route: ActivatedRoute,
    private router: Router,
    public hwModeService: HwModeService,
    private $modal: NzModalService,
  ) {

  }

  ngOnInit(): void {
    const roles = this.xn.user.roles;
    this.isAdmin = roles.includes('admin')
    this.route.data.subscribe(tabConfig => {
      this.currentTab = tabConfig.tabList[0];
      this.currentSubTab = this.currentTab.subTabList[0];
      this.heads = CommUtils.getListFields(this.currentSubTab.headText);  // 当前表格表头项
      this.searches = this.currentSubTab.searches;  // 当前标签页的搜索项
      this.onUrlData();
      this.buildCondition(this.searches);
      this.onPage({ page: this.paging });
    });
  }

  /**
   *  格式化数据
   * @param data
   */
  jsonTransForm(data) {
    return JsonTransForm(data);
  }
  // 自定义列表
  getCustomlist() {
    const params = {
      FixedNumber: this.fixedHeadNumber,
      headText: JSON.stringify(this.currentSubTab.headText),
      selectHead: JSON.stringify(this.newHeads),
      status: 1,
      // status: this.currentSubTab.params
    };
    XnModalUtils.openInViewContainer(this.xn, this.vcr, DragongetCustomListComponent, params).
      subscribe((x: any[]) => {
        this.onPage({ page: this.paging });
      });
  }
  /**
   * @param e  page: 新页码、 pageSize: 页面显示行数、first: 新页面之前的总行数、pageCount : 页码总数
   * @summary 采购融资，地产abs  请求api有区别，采购融资：avenger 、地产abs：api
   */
  public onPage(e?: { page: number, first?: number, pageSize?: number, pageCount?: number }) {
    this.paging = e.page || 1;
    this.pageConfig = { ...this.pageConfig, ...e };
    // 缓存搜索表单的值
    this.tempForm = JSON.parse(JSON.stringify(this.form.value));
    this.onUrlData();
    const params = this.buildParams();
    this.requestInterface(params);
  }
  resetList() {
    this.list = [];
    this.listInfo = [];
    this.pageConfig.total = 0;
  }
  // 数组对象根据对象prop属性进行分类、重组
  groupArray(arr, prop) {
    const typeArr = Array.from(new Set(arr.map(c => c[prop])));
    let serial = 0;
    return typeArr.map(c => {
      const obj = {
        type: c,
        arr: [],
      };
      arr.forEach(d => {
        if (d[prop] === obj.type) {
          serial++;
          d.serial = serial;
          obj.arr.push(d);
        }
      });
      return obj;
    });
  }
  // 查询列表数据
  requestInterface(params) {
    this.xn.loading.open();
    this.xn.dragon.post(this.currentTab.post_url, params).subscribe(x => {
      // this.newHeads = [];
      // this.fixedHeadNumber = x.data.lockCount || 0;
      // this.heads = CommUtils.getListFields(this.currentSubTab.headText);
      // if (!x.data.column) {
      //   this.newHeads = this.heads;
      // } else {
      //   JSON.parse(x.data.column).forEach((y, index) => {
      //     this.heads.forEach((z: any) => {
      //       if (y === z.value) {
      //         this.newHeads.push(z);
      //       }
      //     });
      //   });
      //   this.heads = this.newHeads;
      // }
      if (x?.data?.data?.length) {
        this.selectedItems = [];
        this.isAllSelected = false;
        this.list = x.data.data;
        this.list.forEach(c => {
          c.checked = false;
        });
        this.pageConfig.total = x.data.count || 0;
        this.listInfo = this.groupArray(this.list, 'mainFlowId');
      } else {
        this.resetList();
      }
    }, () => {
      this.resetList();
    }, () => {
      this.xn.loading.close();
    });
  }
  onSearch() {
    this.paging = 1;
    this.onPage({ page: this.paging, first: 0 });
  }
  /**
   * 重置
   */
  public reset() {
    this.sorting = '';
    this.naming = '';
    this.cacheForm = null;
    this.pageConfig = {
      pageSize: 10,
      first: 0,
      total: 0,
    };
    this.buildCondition(this.searches);
    this.onSearch();
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
    this.onPage({ page: this.paging });
  }


  /**
   * 计算表格合并项
   * currentSubTab.headText.length + 可选择1 + 序号1 + 行操作+1
   */
  public calcAttrColspan(): number {
    const nums: number = this.currentSubTab.headText.length + 1 + 1;
    return nums;
  }


  /**
   * 搜索项值格式化
   * @param searches
   */
  private buildCondition(searches) {
    this.shows = JSON.parse(JSON.stringify(searches));
    if (this.cacheForm) {
      this.shows.forEach(c => {
        c.value = this.cacheForm[c.checkerId] || '';
      });
    }
    XnFormUtils.buildSelectOptions(this.shows);
    this.buildChecker(this.shows);
    this.form = XnFormUtils.buildFormGroup(this.shows);
  }
  /**
   * 构建参数
   */
  private buildParams() {
    // 分页处理
    let params: any = {
      pageNo: this.paging,
      pageSize: this.pageConfig.pageSize,
    };
    const sortMap = {
      mainFlowId: 1,
      payConfirmId: 2,
    };
    const typeMap = {
      asc: 1,
      desc: -1,
    };
    // 排序处理
    if (this.sorting && this.naming) {
      params.order = {
        name: sortMap[this.sorting],
        type: typeMap[this.naming] || 0,
      };
    }
    // 搜索处理
    for (const search of this.searches) {
      if (!XnUtils.isEmpty(this.tempForm[search.checkerId])) {
        if (['valueDate', 'productType'].includes(search.checkerId)) {
          params = { ...params, ...JSON.parse(this.tempForm[search.checkerId]) };
        } else {
          params[search.checkerId] = this.tempForm[search.checkerId];
        }
        if (params.beginTime) {
          params.valueDateStart = +params.beginTime;
          delete params.beginTime;
        }
        if (params.endTime) {
          params.valueDateEnd = +params.endTime;
          delete params.endTime;
        }
      }
    }
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
  handleHeadClick(btn) {
    switch (btn.operate) {
      // 导出
      case 'export': {
        // 弹框确认导出类型
        if (!this.list.length) {
          this.$modal.warning({
            nzTitle: '温馨提示',
            nzContent: '当前列表无发票数据，请查询发票信息后再进行导出操作。',
            nzOkType: 'primary',
            nzOnOk: () => { },
            nzStyle: { top: '300px' },
            // nzWrapClassName: '',
          });
          return;
        }
        this.exportType = 0;
        this.$modal.create({
          nzTitle: '导出',
          nzContent: this.tplContent,
          nzMaskClosable: false,
          nzClosable: false,
          nzStyle: { top: '300px' },
          nzComponentParams: {
            radios: [
              {
                label: '当前页所有发票查验记录',
                value: 0,
              },
              {
                label: '所选的发票查验记录',
                value: 1,
              },
            ]
          },
          nzOnOk: () => {
            const fileName = '发票查验记录.xlsx';
            const selectedItemsKey = this.selectedItems.length ? this.selectedItems.map(c => c.id) : [];
            const params = this.exportType === 0 ? this.buildParams() : { id: selectedItemsKey};
            // FIXME: 重新修改逻辑
            params.selectType = this.exportType
            this.xn.dragon.download('/invoice/export_invoices', params)
              .subscribe((v: any) => {
                this.xn.dragon.save(v._body, fileName);
              });
          }
        });
        break;
      }
      // 发票查验
      case 'check': {
        // 1.已在轮候队伍中的发票过滤掉.弹出提示：[发票号码1,发票号码2]已在轮候队伍中，本次查验已过滤上述发票
        // 2.查验提交后提示:请前往发票查验记录中查看查验详情
        // 3.无查询结果时点击后提示：请查询发票信息后再进行查验
        if (!this.selectedItems.length) {
          this.$modal.warning({
            nzTitle: '温馨提示',
            nzContent: '请选择需要查验的发票。',
            nzOkType: 'primary',
            nzOnOk: () => { },
            nzStyle: { top: '300px' },
            // nzWrapClassName: '',
          });
        } else {
          this.$modal.confirm({
            nzTitle: '温馨提示',
            nzContent: '确定查验当前所选的发票吗？',
            nzOkType: 'danger',
            nzStyle: { top: '300px' },
            nzOnOk: () => this.onCheckInvoice(),
          });
        }
        break;
      }
    }
    // paramBtnOperate.click(this.xn, this.$modal, this.buildParams(), this.list);
  }
  onCheckInvoice() {
    const selectedItemsKey = this.selectedItems.length ? this.selectedItems.map(c => c.id) : [];
    this.xn.dragon.post('/invoice/invioces_check', { id: selectedItemsKey })
      .subscribe(v => {
        if (v?.data?.data?.length) {
          const message = v.data.data.map(c => `发票号码${c.invoiceNum}`).join(',');
          this.$modal.confirm({
            nzTitle: '温馨提示',
            nzContent: `【${message}】已在轮候队伍中，本次查验已过滤上述发票。请前往发票查验记录中查看查验详情。`,
            nzOkType: 'primary',
            nzOkText: '查看查验详情',
            nzCancelText: '关闭',
            nzStyle: { top: '300px' },
            nzOnOk: () => {
              this.xn.router.navigate(['/console/manage/invoice-check-list/search']);
            },
            nzOnCancel: () => {
              this.onPage({ page: this.paging });
            },
          });
        }
      });
  }
  // 页面回退缓存
  private onUrlData() {
    const urlData = this.xn.user.getUrlData(this.xn.router.url);
    if (urlData && urlData.pop) {
      this.paging = urlData.data.paging || this.paging;
      this.pageConfig = urlData.data.pageConfig || this.pageConfig;
      this.cacheForm = urlData.data.cacheForm || this.tempForm;
      this.displayShow = urlData.data.displayShow || false;
    } else {
      this.xn.user.setUrlData(this.xn.router.url, {
        paging: this.paging,
        pageConfig: this.pageConfig,
        cacheForm: this.tempForm,
        displayShow: this.displayShow,
      });
    }
  }
  // 查看发票批量查验记录
  onViewCheckList() {
    this.router.navigate(['/console/manage/invoice-check-list/search']);
  }
  /**
   *  判读列表项是否全部选中
   */
  handleAllSelect() {
    this.isAllSelected = !this.isAllSelected;
    if (this.isAllSelected) {
      this.list.forEach(item => item.checked = true);
      this.listInfo.forEach(c => {
        if (c.arr.length) {
          c.arr.forEach(d => {
            d.checked = true;
          });
        }
      });
    } else {
      this.list.forEach(item => item.checked = false);
      this.listInfo.forEach(c => {
        if (c.arr.length) {
          c.arr.forEach(d => {
            d.checked = false;
          });
        }
      });
    }
    this.selectedItems = this.list.filter(r => r.checked && r.checked === true);
    // this.listInfo = this.groupArray(this.list, 'mainFlowId');
    // console.log('all selectedItems', this.selectedItems);
  }
  onSelected(row) {
    this.listInfo.forEach(c => {
      if (c.arr.length) {
        c.arr.forEach(d => {
          if (d.id === row.id) {
            d.checked = !row.checked;
          }
        });
      }
    });
    const index = this.list.findIndex(c => c.id === row.id);
    // this.list[index].checked = !row.checked;
    if (this.list[index].checked) {
      this.selectedItems.push(row);
    } else {
      const deleteIndex = this.selectedItems.findIndex(c => c.id === row.id);
      if (deleteIndex > -1) {
        this.selectedItems.splice(deleteIndex, 1);
      }
    }
    // this.listInfo = this.groupArray(this.list, 'mainFlowId');
    console.log('selectedItems', this.selectedItems);
  }
}
