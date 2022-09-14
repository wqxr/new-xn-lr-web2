import { FormGroup } from '@angular/forms';
import { Component, OnInit, Input, ViewContainerRef } from '@angular/core';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { InvoiceViewModalComponent } from 'libs/shared/src/lib/public/modal/invoice-view-modal.component';
import { BankManagementService } from 'libs/products/new-agile/src/lib/pages/vnake-mode/bank-mangement.service';


@Component({
  template: `
    <table
      class="table table-bordered table-hover file-row-table text-center"
      width="100%"
    >
      <thead>
        <tr>
          <th>图片名称</th>
          <th>发票号码</th>
          <th>发票代码</th>
          <th>开票日期</th>
          <th>含税金额</th>
          <th>发票转让金额</th>
          <th>状态</th>
          <th *ngIf="orgType === 3">历史交易id</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let item of items">
          <td>
            <a class="xn-click-a" (click)="onViewInvoice(item)"
              >{{ item.fileName }}</a
            >
          </td>
          <td>{{ item.invoiceNum || "" }}</td>
          <td>{{ item.invoiceCode || "" }}</td>
          <td>{{ item.invoiceDate }}</td>
          <td>{{ item.invoiceAmount | xnMoney }}</td>
          <td>{{ item.transferMoney | xnMoney }}</td>
          <td>
            <ng-container
              *ngIf="(item?.tag && item?.tag === 'artificial') ||
                      (item?.away && item?.away === 'edit');
                      else block1"
            >
              <span class="tag-color">人工验证</span>
            </ng-container>
            <ng-template #block1>
              <span>{{ item.status | xnInvoiceStatus }}</span>
            </ng-template>
          </td>
          <td *ngIf="orgType === 3">
            <ng-container
              *ngIf="item?.mainFlowIds && item?.mainFlowIds.length;else mianflows"
            >
              <div *ngFor="let sub of item.mainFlowIds">
                <ng-container *ngIf="sub.mainFlowId.indexOf('cloud') === -1;else cloud">
                  <a href="javaScript:void (0)" (click)="viewProcess(sub)">{{sub.mainFlowId}}</a>
                </ng-container>
                <ng-template #cloud>
                  <span>{{sub.mainFlowId}}</span>
                </ng-template>
              </div>
            </ng-container>
            <ng-template #mianflows>
              <div>/</div>
            </ng-template>
          </td>
        </tr>
        <tr *ngIf="amountAll > 0 || preAmount > 0">
          <td>合计</td>
          <td>/</td>
          <td>/</td>
          <td>/</td>
          <td>{{ amountAll }}</td>
          <td>{{ transferAll }}</td>
          <td *ngIf="orgType === 3">/</td>
        </tr>
      </tbody>
    </table>
    <div class="plat-table-footer">更新时间：{{updateTime}}</div>
  `,
  styles: [
    `
      .plat-table-footer {
        font-size: 14px;
        text-align: right;
        padding-right: 8px;
      }
    `
  ]
})
@DynamicForm({ type: 'invoice-transfer', formModule: 'new-agile-show' })
export class XnInvoiceTransferShowComponent implements OnInit {
  @Input() row: any;
  @Input() form: FormGroup;
  @Input() svrConfig: any;
  items: any[];

  amountAll = 0;
  preAmount = 0;
  transferAll = 0;

  public orgType: number = this.xn.user.orgType;
  updateTime: string;
  constructor(
    private xn: XnService,
    private vcr: ViewContainerRef,
    private localStorageService: LocalStorageService,
    private bankManagementService: BankManagementService
  ) { }

  ngOnInit(): void {
    const { data } = this.row;
    if (!!data) {
      this.items = JSON.parse(data);
      this.updateTime = this.row.updateTime;
      const amountAll = this.items.filter((v) => v && v.invoiceAmount);
      if (amountAll.length > 0) {
        this.amountAll =
          this.computeSum(
            amountAll.map((v) => Number(v.invoiceAmount))
          ).toFixed(2) || 0;
      }

      const transferAll = this.items.filter((v) => v && v.transferMoney);
      if (transferAll.length > 0) {
        this.transferAll =
          this.computeSum(
            transferAll.map((v) => Number(v.transferMoney))
          ).toFixed(2) || 0;
      }
    }
  }

  public onViewInvoice(item: any) {
    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      InvoiceViewModalComponent,
      item
    ).subscribe(() => { });
  }

  // 查看流程
  public viewProcess(item) {
    this.bankManagementService.viewProcess(item.mainFlowId);
  }

  // 具体到单个数组的求和
  private computeSum(array) {
    if (array.length <= 0) {
      return;
    }
    return array.reduce((prev, curr, idx, arr) => {
      return prev + curr;
    });
  }
}
