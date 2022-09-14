import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { SelectOptions } from 'libs/shared/src/lib/config/select-options';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import * as _ from 'lodash';

declare const moment: any;

@Component({
  templateUrl: './batch-modify.component.html',
  styles: [`
    table {
      table-layout: fixed;
      margin: 0;
    }

    table tr td:first-child, table tr th:first-child {
      width: 196px;
    }

    .scroll-height {
      max-height: calc(100vh - 450px);
      overflow-y: auto
    }

    .scroll-height > table {
      border-top: none;
    }

    .scroll-height > table tr:first-child td {
      border-top: 0;
    }

    .checkbox label {
      padding-right: 6px;
    }

    .padding-0 {
      padding: 0;
    }

    .text-error  {
      color: red;
    }
  `]
})
export class BatchModifyComponent implements OnInit {

  /** formCapitalPool(query params) */
  public formCapitalPool: any;

  public heads = [
    { label: '交易ID', value: 'mainFlowId' },
    { label: '收款单位', value: 'debtUnit' },
    { label: '申请付款单位', value: 'projectCompany' },
    { label: '总部公司', value: 'headquarters' },
    { label: '资产编号', value: 'poolTradeCode' },
    { label: '交易金额', value: 'receive' },
    { label: '保理融资到期日', value: 'factoringEndDate' },
    { label: '预计放款日期', value: 'priorityLoanDate' },
    { label: '渠道价格', value: 'channelPrice' },
    { label: '资产转让折扣率', value: 'discountRate' },
    { label: '付款确认书编号', value: 'payConfirmId' },
  ];

  public rows: any[] = [];
  public detailInfo: any[] = [];
  public bankAccount = '';
  public payerName = '';

  public isDemoList = false; // 台账标识
  public isVanke = false; // 资产管理标识
  public vankeQueryParams: any; // 资产管理标识
  public isEnterPoor: any; // 拟入池标识
  public data: {
    capitalPoolId: string;              // 资产池ID 长度[1,40]
    mainFlowIdList: string[];           // 选择的交易ID列表
    factoringEndDate?: string;          // 保理融资到期日 时间戳 单位毫秒
    priorityLoanDate?: string;          // 优先放款日期
    fundingChannelId?: string;
    channelType?: number;         // 对应的资金渠道ID
    channelPrice?: any;         // 对应的渠道价格
    discountRate?: any;
    payConfirmIdList?: any[];
    payConfirmInfo?: any;
  } = {
    capitalPoolId: '',
    mainFlowIdList: [],
    factoringEndDate: '',
    priorityLoanDate: '',
    fundingChannelId: '',
    channelType: 0,
    channelPrice: '',
    discountRate: '',
    payConfirmIdList: [],
    payConfirmInfo: {},
  };

  public errors = {
    factoringEndDate: false,
    priorityLoanDate: false,
    channelPrice: false,
    discountRate: false,
  };

  public infos = [
    { label: '保理融资到期日', value: 'factoringEndDate', checked: false, memo: '保理融资到期日，仅供应商签署合同之前可通过此页面修改' },
    { label: '预计放款日期', value: 'priorityLoanDate', checked: false, memo: '预计放款日期，可以在任何时候修改' },
    { label: '资金渠道', value: 'channelType', checked: false, memo: '资金渠道， 仅在发起审批前可以修改' },
    { label: '付款账户信息', value: 'fundingChannelId', checked: false, memo: '付款账户信息，仅在发起审批前可以修改' },
    { label: '渠道价格', value: 'channelPrice', checked: false, memo: '渠道价格，可以在任何时候修改' },
    { label: '资产转让折扣率', value: 'discountRate', checked: false, memo: '资产转让折扣率，仅供应商签署合同之前可通过此页面修改' },
    { label: '付款确认书编号', value: 'payConfirmId', checked: false, memo: '付款确认书编号，仅供应商签署合同之前可通过此页面修改' },
  ];

  public enterpriserSelectItems = SelectOptions.get('abs_headquarters'); // 总部企业对应;

  /** 资金渠道 */
  public moneyChannelOptions: any[] = SelectOptions.get('moneyChannel');

  /** 资金渠道 > 银行 */
  public bankOptions: any[] = [];

  /** 资金渠道 > 银行 > 账号 */
  public accountOptions: any[] = [];

  private bankInfo: any[] = [];

  /* 自定义组件配置。若不设置，则使用默认配置 */
  public options: any = {
    format: 'yyyymmdd',
  };

  constructor(public xn: XnService,
              public route: ActivatedRoute,
              private loadingService: LoadingService,
              private localStorageService: LocalStorageService) {

  }

  ngOnInit() {
    this.route.queryParams.subscribe(x => {
      this.formCapitalPool = x;
      this.data.capitalPoolId = this.formCapitalPool.capitalId ? this.formCapitalPool.capitalId : '';
      this.isDemoList = this.formCapitalPool.isDemoList ? this.formCapitalPool.isDemoList : false;
      this.isVanke = this.formCapitalPool.isVanke ? this.formCapitalPool.isVanke : false;
      this.isEnterPoor = this.formCapitalPool.isEnterPoor ? this.formCapitalPool.isEnterPoor : false;
    });
    this.rows = this.localStorageService.caCheMap.get('batchModifyMainList')?.mainList || [];
    this.data.mainFlowIdList = this.rows.map((x: any) => x.mainFlowId);
    this.data.payConfirmIdList = this.rows.map(c => {
      return {
        mainFlowId: c.mainFlowId,
        payConfirmId: c.payConfirmId || '',
      };
    });
    this.initChannelData();
  }

