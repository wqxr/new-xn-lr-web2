/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\account-system\src\lib\pages\account-info\account-info.component.ts
 * @summary：我的账户信息页面
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                 hucongying          init           2021-10-20
 ***************************************************************************/
import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Column, ColumnButton, TableChange, TableData } from '@lr/ngx-table';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import {
  AccountStatusTypeEnum,
  BankTypeEnum,
  RetCodeEnum,
  SystemCodeEnum,
  TradeStatusEnum,
} from 'libs/shared/src/lib/config/enum';
import { XnTableComponent } from '@lr/ngx-table/lib/table.component';
import {
  AccountBankTypeOptions,
  AccountStatusOptions,
  RouteUrlOptions,
  TradeDirectionOptions,
  TradeStatusOptions,
  TranAmtTypeOptions,
} from 'libs/shared/src/lib/config/options';
import * as moment from 'moment';
import { XnSelectOptionPipe } from '../../shared/pipes';

@Component({
  templateUrl: './my-account.component.html',
  styles: [
    `
      ::ng-deep .ant-card-head-title {
        font-weight: bold;
      }
      .company-title {
        font-weight: bold;
        font-size: 20px;
      }
      .active-status {
        display: block;
        height: 24px;
        line-height: 24px;
        padding: 0 10px;
        background: #d1e0f4;
        text-align: center;
        color: #4b87d3;
        border-radius: 20px;
        margin: 3px 0 0 10px;
      }
      .company-account {
        color: #707880;
        margin-top: 20px;
      }
      .tip-divider {
        margin: 11px 0;
        background-color: #4b87d3;
      }
      .account-money {
        font-size: 20px;
        color: black;
        font-weight: bold;
        margin-right: 5px;
      }
      .left-title {
        padding: 5px;
        text-align: right;
      }
      .right-money {
        padding: 5px;
        text-align: left;
      }
      #u809 {
        border-width: 0px;
        left: 303px;
        top: 189px;
        width: 62px;
        height: 62px;
        display: flex;
        margin-right: 10px;
      }
      #u809Img {
        border-width: 0px;
        position: absolute;
        left: 0px;
        top: 0px;
        width: 62px;
        height: 62px;
      }
    `,
  ],
})
export class MyAccountComponent implements OnInit {
  // 企业appId
  appId: string = this.xn.user.appId;
  accountInfo: any = {} as any;
  // 分页
  pageConfig = {
    total: 0,
    pageIndex: 1,
    pageSize: 10,
  };
  pageIndex: number = 1;
  // 表格数据
  listInfo: any[] = [] as any;
  loading: boolean = false;
  loadingTable: boolean = false;
  // 表头
  columns: Column[] = [
    {
      title: '序号',
      index: 'no',
      fixed: 'left',
      width: 50,
      format: (item: TableData, col: Column, index: number): string =>
        (index + 1).toString(),
    },
    { title: '交易明细ID', index: 'detailId', width: 300, },
    { title: '交易金额', index: 'tradeAmount', render: 'amountTpl', width: 260, },
    { title: '交易方向', index: 'tradeDirection', render: 'directionTpl', width: 260, },
    { title: '交易时间', index: 'tradeTime', width: 260, },
    { title: '交易状态', index: 'tradeStatus', render: 'statusTpl', width: 260, },
    { title: '动账金额类型', index: 'tranAmtType', render: 'amyTpl', width: 260, },
    {
      title: '操作',
      index: 'action',
      fixed: 'right',
      width: 200,
      buttons: [
        {
          text: '查看明细',
          type: 'link',
          iif: (item: TableData, btn: ColumnButton, column: Column) => {
            return item.tradeStatus === TradeStatusEnum.SUCCESS;
          },
          click: (
            record: TableData,
            modal?: any,
            instance?: XnTableComponent
          ) => {
            this.xn.router
              .navigate(['trade-detail'], {
                relativeTo: this.router.parent,
                queryParams: {
                  tradeInfo: JSON.stringify(record),
                },
              })
              .then();
          },
        },
        {
          text: '电子回单下载',
          type: 'link',
          iif: (item: TableData, btn: ColumnButton, column: Column) => {
            return item.tradeStatus === TradeStatusEnum.SUCCESS;
          },
          click: (
            record: TableData,
            modal?: any,
            instance?: XnTableComponent
          ) => {
            this.downLoadTrade(this.accountInfo.accountId, record.detailId);
          },
        },
      ],
    },
  ];
  query: any = {
    // 交易方向
    tradeDirection: undefined,
    beginTime: undefined,
    endTime: undefined,
  };
  // 账户金额信息
  balanceInfo = {} as any;
  get accountStatusOptions() {
    return AccountStatusOptions;
  }

