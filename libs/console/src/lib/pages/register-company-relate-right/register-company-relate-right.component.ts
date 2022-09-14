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
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormlyFieldConfig } from '@lr/ngx-formly';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { SearchFormComponent } from '@lr/ngx-shared';
import {
  Column,
  TableChange,
  TableData,
} from '@lr/ngx-table';
import { XnTableComponent } from '@lr/ngx-table/lib/table.component';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormlyFormOptions } from '@ngx-formly/core';
import {
  RegisterStateEnum,
  RightStatus,
} from '../../../../../shared/src/lib/config/enum';
import {
  RegisterStateOptions,
  RightStatusOptions,
} from '../../../../../shared/src/lib/config/options';

@Component({
  templateUrl: './register-company-relate-right.component.html',
  styles: [],
})
export class RegisterCompanyRelateRightComponent implements OnInit {
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
  // 表头
  public columns: Column[] = [
    {
      title: '序号',
      index: 'no',
      width: 50,
      format: (item: TableData, col: Column, index: number): string =>
        (index + 1).toString(),
    },
    {
      title: '企业ID',
      index: 'appId',
      sort: {
        default: null,
        compare: null,
        key: 'appId',
        reName: { ascend: 'asc', descend: 'desc' },
      },
    },
    {
      title: '企业名称',
      index: 'appName',
      sort: {
        default: null,
        compare: null,
        key: 'appName',
        reName: { ascend: 'asc', descend: 'desc' },
      },
    },
    { title: '法定代表人姓名', index: 'orgLegalPerson' },
    /** 0=草稿 1=未生效 2=已生效 */
    {
      title: '注册状态',
      index: 'status',
      render: 'statusTpl',
      sort: {
        default: null,
        compare: null,
        key: 'status',
        reName: { ascend: 'asc', descend: 'desc' },
      },
    },
    {
      title: '权限系统信息状态',
      index: 'rightStatus',
      render: 'rightStatusTpl',
    },
    { title: '企业角色', index: 'orgTypes', render: 'orgTypesTpl' },
    {
      title: '创建时间',
      index: 'createTime',
      render: 'dateTimeTpl',
      sort: {
        default: null,
        compare: null,
        key: 'createTime',
        reName: { ascend: 'asc', descend: 'desc' },
      },
    },
    {
      title: '更新时间',
      index: 'updateTime',
      render: 'dateTimeTpl',
      sort: {
        default: null,
        compare: null,
        key: 'updateTime',
        reName: { ascend: 'asc', descend: 'desc' },
      },
    },
    {
      title: '操作',
      width: 185,
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
        {
          text: '权限系统相关',
          type: 'link',
          iif: (e: any) => this.rightBtnCtrl(e),
          children: [
            {
              text: '注册到权限系统',
              type: 'link',
              pop: '确定执行注册？',
              iif: (e: any) => e.rightStatus === RightStatus.NotReg,
              click: (e: any) => {
                this.doRightReg(e);
              },
            },
            {
              text: '同步到权限系统',
              type: 'link',
              pop: '确定执行同步？',
              iif: (e: any) => e.rightStatus === RightStatus.NotSync,
              click: (e: any) => {
                this.doRightSync(e);
              },
            },
          ],
        },
      ],
    },
  ];

  options: FormlyFormOptions = {
    formState: {
      /** 所有系统 */
      sysOptions: [],
    },
  };
  showFields: FormlyFieldConfig[] = [
    {
      className: 'ant-col ant-col-md-8 ant-col-sm-24',
      wrappers: ['form-field-horizontal'],
      key: 'systemId',
      type: 'select',
      templateOptions: {
        label: '所在系统',
        nzPlaceHolder: '请选择',
        labelSpan: 9,
        controlSpan: 15,
      },
      expressionProperties: {
        'templateOptions.options': 'formState.sysOptions',
      },
    },
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
      key: 'appName',
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
        options: RegisterStateOptions,
      },
    },
  ];
  searchModel: any = {};

  get rightStatusOptions() {
    return RightStatusOptions;
  }

  get registerStateOptions() {
    return RegisterStateOptions;
  }

  constructor(
    private xn: XnService,
    public hwModeService: HwModeService,
    public msg: NzMessageService
  ) {}

  ngOnInit(): void {
    this.fetchSysList();
    this.onUrlData();
  }

  /** 权限系统相关操作的按钮控制，企业已生效，未在权限系统注册、同步 */
  rightBtnCtrl(row: any) {
    return (
      [RightStatus.NotReg, RightStatus.NotSync].includes(row.rightStatus) &&
      row.status === RegisterStateEnum.InForce
    );
  }

  /**
   * 获取企业已注册的系统列表
   */
  fetchSysList() {
    this.xn.api.post('/product_right/all_system', {}).subscribe({
      next: (res) => {
        this.formatSysOptions(res.data);
        this.searchModel = {
          systemId: this.options.formState.sysOptions[0].value,
        };
        this.onPage({ pageIndex: this.paging });
      },
      error: (err) => {
        this.msg.error(err.msg || '获取系统列表失败');
      },
    });
  }

  /**
   * 格式化系统列表信息
   * @param data 系统列表
   */
  formatSysOptions(data: { systemList: any[] }) {
    if (data.systemList && data.systemList.length) {
      this.options.formState.sysOptions = data.systemList.map((c) => {
        return {
          label: c.name,
          value: c.systemId,
        };
      });
    }
  }

  navToOld() {
    this.xn.router.navigate(['/console/data/register-company']);
  }

  /** 注册到权限系统 */
  doRightReg(e) {
    this.xn.api
      .post('/app_info/right_register', {
        appId: e.appId,
        systemId: this.searchModel.systemId,
      })
      .subscribe(
        () => {
          this.msg.success('在权限系统中注册成功');
          this.onPage({ pageIndex: this.paging });
        },
        (err) => {
          this.msg.error(err.msg || '操作失败');
        }
      );
  }

  /** 同步到权限系统 */
  doRightSync(e) {
    this.xn.api
      .post('/app_info/right_modify', {
        appId: e.appId,
        systemId: this.searchModel.systemId,
      })
      .subscribe(
        () => {
          this.msg.success('在权限系统中同步成功');
          this.onPage({ pageIndex: this.paging });
        },
        (err) => {
          this.msg.error(err.msg || '操作失败');
        }
      );
  }

  /** 企业角色展示 */
  orgTypeTit(data: { orgName: string; orgType: number }[]) {
    return data.map((c) => c.orgName).join(', ');
  }

  /**
   * @param e  pageIndex 页码 pageSize 每页数量 total 数据总数
   * @summary
   */
  public onPage(e?: { pageIndex: number; pageSize?: number; total?: number }) {
    this.loading = true;
    this.selectedItems = [];
    this.paging = e?.pageIndex || 1;
    this.onUrlData(); // 导航回退取值
    this.pageConfig = Object.assign({}, this.pageConfig, e);
    const params = this.buildParams();
    this.xn.api.post('/app_info/get_register_app_list', params).subscribe(
      (x) => {
        this.loading = false;
        if (x.ret === 0) {
          this.listInfo = x.data.data;
          this.pageConfig.total = x.data.count;
        }
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
    this.pageConfig.pageIndex = 1;
    this.selectedItems = [];
    this.searchModel = data;
    this.onPage(this.pageConfig);
  }

  /**
   * 重置搜索项表单
   */
  onReset(searchForm: any) {
    this.selectedItems = [];
    this.sortModels = {};
    searchForm.form.reset();
    this.searchModel = { systemId: this.options.formState.sysOptions[0].value };
    this.reviewTable.clearStatus();
    this.onSearch(this.searchModel);
  }

  /**
   * 构建列表请求参数
   */
  private buildParams() {
    const params: any = {
      start: (this.paging - 1) * this.pageConfig.pageSize,
      length: this.pageConfig.pageSize,
    };

    // 排序处理
    for (const sortKey in this.sortModels) {
      if (this.sortModels.hasOwnProperty(sortKey)) {
        params.order = [sortKey, this.sortModels[sortKey]];
      }
    }

    // 搜索处理
    for (const key of Object.keys(this.searchModel)) {
      if (!XnUtils.isEmptys(this.searchModel[key], [0])) {
        params[key] = this.searchModel[key]?.toString()?.trim();
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
        this.onPage(e);
        break;
      case 'pageSize':
        this.onPage(e);
        break;
      case 'sort':
        this.sortModels = e?.sort?.map || {};
        this.onPage(e);
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
