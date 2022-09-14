/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：profit-table-input.component.ts
 * @summary：资产池变更发行流程列表
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 wangqing            增加             2019-10-31
 * **********************************************************************
 */

import { Component, OnInit, Input, ElementRef, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { DragonMfilesViewModalComponent } from '../../../modal/mfiles-view-modal.component';
import { DynamicForm } from '../../../../../common/dynamic-form/dynamic.decorators';
import { XnInputOptions } from '../../../../form/xn-input.options';
import { XnService } from '../../../../../services/xn.service';
import DragonchangeCapitalTabConfig from '../../../../../../../../products/dragon/src/lib/common/change-capital.config';
import { XnModalUtils } from '../../../../../common/xn-modal-utils';
import { HwModeService } from '../../../../../services/hw-mode.service';

@Component({
  selector: 'change-capital',
  template: `
  <div style="width:100%;">
  <div class="table-head" [ngStyle]="{'padding-right':items.length>10?'17px':'0px'}">
    <table>
    <thead class='headstyle'>
      <tr>
        <!-- 全选按钮 -->
        <!-- title -->
        <th style='width:30px'>序号</th>
        <th *ngFor="let head of currentTab.heads" [ngStyle]="{'width':head.type==='mainFlowId'?'14%':head.width}">
          {{head.label}}
        </th>
      </tr>
    </thead>
    </table>
    </div>
    <div class="table-body">
    <table>
    <tbody>
        <ng-container  *ngIf="items.length>0;" >
            <tr *ngFor="let item of items;let i=index"  >
            <td style='width:30px'>{{i+1}}</td>
            <td *ngFor="let head of currentTab.heads" [ngStyle]="{'width':head.type==='mainFlowId'?'14%':head.width}"
             style="max-width: 70px;word-wrap:break-word">
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
            <ng-container *ngSwitchDefault>
            <div [innerHTML]="item[head.value] | xnGatherType: {head:head,row:item}"></div>
          </ng-container>
            </ng-container>
            </td>
            </tr>
            </ng-container>


    </tbody>
  </table>
  </div>
</div>
    `,
  styles: [
    `
    .table-head table,.table-body table{width:100%;border-collapse:collapse;}
    .table-head{background-color:white}
    .table-body{width:100%; max-height:600px;overflow-y:auto;min-height:50px;}
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
    }
        `
  ]
})
@DynamicForm({ type: 'dragon_add_list', formModule: 'dragon-input' })
export class DragonchangeCapitalComponent implements OnInit {

  @Input() row: any;
  @Input() form: FormGroup;
  @Input() svrConfig: any;
  public ctrl: AbstractControl;

  public items: any[] = [];
  public Tabconfig: any;
  currentTab: any; // 当前标签页
  alert = '';
  public xnOptions: XnInputOptions;
  constructor(private xn: XnService,
              private vcr: ViewContainerRef,
              private er: ElementRef, public hwModeService: HwModeService, ) {
  }

  ngOnInit() {
    this.ctrl = this.form.get(this.row.name);
    this.currentTab = DragonchangeCapitalTabConfig.changeCapitalOne;
    this.items = JSON.parse(this.row.value);
    this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);

  }
  viewFiles(params) {
    XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonMfilesViewModalComponent, [params]).subscribe(() => {
    });
  }
}
