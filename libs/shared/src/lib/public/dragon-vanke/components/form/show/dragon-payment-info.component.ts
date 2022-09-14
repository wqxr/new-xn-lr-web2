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

import { Component, OnInit, Input, ElementRef, ViewContainerRef } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { DragonMfilesViewModalComponent } from '../../../modal/mfiles-view-modal.component';
import { DynamicForm } from '../../../../../common/dynamic-form/dynamic.decorators';
import { XnInputOptions } from '../../../../form/xn-input.options';
import { XnService } from '../../../../../services/xn.service';
import DragonpaymentTabConfig from '../../../../../../../../products/dragon/src/lib/common/upload-payment-confirmation';
import { XnModalUtils } from '../../../../../common/xn-modal-utils';
import { HwModeService } from '../../../../../services/hw-mode.service';


@Component({
  selector: 'dragon-payment-info-show',
  template: `
    <table class="table table-bordered text-center">
    <thead>
      <tr class="table-head">
        <!-- 全选按钮 -->
        <!-- title -->
        <th>序号</th>
        <th *ngFor="let head of currentTab.heads">
          {{head.label}}
        </th>
        <!-- 行操作 -->
      </tr>
    </thead>
    <tbody>
        <ng-container  *ngIf="items.length;" >
            <tr *ngFor="let item of items;let i=index" >
            <td>{{i+1}}</td>
            <td *ngFor="let head of currentTab.heads">
            <ng-container [ngSwitch]="head.type">
            <ng-container *ngSwitchCase="'mainFlowId'">
            <a href="javaScript:void(0)"
               (click)="hwModeService.DragonviewProcess(item[head.value])">{{item[head.value]}}</a>
          </ng-container>
          <ng-container *ngSwitchCase="'file'">
          <ng-container *ngIf=" item[head.value]&& item[head.value]!==''">
            <div *ngFor="let sub of item[head.value] | xnJson">
              <a href="javaScript:void(0)" (click)="viewFiles(sub)">{{sub.fileName}}</a>
            </div>
          </ng-container>
          </ng-container>
          <ng-container *ngSwitchCase="'result'">
          <div *ngIf='item.flag===true'>匹配成功</div>
          <div *ngIf='item.flag===false'>未匹配</div>
            </ng-container>
            <ng-container *ngSwitchDefault>
            <div [innerHTML]="item[head.value] | xnGatherType: {head:head,row:item}"></div>
          </ng-container>
            </ng-container>
            </td>
            </tr>
            </ng-container>


    </tbody>
  </table>

    `,
  styles: [
    `
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
        `
  ]
})
@DynamicForm({ type: 'person-list1', formModule: 'dragon-show' })
export class DragonPaymentInfoShowComponent implements OnInit {

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

  public myClass = '';
  constructor(private xn: XnService,
              private vcr: ViewContainerRef, public hwModeService: HwModeService, ) {
  }

  ngOnInit() {
    this.ctrl = this.form.get(this.row.name);
    this.currentTab = DragonpaymentTabConfig.personMatch;
    this.items = JSON.parse(this.row.data);
    // this.ctrl.statusChanges.subscribe(v => {
    //     this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    // });
    // this.fromValue();
    // this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    // console.info('this.items', this.items);
  }
  viewFiles(params) {
    XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonMfilesViewModalComponent, [params]).subscribe(v => {
      if (v.action === 'cancel') {
        return;
      } else {
      }
    });
  }

}