  // 交易方向
  get tradeDirectionOptions() {
    return TradeDirectionOptions;
  }
  // 交易状态
  get tradeStatusOptions() {
    return TradeStatusOptions;
  }
  // 动账金额类型
  get tranAmtTypeOptions() {
    return TranAmtTypeOptions;
  }

  // 账户体系银行类型
  get accountBankTypeOptions() {
    return AccountBankTypeOptions
  }

  get routeUrlOptions() {
    return RouteUrlOptions
  }
  constructor(
    private xn: XnService,
    public hwModeService: HwModeService,
    private router: ActivatedRoute,
    private xnSelectOptionPipe: XnSelectOptionPipe,
  ) { }
  ngOnInit(): void {
    this.getAccountInfo();
  }

  /**
   * 获取账户详情
   */
  getAccountInfo() {
    this.loading = true;
    this.xn.loading.open();
    this.xn.middle
      .post('/account/info/overview', {
        appId: this.appId,
        bankType: BankTypeEnum.SH_BANK,
      })
      .subscribe(
        (x) => {
          this.xn.loading.close();
          if (x.code === RetCodeEnum.OK) {
            this.loading = true;
            this.accountInfo = x.data;
            if (this.accountInfo.virAcctNo) {
              this.getTradeList({ pageIndex: 1, pageSize: 10 }, this.query);
              if (this.accountInfo.accountStatus !== AccountStatusTypeEnum.LOGGED_OUT) {
                this.getBalance(this.accountInfo.accountId);
              }
            }
          }
        },
        () => {
          this.xn.loading.close();
        }
      );
  }

  /**
   * 查询账户金额
   * @param accountId 账户Id
   */
  getBalance(accountId: string) {
    this.xn.middle
      .post2('/account/balance', { accountId })
      .subscribe({
        next: (res: any) => {
          if (res.code === RetCodeEnum.OK) {
            this.balanceInfo = res.data;
          }
        }
      });
  }

