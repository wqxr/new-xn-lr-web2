import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { ViewInvoiceSingleModalComponent } from '../../../modal/invoice-view-single.modal';

declare const moment: any;

@Component({
  template: `
    <table class="table table-bordered table-hover file-row-table" width="100%">
    <thead>
      <tr>
        <th>序号</th>
        <th>图片名称</th>
        <th>发票号码</th>
        <th>发票代码</th>
        <th>开票日期</th>
        <th>含税金额</th>
        <th>状态</th>
        <th style="width: 80px;">操作</th>
      </tr>
    </thead>
    <tbody>
      <tr *ngFor="let item of items;let i=index">
        <td>{{i+1}}</td>
        <td><a href='javascript:void(0)' (click)="onViewInvoice(item)">{{item.fileName}}</a></td>
        <td>{{item.invoiceNum || ''}}</td>
        <td>{{ item.invoiceCode }}</td>
        <td>{{ item.invoiceDate }}</td>
        <td>{{item.invoiceAmount || '' | xnMoney}}</td>

        <td>
        <ng-container
        *ngIf="(item?.tag&&item?.tag==='artificial') || (item?.away && item?.away==='edit');else block1">
        <span class="tag-color">人工验证</span>
      </ng-container>
      <ng-template #block1>
        <span>{{item.invoiceStatus | xnInvoiceStatus}}</span>
      </ng-template>
        </td>
        <td>
          <a class="xn-click-a" (click)="onViewInvoice(item)">查看</a>
        </td>
      </tr>
      <tr *ngIf="amountAll > 0">
        <td>发票金额合计</td>
        <td>/</td>
        <td>/</td>
        <td>/</td>
        <td>/</td>
        <td>{{amountAll}}</td>
        <td>/</td>
        <td>/</td>
      </tr>
    </tbody>
  </table>
    `,
  styles: [`
  .tag-color {
    color: #f20000;
}
  `]
})
@DynamicForm({ type: 'stop-invoice', formModule: 'dragon-input' })
export class StopInvoiceComponent implements OnInit {
  @Input() row: any;

  @Input() form: FormGroup;
  @Input() svrConfig: any;
  amountAll = 0;
  dateCheckTemp = false;

  public items: any[] = [];


  constructor(
    private xn: XnService,
    private vcr: ViewContainerRef) {
  }


  ngOnInit() {
    this.items = JSON.parse(this.row.value);

    // this.items.forEach(temp => {
    //   // let files = [];
    //   // files.push({ fileName: temp.fileName, filePath: temp.filePath });
    //   // temp.files = files;
    //   this.dateCheckTemp = XnUtils.toDateFromString(temp.invoiceDate);
    //   if (!this.dateCheckTemp) {
    //     temp.invoiceDate = moment(temp.invoiceDate).format('YYYYMMDD');
    //   }
    // });
    if (this.items.filter(v => v && v.invoiceAmount).length > 0) {
      this.amountAll = this.computeSum(this.items.filter(v => v && v.invoiceAmount)
        .map(v => Number(v.invoiceAmount))).toFixed(2) || 0;
    }
    //}

  }
  // 具体到单个数组的求和
  private computeSum(array) {
    if (array.length <= 0) {
      return;
    }
    return array.reduce((prev, curr) => {
      return prev + curr;
    });
  }

  public onViewInvoice(item: any) {
    XnModalUtils.openInViewContainer(this.xn, this.vcr, ViewInvoiceSingleModalComponent, item).subscribe(() => {
    });
  }


}
