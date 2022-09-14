/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\abs-gj\src\lib\pages\capital-pool\batch-modify\batch-modify.component.ts
 * @summary：batch-modify.component.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-11-26
 ***************************************************************************/
import * as _ from 'lodash';
import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../../../../../../../shared/src/lib/services/loading.service';
import { ActivatedRoute } from '@angular/router';
import { SelectOptions } from '../../../../../../../shared/src/lib/config/select-options';
import { LocalStorageService } from '../../../../../../../shared/src/lib/services/local-storage.service';
import { XnService } from '../../../../../../../shared/src/lib/services/xn.service';
import { XnUtils } from '../../../../../../../shared/src/lib/common/xn-utils';

declare const moment: any;

@Component({
  templateUrl: './batch-modify.component.html',
  styleUrls: [`./batch-modify.component.less`]
})
export class GjBatchModifyComponent implements OnInit {
  public heads = [
    {label: '交易ID', value: 'mainFlowId'},
    {label: '收款单位', value: 'debtUnit'},
    {label: '申请付款单位', value: 'projectCompany'},
    {label: '总部公司', value: 'headquarters'},
    {label: '资产编号', value: 'poolTradeCode'},
    {label: '交易金额', value: 'receive'},
    {label: '保理融资到期日', value: 'factoringEndDate'},
    {label: '预计放款日期', value: 'priorityLoanDate'},
    {label: '渠道价格', value: 'channelPrice'},
  ];

  public rows: any[] = [];
  public data: {
    mainFlowIdList: string[];           // 选择的交易ID列表
    factoringEndDate?: string;          // 保理融资到期日 时间戳 单位毫秒
    priorityLoanDate?: string;          // 优先放款日期
    fundingChannelId?: string;
    channelType?: number;         // 对应的资金渠道ID
    channelPrice?: any;         // 对应的渠道价格
  } = {
    mainFlowIdList: [],
    factoringEndDate: '',
    priorityLoanDate: '',
    fundingChannelId: '',
    channelType: 0,
    channelPrice: '',
  };

  public errors = {
    factoringEndDate: false,
    priorityLoanDate: false,
    channelPrice: false
  };

  public infos = [
    {label: '保理融资到期日', value: 'factoringEndDate', checked: false, memo: '保理融资到期日，仅供应商签署合同之前可通过此页面修改'},
    {label: '预计放款日期', value: 'priorityLoanDate', checked: false, memo: '预计放款日期，可以在任何时候修改'},
    {label: '资金渠道', value: 'channelType', checked: false, memo: '资金渠道， 仅在发起审批前可以修改'},
    {label: '付款账户信息', value: 'fundingChannelId', checked: false, memo: '付款账户信息，仅在发起审批前可以修改'},
    {label: '渠道价格', value: 'channelPrice', checked: false, memo: '渠道价格，可以在任何时候修改'},
  ];

  public enterpriserSelectItems = SelectOptions.get('abs_headquarters'); // 总部企业对应;

  /** 资金渠道 */
  public moneyChannelOptions: any[] = SelectOptions.get('moneyChannel');

  /** 资金渠道 > 银行 */
  public bankOptions: any[] = [];

  /** 资金渠道 > 银行 > 账号 */
  public accountOptions: any[] = [];

  private bankInfo: any[] = [];

  /** xn-date-picker 配置 */
  public options: any = {
    format: 'yyyymmdd',
  };

  constructor(
    public xn: XnService,
    public route: ActivatedRoute,
    private loadingService: LoadingService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit() {
    this.rows = this.localStorageService.caCheMap.get('batchModifyMainList').mainList || [];
    this.data.mainFlowIdList = this.rows.map((x: any) => x.mainFlowId);
    this.data.channelType = this.moneyChannelOptions[0].value;

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
      };

      if (!params.channelPrice) {
        delete params.channelPrice;
      }
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
    this.loadingService.close();
    window.history.go(-1);
  }

  /** 渠道价格 */
  public channelPriceChange(ev: Event) {
    const el = ev.currentTarget as HTMLInputElement;
    const re: RegExp = /^(^[1-9](\d)?(\.\d{1,2})?$)|(^0$)|(^\d\.\d{1,2}$)$/;
    const ok = re.test(el.value);
    this.errors.channelPrice = !ok;
    this.data.channelPrice = ok ? Number(el.value) : '';
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
    this.xn.router.navigate([`abs-gj/main-list/detail/${item}`]);
  }

  public moneyChannelChange(ev: Event) {
    const el = ev.currentTarget as HTMLSelectElement;
    this.data.channelType = Number(el.value);
  }

  public bankChange(ev: Event) {
    const el = ev.currentTarget as HTMLSelectElement;
    this.doBankChange(+el.value);
  }

  private doBankChange(value: number) {
    const selected = this.bankInfo.find(x => x.id === value);

    if (selected) {
      // 级联设置账号选项
      this.accountOptions = this.bankInfo
        .filter((x: any) => x.id === selected.id && x.bankName === selected.bankName)
        .map(x => ({
          label: x.cardCode,
          value: x.id,
        }));

      if (this.accountOptions.length > 0) {
        // 默认选择第一项
        this.data.fundingChannelId = this.accountOptions[0].value;
      }
    }
  }

  public accountChange(ev: Event) {
    const el = ev.currentTarget as HTMLSelectElement;
    this.data.fundingChannelId = el.value;
  }

  public formatDate(date) {
    return XnUtils.formatDate(date);
  }

  private initChannelData() {
    this.xn.api.dragon.post('/pool/funding_channel_list', {}).subscribe(x => {
      this.bankInfo = x.data;
      this.bankOptions = this.bankInfo.map(y => ({
        label: y.bankName,
        value: y.id,
      }));
      this.accountOptions = this.bankInfo
        .map(z => ({
          label: z.cardCode,
          value: z.id,
        }));
      if (this.bankOptions.length > 0) {
        this.doBankChange(this.bankOptions[0].value);
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

    return {y, m, d};
  }

  private getTime(date: string) {
    if (date) {
      const {y, m, d} = this.getDateInfo(`${date}`);
      return new Date(`${y}/${m}/${d}`).getTime();
    }

    return undefined;
  }
}
