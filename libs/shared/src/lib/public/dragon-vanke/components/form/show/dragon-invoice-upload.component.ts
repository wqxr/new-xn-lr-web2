/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：profit-table-input.component.ts
 * @summary：龙光供应商上传资料复核发票控件
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                   wangqing            增加             2019-08-30
 * **********************************************************************
 */

import { Component, OnInit, Input, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import DragonInfos from '../../bean/checkers.tab';
import { VankeInvoiceViewModalComponent } from '../../../modal/invoice-view-modal.component';
import { DynamicForm } from '../../../../../common/dynamic-form/dynamic.decorators';
import { XnService } from '../../../../../services/xn.service';
import { XnModalUtils } from '../../../../../common/xn-modal-utils';

@Component({
  // selector: 'dragon-invoice-component',
  template: `
    <table class="table table-bordered text-center">
      <thead>
        <tr class="table-head">
          <!-- 全选按钮 -->
          <!-- title -->
          <th>序号</th>
          <th *ngFor="let head of currentTab.heads">
            {{ head.label }}
          </th>
        </tr>
      </thead>

      <tbody>
        <ng-container *ngIf="items.length; else block">
          <tr *ngFor="let item of items; let i = index">
            <td>{{ i + 1 }}</td>
            <td *ngFor="let head of currentTab.heads">
              <ng-container [ngSwitch]="head.type">
                <ng-container *ngSwitchCase="'file'">
                  <ng-container
                    *ngIf="item[head.value] && item[head.value] !== ''"
                  >
                    <a class="xn-click-a" (click)="onOpenImage(i)">{{
                      item.fileName
                    }}</a>
                  </ng-container>
                </ng-container>
                <ng-container *ngSwitchCase="'status'">
                  <ng-container
                    *ngIf="
                      (item?.tag && item?.tag === 'artificial') ||
                        (item?.away && item?.away === 'edit');
                      else block1
                    "
                  >
                    <span class="tag-color">人工验证</span>
                  </ng-container>
                  <ng-template #block1>
                    <span>{{ item.status | xnInvoiceStatus }}</span>
                  </ng-template>
                </ng-container>
                <ng-container *ngSwitchDefault>
                  <div
                    [innerHTML]="
                      item[head.value] | xnGatherType: { head: head, row: item }
                    "
                  ></div>
                </ng-container>
              </ng-container>
            </td>
          </tr>
          <tr *ngIf="amountAll > 0">
            <td>合计</td>
            <td>/</td>
            <td>/</td>
            <td>/</td>
            <td class="money-color">{{ preAmount | xnMoney }}</td>
            <td class="money-color">{{ amountAll | xnMoney }}</td>
            <td>/</td>
            <td>/</td>
          </tr>
        </ng-container>
      </tbody>
    </table>

    <span class="xn-input-alert">{{ alert }}</span>

    <ng-template #block>
      <tr>
        <td [attr.colspan]="6">
          <div class="empty-message"></div>
        </td>
      </tr>
    </ng-template>
  `,
  styles: [
    `
      .plat-table-footer {
        font-size: 14px;
        text-align: right;
        padding-right: 8px;
      }
      .button-reset-style {
        font-size: 12px;
        padding: 5px 35px;
        color: #3c8dbc;
      }

      .tip-memo {
        color: #9a9a9a;
      }
      .tag-color {
        color: #f20000;
      }
    `,
  ],
})
@DynamicForm({ type: 'invoice-normal', formModule: 'dragon-show' })
export class DragonShowInvoiceComponent implements OnInit {
  @Input() row: any;
  @Input() form: FormGroup;

  public items: any[] = [];
  public Tabconfig: any;
  currentTab: any; // 当前标签页
  alert = '';
  amountAll = 0;
  preAmount = 0;
  // 更新时间
  public updateTime: string;
  constructor(private xn: XnService, private vcr: ViewContainerRef) {}

  ngOnInit() {
    this.currentTab = DragonInfos.invoice;
    this.updateTime = this.row.updateTime;
    const data = this.row.data;
    console.log('this.row.data');
    if (!!data) {
      this.items = JSON.parse(data);
      this.items.forEach((item) => {
        item.invoiceAmount = Number(item.invoiceAmount).toFixed(2);
        item.amount = Number(item.amount).toFixed(2);
      });
      if (this.items.filter((v) => v && v.invoiceAmount).length > 0) {
        this.amountAll =
          this.computeSum(
            this.items
              .filter((v) => v && v.invoiceAmount)
              .map((v) => Number(v.invoiceAmount))
          ).toFixed(2) || 0;
      }
      if (this.items.filter((v) => v && v.amount).length > 0) {
        this.preAmount =
          this.computeSum(
            this.items.filter((v) => v && v.amount).map((v) => Number(v.amount))
          ).toFixed(2) || 0;
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

  public onOpenImage(paramIndex: any) {
    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      VankeInvoiceViewModalComponent,
      { fileList: this.items, paramIndex }
    ).subscribe();
  }
}
