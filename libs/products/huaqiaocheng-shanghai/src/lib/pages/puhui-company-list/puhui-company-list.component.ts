/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\products\huaqiaocheng-shanghai\src\lib\pages\puhui-company-list\puhui-company-list.component.ts
* @summary：普惠开户企业列表
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                 hucongying          init           2021-07-21
***************************************************************************/

import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { Column, ColumnButton, TableChange, TableData } from '@lr/ngx-table';
import { SearchFormComponent } from '@lr/ngx-shared';
import { XnTableComponent } from '@lr/ngx-table/lib/table.component';
import { FormlyFieldConfig } from '@lr/ngx-formly';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ChangeDetectorRef } from '@angular/core';
import { OrgTypeEnum, RetCodeEnum, ShEAccountUpdateType } from 'libs/shared/src/lib/config/enum';
declare const $: any;
declare const moment: any;

@Component({
  selector: 'oct-puhui-company-list',
  templateUrl: `./puhui-company-list.component.html`,
  styles: [
    `
        [nz-button] {
            margin-right: 8px;
            margin-bottom: 12px;
          }
        `
  ]
})
export class OctPuhuiCompanyListComponent implements OnInit {
  @ViewChild('reviewTable') reviewTable: XnTableComponent;
  @ViewChild('searchForm') searchForm: SearchFormComponent;
  // 搜索项配置
  public showFields: FormlyFieldConfig[] = [
    {
      className: 'ant-col ant-col-md-8 ant-col-sm-24',
      wrappers: ['form-field-horizontal'],
      key: 'orgName',
      type: 'input',
      templateOptions: {
        label: '企业名称',
        placeholder: '请输入',
        autocomplete: 'off',
        labelSpan: 9,
        controlSpan: 15,
      },
    },
    {
      className: 'ant-col ant-col-md-8 ant-col-sm-24',
      wrappers: ['form-field-horizontal'],
      key: 'status',
      type: 'select',
      templateOptions: {
        label: '开户状态',
        nzPlaceHolder: '请选择',
        labelSpan: 9,
        controlSpan: 15,
        options: [
          { label: '全部', value: '' },
          { label: '待开户', value: 1 },
          { label: '待平台审核', value: 2 },
          { label: '待补正资料', value: 4 },
          { label: '待上银审核', value: 5 },
          { label: '待平台审核-上银退回', value: 6 },
          { label: '已完成', value: 8 },
        ]
      },
    },
    {
      className: 'ant-col ant-col-md-8 ant-col-sm-24',
      wrappers: ['form-field-horizontal'],
      key: 'eAccountStatus',
      type: 'select',
      templateOptions: {
        label: '账户激活状态',
        nzPlaceHolder: '请选择',
        labelSpan: 9,
        controlSpan: 15,
        options: [
          { label: '全部', value: '' },
          { label: '待激活', value: 1 },
          { label: '已激活', value: 2 },
        ]
      },
    },
    {
      className: 'ant-col ant-col-md-8 ant-col-sm-24',
      wrappers: ['form-field-horizontal'],
      key: 'custNo',
      type: 'input',
      templateOptions: {
        label: '客户号',
        placeholder: '请输入',
        autocomplete: 'off',
        labelSpan: 9,
        controlSpan: 15,
      },
    },
    {
      className: 'ant-col ant-col-md-8 ant-col-sm-24',
      wrappers: ['form-field-horizontal'],
      key: 'acctNo',
      type: 'input',
      templateOptions: {
        label: '对公在线业务账号',
        placeholder: '请输入',
        autocomplete: 'off',
        labelSpan: 9,
        controlSpan: 15,
      },
    },
    {
      className: 'ant-col ant-col-md-8 ant-col-sm-24',
      wrappers: ['form-field-horizontal'],
      key: 'operatorId',
      type: 'input',
      templateOptions: {
        label: '操作员号',
        placeholder: '请输入',
        autocomplete: 'off',
        labelSpan: 9,
        controlSpan: 15,
      },
    },
  ];
  // 表头配置
  public columns: Column[] = [
    { title: '选择', index: 'id', width: 50, type: 'checkbox' },
    { title: '序号', index: 'no', width: 50, format: (item: TableData, col: Column, index: number): string => (index + 1).toString() },
    { title: '企业名称', index: 'orgName' },
    { title: '开户状态', index: 'status', render: 'statusTpl' },
    { title: '账户激活状态', index: 'eAccountStatus', render: 'eAccountStatusTpl' },
    { title: '客户号', index: 'custNo' },
    { title: '对公在线业务账号', index: 'acctNo' },
    { title: '操作员号', index: 'operatorId' },
    { title: '操作员手机号', index: 'operatorMobile' },
    {
      title: '最后更新时间', index: 'updateTime', width: 150, render: 'dateTimeTpl',
      // sort: {
      //   default: null, compare: null, key: 'updateTime', reName:
      //     { ascend: '1', descend: '-1' }
      // },
    },
    {
      title: '操作', index: 'rowBtn', width: 150, fixed: 'right',
      buttons: [
        {
          text: '查看', type: 'link', iif: (item: TableData, btn: ColumnButton, column: Column) =>
            true,
          iifBehavior: 'hide',
          click: (e: any) => {
            this.viewAccountDetail(e.appId)
          },
        },
        {
          text: '更新审核状态', type: 'link', iif: (item: TableData, btn: ColumnButton, column: Column) =>
            item.statusFlag === ShEAccountUpdateType.APPLYVERIFY && this.xn.user.orgType === OrgTypeEnum.PLATFORM,
          iifBehavior: 'hide',
          click: (e: any) => {
            this.updateCheckStatus(e.appId)
          },
        },
        {
          text: '更新激活状态', type: 'link', iif: (item: TableData, btn: ColumnButton, column: Column) =>
            item.statusFlag === ShEAccountUpdateType.ACCOUNTACTIVE && this.xn.user.orgType === OrgTypeEnum.PLATFORM,
          iifBehavior: 'hide',
          click: (e: any) => {
            this.updateActiveStatus(e.appId)
          },
        },
      ],
    },
  ];
  // 页码配置
  pageConfig = {
    pageIndex: 1,
    pageSize: 10,
    total: 0
  };
  public paging = 1;
  // 表格数据
  public listInfo: any[] = [];
  // 选中项
  public selectedItems: any[] = [];
  public loading: boolean = true;
  // 排序
  public sortModels: { [key: string]: any } = {}

