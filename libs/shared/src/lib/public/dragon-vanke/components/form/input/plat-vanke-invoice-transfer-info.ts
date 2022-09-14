/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Senzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\shared\src\lib\public\dragon-vanke\components\form\input\plat-vanke-invoice-transfer-info.ts
 * @summary：万科数据对接平台审核-发票组件
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                hucongying       万科数据对接优化     2021-06-01
 * **********************************************************************
 */

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { forkJoin, Observable, Observer, fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { DynamicForm } from '../../../../../common/dynamic-form/dynamic.decorators';
import { XnFormUtils } from '../../../../../common/xn-form-utils';
import { XnModalUtils } from '../../../../../common/xn-modal-utils';
import { XnUtils } from '../../../../../common/xn-utils';
import { PublicCommunicateService } from '../../../../../services/public-communicate.service';
import { XnService } from '../../../../../services/xn.service';
import { XnInputOptions } from '../../../../form/xn-input.options';
import { EditModalComponent } from '../../../modal/edit-modal.component';
import { VankeInvoiceViewModalComponent } from '../../../modal/invoice-view-modal.component';
import DragonInfos from '../../bean/checkers.tab';
import { HwModeService } from '../../../../../services/hw-mode.service';
import { ModalComponent } from '../../../../../common/modal/components/modal';
import { DragonMfilesViewModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/mfiles-view-modal.component';

import { isNullOrUndefined } from 'util';
import { LoadingPercentService } from '../../../../../services/loading-percent.service';
import { UploadPicService } from '../../../../../services/upload-pic.service';
import * as md5 from 'js-md5';
import { LocalStorageService } from '../../../../../services/local-storage.service';
@Component({
  selector: 'vanke-plat-invoice',
  template: `
    <div style="width:100%;">
      <div class="table-head" #tableHead>
        <table
          class="table table-bordered table-striped text-center"
          style="margin-bottom:0px !important"
        >
          <thead class="headstyle">
            <tr class="table-head">
              <!-- 全选按钮 -->
              <!-- title -->
              <th style="width:5%">序号</th>
              <th
                *ngFor="let head of currentTab.heads"
                [ngStyle]="{ width: head.type === 'mainFlowId' ? '12%' : '' }"
              >
                {{ head.label }}
              </th>
              <!-- 行操作 -->
              <th
                *ngIf="
                  ![
                    'dragon_supplier_sign',
                    'vanke_financing_sign',
                    'oct_financing_sign',
                    'sh_vanke_financing_sign',
                    'bgy_financing_sign',
                    'jd_financing_sign',
                    'yjl_factoring_risk',
                    'yjl_financing_sign',
                    'yjl_factoring_risk_common',
                    'yjl_financing_sign_common'
                  ].includes(svrConfig.flow.flowId)
                "
              >
                操作
              </th>
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
                <td style="width:5%">{{ i + 1 }}</td>
                <td
                  *ngFor="let head of currentTab.heads"
                  [ngClass]="{ history: head.type === 'mainFlowId' }"
                >
                  <ng-container [ngSwitch]="head.type">
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
                        >
                          {{ item.status | xnInvoiceStatus }}
                        </span>
                      </ng-template>
                    </ng-container>
                    <ng-container *ngSwitchCase="'money'">
                      <div *ngIf="item[head.value] && item[head.value] !== ''">
                        {{ item[head.value] | xnMoney }}
                      </div>
                    </ng-container>
                    <ng-container *ngSwitchCase="'mainFlowId'">
                      <div style="height:180px;overflow-y:auto">
                        <p
                          *ngFor="
                            let sub of item[head.value] | xnJson;
                            let i = index
                          "
                        >
                          <ng-container
                            *ngIf="sub.indexOf('cloud') === -1; else cloud"
                          >
                            <a [href]="getHref(sub)" target="_blank">{{
                              sub
                            }}</a>
                          </ng-container>
                          <ng-template #cloud>
                            <span>{{ sub }}</span>
                          </ng-template>
                        </p>
                      </div>
                    </ng-container>
                    <ng-container *ngSwitchCase="'screenshot'">
                      <ng-container *ngIf="item.invoiceScreenshot; else add">
                        <a
                          href="javaScript:void(0)"
                          (click)="viewScreenshot(item)"
                          >查看</a
                        >
                      </ng-container>
                      <ng-template #add>
                        <div
                          style="padding: 2px 5px"
                          class="btn btn-default btn-file xn-table-upload block"
                        >
                          <span class="hidden-xs xn-input-font">补充</span>
                          <input
                            type="file"
                            (change)="onUpload($event, item, i)"
                          />
                        </div>
                      </ng-template>
                    </ng-container>
                    <ng-container *ngSwitchDefault>
                      <div
                        [innerHTML]="
                          item[head.value]
                            | xnGatherType: { head: head, row: item }
                        "
                      ></div>
                    </ng-container>
                  </ng-container>
                </td>
                <td
                  *ngIf="
                    ![
                      'dragon_supplier_sign',
                      'vanke_financing_sign',
                      'oct_financing_sign',
                      'sh_vanke_financing_sign',
                      'bgy_financing_sign',
                      'jd_financing_sign',
                      'yjl_factoring_risk',
                      'yjl_financing_sign',
                      'yjl_factoring_risk_common',
                      'yjl_financing_sign_common'
                    ].includes(svrConfig.flow.flowId)
                  "
                >
                  <a
                    href="javaScript:void (0)"
                    (click)="changeTransferMoney(item)"
                    >修改转让金额</a
                  >

                  <a
                    class="xn-click-a"
                    target="_blank"
                    [routerLink]="['/console/manage/invoice-search/main/list']"
                    [queryParams]="viewZd(item)"
                    >查中登</a
                  >
                  <a
                    *ngIf="item.invoiceScreenshot"
                    href="javaScript:void(0)"
                    (click)="delScreenshot(item, i)"
                    >删除截图</a
                  >
                </td>
              </tr>
            </ng-container>
            <tr *ngIf="items.length > 0">
              <td style="width:5%">合计</td>
              <td>/</td>
              <td>/</td>
              <td>/</td>
              <td>/</td>
              <td class="money-color">{{ preAmountAll || '' | xnMoney }}</td>
              <td class="money-color">{{ amountAll || '' | xnMoney }}</td>
              <ng-container *ngIf="vankeTransferMoney; else na">
                <td class="money-color">{{ vankeTransferMoney | xnMoney }}</td>
              </ng-container>
              <td class="money-color">{{ transferAmount | xnMoney }}</td>
              <td>/</td>
              <td>/</td>
              <td style="width:12%">/</td>
              <td
                *ngIf="
                  ![
                    'dragon_supplier_sign',
                    'vanke_financing_sign',
                    'oct_financing_sign',
                    'sh_vanke_financing_sign',
                    'bgy_financing_sign',
                    'jd_financing_sign',
                    'yjl_factoring_risk',
                    'yjl_financing_sign',
                    'yjl_factoring_risk_common',
                    'yjl_financing_sign_common'
                  ].includes(svrConfig.flow.flowId)
                "
              >
                /
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <span class="xn-input-alert">{{ alert }}</span>

    <ng-template #block>
      <tr>
        <td [attr.colspan]="11">
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
      .table tbody tr td:nth-child(5) {
        word-wrap: break-word;
      }
      .history {
        overflow: hidden;
        width: 12%;
        padding-right: 0px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@DynamicForm({ type: 'invoice-transfer-vanke', formModule: 'dragon-input' })
export class VankePlatInvoiceComponent
  implements OnInit, AfterViewInit, OnDestroy {
  @Input() row: any;
  @Input() form: FormGroup;
  @Input() svrConfig: any;
  @Input() step?: any;
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
  // 万科建议转让金额总计
  public vankeTransferMoney = 0;
  // 更新时间
  public updateTime: string;
  subResize: any;
  private idx = 0;
  private arrCache: any[];
  private filesMap = new Map();
  private selectItem: any;
  private selectIndex: any;
  constructor(
    private xn: XnService,
    private render2: Renderer2,
    private vcr: ViewContainerRef,
    private er: ElementRef,
    private publicCommunicateService: PublicCommunicateService,
    private hwModeService: HwModeService,
    private cdr: ChangeDetectorRef,
    private uploadPicService: UploadPicService,
    private localstorigeService: LocalStorageService
  ) { }

  ngOnInit() {
    this.currentTab = DragonInfos.platVankeInvoiceTransfer;
    this.ctrl = this.form.get(this.row.name);
    this.items = JSON.parse(this.row.value);
    this.updateTime = this.row.updateTime;
    this.ctrl1 = this.form.get('receive');
    this.ctrl.statusChanges.subscribe((v) => {
      this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    });
    this.observable = new Observable(
      (subscribe) => (this.observer = subscribe)
    );
    const mainFlowIds$ = this.items.map((temp) =>
      this.xn.dragon.post('/file/allHistoryList', {
        mainFlowId: this.svrConfig.record.mainFlowId,
        invoiceNum: temp.invoiceNum,
        invoiceCode: temp.invoiceCode,
      })
    );
    forkJoin(mainFlowIds$).subscribe(async (x: any) => {
      this.items.forEach((item, index) => {
        item.mainFlowId = x[index].data;
      });
      await this.fromValue();
      this.xnOptions = new XnInputOptions(
        this.row,
        this.form,
        this.ctrl,
        this.er
      );
      this.cdr.markForCheck();
    });
    this.subResize = fromEvent(window, 'resize')
      .pipe(debounceTime(300))
      .subscribe(() => {
        this.formResize();
      });
  }

  ngAfterViewInit() {
    this.formResize();
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
  // 批量上传发票图片按钮
  public onUpload(e, item, index) {
    this.selectItem = item || '';
    this.selectIndex = index || '';
    if (e.target.files.length === 0) {
      return;
    }
    for (const file of e.target.files) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        file.md5 = md5(event.target.result);
        this.resolveFiles(e);
      };
      reader.readAsArrayBuffer(file);
    }
  }
  /**
   * 处理本地上传文件数据
   * @param e 文件event
   */
  private resolveFiles(e) {
    const files = e.target.files;
    this.idx++;
    if (this.idx === files.length) {
      this.idx = 0;
      const tempArr = [];
      for (const file of files) {
        tempArr.push(file);
      }
      // 保存数组
      this.arrCache = tempArr;
      // 本次选择重复的，在去重掉已经上传过的；
      const repeatFiles = XnUtils.distinctArray2(tempArr, 'md5').filter(
        (item) => !this.filesMap.has(item.md5)
      );
      if (repeatFiles.length < 1) {
        this.xn.msgBox.open(false, '发票已存在');
      }
      this.uploadImg(repeatFiles, 0);
      $(e.target).val('');
    }
  }
  // 上传图片
  private uploadImg(files: any[], index: number) {
    const that = this;
    if (files.length === index) {
      this.items.sort((a, b) => (a.prevName > b.prevName ? 1 : -1));
      // 进行批量验证
      // 已上传完毕关闭
      // 如果存在重复，并处理过，提示
      if (files.length < this.arrCache.length) {
        this.xn.msgBox.open(false, '已自动过滤重复发票');
      }
      return;
    }
    // this.loading.open(files.length, index);
    this.uploadPicService.compressImage(
      files[index],
      this.alert,
      this.row,
      (blob, file) => {
        const fd = new FormData();
        fd.append('checkerId', this.row.checkerId);
        // FormData.append中如果不带第三个参数，则默认filename属性为blob, file && file.name是为了检测file是否存在
        fd.append('file_data', blob, file && file.name);
        this.xn.file.dragonUpload(fd).subscribe({
          next: (v) => {
            if (v.type === 'progress') {
              // this.alert = this.uploadPicService.onProgress(v.data.originalEvent);
            } else if (v.type === 'complete') {
              if (v.data.ret === 0) {
                const prevFileName = (file && file.name) || (blob && blob.name); // filename不存在则检测blobname
                v.data.data.prevName = prevFileName;
                // this.alert = '';
                const screenShot = v.data.data;
                const {
                  invoiceNum,
                  invoiceCode,
                  invoiceDate,
                  invoiceAmount,
                  amount,
                  checkCode,
                } = this.selectItem;
                const selectIndex = this.selectIndex;
                that.xn.msgBox.open(false, '发票截图补充成功');
                this.items.forEach((item, i) => {
                  if (item.invoiceNum === invoiceNum) {
                    const obj = Object.assign(item, {
                      invoiceNum: invoiceNum || '',
                      invoiceCode: invoiceCode || '',
                      invoiceDate: invoiceDate || '',
                      invoiceAmount: invoiceAmount || '',
                      amount: amount || '',
                      checkCode: checkCode || '',
                      status: 1,
                      invoiceScreenshot: JSON.stringify(screenShot),
                    });
                    this.items[i] = obj;
                  }
                });
                this.toValue();
              } else {
                this.xn.msgBox.open(false, v.data.msg);
                // 上传失败
              }
              index++;
              setTimeout(() => {
                this.uploadImg(files, index);
              }, 1000);
            } else {
              // 上传失败
              this.xn.msgBox.open(false, v.data.msg);
            }
          },
          error: (errs) => {
            this.xn.msgBox.open(false, errs);
          },
          complete: () => {
            this.ctrl.markAsDirty();
            // this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
          },
        });
      }
    );
  }
  /**
   * 删除国税截图
   */
  delScreenshot(item, i) {
    this.items[i].invoiceScreenshot = null;
  }
  /**
   * 查中登
   */
  viewZd(paramItem) {
    return {
      transferor: this.form.get('debtUnit').value,
      invoices: paramItem.invoiceNum,
      contractNo: !!this.row.stepId
        ? this.form.get('contractId').value
        : JSON.parse(this.form.get('dealContract').value)[0].contractId,
    };
  }
  ngOnDestroy() {
    // 在组件生命周期销毁里取消事件，防止出现页面多次执行之后卡顿
    if (this.subResize) {
      this.subResize.unsubscribe();
    }
  }

  formResize() {
    const scrollContainer =
      $(`<div class="custom-scrollbar" style="box-sizing: border-box;
            position: absolute;height: 100px;width: 100px;top: -3000px;left: -3000px;
            overflow: scroll;z-index: 1000;overflow-y: scroll;"></div>`).prependTo(
        $('body')
      );
    const scrollContent = $(`<div class="inner" style="box-sizing: border-box;
            height: 200px;"></div>`).appendTo(scrollContainer);
    // 滚动条的宽度
    const scrollBarWidth1 =
      scrollContainer.outerWidth(true) - scrollContent.outerWidth(true);
    scrollContainer.remove();
    this.render2.setStyle(
      this.tableHead.nativeElement,
      'width',
      `calc(100% - ${scrollBarWidth1}px`
    );
  }
  // 修改转让金额
  changeTransferMoney(item) {
    const params = {
      title: '发票转让金额',
      checker: [
        {
          checkerId: 'transferMoney',
          required: 1,
          type: 'money-vanke',
          options: {},
          title: '发票转让金额',
          value: item.transferMoney,
          vankeTransferMoney: item?.vankeTransferMoney || 0,
        },
      ],
    };
    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      EditModalComponent,
      params
    ).subscribe((x) => {
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
        /**修改转让金额时，如果是通过状态，把审核状态变成未审核 */
        if (!!this.step) {
          this.step.result_status = this.step.result_status === 1 ? 0 : this.step.result_status;
        }
        this.toValue();
        this.cdr.markForCheck();
      }
    });
  }
  // TODO: 金蝶云发票查验
  // kingDeeInvoiceVerify(item) {
  //   const params = { ...item };
  //   this.xn.dragon.postMap('/file/invoice_check', params).subscribe(res => {
  //     if (res.ret === 0) {
  //       const responseData = res.data.data;
  //       this.xn.msgBox.open(false, '发票验证成功', () => {
  //         this.close({
  //           action: 'ok',
  //           invoiceCode: responseData.invoiceCode,
  //           invoiceNum: responseData.invoiceNum,
  //           invoiceDate: responseData.invoiceDate,
  //           amount: responseData.amount || 0,
  //           invoiceAmount: responseData.invoiceAmount,
  //           status: responseData.status, // 1表示验证成功
  //           invoiceCheckCode: params.invoiceCheckCode || '',
  //           invoiceScreenshot: responseData.invoiceScreenshot || '',
  //           fileId: params.fileId,
  //         });
  //       });
  //     } else {
  //       const html = `
  //         <dl>
  //           <dt>${res.msg}</dt>
  //         </dl>
  //       `;
  //       this.xn.msgBox.open(false, [html]);
  //     }
  //   });
  // }
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
        contractTypeBool.push(
          !!item.invoiceAmount && !!(item.invoiceNum && !!item.invoiceDate)
        );
        item.invoiceAmount = Number(item.invoiceAmount).toFixed(2);
        item.amount = Number(item.amount).toFixed(2);
        item.transferMoney = Number(item.transferMoney).toFixed(2);
        if(!isNaN(item.vankeTransferMoney)){
          item.vankeTransferMoney=Number(item.vankeTransferMoney).toFixed(2);
        }
        this.cdr.markForCheck();
      }
      contractTypeBool.indexOf(false) > -1
        ? this.ctrl.setValue('')
        : this.ctrl.setValue(JSON.stringify(this.items));
      if (this.items.filter((v) => v && v.invoiceAmount).length > 0) {
        this.amountAll =
          this.computeSum(
            this.items
              .filter((v) => v && v.invoiceAmount)
              .map((v) => Number(v.invoiceAmount))
          ).toFixed(2) || 0;
        this.transferAmount =
          this.computeSum(
            this.items
              .filter((v) => v && v.transferMoney)
              .map((v) => Number(v.transferMoney))
          ).toFixed(2) || 0;
        this.preAmountAll =
          this.computeSum(
            this.items.filter((v) => v && v.amount).map((v) => Number(v.amount))
          ).toFixed(2) || 0;
      } else {
        this.amountAll = 0;
        this.transferAmount = 0;
        this.preAmountAll = 0;
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
    // 计算完金额后向外抛出的值
    this.publicCommunicateService.change.emit(this.amountAll);
    this.localstorigeService.setCacheValue('invoicedata', this.items);
    this.ctrl.markAsTouched();
    this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
  }

  private fromValue() {
    this.items = XnUtils.parseObject(this.items, []);
    this.items = this.items.sort((a, b) => a.invoiceNum - b.invoiceNum);
    this.items.map((item) => {
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
        if (
          this.ReceiveData(this.ctrl1.value) >
          this.calculateData(item[i].invoiceAmount) &&
          totalinvoiceAmount < this.ReceiveData(this.ctrl1.value)
        ) {
          previnvoiceAmount = totalinvoiceAmount;
          totalinvoiceAmount += this.calculateData(item[i].invoiceAmount);
          if (totalinvoiceAmount > this.ReceiveData(this.ctrl1.value)) {
            item[i].transferMoney = this.calculateData(
              this.ReceiveData(this.ctrl1.value) - previnvoiceAmount
            );
            bcontinue = true;
          } else {
            item[i].transferMoney = this.calculateData(item[i].invoiceAmount);
          }
        } else {
          if (
            this.ReceiveData(this.ctrl1.value) <
            this.calculateData(item[i].invoiceAmount) &&
            i === 0
          ) {
            item[i].transferMoney = this.ReceiveData(this.ctrl1.value).toFixed(
              2
            );
            bcontinue = true;
          } else {
            item[i].transferMoney = this.calculateData(
              this.ReceiveData(this.ctrl1.value) - totalinvoiceAmount
            );
            bcontinue = true;
          }
        }
      }
    }
  }

  public onOpenImage(index: number) {
    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
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
  public close(value) {
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
