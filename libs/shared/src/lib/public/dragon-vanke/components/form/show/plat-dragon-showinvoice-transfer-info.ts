/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：profit-table-input.component.ts
 * @summary：龙光供应商上传资料平台复核发票控件
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 wangqing            增加             2019-08-30
 * **********************************************************************
 */

import { Component, OnInit, Input, ElementRef, ViewContainerRef } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import DragonInfos from '../../bean/checkers.tab';
import { DynamicForm } from '../../../../../common/dynamic-form/dynamic.decorators';
import { XnService } from '../../../../../services/xn.service';
import { XnModalUtils } from '../../../../../common/xn-modal-utils';
import { VankeInvoiceViewModalComponent } from '../../../modal/invoice-view-modal.component';
import { HwModeService } from '../../../../../services/hw-mode.service';
import { ShVankeFlowIdEnum } from 'libs/shared/src/lib/config/enum';


@Component({
  // selector: 'dragon-showInvoice-component',
  template: `
    <table class="table table-bordered text-center">
      <thead>
        <tr class="table-head">
          <!-- 全选按钮 -->
          <!-- title -->
          <th>序号</th>
          <th *ngFor="let head of currentTab.heads">{{head.label}}</th>
          <!-- 行操作 -->
        </tr>
      </thead>

      <tbody>
        <ng-container *ngIf="items.length;else block">
          <tr *ngFor="let item of items;let i=index">
            <td>{{i+1}}</td>
            <td *ngFor="let head of currentTab.heads">
              <ng-container [ngSwitch]="head.type">
                <ng-container *ngSwitchCase="'money'">
                  <div *ngIf="item[head.value] && item[head.value] !==''">
                    {{item[head.value] | xnMoney}}
                  </div>
                </ng-container>
                <ng-container *ngSwitchCase="'file'">
                  <ng-container
                    *ngIf=" item[head.value]&& item[head.value]!==''"
                  >
                    <div>
                      <a href="javaScript:void(0)" (click)="onOpenImage(i)"
                        >文件</a
                      >
                    </div>
                  </ng-container>
                </ng-container>
                <ng-container *ngSwitchCase="'status'">
                  <ng-container
                    *ngIf="(item?.tag&&item?.tag==='artificial') || (item?.away && item?.away==='edit');else block1"
                  >
                    <span class="tag-color">人工验证123</span>
                  </ng-container>
                  <ng-template #block1>
                    <span
                      [ngClass]="{'tag-color':item.status===4 || item.status===2}"
                      >{{item.status | xnInvoiceStatus}}</span
                    >
                  </ng-template>
                </ng-container>
                <ng-container *ngSwitchCase="'mainFlowId'">
                  <p *ngFor="let sub of item[head.value] | xnJson; let i=index">
                    <ng-container *ngIf="sub.indexOf('cloud') === -1;else cloud">
                          <a [href]="getHref(sub)" target="_blank">{{ sub }}</a>
                        </ng-container>
                        <ng-template #cloud>
                          <span>{{sub}}</span>
                        </ng-template>
                  </p>
                </ng-container>
                <ng-container *ngSwitchDefault>
                  <div
                    [innerHTML]="item[head.value] | xnGatherType: {head:head,row:item}"
                  ></div>
                </ng-container>
              </ng-container>
            </td>
          </tr>
        </ng-container>
        <tr *ngIf="items.length>0">
          <td>合计</td>
          <td>/</td>
          <td>/</td>
          <td>/</td>
          <td>/</td>
          <td class="money-color">{{preAmountAll | xnMoney}}</td>
          <td class="money-color">{{amountAll | xnMoney}}</td>
          <ng-container *ngIf="vankeTransferMoney; else na">
            <td class="money-color">{{ vankeTransferMoney | xnMoney }}</td>
          </ng-container>
          <td class="money-color">{{transferAmount | xnMoney}}</td>
          <td>/</td>
          <td>/</td>
        </tr>
      </tbody>
    </table>

    <span class="xn-input-alert">{{alert}}</span>

    <ng-template #block>
      <tr>
        <td [attr.colspan]="6">
          <div class="empty-message"></div>
        </td>
      </tr>
    </ng-template>
    <ng-template #na>
      <td *ngIf="svrConfig.flow.flowId === shVankePlatformVerify"></td>
    </ng-template>
    <div class="plat-table-footer">更新时间：{{updateTime}}</div>

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
        color: #9A9A9A;
      }
      .tag-color {
        color: #f20000;
      }
    `
  ]
})
@DynamicForm({ type: 'invoice-transfer', formModule: 'dragon-show' })
export class DragonPlatInvoiceShowComponent implements OnInit {

