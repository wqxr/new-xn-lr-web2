import { JsonShowComponent } from './../../../../../../../../products/bank-shanghai/src/lib/share/components/json-pre/json-show.component';
/*
 * Copyright(c) 2017-2021, 深圳市链融科技股份有限公司
 * Senzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\shared\src\lib\public\dragon-vanke\components\form\input\plat-vanke-invoice-transfer-info.ts
 * @summary：万科数据对接平台审核-发票组件
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                hucongying       万科数据对接优化     2021-06-02
 * **********************************************************************
 */

import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from '../../../../../common/dynamic-form/dynamic.decorators';
import { XnModalUtils } from '../../../../../common/xn-modal-utils';
import { HwModeService } from '../../../../../services/hw-mode.service';
import { XnService } from '../../../../../services/xn.service';
import { VankeInvoiceViewModalComponent } from '../../../modal/invoice-view-modal.component';
import DragonInfos from '../../bean/checkers.tab';
import { DragonMfilesViewModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/mfiles-view-modal.component';
@Component({
  selector: 'vanke-showInvoice-component',
  template: `
  <div style="width:100%;">
      <div class="table-head" #tableHead>
      <table class="table table-bordered text-center" style="margin-bottom:0px !important">
      <thead class="headstyle">
        <tr class="table-head">
          <!-- 全选按钮 -->
          <!-- title -->
          <th style='width:5%'>序号</th>
          <th *ngFor="let head of currentTab.heads" [ngStyle]="{'width':head.type==='mainFlowId'?'12%':''}">
            {{ head.label }}
          </th>
          <!-- 行操作 -->
          <th>操作</th>
        </tr>
      </thead>
      </table>
      </div>
      <div class="table-body">
      <table
      class="table table-bordered table-hover text-center table-display"
      style="margin-bottom:0px !important"
    >
      <tbody>
        <ng-container *ngIf="items.length; else block">
          <tr *ngFor="let item of items; let i = index">
            <td style='width:5%'>{{ i + 1 }}</td>
            <td *ngFor="let head of currentTab.heads" [ngClass]="{'history':head.type==='mainFlowId'}">
              <ng-container [ngSwitch]="head.type">
                <ng-container *ngSwitchCase="'money'">
                  <div *ngIf="item[head.value] && item[head.value] !== ''">
                    {{ item[head.value] | xnMoney }}
                  </div>
                </ng-container>
                <ng-container *ngSwitchCase="'file'">
                  <ng-container
                    *ngIf="item[head.value] && item[head.value] !== ''"
                  >
                    <div>
                      <a href="javaScript:void(0)" (click)="onOpenImage(i)"
                        >文件</a
                      >
                    </div>
                  </ng-container>
                </ng-container>
                <ng-container *ngSwitchCase="'screenshot'">
                  <ng-container *ngIf="item?.invoiceScreenshot">
                    <a href="javaScript:void(0)" (click)="viewScreenshot(item)"
                      >查看</a
                    >
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
                    <span
                      [ngClass]="{
                        'tag-color': item.status === 4 || item.status === 2
                      }"
                      >{{ item.status | xnInvoiceStatus }}</span
                    >
                  </ng-template>
                </ng-container>
                <ng-container *ngSwitchCase="'mainFlowId'">
                <div style='height:180px;overflow-y:auto'>
                <p
                *ngFor="let sub of item[head.value] | xnJson; let i = index"
              >
                   <ng-container *ngIf="sub.indexOf('cloud') === -1;else cloud">
                      <a [href]="getHref(sub)" target="_blank">{{ sub }}</a>
                    </ng-container>
                    <ng-template #cloud>
                      <span>{{sub}}</span>
                    </ng-template>
              </p>
                </div>


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
            <td>
              <a
                class="xn-click-a"
                target="_blank"
                [routerLink]="['/console/manage/invoice-search/main/list']"
                [queryParams]="viewZd(item)"
                >查中登</a
              >
            </td>
          </tr>
        </ng-container>
        <tr *ngIf="items.length > 0">
          <td style='width:5%'>合计</td>
          <td>/</td>
          <td>/</td>
          <td>/</td>
          <td>/</td>
          <td class="money-color">{{ preAmountAll | xnMoney }}</td>
          <td class="money-color">{{ amountAll | xnMoney }}</td>
          <ng-container *ngIf="vankeTransferMoney; else na">
            <td class="money-color">{{ vankeTransferMoney | xnMoney }}</td>
          </ng-container>
          <td class="money-color">{{ transferAmount | xnMoney }}</td>
          <td>/</td>
          <td>/</td>
          <td style='width:12%'>/</td>
          <td>/</td>
        </tr>
      </tbody>
    </table>
     </div>
      </div>



    <span class="xn-input-alert">{{ alert }}</span>

    <ng-template #block>
      <tr>
        <td [attr.colspan]="6">
          <div class="empty-message"></div>
        </td>
      </tr>
    </ng-template>

    <ng-template #na>
      <td></td>
    </ng-template>
    <div class="plat-table-footer">更新时间：{{ updateTime }}</div>
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
      .table-head table,
      .table-body table {
        width: 100%;
        border-collapse: collapse;
      }
      .table-head {
        background-color: white;
      }
      .table-body {
        width: 100%;
        max-height: 400px;
        overflow-y: scroll;
        min-height: 50px;
      }
      .table-body table tr:nth-child(2n + 1) {
        background-color: #f2f2f2;
      }
      .headstyle tr th {
        border: 1px solid #cccccc30;
        text-align: center;
      }
      table thead,
      tbody tr {
        display: table;
        width: 100%;
        table-layout: fixed;
      }
      .table-body table tr td {
        border: 1px solid #cccccc30;
        text-align: center;
        max-width: 70px;
        word-wrap: break-word;
      }
      .table-body table tr td a {
        display: block;
        margin-top: 10px;
      }
      .table tbody tr td:nth-child(5) {
        word-wrap: break-word;
      }
      .history{
        overflow-y: hidden;
        width:12%;
        padding-right:0px;
      }
    `,
  ],
})
@DynamicForm({ type: 'invoice-transfer-vanke', formModule: 'dragon-show' })
export class VankePlatInvoiceShowComponent implements OnInit {
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
  // 万科建议转让金额总计
  public vankeTransferMoney = 0;
  updateTime: string;
  constructor(
    private xn: XnService,
    private vcr: ViewContainerRef,
    private hwModeService: HwModeService
  ) { }

