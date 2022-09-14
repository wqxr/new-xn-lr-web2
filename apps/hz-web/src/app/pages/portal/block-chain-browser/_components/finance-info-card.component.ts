/*************************************************************************
 * Copyright (c) 2017 - 2020 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：xn-lr-web\apps\src\app\pages\portal\block-chain-browser\_components\finance-info-card.component.ts
 * @summary：init finance-info-card.component.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  zigui              init             2020-11-11
 ***************************************************************************/
import { Component, Input } from '@angular/core';

@Component({
  selector: 'finance-info-card',
  template: `
    <nz-card nzTitle="融资信息" class="finance-info-card">
      <div class="item-block">
        <div>保理商</div>
        <div>
          <span>{{data.factoringName}}</span>
        </div>
      </div>
      <div class="item-block">
        <div>资产转让折扣率</div>
        <div>
          <span>{{data.discountRate}}</span>
        </div>
      </div>
      <div class="item-block">
        <div>收款单位名称</div>
        <div>
          <span>{{data.debtUnitName}}</span>
        </div>
      </div>
      <div class="item-block">
        <div>收款单位账号</div>
        <div>
          <span>{{data.debtUnitAccount}}</span>
        </div>
      </div>
      <div class="item-block">
        <div>收款单位开户行</div>
        <div>
          <span>{{data.debtUnitBank}}</span>
        </div>
      </div>
      <div class="item-block">
        <div>保理融资到期日</div>
        <div>
          <span>{{data.factoringEndDate}}</span>
        </div>
      </div>
      <div class="item-block">
        <div>实际放款时间</div>
        <div>
          <span>{{data.actualLendingTime}}</span>
        </div>
      </div>
      <div class="item-block">
        <div>放款金额</div>
        <div>
          <span>{{data.lendingAmount}}</span>
        </div>
      </div>
    </nz-card>
  `,
  styleUrls: ['../detail/detail.component.less'],
})
export class FinanceInfoCardComponent {
  @Input() data: any = {};
}
