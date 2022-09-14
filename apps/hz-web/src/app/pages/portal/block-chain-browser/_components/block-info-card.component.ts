/*************************************************************************
 * Copyright (c) 2017 - 2020 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：xn-lr-web\apps\src\app\pages\portal\block-chain-browser\_components\block-info-card.component.ts
 * @summary：init block-info-card.component.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  zigui              init             2020-11-11
 ***************************************************************************/
import { Component, Input } from '@angular/core';

@Component({
  selector: 'block-info-card',
  template: `
    <nz-card nzTitle="区块信息" class="block-info-card">
      <div nz-row>
        <div nz-col [nzSpan]="10">
          <div class="item-block">
            <div>基础资产ID</div>
            <div>
              <span>{{data.transactionId}}</span>
            </div>
          </div>
        </div>
        <div nz-col [nzSpan]="14">
          <div class="item-block">
            <div>存证Hash</div>
            <div>
              <span>{{data.evHash}}</span>
            </div>
          </div>
        </div>
      </div>
      <div nz-row>
        <div nz-col [nzSpan]="10">
          <div class="item-block">
            <div>审批流ID</div>
            <div>
              <span>{{data.flowId}}</span>
            </div>
          </div>
        </div>
        <div nz-col [nzSpan]="14">
          <div class="item-block">
            <div>区块高度</div>
            <div>
              <span>{{data.blockHeight | transformNum}}</span>
            </div>
          </div>
        </div>
      </div>
      <div nz-row>
        <div nz-col [nzSpan]="10">
          <div class="item-block">
            <div>上链时间</div>
            <div>
              <span>{{data.createTime}}</span>
            </div>
          </div>
        </div>
      </div>
    </nz-card>
  `,
  styleUrls: ['../detail/detail.component.less'],
})
export class BlockInfoCardComponent {
  @Input() data: any = {
    evHash: '',
  };
}