  ngOnInit() {
    this.currentTab = DragonInfos.platVankeInvoice;
    this.items = JSON.parse(this.row.data);
    this.updateTime = this.row.updateTime;
    if (this.items.filter((v) => v && v.invoiceAmount).length > 0) {
      this.amountAll =
        this.computeSum(
          this.items
            .filter((v) => v && v.invoiceAmount)
            .map((v) => Number(v.invoiceAmount))
        ).toFixed(2) || 0;
    } else {
      this.amountAll = 0;
    }
    if (this.items.filter((v) => v && v.amount).length > 0) {
      this.preAmountAll =
        this.computeSum(
          this.items.filter((v) => v && v.amount).map((v) => Number(v.amount))
        ).toFixed(2) || 0;
    } else {
      this.preAmountAll = 0;
    }
    if (this.items.filter((v) => v && v.transferMoney).length > 0) {
      this.transferAmount =
        this.computeSum(
          this.items
            .filter((v) => v && v.transferMoney)
            .map((v) => Number(v.transferMoney))
        ).toFixed(2) || 0;
    } else {
      this.transferAmount = 0;
    }

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
  /**
   * 查看发票截图
   *
   * @param item 列表项
   */
  public viewScreenshot(item: any) {
    let params = {};
    if (!item.invoiceScreenshot) {
      this.xn.msgBox.open(false, '暂无国税局截图信息');
      return;
    }
    if (typeof item.invoiceScreenshot === 'object' && item.invoiceScreenshot) {
      params = { ...item.invoiceScreenshot };
    } else {
      const screenShot =
        item.invoiceScreenshot === ''
          ? undefined
          : JSON.parse(item.invoiceScreenshot);
      params = !screenShot ? {} : { ...screenShot };
    }
    if (JSON.stringify(params) === '{}') {
      this.xn.msgBox.open(false, '暂无国税局截图信息');
      return;
    }
    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      DragonMfilesViewModalComponent,
      [params]
    ).subscribe();
  }
  /**
   * 查中登
   */
  viewZd(paramItem: any) {
    const checkers =
      this.svrConfig.actions[this.svrConfig.actions.length - 1].checkers;
    let transferor: string;
    let contractNo: string;
    checkers.forEach((item) => {
      if (item.checkerId === 'debtUnit') {
        transferor = item.data;
      } else if (item.checkerId === 'dealContract') {
        // 非分步提交流程，合同编号取交易合同里的信息
        contractNo = JSON.parse(item.data)[0].contractId;
      } else if (item.checkerId === 'contractId') {
        // 分步提交流程，合同编号取 contractId
        contractNo = item.data;
      }
    });
    return {
      transferor: transferor,
      invoices: paramItem.invoiceNum,
      contractNo: contractNo,
    };
  }
  // 修改转让金额
  getHref(sub) {
    const newsub = sub.split('_');
    if (!transAction[newsub[newsub.length - 1]]) {
      return 'console/main-list/detail/' + sub;
    } else {
      return (
        transAction[newsub[newsub.length - 1]] + '/main-list/detail/' + sub
      );
    }
  }

  // 具体到单个数组的求和
  private computeSum(array) {
    return array.reduce((prev, curr) => {
      return prev + curr;
    });
  }
  public onOpenImage(index: number) {
    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      VankeInvoiceViewModalComponent,
      { fileList: this.items, paramIndex: index }
    ).subscribe(() => { });
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
