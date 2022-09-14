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

import { Component, OnInit, Input, ElementRef, ViewContainerRef, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { EditParamInputModel, DragonEditModalComponent } from '../../../modal/dragon-edit-modal.component';
import { CheckersOutputModel } from '../../../../../config/checkers';
import { DragonMfilesViewModalComponent } from '../../../modal/mfiles-view-modal.component';
import DragonInvoiceTabConfig from '../../../../../../../../products/dragon/src/lib/common/invoice-management';
import { Observable, of, fromEvent } from 'rxjs';
import DragonpaymentTabConfig from '../../.././../../../../../products/dragon/src/lib/common/upload-payment-confirmation';
import { DynamicForm } from '../../../../../common/dynamic-form/dynamic.decorators';
import { XnService } from '../../../../../services/xn.service';
import { XnFormUtils } from '../../../../../common/xn-form-utils';
import { XnInputOptions } from '../../../../form/xn-input.options';
import { XnModalUtils } from '../../../../../common/xn-modal-utils';
import { XnUtils } from '../../../../../common/xn-utils';
import { HwModeService } from '../../../../../services/hw-mode.service';

@Component({
  selector: 'dragon-payment-replace',
  template: `
    <div style="width:100%;">
        <div class="table-head">
            <table class="table">
                <thead>
                    <tr>
                        <!-- 全选按钮 -->
                        <!-- title -->
                        <th style='width:30px'>序号</th>
                        <th *ngFor="let head of currentTab.heads"
                            [ngStyle]="{'width':head.type==='mainFlowId'?'14%':head.width}">
                            {{head.label}}
                        </th>
                        <!-- 行操作 -->
                        <th>操作</th>
                    </tr>
                </thead>
            </table>
        </div>
        <div class="table-body">
            <table class="table">
                <tbody>
                    <ng-container *ngIf="items.length>0;">
                        <tr *ngFor="let item of items;let i=index">
                            <td style='width:30px'>{{i+1}}</td>
                            <td *ngFor="let head of currentTab.heads"
                                [ngStyle]="{'width':head.type==='mainFlowId'?'14%':head.width}"
                                style="max-width: 70px;word-wrap:break-word">
                                <ng-container [ngSwitch]="head.type">
                                    <ng-container *ngSwitchCase="'mainFlowId'">
                                        <a href="javaScript:void(0)"
                                            (click)="hwModeService.DragonviewProcess(item[head.value])">{{item[head.value]}}
                                        </a>
                                    </ng-container>
                                    <ng-container *ngSwitchCase="'file'">
                                        <ng-container *ngIf=" item[head.value]&& item[head.value]!==''">
                                            <div *ngFor="let sub of item[head.value] | xnJson">
                                                <a href="javaScript:void(0)" (click)="viewFiles(sub)">{{sub.fileName}}</a>
                                            </div>
                                        </ng-container>
                                    </ng-container>
                                    <ng-container *ngSwitchCase="'result'">
                                        <div *ngIf='item.flag===0'>未匹配</div>
                                        <div *ngIf='item.flag===1 || item.flag===2'>匹配成功</div>
                                    </ng-container>
                                    <ng-container *ngSwitchDefault>
                                        <div [innerHTML]="item[head.value] | xnGatherType: {head:head,row:item}"></div>
                                    </ng-container>
                                </ng-container>
                            </td>
                            <td> <a class="xn-click-a" (click)='replaceFile(item)'>替换文件</a></td>
                        </tr>
                    </ng-container>
                </tbody>
            </table>
        </div>
    </div>
      `,
  styles: [
    `
        .table-head table,.table-body table{
            margin-bottom: 0px
        }
        .table-body{
            width:100%;
            max-height:600px;
            overflow-y:auto;
            min-height:50px;
        }
        .table-body table tr:nth-child(2n+1){
            background-color:#f9f9f9;
        }
        table thead,tbody tr {
            display:table;
            width:100%;
            table-layout:fixed;
        }
        .table-head table tr th {
            border:1px solid #cccccc30;
            text-align: center;
        }
        .table-body table tr td{
            border:1px solid #cccccc30;
            text-align: center;
        }
        `
  ]
})
@DynamicForm({ type: 'replace-list', formModule: 'dragon-input' })
export class DragonPaymentReplaceComponent implements OnInit, AfterViewInit {

  @Input() row: any;
  @Input() form: FormGroup;
  @Input() svrConfig: any;
  public ctrl: AbstractControl;

  public items: any[] = [];
  public Tabconfig: any;
  currentTab: any; // 当前标签页
  alert = '';
  public xnOptions: XnInputOptions;
  public flag = ''; // 判断合同账户信息与供应商收款账户信息是否一致
  subResize: any;
  fileTypeMatch = {
    深圳市龙光控股有限公司: [
      { label: '《付款确认书(总部致保理商)》', value: 1 },
      { label: '《付款确认书(总部致劵商)》', value: 2 },
    ],
    万科企业股份有限公司: [
      { label: '《付款确认书》', value: 3 },
    ],
    雅居乐集团控股有限公司: [
      { label: '《付款确认书（适用于雅居乐控股向供应商出具）》', value: 3 }
    ],
    碧桂园地产集团有限公司: [
      { label: '《付款确认书》', value: 3 },
    ],
    深圳华侨城股份有限公司: [
      { label: '《付款确认书》', value: 3 },
    ],
  };
  public myClass = '';
  constructor(private xn: XnService,
    private vcr: ViewContainerRef, private cdr: ChangeDetectorRef, private er: ElementRef, public hwModeService: HwModeService,) {
  }

  ngOnInit() {
    this.ctrl = this.form.get(this.row.name);
    const headquarters = JSON.parse(this.row.value)[0].headquarters;
    this.currentTab = DragonpaymentTabConfig.replaceFile[headquarters];
    this.items = JSON.parse(this.row.value);
    this.ctrl.statusChanges.subscribe(() => {
      this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    });
    this.fromValue();
    this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    this.subResize = fromEvent(window, 'resize').subscribe((event) => {
      this.formResize();
    });
  }
  ngAfterViewInit() {
    this.formResize();
  }
  viewFiles(params) {
    params.isAvenger = true;
    XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonMfilesViewModalComponent, [params]).subscribe(() => {
    });
  }
  // 替换文件
  replaceFile(item) {
    // 判断是否可替换
    const obj = {
      mainFlowId: item.mainFlowId
    };
    // 不允许一下状态替换付款确认书文件
    const statusReject = (currentStatus) => (
      currentStatus === '审批中' ||
      currentStatus === '待签署合同' ||
      currentStatus === '待放款' ||
      currentStatus === '已放款' ||
      currentStatus === '已回款')
    this.xn.dragon.post('/list/main/detail', obj).subscribe((res) => {
      if (obj.mainFlowId.endsWith('lg') || obj.mainFlowId.endsWith('yjl') || obj.mainFlowId.endsWith('hz')) {
        if (res.ret === 0 && (res.data.currentStatus === '待放款' || res.data.currentStatus === '已放款' || res.data.currentStatus === '已回款')) {
          this.xn.msgBox.open(false, '不允许替换待放款、已放款、已回款状态的交易的付款确认书文件');
          return;
        }

      }
      // 暂时去除改校验
      // if (obj.mainFlowId.endsWith('wk') ||
      //   obj.mainFlowId.endsWith('bgy') ||
      //   obj.mainFlowId.endsWith('oct')) {
      //   if (res.ret === 0 && statusReject(res.data.currentStatus)) {
      //     this.xn.msgBox.open(false, '不允许替换审批中、待签署合同、待放款、已放款、已回款状态的交易的付款确认书文件');
      //     return;
      //   }

      // }
      if (res.ret === 0) {
        const paramsValue = this.fileTypeMatch[item.headquarters];
        const params: EditParamInputModel = {
          title: '替换付款确认书文件',
          options: {
            tips: '',
            svrConfig: {
              headquarters: item.headquarters,
              personList: item,
              selectValue: ''
            },
          },
          checker: [
            {
              title: '文件类型',
              checkerId: 'qrsType',
              type: 'replace-select',
              required: 1,
              value: paramsValue,
            }
          ] as CheckersOutputModel[],
          buttons: ['取消', '确定']
        };

        XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonEditModalComponent, params).subscribe(v => {
          if (v === null) {
            return;
          } else {
            if (v.factoringPayConfirmYyj && this.judgeDataType(v.factoringPayConfirmYyj) && v.factoringPayConfirmYyj.length) {
              item.factoringPayConfirmYyj = JSON.stringify(v.factoringPayConfirmYyj);
            }
            if (v.brokerPayConfirmYyj && this.judgeDataType(v.brokerPayConfirmYyj) && v.brokerPayConfirmYyj.length) {
              item.brokerPayConfirmYyj = JSON.stringify(v.brokerPayConfirmYyj);
            }
            if (v.pdfProjectFiles && this.judgeDataType(v.pdfProjectFiles) && v.pdfProjectFiles.length) {
              item.pdfProjectFiles = JSON.stringify(v.pdfProjectFiles);
            }
            this.cdr.markForCheck();
            this.toValue();
          }
        });
      }
    });
  }

  private fromValue() {
    this.items = XnUtils.parseObject(this.ctrl.value, []);
    this.toValue();
  }

  // 上传完后取回值
  private toValue() {
    if (this.items.length === 0) {
      this.ctrl.setValue('');
    } else {
      this.items.forEach(() => {
        this.ctrl.setValue(JSON.stringify(this.items));

      });
    }

    this.ctrl.markAsTouched();
    this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
  }
  ngOnDestroy() {
    // 在组件生命周期销毁里取消事件，防止出现页面多次执行之后卡顿
    if (this.subResize) {
      this.subResize.unsubscribe();
    }
  }
  formResize() {
    const scrollBarWidth = $('.table-body', this.er.nativeElement).outerWidth(true) - $('.table-body>table').outerWidth(true);
    $('.table-head', this.er.nativeElement).css({ 'padding-right': scrollBarWidth ? scrollBarWidth + 'px' : '0px' });
  }
  /**
   *  判断数据类型
   * @param paramValue
   */
  public judgeDataType(paramValue: any): boolean {
    if (typeof Array.isArray === 'function') {
      return Array.isArray(paramValue);
    } else {
      return Object.prototype.toString.call(paramValue) === '[object Array]';
    }
  }
}
