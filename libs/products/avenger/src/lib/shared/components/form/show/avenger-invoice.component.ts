import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { AvengerViewInvoiceSingleComponent } from '../../modal/avenger-invoice-view-single.modal';
import * as moment from 'moment';

@Component({
  template: `
    <div style='width:100%'>
    <table class="table table-bordered table-hover file-row-table" width="100%">
    <thead>
      <tr>
        <th>序号</th>
        <th>发票号码</th>
        <th>发票代码</th>
        <th>开票日期</th>
        <th>含税金额</th>
        <th>状态</th>
        <th
          *ngIf="isShow">
          历史交易id
        </th>
        <th style="width: 80px;">操作</th>
      </tr>
    </thead>
    <tbody>
      <tr *ngFor="let item of items;let i=index">
        <td>{{i+1}}</td>
        <td>{{item.invoiceNum || ''}}</td>
        <td>{{ item.invoiceCode }}</td>
        <td>{{ item.invoiceDate }}</td>
        <td>{{item.invoiceAmount || '' | xnMoney}}</td>

        <td>
          <ng-container
            *ngIf="(item?.tag&&item?.tag==='artificial') || (item?.away && item?.away==='edit');else block2">
            <span class="tag-color">人工验证</span>
          </ng-container>
          <ng-template #block2>
            <span [ngClass]="{'tag-color':item.status===4 || item.status===2 || item.status===6 ||item.status===7 || item.status===8}">{{item.status | xnInvoiceStatus}}</span>
          </ng-template>
        </td>
        <td>
          <a class="xn-click-a" (click)="onViewInvoice(item)">查看</a>
        </td>
        <td
          *ngIf="isShow">
          <ng-container *ngIf="item?.mainFlowIds && item?.mainFlowIds.length ; else block">
            <div *ngFor="let sub of item.mainFlowIds">
              <a href="javaScript:void (0)" (click)="viewProcess(sub)">{{sub.mainFlowId}}</a>
            </div>
          </ng-container>
          <ng-template #block>
            <div>/</div>
          </ng-template>
        </td>
      </tr>
      <tr *ngIf="amountAll > 0">
        <td>发票金额合计</td>
        <td>/</td>
        <td>/</td>
        <td>/</td>
        <td>{{amountAll}}</td>
        <td>/</td>
        <td>/</td>
        <td
          *ngIf="isShow">
          /
        </td>
      </tr>
    </tbody>
  </table>
    </div>
    `,
  styleUrls: ['../show-avenger-input.component.css']
})
@DynamicForm({ type: 'invoice', formModule: 'avenger-show' })
export class AvengerInvoiceComponent implements OnInit {
  @Input() row: any;
  @Input() form: FormGroup;
  @Input() svrConfig: any;
  amountAll = 0;
  dateCheckTemp = false;

  public items: any[] = [];

  isShow = false;

  constructor(
    private xn: XnService,
    private vcr: ViewContainerRef) {
  }


  ngOnInit() {
    const flow = [
      'financing_factoring',
      'financing_factoring1',
      'financing_factoring2',
      'financing_factoring13'
    ];
    this.isShow = flow.includes(this.svrConfig.record.flowId);
    const data = this.row.data;
    if (data !== '') {
      this.items = JSON.parse(data);

      this.items.forEach(temp => {
        this.dateCheckTemp = XnUtils.toDateFromString(temp.invoiceDate);
        if (!this.dateCheckTemp) {
          temp.invoiceDate = moment(temp.invoiceDate).format('YYYYMMDD');
        }
      });
      if (this.items.filter(v => v && v.invoiceAmount).length > 0) {
        this.amountAll = this.computeSum(this.items.filter(v => v && v.invoiceAmount)
          .map(v => Number(v.invoiceAmount))).toFixed(2) || 0;
      }
    }

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
    XnModalUtils.openInViewContainer(this.xn, this.vcr, AvengerViewInvoiceSingleComponent, item).subscribe(() => {
    });
  }

  public viewProcess() {
    console.warn('Not Implemented!');
  }
}
