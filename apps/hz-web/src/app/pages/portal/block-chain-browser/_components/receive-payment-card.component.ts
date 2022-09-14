/*************************************************************************
 * Copyright (c) 2017 - 2020 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：xn-lr-web\apps\src\app\pages\portal\block-chain-browser\_components\receive-payment-card.component.ts
 * @summary：init receive-payment-card.component.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  zigui              init             2020-11-11
 ***************************************************************************/
import { Component, Input } from '@angular/core';

@Component({
  selector: 'receive-payment-card',
  template: `
    <nz-card nzTitle="应收账款信息" class="receive-payment-card">
      <div class="item-block">
        <div>项目名称</div>
        <div>
          <span>{{data.projectName}}</span>
        </div>
      </div>
      <div class="item-block">
        <div>总部公司</div>
        <div>
          <span>{{data.headquarters}}</span>
        </div>
      </div>
      <div class="item-block">
        <div>申请付款单位</div>
        <div>
          <span>{{data.projectCompany}}</span>
        </div>
      </div>
      <div class="item-block">
        <div>收款单位</div>
        <div>
          <span>{{data.debtUnitName}}</span>
        </div>
      </div>
      <div class="item-block">
        <div>应收账款金额</div>
        <div>
          <span>{{data.receive}}</span>
        </div>
      </div>
<!--      <div class="item">-->
<!--        <span>核心企业内部区域</span>-->
<!--        <span>xx</span>-->
<!--      </div>-->
    </nz-card>
  `,
  styleUrls: ['../detail/detail.component.less'],
})
export class ReceivePaymentCardComponent {
  @Input() data: any = {};
}