  @Input() row: any;
  @Input() form: FormGroup;
  @Input() svrConfig: any;
  public items: any[] = [];
  public Tabconfig: any;
  currentTab: any; // 当前标签页
  // 含税
  public amountAll = 0;
  public transferAmount = 0;
  // 不含税
  public preAmountAll = 0;
  public alert = '';
  updateTime: string;
  // 万科建议转让金额总计
  public vankeTransferMoney = 0;
  // 上海银行平台审核流程
  get shVankePlatformVerify() {
    return ShVankeFlowIdEnum.ShVankePlatformVerify;
  }
  constructor(
    private xn: XnService,
    private vcr: ViewContainerRef,
    private hwModeService: HwModeService
  ) {
  }

  ngOnInit() {
    const flowId = this.svrConfig.flow.flowId;
    if(flowId === ShVankeFlowIdEnum.ShVankePlatformVerify) {
      // 上海银行平台审核流程
      this.currentTab = DragonInfos.shVankePlatInvoice;
    } else {
      this.currentTab = DragonInfos.platInvoice;
    }
    this.items = JSON.parse(this.row.data);
    this.updateTime = this.row.updateTime;
    if (this.items.filter(v => v && v.invoiceAmount).length > 0) {
      this.amountAll = this.computeSum(this.items.filter(v =>
        v && v.invoiceAmount).map(v => Number(v.invoiceAmount))).toFixed(2) || 0;
    } else {
      this.amountAll = 0;
    }
    if (this.items.filter(v => v && v.amount).length > 0) {
      this.preAmountAll = this.computeSum(this.items.filter(v =>
        v && v.amount).map(v => Number(v.amount))).toFixed(2) || 0;
    } else {
      this.preAmountAll = 0;
    }
    if (this.items.filter(v => v && v.transferMoney).length > 0) {
      this.transferAmount = this.computeSum(this.items.filter(v =>
        v && v.transferMoney).map(v => Number(v.transferMoney))).toFixed(2) || 0;
    } else {
      this.transferAmount = 0;
    }

    // 万科建议转让金额合计
    if (this.items.filter((v) => v && v.vankeTransferMoney).length > 0) {
      this.vankeTransferMoney =
        this.computeSum(
          this.items
            .filter((v) => v && v.vankeTransferMoney)
            .map((v) => Number(v.vankeTransferMoney))
        ).toFixed(2) || 0;
    } else {
      this.vankeTransferMoney = 0;
    }

  }
  // 修改转让金额

  getHref(sub) {
    const newsub = sub.split('_');
    if (!transAction[newsub[newsub.length - 1]]) {
      return 'console/main-list/detail/' + sub;
    } else {
      return transAction[newsub[newsub.length - 1]] + '/main-list/detail/' + sub;
    }
  }

  // 具体到单个数组的求和
  private computeSum(array) {
    return array.reduce((prev, curr) => {
      return prev + curr;
    });
  }
  public onOpenImage(index: number) {
    XnModalUtils.openInViewContainer(this.xn, this.vcr, VankeInvoiceViewModalComponent, { fileList: this.items, paramIndex: index }).subscribe(() => {
    });
  }



}
enum transAction {
  'wk' = 'logan',
  'lg' = 'logan',
  'oct' = 'oct',
  'bgy' = 'country-graden',
  'sh' = 'bank-shanghai',
  'jd' = 'new-gemdale',
  'hz' = 'agile-hz',
  'yjl' = 'agile-xingshun',
}