  constructor(
    private xn: XnService,
    private cdr: ChangeDetectorRef,
    public hwModeService: HwModeService,
    private vcr: ViewContainerRef,
    private router: ActivatedRoute,
    private message: NzMessageService) { }

  ngOnInit(): void {
    this.onPage({ pageIndex: 1 }, {});
  }

  /**
   * @param e  pageIndex 页码 pageSize 每页数量 total 数据总数
   * @param searchModel  搜索项
   * @summary
   */
  public onPage(e?: { pageIndex: number, pageSize?: number, total?: number }, searchModel?: { [key: string]: any }) {
    this.loading = true
    this.selectedItems = [];
    this.paging = e.pageIndex || 1;
    this.pageConfig = Object.assign({}, this.pageConfig, e);
    const params = this.buildParams(searchModel);
    this.xn.dragon.post2('/shanghai_bank/so_general/shEAccountApplyList', params).subscribe(x => {
      this.loading = false
      if (x.ret === RetCodeEnum.OK) {
        this.listInfo = x.data.data;
        this.pageConfig.total = x.data.count;
      } else {
        this.listInfo = [];
        this.pageConfig.total = 0;
      }
    }, () => {
      this.loading = false
    });

  }

  /**
   * 更新审核状态
   * @param appId 企业id
   */
  updateCheckStatus(appId: string) {
    this.loading = true;
    this.xn.dragon.post2('/shanghai_bank/so_general/shPHBankVerifyStatusRefresh', { appId }).subscribe(x => {
      this.loading = false;
      if (x.ret === RetCodeEnum.OK) {
        this.message.success('更新成功！');
        this.onPage(this.pageConfig, {});
      } else {
        this.message.error('更新失败！')
      }
    }, () => {
      this.loading = false
    });
  }

  /**
   * 更新激活状态
   * @param appId 企业id
   */
  updateActiveStatus(appId: string) {
    this.loading = true;
    this.xn.dragon.post2('/shanghai_bank/so_general/shPHAcctActiveStatusRefresh', { appId }).subscribe(x => {
      this.loading = false;
      if (x.ret === RetCodeEnum.OK) {
        this.message.success('更新成功！');
        this.onPage(this.pageConfig, {});
      } else {
        this.message.error('更新失败！')
      }
    }, () => {
      this.loading = false
    });
  }

  /**
   * 查看普惠开户账户详情
   * @param appId 企业id
   */
  viewAccountDetail(appId: string) {
    this.xn.router.navigate(['/oct-shanghai/puhui-account-detail'],
      {
        queryParams: {
          appId: appId || ''
        }
      }
    )
  }

  /**
   * 搜索条件查询
   */
  onSearch(data: any) {
    this.pageConfig.pageIndex = 1;
    this.selectedItems = [];
    this.onPage(this.pageConfig, data);
  }

  /**
   * 重置搜索项表单
   */
  onReset(searchForm: any) {
    this.selectedItems = [];
    this.sortModels = {};
    searchForm.form.reset();
    this.reviewTable.clearStatus();
    this.onSearch({});
  }

  /**
   * 构建列表请求参数
   * @param searchModel
   */
  private buildParams(searchModel: { [key: string]: any }) {
    const params: any = {
      pageNo: this.pageConfig.pageIndex,
      pageSize: this.pageConfig.pageSize,
    };

    // 搜索处理
    for (const key of Object.keys(searchModel)) {
      if (!XnUtils.isEmptys(searchModel[key], [0])) {
        switch (key) {
          case 'status':
            params[key] = Number(searchModel[key])
            break;
          case 'eAccountStatus':
            params[key] = Number(searchModel[key])
            break;

          default:
            params[key] = searchModel[key]?.toString()?.trim();
            break;
        }
      }
    }
    return params;
  }

  /**
  * 数据导出
  * @param
  */
  exportData() {
    const params = this.buildParams(this.searchForm.model)
    delete params.pageNo
    delete params.pageSize
    if (this.selectedItems.length > 0) {
      const appIdList = this.selectedItems.map(v => v.addId); // 企业id列表
      params.appIdList = appIdList;
    }
    this.xn.loading.open()
    this.xn.dragon.download('/shanghai_bank/so_general/shEAccountApplyListDownload', params)
      .subscribe(x => {
        this.xn.loading.close();
        this.xn.dragon.save(x._body, '普惠开户企业列表清单.xlsx');
      }, () => {
        this.xn.loading.close();
      })
  }

  /**
 * table事件处理
 * @param e 分页参数
 * @param searchForm 搜索项
 */
  handleTableChange(e: TableChange, searchForm: { [key: string]: any }) {
    switch (e.type) {
      case 'pageIndex':
        this.onPage(e, searchForm.model);
        break;
      case 'pageSize':
        this.onPage(e, searchForm.model);
        break;
      case 'checkbox':
        this.selectedItems = e.checkbox || [];
        break;
      case 'sort':
        this.sortModels = e?.sort?.map || {};
        this.onPage(e, searchForm.model);
        break;
      default:
        break;
    }
  }

}


