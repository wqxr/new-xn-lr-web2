/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\console\src\lib\pages\register-company\register-company-list.component.ts
 * @summary：注册公司列表
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                 hucongying         upgrade         2021-06-21
 ***************************************************************************/
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormlyFieldConfig } from '@lr/ngx-formly';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { SearchFormComponent } from '@lr/ngx-shared';
import { Column, TableChange, TableData } from '@lr/ngx-table';
import { XnTableComponent } from '@lr/ngx-table/lib/table.component';
import {
  RegisterStateOptions,
  ChannelOptions,
} from '../../../../../shared/src/lib/config/options';
import { EnvEnum } from '../../../../../shared/src/lib/config/enum';

@Component({
  templateUrl: './register-company-list.component.html',
  styles: [],
})
export class RegisterCompanyListComponent implements OnInit {
  @ViewChild('reviewTable') reviewTable: XnTableComponent;
  @ViewChild('searchForm') searchForm: SearchFormComponent;
  // 页码配置
  pageConfig = {
    pageIndex: 1,
    pageSize: 10,
    total: 0,
  };
  public paging = 1;
  public listInfo: any[] = []; // 表格数据
  public selectedItems: any[] = []; // 选中项
  public loading = true;
  public sortModels: { [key: string]: any } = {}; // 排序
  public bankInfo: any[] = []; // 银行信息
  // 表头
  public columns: Column[] = [
    {
      title: '序号',
      index: 'no',
      width: 50,
      fixed: 'left',
      format: (item: TableData, col: Column, index: number): string =>
        (index + 1).toString(),
    },
    {
      title: '企业ID',
      index: 'appId',
      width: 160,
      sort: {
        default: null,
        compare: null,
        key: 'appId',
        reName: { ascend: '1', descend: '-1' },
      },
    },
    {
      title: '企业名称',
      index: 'orgName',
      width: 260,
      sort: {
        default: null,
        compare: null,
        key: 'orgName',
        reName: { ascend: '1', descend: '-1' },
      },
    },
    { title: '法定代表人姓名', width: 160, index: 'orgLegalPerson' },
    {
      title: '注册渠道',
      index: 'channel',
      render: 'channelTpl',
      width: 160,
    },
    /** 0=草稿 1=未生效 2=已生效 */
    {
      title: '注册状态',
      index: 'status',
      render: 'statusTpl',
      width: 160,
      sort: {
        default: null,
        compare: null,
        key: 'status',
        reName: { ascend: '1', descend: '-1' },
      },
    },
    { title: '企业角色', width: 160, index: 'orgTypes', render: 'orgTypesTpl' },
    {
      title: '创建时间',
      index: 'createTime',
      render: 'dateTimeTpl',
      width: 260,
      sort: {
        default: null,
        compare: null,
        key: 'createTime',
        reName: { ascend: '1', descend: '-1' },
      },
    },
    {
      title: '更新时间',
      index: 'updateTime',
      render: 'dateTimeTpl',
      width: 260,
      sort: {
        default: null,
        compare: null,
        key: 'updateTime',
        reName: { ascend: '1', descend: '-1' },
      },
    },
    {
      title: '操作',
      width: 120,
      fixed: 'right',
      buttons: [
        {
          text: '查看详情',
          type: 'link',
          click: (e: any) => {
            this.xn.router.navigate([
              `/console/data/register-company/${e.appId}`,
            ]);
          },
        },
      ],
    },
  ];

  /** 列表排序后台传值配置 */
  listOrder: { [key: string]: any } = {
    /** 企业appId */
    appId: 1,
    /** 企业名称 */
    orgName: 2,
    /** 创建时间 */
    createTime: 3,
    /** 更新时间 */
    updateTime: 4,
    /** 注册状态 */
    status: 5,
  };

