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

import { Component, OnInit, OnDestroy, AfterViewInit, Input, ElementRef, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';

import { DragonMfilesViewModalComponent } from '../../../modal/mfiles-view-modal.component';
import { Observable, of, fromEvent } from 'rxjs';
import { DynamicForm } from '../../../../../common/dynamic-form/dynamic.decorators';
import { XnService } from '../../../../../services/xn.service';
import { HwModeService } from '../../../../../services/hw-mode.service';
import DragonpaymentTabConfig from '../../../../../../../../products/dragon/src/lib/common/upload-payment-confirmation';
import { XnModalUtils } from '../../../../../common/xn-modal-utils';

@Component({
    selector: 'dragon-payment-replace-show',
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
@DynamicForm({ type: 'replace-list', formModule: 'dragon-show' })
export class DragonPaymentReplaceShowComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() row: any;
    @Input() form: FormGroup;
    @Input() svrConfig: any;

    public items: any[] = [];
    currentTab: any; // 当前标签页
    subResize: any;
    constructor(private xn: XnService, private vcr: ViewContainerRef,
                private cdr: ChangeDetectorRef, private er: ElementRef,
                public hwModeService: HwModeService) {
    }
    ngOnInit() {
        const headquarters = JSON.parse(this.row.data)[0].headquarters;
        this.currentTab = DragonpaymentTabConfig.replaceFile[headquarters];
        if (!!this.row.data) {
            this.items = JSON.parse(this.row.data);
        }
        this.subResize = fromEvent(window, 'resize').subscribe((event) => {
            this.formResize();
        });
    }
    // 查看文件
    viewFiles(params) {
        params.isAvenger = true;
        XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonMfilesViewModalComponent, [params]).subscribe(v => {
            if (v.action === 'cancel') {
                return;
            } else {
            }
        });
    }
    ngAfterViewInit() {
        this.formResize();
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
}
