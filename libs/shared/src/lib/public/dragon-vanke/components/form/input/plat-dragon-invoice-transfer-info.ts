/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：profit-table-input.component.ts
 * @summary：龙光供应商上传资料平台初审交易合同
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 wangqing            增加             2019-08-30
 * **********************************************************************
 */

import {
  Component,
  OnInit,
  Input,
  ElementRef,
  ViewContainerRef,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  AfterViewInit,
  OnDestroy,
  Renderer2,
  ViewChild
} from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import DragonInfos from '../../bean/checkers.tab';

import { EditModalComponent } from '../../../modal/edit-modal.component';

import { VankeInvoiceViewModalComponent } from '../../../modal/invoice-view-modal.component';
import { forkJoin, fromEvent, Observable } from 'rxjs';
import { DynamicForm } from '../../../../../common/dynamic-form/dynamic.decorators';
import { XnFormUtils } from '../../../../../common/xn-form-utils';
import { XnInputOptions } from '../../../../form/xn-input.options';
import { XnModalUtils } from '../../../../../common/xn-modal-utils';
import { XnUtils } from '../../../../../common/xn-utils';
import { HwModeService } from '../../../../../services/hw-mode.service';
import { PublicCommunicateService } from '../../../../../services/public-communicate.service';
import { XnService } from '../../../../../services/xn.service';
import { debounceTime } from 'rxjs/operators';
import { ModalComponent } from '../../../../../common/modal/components/modal';
import { ShVankeFlowIdEnum } from 'libs/shared/src/lib/config/enum';