  /**
   * 获取交易明细
   */
  getTradeList(e?: { pageIndex: number; pageSize?: number; total?: number }, query?: any) {
    this.loadingTable = true;
    this.pageIndex = e.pageIndex || 1;
    this.pageConfig = Object.assign({}, this.pageConfig, e);
    const params = this.buildParams(query);

    this.xn.middle.post2('/account/trade/list', params).subscribe(
      (x) => {
        this.loadingTable = false;
        if (x.code === RetCodeEnum.OK) {
          this.listInfo = x.data.tradeList;
          this.pageConfig.total = x.data.total;
        }
      },
      () => {
        this.loadingTable = false;
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
      accountId: this.accountInfo.accountId,
      systemCode: SystemCodeEnum.XN_LR,
    };

    // 搜索处理
    for (const key of Object.keys(searchModel)) {
      if (!XnUtils.isEmptys(searchModel[key], [0])) {
        params[key] = searchModel[key] ? searchModel[key] : undefined;
      }
    }
    return params;
  }

  /**
   * 下载电子回单
   * @param accountId 账户id
   * @param detailId 明细id
   */
  downLoadTrade(accountId: string, detailId: string) {
    this.xn.middle
      .getFileDownload('/account/trade/download/electronic', {
        accountId,
        detailId,
      })
      .subscribe((res) => {
        const fileName = this.xn.middle.getFileName(res.Body.headers);
        this.xn.middle.save(res.Body.body, fileName);
      });
  }

  /**
   * 打款激活
   */
  activeAccount() {
    const path = this.xnSelectOptionPipe.transform(this.accountInfo.accountStatus, this.routeUrlOptions);
    this.xn.router
      .navigate([`${path}`, this.accountInfo.accountId], {
        relativeTo: this.router.parent,
      }).then();
  }

  /**
   * 查看账户信息
   */
  viewAccountInfo() {
    this.xn.router
      .navigate(['account-info', this.accountInfo.accountId], {
        relativeTo: this.router.parent,
      })
      .then();
  }

  /**
   * 查看经办人信息
   */
  viewOperatorInfo() {
    this.xn.router
      .navigate(['operator-info/view', this.accountInfo.accountId], {
        relativeTo: this.router.parent,
      })
      .then();
  }

  /**
   * 查看工商信息
   */
  viewBusinessInfo() {
    this.xn.router
      .navigate(['business-info/view', this.accountInfo.accountId], {
        relativeTo: this.router.parent,
      })
      .then();
  }

  /**
   * 去开户
   */
  supplyAccountInfo() {
    this.xn.router
      .navigate(['supply-account-info', this.accountInfo.accountId], {
        relativeTo: this.router.parent,
      })
      .then();
  }

  /**
   * 提现
   */
  withdraw(e: Event) {
    e.preventDefault();
    this.xn.router
      .navigate(['withdraw', this.accountInfo.accountId], {
        relativeTo: this.router.parent,
        queryParams: {
          balance: this.balanceInfo.withdrawableBalance
        }
      })
      .then();
  }

  /**
   * 绑定银行账户
   */
  bindAccount() {
    this.xn.router
      .navigate(['bind-account/list', this.accountInfo.accountId], {
        relativeTo: this.router.parent,
      })
      .then();
  }

  /**
   * 选择交易方向
   * @param e
   */
  onSelectChange(e: any) {
    if (this.accountInfo.virAcctNo) {
      this.getTradeList(this.pageConfig, this.query);
    }
  }
  /**
   * 选择交易时间
   * @param date
   */
  onDateChange(date: any) {
    let beginTime = date[0];
    let endTime = date[1];
    if (XnUtils.isEmpty(date)) {
      this.query.beginTime = undefined;
      beginTime = undefined;
      this.query.endTime = undefined;
      endTime = undefined;
    } else {
      beginTime = moment(beginTime).format('YYYY-MM-DD HH:mm:ss');
      endTime = moment(endTime).format('YYYY-MM-DD HH:mm:ss');
      this.query.beginTime = beginTime;
      this.query.endTime = endTime;
    }
    if (this.accountInfo.virAcctNo) {
      this.getTradeList(this.pageConfig, this.query)
    }
  }

  /**
   * 表格事件handle
   * @param e table事件
   * @param seachQuery 搜索项
   */
  handleTableChange(e: TableChange) {
    switch (e.type) {
      case 'pageIndex':
        this.getTradeList(e, this.query);
        break;
      case 'pageSize':
        this.getTradeList(e, this.query);
        break;
      default:
        break;
    }
  }

  /**
   * 查看账户信息
   * @returns
   */
  showAccountInfo() {
    return [
      AccountStatusTypeEnum.NEED_ACTIVE,
      AccountStatusTypeEnum.ACCOUNT_OPENED,
      AccountStatusTypeEnum.BUSINESS_BEGIN,
      AccountStatusTypeEnum.BUSINESS_REVIEW,
      AccountStatusTypeEnum.BUSINESS_CONFIRM,
      AccountStatusTypeEnum.BUSINESS_REJECT,
      AccountStatusTypeEnum.OPERATOR_BEGIN,
      AccountStatusTypeEnum.OPERATOR_REVIEW,
      AccountStatusTypeEnum.OPERATOR_CONFIRM,
      AccountStatusTypeEnum.OPERATOR_REJECT,
      AccountStatusTypeEnum.OPERATOR_UNACTIVE,
      AccountStatusTypeEnum.MODIFIY,
    ].includes(this.accountInfo.accountStatus);
  }

  /**
   * 待开户
   * @returns
   */
  canApplyAccount() {
    return [
      AccountStatusTypeEnum.SUBMITTED,
      AccountStatusTypeEnum.OPEN_REJECT
    ].includes(this.accountInfo.accountStatus);
  }

  /**
   * 已开户
   * @returns
   */
  canAddAccount() {
    return (
      this.accountInfo.accountStatus === AccountStatusTypeEnum.ACCOUNT_OPENED
    );
  }

  /**
   * 待激活状态
   * @returns
   */
  canActiveAccount() {
    return [
      AccountStatusTypeEnum.NEED_ACTIVE,
      AccountStatusTypeEnum.OPERATOR_UNACTIVE,
      AccountStatusTypeEnum.MODIFIY
    ].includes(this.accountInfo.accountStatus);
  }

  /**
   * 确认开户
   * @returns
   */
  confirmApplyAccount() {
    return this.accountInfo.accountStatus === AccountStatusTypeEnum.OPEN_CONFIRM;
  }

  /**
  * 确认修改
  * @returns
  */
  confirmModify() {
    return [
      AccountStatusTypeEnum.BUSINESS_CONFIRM,
      AccountStatusTypeEnum.OPERATOR_CONFIRM
    ].includes(this.accountInfo.accountStatus);
  }

  showMoney(money: any) {
    return ![null, undefined, ''].includes(money)
  }

  goBack() {
    window.history.go(-1);
  }

  /**
   * 确认开户
   */
  confirmOpenAccount() {
    this.xn.router
      .navigate(['confirm-account-info', this.accountInfo.accountId], {
        relativeTo: this.router.parent,
      }).then();
  }

  /**
   * 确认修改
   */
  confirmAccountInfo() {
    const path = this.xnSelectOptionPipe.transform(this.accountInfo.accountStatus, this.routeUrlOptions);
    this.xn.router
      .navigate([`${path}`, this.accountInfo.accountId], {
        relativeTo: this.router.parent,
      }).then();
  }
}