  // 搜索项
  public showFields: FormlyFieldConfig[] = [
    {
      className: 'ant-col ant-col-md-8 ant-col-sm-24',
      wrappers: ['form-field-horizontal'],
      key: 'appId',
      type: 'input',
      templateOptions: {
        label: '企业ID',
        placeholder: '请输入',
        autocomplete: 'off',
        labelSpan: 9,
        controlSpan: 15,
      },
    },
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
      key: 'orgLegalPerson',
      type: 'input',
      templateOptions: {
        label: '法定代表人姓名',
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
        label: '注册状态',
        nzPlaceHolder: '请选择',
        labelSpan: 9,
        controlSpan: 15,
        options: [
          { label: '草稿', value: 0 },
          { label: '未生效', value: 1 },
          { label: '已生效', value: 2 },
        ],
      },
    },
    {
      className: 'ant-col ant-col-md-8 ant-col-sm-24',
      wrappers: ['form-field-horizontal'],
      key: 'channel',
      type: 'select',
      templateOptions: {
        label: '注册渠道',
        nzPlaceHolder: '请选择',
        labelSpan: 9,
        controlSpan: 15,
        options: [
          { label: '农交所', value: 'LJS' },
          { label: '链融平台', value: 'LR' },
        ],
      },
    },
    {
      className: 'ant-col ant-col-md-8 ant-col-sm-24',
      wrappers: ['form-field-horizontal'],
      key: 'orgType',
      type: 'select',
      templateOptions: {
        label: '企业角色',
        nzPlaceHolder: '请选择',
        labelSpan: 9,
        controlSpan: 15,
        options: [
          { label: '供应商', value: '1' },
          { label: '保理商', value: '3' },
          { label: '银行', value: '4' },
          { label: '风控平台', value: '88' },
          { label: '平台', value: '99' },
          { label: '项目公司', value: '201' },
          { label: '总部公司', value: '202' },
          { label: '中介机构', value: '102' },
          { label: '服务机构', value: '6' },
        ],
      },
    },
  ];

  /** 是否生产环境 */
  get isProd() {
    return this.xn.user.env === EnvEnum.Production;
  }

  get registerStateOptions() {
    return RegisterStateOptions;
  }
  get channelOptions() {
    return ChannelOptions;
  }
  constructor(private xn: XnService, public hwModeService: HwModeService) {}

  ngOnInit(): void {
    this.onUrlData();
    this.onPage({ pageIndex: this.paging }, {});
  }

  /**
   * 跳转到新版用户管理
   */
  navToNew() {
    this.xn.router.navigate(['/console/data/register-company-relate-right']);
  }
  /**
   * @param e  pageIndex 页码 pageSize 每页数量 total 数据总数
   * @param searchModel  搜索项
   * @summary
   */
  public onPage(
    e?: { pageIndex: number; pageSize?: number; total?: number },
    searchModel?: { [key: string]: any }
  ) {
    this.loading = true;
    this.selectedItems = [];
    this.paging = e?.pageIndex || 1;
    this.onUrlData(); // 导航回退取值
    this.pageConfig = Object.assign({}, this.pageConfig, e);
    const params = this.buildParams(searchModel);
    this.xn.dragon.post('/app/app_register_list', params).subscribe(
      (x) => {
        this.loading = false;
        if (x.ret === 0) {
          this.listInfo = x.data.data;
          this.pageConfig.total = x.data.count;
        }
      },
      (err: any) => {
        console.error(err);
        this.loading = false;
      },
      () => {
        this.loading = false;
      }
    );
  }

  /**
   * 搜索条件查询
   */
  onSearch(data: any) {
    console.log('search data :>> ', data);
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
   * @param searchModel 原始数据
   */
  private buildParams(searchModel: { [key: string]: any }) {
    const params: any = {
      start: (this.paging - 1) * this.pageConfig.pageSize,
      length: this.pageConfig.pageSize,
    };

    // 排序处理
    for (const sortKey in this.sortModels) {
      params.order = [
        {
          name: this.listOrder[sortKey],
          asc: Number(this.sortModels[sortKey]),
        },
      ];
    }

    // 搜索处理
    for (const key of Object.keys(searchModel)) {
      if (!XnUtils.isEmptys(searchModel[key], [0])) {
        params[key] = searchModel[key]?.toString()?.trim();
      }
    }
    return params;
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
      case 'sort':
        this.sortModels = e?.sort?.map || {};
        this.onPage(e, searchForm.model);
        break;
      default:
        break;
    }
  }

  /**
   * 手动开户
   */
  createAuth() {
    this.xn.router.navigate([`/console/manage/record/create_company`]);
  }

  /**
   * 回退操作，路由存储
   */
  private onUrlData() {
    const urlData = this.xn.user.getUrlData(this.xn.router.url);
    if (urlData && urlData.pop) {
      this.paging = urlData.data.paging || this.paging;
      this.pageConfig = urlData.data.pageConfig || this.pageConfig;
      // this.arrObjs = urlData.data.arrObjs || this.arrObjs;
      // this.sortObjs = urlData.data.sortObjs || this.sortObjs;
    } else {
      this.xn.user.setUrlData(this.xn.router.url, {
        paging: this.paging,
        pageConfig: this.pageConfig,
        // arrObjs: this.arrObjs,
        // sortObjs: this.sortObjs,
      });
    }
  }
}
