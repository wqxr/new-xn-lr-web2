/*************************************************************************
 * Copyright (c) 2017 - 2020 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：xn-lr-web\apps\src\app\pages\portal\block-chain-browser\_components\contract-info-card.component.ts
 * @summary：init contract-info-card.component.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  zigui              init             2020-11-11
 ***************************************************************************/
import { Component, Input } from '@angular/core';

@Component({
  selector: 'contract-info-card',
  template: `
    <nz-card nzTitle="合同信息" class="contract-info-card">
      <div class="item-block">
        <div>合同编号</div>
        <div>
          <span>{{data.contracts[0].contractId}}</span>
        </div>
      </div>
      <div class="item-block">
        <div>合同名称</div>
        <div>
          <span>{{data.contracts[0].contractName}}</span>
        </div>
      </div>
      <div class="item-block">
        <div>合同金额</div>
        <div>
          <span>{{data.contracts[0].contractMoney}}</span>
        </div>
      </div>
      <div class="item-block">
        <div>付款比例</div>
        <div>
          <span>{{data.contracts[0].payRate}}</span>
        </div>
      </div>
      <div class="item-block">
        <div>合同类型</div>
        <div>
          <span>{{data.contracts[0].contractType}}</span>
        </div>
      </div>
      <div class="item-block">
        <div>合同签订时间</div>
        <div>
          <span>{{data.contracts[0].signTime}}</span>
        </div>
      </div>
      <div class="item-block">
        <div>基础合同甲方名称</div>
        <div>
          <span>{{data.contracts[0].contractJia}}</span>
        </div>
      </div>
      <div class="item-block">
        <div>基础合同已方名称</div>
        <div>
          <span>{{data.contracts[0].contractYi}}</span>
        </div>
      </div>
      <div class="item-block">
        <div>累计确认产值</div>
        <div>
          <span>{{data.contracts[0].totalReceive}}</span>
        </div>
      </div>
      <div class="item-block">
        <div>本次产值金额</div>
        <div>
          <span>{{data.contracts[0].percentOutputValue}}</span>
        </div>
      </div>
      <div class="item-block">
        <div>本次付款性质</div>
        <div>
          <span>{{data.contracts[0].payType}}</span>
        </div>
      </div>
    </nz-card>
  `,
  styleUrls: ['../detail/detail.component.less'],
})
export class ContractInfoCardComponent {
  @Input() data: any = {};
}
