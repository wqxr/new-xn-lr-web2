/*************************************************************************
 * Copyright (c) 2017 - 2020 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：xn-lr-web\apps\src\app\pages\portal\block-chain-browser\_components\factoring-info-card.component.ts
 * @summary：init factoring-info-card.component.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  zigui              init             2020-11-11
 ***************************************************************************/
import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'factoring-info-card',
  template: `
    <nz-card nzTitle="保理合同" class="factoring-info-card">
      <div style="margin-bottom: 15px;display: flex;" *ngFor="let item of data.supplierContacts;">
        <div style="margin-right: 20px;">
          <div style="width: 168px;color: rgba(31, 43, 56, 0.66);font-weight: 400;line-height: 20px;">
            {{item.reLabel}}
          </div>
          <div style="width: 168px;color: rgba(31, 43, 56, 0.5);font-weight: 400;line-height: 20px;font-size: 12px;" *ngIf="item.subLabel!==''">
            {{item.subLabel}}
          </div>
        </div>
        <div style="color: rgba(31, 43, 56, 1);font-weight: 400;line-height: 20px;flex: 1;display: flex;flex-wrap: wrap;">
          {{item.fileName}}
        </div>
      </div>
      <nz-empty style="margin-top: 20px;" *ngIf="(!data.supplierContacts) || (!data.supplierContacts.length)"></nz-empty>
    </nz-card>
  `,
  styleUrls: ['../detail/detail.component.less'],
})
export class FactoringInfoCardComponent implements OnInit{
  @Input() data: any = {
    supplierContacts: [],
  };
  ngOnInit(): void {
    if (this.data.supplierContacts && this.data.supplierContacts.length) {
      this.data.supplierContacts = this.data.supplierContacts.map(v => {
        const start = v.label.indexOf('（');
        if (start > 0) {
          v.subLabel = `(${v.label.slice(start + 1)})`;
          v.reLabel = v.label.slice(0, start);
        } else {
          v.subLabel = '';
          v.reLabel = v.label;
        }
        return v;
      });
    }
  }
}