  public submit() {
    const param = this.infos.filter((x: any) => x.checked === false).map((x: any) => x.value);
    this.data = _.omit(this.data, param);
    if (this.validate()) {
      this.loadingService.open();
      const params = {
        ...this.data,
        factoringEndDate: this.getTime(this.data.factoringEndDate),
        priorityLoanDate: this.getTime(this.data.priorityLoanDate),
        // channelType: this
      };

      // 台账列表
      delete params.capitalPoolId;
      if (!params.channelPrice) {
        delete params.channelPrice;
      }
      if (!params.discountRate) {
        delete params.discountRate;
      }
      if (params.payConfirmIdList?.length) {
        params.payConfirmIdList.forEach(c => {
          params.payConfirmInfo[c.mainFlowId] = c.payConfirmId;
        });
      }
      if (!this.infos[6].checked) {
        delete params.payConfirmInfo;
      }
      delete params.payConfirmIdList;
      this.xn.api.dragon.post('/pool/batch_modify', params)
        .subscribe({
          next: () => this.goBack(),
          error: () => this.loadingService.close(),
        });

    }
  }

  /**
   *  返回
   */
  public goBack() {
    // if (this.isDemoList) {
    //     // 台账列表
    //     this.xn.router.navigate(['/machine-account']);
    // } else if (this.isVanke) {
    //     // 资产管理
    //     this.xn.router.navigate(['/logan/vanke/capital-pool'], {
    //         queryParams: this.formCapitalPool
    //     });
    // } else if (this.isEnterPoor) {
    //     // 拟入池
    //     this.xn.router.navigate(['/logan/vanke/enter-pool']);
    // } else {
    //     this.xn.router.navigate(['/logan/capital-pool/trading-list'], {
    //         queryParams: this.formCapitalPool
    //     });
    // }
    window.history.go(-1)

  }

  /**
   * 渠道价格
   * @params value
   */
  public onChange(value: string, type) {
    const re: RegExp = /^(^[1-9](\d)?(\.\d{1,2})?$)|(^0$)|(^\d\.\d{1,2}$)$/;
    const ok = re.test(value);
    this.errors[type] = !ok;
    this.data[type] = ok ? Number(value) : '';
  }

  /**
   * 补充信息
   */
  onInfoChange(item) {
    item.checked = !item.checked;

    if (!item.checked) {
      this.data[item.value] = undefined;
    }
  }

  /**
   * 查看交易流程
   * @param item mainFlowId
   */
  public viewProcess(item: any) {
    this.xn.router.navigate([`logan/main-list/detail/${item}`]);
  }

  public moneyChannelChange(value) {
    this.data.channelType = Number(value);
    // 级联设置银行选项

  }

  public bankChange(value) {
    const selected = this.bankInfo.find(x => +x.id === +value);

    if (selected) {
      // 级联设置账号选项
      this.accountOptions = this.bankInfo
        .filter((x: any) => x.id === selected.id && x.bankName === selected.bankName)
        .map(x => {
          return {
            label: x.cardCode,
            value: x.id,
          };
        });

      if (this.accountOptions.length > 0) {
        // 默认选择第一项
        this.accountChange(this.accountOptions[0].value);
      }
    }
  }

  public accountChange(value) {

    this.data.fundingChannelId = value;
    // const selected = this.bankInfo.find(x => +x.id === +value);
    // this.detailInfo = this.bankInfo
    //     .filter((x: any) => x.channelType === selected.channelType &&
    //         x.bankName === selected.bankName && x.payerAccount === selected.payerAccount).map(x => {
    //             return {
    //                 bankAccount: x.bankAccount,
    //                 value: x.id,
    //                 payerName: x.payerName
    //             }
    //         })
    // if (this.detailInfo.length > 0) {
    //     // 默认选择第一项
    //     this.getDetailInfo(this.detailInfo[0].value);
    // }
  }

  public formatDate(date) {
    return XnUtils.formatDate(date);
  }
  // public getDetailInfo(value) {
  //     const selected = this.bankInfo.find(x => +x.id === +value);
  //     this.bankAccount = selected.bankAccount;
  //     this.payerName = selected.payerName;
  // }

  private initChannelData() {
    this.xn.api.dragon.post('/pool/funding_channel_list', {}).subscribe(x => {

      this.bankInfo = x.data;
      // 默认选择第一项
      this.moneyChannelChange(this.moneyChannelOptions[0].value);
      this.bankOptions = this.bankInfo.map(x => {
        return {
          label: x.bankName,
          value: x.id,
        };
      });
      this.accountOptions = this.bankInfo
        .map(x => {
          return {
            label: x.cardCode,
            value: x.id,
          };
        });
      if (this.bankOptions.length > 0) {
        this.bankChange(this.bankOptions[0].value);
      }

    });
  }

  public selectedDate(value: any, key: string) {
    this.data[key] = value.format();
  }

  private validate() {
    this.errors.factoringEndDate = !this.validDate(`${this.data.factoringEndDate}`);
    this.errors.priorityLoanDate = !this.validDate(`${this.data.priorityLoanDate}`);

    return Object.keys(this.errors)
      .filter(x => this.infos.find(y => y.value === x).checked)
      .every(x => !this.errors[x]);
  }

  private validDate(str: string) {
    if (str.length !== 8) {
      return false;
    }

    return moment(this.getTime(str)).format('YYYYMMDD') === str;
  }

  private getDateInfo(str: string) {
    const y = +str.substr(0, 4);
    const m = +str.substr(4, 2);
    const d = +str.substr(6, 2);

    return { y, m, d };
  }

  private getTime(date: string) {
    if (date) {
      const { y, m, d } = this.getDateInfo(`${date}`);

      return new Date(`${y}/${m}/${d}`).getTime();
    }

    return undefined;
  }

}
