import { includes } from 'lodash';
/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\account-system\src\lib\pages\account-list\account-list.component.ts
 * @summary：账户列表
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                 hucongying          init           2021-10-19
 ***************************************************************************/
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Column, ColumnButton, TableChange, TableData } from '@lr/ngx-table';
import { NzMessageService } from 'ng-zorro-antd/message';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { FormlyFieldConfig } from '@lr/ngx-formly';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { AccountStatusOptions, RouteUrlOptions } from 'libs/shared/src/lib/config/options'
import { AccountStatusTypeEnum, RetCodeEnum } from 'libs/shared/src/lib/config/enum';
import { XnTableComponent } from '@lr/ngx-table/lib/table.component';
import { XnSelectOptionPipe } from '../../shared/pipes';

@Component({
  templateUrl: './account-list.component.html',
  styles: [
    `
      .page-head {
        display: flex;
        justify-content: space-between;
      }
      .box-content {
        border-radius: 3px;
        background: #ffffff;
        box-shadow: 0 1px 1px rgb(0 0 0 / 10%);
      }
      .foot-set {
        position: absolute;
        bottom: -85px;
      }
      .right-button {
        text-align: right;
        padding: 0 10px 10px 10px
      }
      .table-content {
        padding: 10px;
        position: relative;
      }
    `,
  ],
})
export class AccountListComponent implements OnInit {
  // 表格数据
  listInfo: any[] = [] as any;
  // 表头
  columns: Column[] = [
    {
      title: '序号', index: 'no', width: 50, fixed: 'left',
      format: (item: TableData, col: Column, index: number): string => (index + 1).toString()
    },
    { title: '企业名称', index: 'appName', width: 260, },
    { title: '电子账本账号', index: 'virAcctNo', width: 260, },
    { title: '账户状态', index: 'accountStatus', render: 'accountStatusTpl', width: 260, },
    { title: '账户余额', index: 'balance', render: 'balanceTpl', width: 260, },
    {
      title: '操作', index: 'action', fixed: 'right', width: 160, buttons: [
        {
          text: '查看账户',
          type: 'link',
          click: (record: TableData, modal?: any, instance?: XnTableComponent) => {
            this.xn.router.navigate(['account-detail', record.appId], {
              relativeTo: this.router.parent,
            }).then();
          }
        },
        {
          text: '销户',
          type: 'del',
          pop: {
            title: '确认要销户吗？',
            trigger: 'click',
          },
          iif: (item: TableData, btn: ColumnButton, column: Column) => {
            return (item.accountStatus === AccountStatusTypeEnum.ACCOUNT_OPENED
              || item.accountStatus === AccountStatusTypeEnum.NEED_ACTIVE)
          },
          click: (record: TableData, modal?: any, instance?: XnTableComponent) => {
            this.logoutAccount(record.accountId);
          }
        },
        {
          text: '审核',
          type: 'link',
          iif: (item: TableData, btn: ColumnButton, column: Column) => {
            return [
              AccountStatusTypeEnum.OPEN_BEGIN,
              AccountStatusTypeEnum.OPEN_REVIEW,
              AccountStatusTypeEnum.BUSINESS_BEGIN,
              AccountStatusTypeEnum.BUSINESS_REVIEW,
              AccountStatusTypeEnum.OPERATOR_BEGIN,
              AccountStatusTypeEnum.OPERATOR_REVIEW,
            ].includes(item.accountStatus)
          },
          click: (record: TableData, modal?: any, instance?: XnTableComponent) => {
            const path = this.xnSelectOptionPipe.transform(record.accountStatus, this.routeUrlOptions);
            this.xn.router
              .navigate([`${path}`, record.accountId], {
                relativeTo: this.router.parent,
              }).then();
          }
        }
      ]
    },
  ];
  // 搜索项配置
  showFields: FormlyFieldConfig[] = [
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
      key: 'accountStatusList',
      type: 'select',
      templateOptions: {
        label: '账户状态',
        nzPlaceHolder: '请选择',
        labelSpan: 9,
        controlSpan: 15,
        options: AccountStatusOptions
      },
    },
  ];
  formModel: any = {} as any;
  // 分页
  pageConfig = {
    total: 0,
    pageIndex: 1,
    pageSize: 10
  }
  pageIndex: number = 1;
  loading: boolean = false;

  get accountStatusOptions() {
    return AccountStatusOptions
  }

  get routeUrlOptions() {
    return RouteUrlOptions
  }
  constructor(
    private xn: XnService,
    public hwModeService: HwModeService,
    private router: ActivatedRoute,
    private message: NzMessageService,
    private xnSelectOptionPipe: XnSelectOptionPipe,
    private cdr: ChangeDetectorRef,
  ) { }
  ngOnInit(): void {
    this.onPage({ pageIndex: 1, pageSize: 10 }, {});
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
    this.pageIndex = e.pageIndex || 1;
    this.pageConfig = Object.assign({}, this.pageConfig, e);
    let params = this.buildParams(searchModel);
    this.xn.middle.post2('/account/list', params).subscribe(
      (x) => {
        this.loading = false;
        if (x.code === RetCodeEnum.OK) {
          this.listInfo = x.data.accountInfoList;
          this.pageConfig.total = x.data.total;
        }
      },
      () => {
        this.loading = false;
      }
    );
  }

  /**
   * 构建列表请求参数
   * @param searchModel 搜索项
   */
  private buildParams(searchModel: { [key: string]: any }) {
    const params: any = {
      page: this.pageIndex,
      size: this.pageConfig.pageSize,
    };

    // 搜索处理
    for (const key of Object.keys(searchModel)) {
      if (!XnUtils.isEmptys(searchModel[key], [0])) {
        params[key] = searchModel[key];
        if (key === 'accountStatusList') {
          params[key] = [searchModel[key]];
        }
      }
    }
    return params;
  }

  /**
  * 搜索条件查询
  */
  onSearch(data: any) {
    this.formModel = data;
    this.pageConfig.pageIndex = 1;
    this.onPage(this.pageConfig, data);
  }

  /**
   * 重置搜索项表单
   */
  onReset() {
    this.formModel = {};
    this.onSearch({});
  }

  /**
   * 注销账户
   * @param accountId 账户id
   */
  logoutAccount(accountId: number) {
    this.xn.loading.open();
    this.xn.middle.post('/account/logout', { accountId }).subscribe(x => {
      if (x.code === RetCodeEnum.OK) {
        this.xn.loading.close();
        this.message.success('注销成功');
        this.onPage(this.pageConfig, this.formModel);
      }
    },
      (error) => {
        this.xn.loading.close();
        this.message.error(error.msg)
      }
    );
  }

  /**
   * 上传开户企业名单
   */
  uploadAccountList() {
    this.xn.router.navigate(['apply-account'], {
      relativeTo: this.router.parent,
    }).then();
  }

  /**
   * 表格事件handle
   * @param e table事件
   * @param seachQuery 搜索项
   */
  handleTableChange(e: TableChange) {
    switch (e.type) {
      case 'pageIndex':
        this.onPage(e, this.formModel);
        break;
      case 'pageSize':
        this.onPage(e, this.formModel);
        break;
      default:
        break;
    }
  }

  showMoney(item: TableData) {
    return ![null, undefined, ''].includes(item.balance)
  }

  /**
   * 已完成开户的
   * @param item
   * @returns
   */
  openAccountStatus(item: TableData) {
    return (item.virAcctNo && item.accountId) && item.accountStatus !== AccountStatusTypeEnum.LOGGED_OUT;
  }

  /**
   * 查看金额
   * @param record
   */
  viewBalance(record: TableData) {
    this.xn.middle
      .post2('/account/balance', { accountId: record.accountId })
      .subscribe({
        next: (res: any) => {
          if (res.code === RetCodeEnum.OK) {
            record.balance = res.data.totalBalance;
            this.cdr.markForCheck();
          }
        }
      });
  }
}
