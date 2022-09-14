/*************************************************************************
 * Copyright (c) 2017 - 2020 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：xn-lr-web\apps\src\app\pages\portal\block-chain-browser\_components\invoice-info-card.component.ts
 * @summary：init invoice-info-card.component.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  zigui              init             2020-11-11
 ***************************************************************************/
import { Component, Input } from '@angular/core';

@Component({
  selector: 'invoice-info-card',
  template: `
    <nz-card nzTitle="发票信息" class="invoice-info-card">
      <nz-table style="margin-top: 20px;" #columnTable [nzData]="tableData" [nzShowPagination]="false" [nzScroll]="{ x: '1000px' }">
        <thead>
        <tr>
          <th>发票号码</th>
          <th>发票代码</th>
          <th>开票日期</th>
          <th>含税金额</th>
          <th>不含税金额</th>
          <th>发票转让金额</th>
          <th>发票状态</th>
          <th>历史交易ID</th>
          <th>发票图片</th>
        </tr>
        </thead>
        <tbody>
        <tr class="tr" *ngFor="let data of tableData;let key = index;">
          <td>{{ data.invoiceNum }}</td>
          <td>{{ data.invoiceCode }}</td>
          <td>{{ data.invoiceDate }}</td>
          <td>{{ data.amount }}</td>
          <td>{{ data.invoiceAmount }}</td>
          <td>{{ data.transferMoney }}</td>
          <td>{{ data.status }}</td>
          <td>{{ data.mainFlowId }}</td>
          <td>{{ data.invoiceImages ? data.invoiceImages.fileName.slice(0, 25) : '' }}</td>
        </tr>
        </tbody>
      </nz-table>
      <div class="pagination-box" *ngIf="data.invoices && data.invoices.length > 5">
        <nz-pagination [(nzPageIndex)]="pageNum" [nzPageSize]="5" [nzTotal]="data.invoices.length" [nzSize]="'small'" [nzShowTotal]="totalTemplate" (nzPageIndexChange)="pageChange($event)"></nz-pagination>
        <ng-template #totalTemplate let-total>共 {{data.invoices.length}} 条</ng-template>
      </div>
    </nz-card>
  `,
  styleUrls: ['../detail/detail.component.less'],
})
export class InvoiceInfoCardComponent {
  @Input() data: any = { invoices: [] };
  get tableData() {
    if (this.data.invoices && this.data.invoices.length) {
      return this.data.invoices.slice((this.pageNum - 1) * 5, this.pageNum * 5);
    } else {
      return [];
    }
  }
  pageNum = 1;
  pageChange(e) {
    this.pageNum = e;
  }
}