@Component({
  selector: 'dragon-plat-invoice',
  template: `
    <div style="width:100%;">
      <div class="table-head" #tableHead>
        <table class="table table-bordered table-striped text-center" style='margin-bottom:0px !important'>
          <thead class='headstyle'>
            <tr class="table-head">
              <!-- 全选按钮 -->
              <!-- title -->
              <th>序号</th>
              <th *ngFor="let head of currentTab.heads">
                {{head.label}}
              </th>
              <!-- 行操作 -->
              <th *ngIf="!['dragon_supplier_sign', 'vanke_financing_sign','oct_financing_sign', 'cdr_supplier_sign',
              'sh_vanke_financing_sign','bgy_financing_sign','jd_financing_sign',
              'yjl_factoring_risk','yjl_financing_sign','yjl_factoring_risk_common','yjl_financing_sign_common'].includes(svrConfig.flow.flowId) && !row.options?.readonly">操作</th>
            </tr>
          </thead>
        </table>
      </div>
        <div class="table-body">
          <table class="table table-bordered table-hover text-center table-display" style='margin-bottom:0px !important'>
            <tbody>
              <ng-container  *ngIf="items.length;else block" >
                <tr *ngFor="let item of items;let i=index" >
                  <td>{{i+1}}</td>
                  <td *ngFor="let head of currentTab.heads">
                    <ng-container [ngSwitch]="head.type">
                      <ng-container *ngSwitchCase="'file'">
                        <ng-container *ngIf="item[head.value]&& item[head.value]!==''">
                            <div><a href="javaScript:void(0)" (click)="onOpenImage(i)">文件</a></div>
                        </ng-container>
                      </ng-container>
                      <ng-container *ngSwitchCase="'status'">
                        <ng-container *ngIf="(item?.tag&&item?.tag==='artificial') || (item?.away && item?.away==='edit');else block1">
                            <span class="tag-color">人工验证</span>
                        </ng-container>
                        <ng-template #block1>
                            <span [ngClass]="{'tag-color':item.status===4 || item.status===2}">
                                {{item.status | xnInvoiceStatus}}
                            </span>
                        </ng-template>
                      </ng-container>
                      <ng-container *ngSwitchCase="'money'">
                        <div *ngIf="item[head.value] && item[head.value] !==''">
                            {{item[head.value] | xnMoney}}
                        </div>
                      </ng-container>
                      <ng-container *ngSwitchCase="'mainFlowId'">
                        <p *ngFor='let sub of item[head.value] | xnJson; let i=index'>
                          <ng-container *ngIf="sub.indexOf('cloud') === -1;else cloud">
                            <a [href]="getHref(sub)" target="_blank">{{ sub }}</a>
                          </ng-container>
                          <ng-template #cloud>
                            <span>{{sub}}</span>
                          </ng-template>
                        </p>
                      </ng-container>
                      <ng-container *ngSwitchDefault>
                        <div [innerHTML]="item[head.value] | xnGatherType: {head:head,row:item}"></div>
                      </ng-container>
                    </ng-container>
                  </td>
                  <td *ngIf="!['dragon_supplier_sign', 'vanke_financing_sign','oct_financing_sign', 'cdr_supplier_sign',
                  'sh_vanke_financing_sign','bgy_financing_sign','jd_financing_sign',
                  'yjl_factoring_risk','yjl_financing_sign','yjl_factoring_risk_common','yjl_financing_sign_common'].includes(svrConfig.flow.flowId) && !row.options?.readonly">
                      <a href="javaScript:void (0)" (click)='changeTransferMoney(item)'>修改转让金额</a>
                      <!-- <a class="tag-color" *ngIf="item.status===4 || item.status===2" href="javaScript:void (0)" (click)='kingDeeInvoiceVerify(item)'>去验证发票</a> -->
                  </td>
                </tr>
              </ng-container>
              <tr *ngIf="items.length>0">
                <td>合计</td>
                <td>/</td>
                <td>/</td>
                <td>/</td>
                <td>/</td>
                <td class="money-color">{{preAmountAll || '' | xnMoney}}</td>
                <td class="money-color">{{ amountAll || '' | xnMoney}}</td>
                <ng-container *ngIf="vankeTransferMoney; else na">
                   <td class="money-color">{{ vankeTransferMoney | xnMoney }}</td>
                </ng-container>
                <td class="money-color">{{transferAmount  | xnMoney}}</td>
                <td>/</td>
                <td>/</td>
                <td *ngIf="!['dragon_supplier_sign', 'vanke_financing_sign', 'oct_financing_sign', 'cdr_supplier_sign',
                'sh_vanke_financing_sign','bgy_financing_sign','jd_financing_sign',
                'yjl_factoring_risk','yjl_financing_sign','yjl_factoring_risk_common','yjl_financing_sign_common'].includes(svrConfig.flow.flowId)">/</td>
              </tr>
            </tbody>
          </table>
        </div>
    </div>
    <span class="xn-input-alert">{{alert}}</span>
    <ng-template #block>
      <tr>
        <td [attr.colspan]="11">
          <div class="empty-message"></div>
        </td>
      </tr>
    </ng-template>
    <ng-template #na>
      <td *ngIf="svrConfig.flow.flowId === shVankePlatformVerify"></td>
    </ng-template>
    <div class="plat-table-footer">更新时间：{{updateTime}}</div>
    `,
  styles: [`
    .plat-table-footer {
      font-size: 14px;
      text-align: right;
      padding-right: 8px;
    }
    .table-head table,.table-body table{width:100%;border-collapse:collapse;}
    .table-head{background-color:white}
    .table-body{width:100%; max-height:400px;overflow-y:scroll;min-height:50px;}
    .table-body table tr:nth-child(2n+1){background-color:#f2f2f2;}
    .headstyle  tr th{
      border:1px solid #cccccc30;
      text-align: center;
    }
    table thead, tbody tr {
      display:table;
      width:100%;
      table-layout:fixed;
      }
  .table-body table tr td{
      border:1px solid #cccccc30;
      text-align: center;
      max-width: 70px;
      word-wrap:break-word
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
      color: #f20000;;
    }
    .table tbody tr td:nth-child(5) {
      word-wrap: break-word
    }
    `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@DynamicForm({ type: 'invoice-transfer', formModule: 'dragon-input' })
export class DragonPlatInvoiceComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() row: any;
  @Input() form: FormGroup;
  @Input() svrConfig: any;
  @ViewChild('tableHead') tableHead: ElementRef;
  @ViewChild('modal') modal: ModalComponent;
  private observer: any;
  private observable: any;
  private ctrl: AbstractControl;
  private ctrl1: AbstractControl;

  public items: any[] = [];
  public Tabconfig: any;
  currentTab: any; // 当前标签页
  // 含税
  public amountAll = 0;
  public alert = '';
  private xnOptions: XnInputOptions;
  public transferAmount = 0;
  headLeft = 0;
  scrollX = 0;
  // 不含税
  public preAmountAll = 0;
  subResize: any;
  // 更新时间
  public updateTime: string;
  // 万科建议转让金额总计
  public vankeTransferMoney = 0;
  // 上海银行平台审核流程
  get shVankePlatformVerify() {
    return ShVankeFlowIdEnum.ShVankePlatformVerify;
  }
  constructor(
    private xn: XnService, private render2: Renderer2,
    private vcr: ViewContainerRef, private er: ElementRef,
    private publicCommunicateService: PublicCommunicateService,
    private hwModeService: HwModeService, private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    const flowId = this.svrConfig.flow.flowId;
    if(flowId === ShVankeFlowIdEnum.ShVankePlatformVerify) {
      // 上海银行平台审核流程
      this.currentTab = DragonInfos.shVankePlatInvoice;
    } else {
      this.currentTab = DragonInfos.platInvoice;
    }
    this.updateTime = this.row.updateTime;
    this.ctrl = this.form.get(this.row.name);
    this.items = JSON.parse(this.row.value);
    this.ctrl1 = this.form.get('receive');
    this.observable = Observable.create(observer => { this.observer = observer; });
    this.ctrl.statusChanges.subscribe(v => {
      this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    });
    const mainFlowIds$ = this.items.map(temp =>
      this.xn.dragon.post('/file/allHistoryList',
        {
          mainFlowId: this.svrConfig.record.mainFlowId,
          invoiceNum: temp.invoiceNum, invoiceCode: temp.invoiceCode
        }));
    forkJoin(mainFlowIds$).subscribe(async (x: any) => {
      this.items.forEach((item, index) => {
        item.mainFlowId = x[index].data;
      });
      await this.fromValue();
      this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
      this.cdr.markForCheck();
    });
    this.subResize = fromEvent(window, 'resize').pipe(debounceTime(300)).subscribe(() => {
      this.formResize();
    });
  }

  ngAfterViewInit() {
    this.formResize();
  }

  getHref(sub) {
    const newsub = sub.split('_');
    if (!transAction[newsub[newsub.length - 1]]) {
      return 'console/main-list/detail/' + sub;
    } else {
      return transAction[newsub[newsub.length - 1]] + '/main-list/detail/' + sub;
    }
  }
  ngOnDestroy() {
    // 在组件生命周期销毁里取消事件，防止出现页面多次执行之后卡顿
    if (this.subResize) {
      this.subResize.unsubscribe();
    }
  }

  formResize() {
    const scrollContainer = $(`<div class="custom-scrollbar" style="box-sizing: border-box;
            position: absolute;height: 100px;width: 100px;top: -3000px;left: -3000px;
            overflow: scroll;z-index: 1000;overflow-y: scroll;"></div>`).prependTo($('body'));
    const scrollContent = $(`<div class="inner" style="box-sizing: border-box;
            height: 200px;"></div>`).appendTo(scrollContainer);
    // 滚动条的宽度
    const scrollBarWidth1 = scrollContainer.outerWidth(true) - scrollContent.outerWidth(true);
    scrollContainer.remove();
    this.render2.setStyle(this.tableHead.nativeElement, 'width', `calc(100% - ${scrollBarWidth1}px`);
  }
  // 修改转让金额
  changeTransferMoney(item) {
    const params = {
      title: '发票转让金额',
      checker: [
        {
          checkerId: 'transferMoney',
          required: 1,
          type: 'money',
          options: {},
          title: '发票转让金额',
          value: item.transferMoney,
        },
      ]
    };
    XnModalUtils.openInViewContainer(this.xn, this.vcr, EditModalComponent, params).subscribe(x => {

      if (x === null) {
        return;
      }
      const transfer = this.ReceiveData(x.transferMoney);
      if (transfer < 0) {
        this.xn.msgBox.open(false, '转让金额不可以为负数');
        return;
      } else if (transfer > parseFloat(item.invoiceAmount)) {
        this.xn.msgBox.open(false, '转让金额不可以大于税收金额');
        return;

      } else {
        item.transferMoney = transfer.toFixed(2);
        this.toValue();
        this.cdr.markForCheck();
      }
    });
  }
  // 滚动表头
  onScroll($event) {
    this.headLeft = $event.srcElement.scrollLeft * -1;
  }

  // 上传完后取回值
  private toValue() {
    if (this.items.length === 0) {
      this.ctrl.setValue('');
      this.amountAll = 0;
      this.transferAmount = 0;
      this.preAmountAll = 0;
    } else {
      const contractTypeBool = []; // 必须每张发票都包含发票号，金额，开票日期
      for (const item of this.items) {
        contractTypeBool.push(!!(item.invoiceAmount) && !!(item.invoiceNum && !!item.invoiceDate));
        item.invoiceAmount = Number(item.invoiceAmount).toFixed(2);
        item.amount = Number(item.amount).toFixed(2);
        item.transferMoney = Number(item.transferMoney).toFixed(2);
        if(!isNaN(item.vankeTransferMoney)) {
          item.vankeTransferMoney = Number(item.vankeTransferMoney).toFixed(2);
        }
        this.cdr.markForCheck();

      }
      contractTypeBool.indexOf(false) > -1 ? this.ctrl.setValue('') : this.ctrl.setValue(JSON.stringify(this.items));
      if (this.items.filter(v => v && v.invoiceAmount).length > 0) {
        this.amountAll = this.computeSum(this.items.filter(v =>
          v && v.invoiceAmount).map(v => Number(v.invoiceAmount))).toFixed(2) || 0;
        this.transferAmount = this.computeSum(this.items.filter(v =>
          v && v.transferMoney).map(v => Number(v.transferMoney))).toFixed(2) || 0;
        this.preAmountAll = this.computeSum(this.items.filter(v =>
          v && v.amount).map(v => Number(v.amount))).toFixed(2) || 0;


      } else {
        this.amountAll = 0;
        this.transferAmount = 0;
        this.preAmountAll = 0;
      }
      // 万科建议转让金额合计
      if (this.items.filter((v: any) => v && v.vankeTransferMoney).length > 0) {
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
    // 计算完金额后向外抛出的值
    this.publicCommunicateService.change.emit(this.amountAll);
    this.ctrl.markAsTouched();
    this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
  }

  private fromValue() {
    this.items = XnUtils.parseObject(this.items, []);
    this.items = this.items.sort((a, b) => a.invoiceNum - b.invoiceNum);

    this.items.map(item => {
      if (item.transferMoney !== undefined) {
        this.toValue();
        return;

      } else {
        this.firstcaclate(this.items);
        this.toValue();
      }
    });
  }

  firstcaclate(item: any) {
    let totalinvoiceAmount = 0;
    let previnvoiceAmount = 0;
    let bcontinue = false;
    for (let i = 0; i < item.length; i++) {
      if (bcontinue) {
        item[i].transferMoney = 0;
      } else {
        if (this.ReceiveData(this.ctrl1.value) > this.calculateData(item[i].invoiceAmount) &&
          totalinvoiceAmount < this.ReceiveData(this.ctrl1.value)) {
          previnvoiceAmount = totalinvoiceAmount;
          totalinvoiceAmount += this.calculateData(item[i].invoiceAmount);
          if (totalinvoiceAmount > this.ReceiveData(this.ctrl1.value)) {
            item[i].transferMoney = this.calculateData(this.ReceiveData(this.ctrl1.value) - previnvoiceAmount);
            bcontinue = true;
          } else {
            item[i].transferMoney = this.calculateData(item[i].invoiceAmount);
          }
        } else {
          if (this.ReceiveData(this.ctrl1.value) < this.calculateData(item[i].invoiceAmount) && i === 0) {
            item[i].transferMoney = this.ReceiveData(this.ctrl1.value).toFixed(2);
            bcontinue = true;
          } else {
            item[i].transferMoney = this.calculateData(this.ReceiveData(this.ctrl1.value) - totalinvoiceAmount);
            bcontinue = true;

          }
        }
      }
    }
  }

  public onOpenImage(index: number) {
    XnModalUtils.openInViewContainer(
      this.xn, this.vcr,
      VankeInvoiceViewModalComponent,
      { fileList: this.items, paramIndex: index }
    ).subscribe(() => { });
  }
  // 计算转让金额
  public calculateData(item: any) {
    return Number(parseFloat(item).toFixed(2));
  }

  // 计算应收账款转让金额
  public ReceiveData(item: any) {
    let tempValue = `${item}`.replace(/,/g, '');
    tempValue = parseFloat(tempValue).toFixed(2);
    return Number(tempValue);
  }
  // 具体到单个数组的求和
  private computeSum(array) {
    return array.reduce((prev, curr, idx, arr) => {
      return prev + curr;
    });
  }
  // 关闭弹窗
  private close(value) {
    this.modal.close();
    this.observer.next(value);
    this.observer.complete();
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
