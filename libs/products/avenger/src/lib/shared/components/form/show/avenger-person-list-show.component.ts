import { Component, OnInit, OnDestroy, AfterViewInit, Input, ElementRef, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import {fromEvent} from 'rxjs';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import DragonInvoiceTabConfig from '../../../../invoice-management/invoice-management';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { AvengerMfilesViewModalComponent } from 'libs/shared/src/lib/public/avenger/modal/mfiles-view-modal.component';
import { DragonMfilesViewModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/mfiles-view-modal.component';

@Component({
    selector: 'dragon-person-list-show',
    template:  `
    <div style="width:100%;">
        <div class="table-head">
            <table class="table table-bordered table-hover text-center table-display" style='width:100%'>
                <thead>
                    <tr>
                        <!-- 全选按钮 -->
                        <!-- title -->
                        <th style='width:4%'>序号</th>
                        <th *ngFor="let head of currentTab.heads"
                            [ngStyle]="{'width':head.width}">
                            {{head.label}}
                        </th>
                        <!-- 行操作 -->
                    </tr>
                </thead>
            </table>
        </div>
        <div class="table-body">
            <table class="table table-bordered table-hover text-center table-display" style='width:100%'>
                <tbody>
                    <ng-container *ngIf="items.length>0;">
                        <tr *ngFor="let item of items;let i=index">
                        <td style='width:4%'>{{i+1}}</td>
                            <td *ngFor="let head of currentTab.heads"
                                [ngStyle]="{'width':head.width}"
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
                                    <ng-container *ngSwitchCase="'uploadFile'">
                                        <ng-container *ngIf="item[head.value] && item[head.value].length">
                                            <div class="view-file">
                                                <a href="javaScript:void(0)" (click)="viewUploadFiles(item[head.value])">
                                                {{(item[head.value] | xnJson).length>1 ? (item[head.value] | xnJson)[0].fileName + '，...' : (item[head.value] | xnJson)[0].fileName}}</a>
                                            </div>
                                        </ng-container>
                                    </ng-container>
                                    <ng-container *ngSwitchCase="'result'">
                                        <div *ngIf='item.flag===0 || item.isMatching===0'  style='color: red;'>未匹配</div>
                                        <div *ngIf='item.flag===1 || item.flag===2 || item.isMatching===1'>匹配成功</div>
                                        <div *ngIf='item.isMatching===2'>账号变更</div>
                                    </ng-container>
                                    <ng-container *ngSwitchCase="'invoice'">
                                        <ng-container *ngIf=" item[head.value]&& item[head.value]!==''">
                                            <div>{{item[head.value]}}</div>
                                        </ng-container>
                                    </ng-container>
                                    <ng-container *ngSwitchCase="'preTaxAmount'">
                                        <ng-container *ngIf=" item[head.value]&& item[head.value]!==''">
                                            <div>{{item[head.value]}}</div>
                                        </ng-container>
                                    </ng-container>
                                    <ng-container *ngSwitchCase="'date'">
                                        <ng-container *ngIf="item[head.value] && item[head.value]!==''">
                                        <div>
                                            {{item[head.value] | xnDate: 'date'}}
                                        </div>
                                        </ng-container>
                                    </ng-container>
                                    <!-- 应收账款金额 -->
                                    <ng-container *ngSwitchCase="'receive'">
                                        <ng-container *ngIf=" item[head.value] !==undefiend &&item[head.value] !==null && item[head.value]!==0">
                                            <div>{{item[head.value].toFixed(2) | xnMoney}}</div>
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
        .table-head table,.table-body table{
            margin-bottom: 0px
        }
        .table-body{
            width:100%;
            max-height:1770px;
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
        .ocrinfo {
            background-color: #cbecee;
            color:red;
        }
        .view-file {
            margin-top: 8px;
        }
        `
    ]
})
@DynamicForm({ type: 'person-list', formModule: 'avenger-show' })
export class AvengerPersonListShowComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() row: any;
    @Input() form: FormGroup;
    @Input() svrConfig: any;

    public items: any[] = [];
    public ctrl_file: AbstractControl;
    public ctrl: AbstractControl;
    currentTab: any; // 当前标签页
    subResize: any;
    fileUploadData: any;
    public allHeads = {
        sub_nuonuocs_blue: DragonInvoiceTabConfig.nuonuocs_blue,
        sub_nuonuocs_red: DragonInvoiceTabConfig.nuonuocs_red,
        sub_nuonuocs_blue_offline: DragonInvoiceTabConfig.nuonuocs_blue_offline,
    };
    constructor(private xn: XnService, private vcr: ViewContainerRef,
                private er: ElementRef,
                public hwModeService: HwModeService) {
    }
    ngOnInit() {
        this.currentTab = this.allHeads[this.row.flowId];
        if (!!this.row.data) {
            this.items = JSON.parse(this.row.data);
        }
        this.subResize = fromEvent(window, 'resize').subscribe(() => {
            this.formResize();
        });
    }
    // 查看文件
    viewFiles(params) {
        // 上传文件调用的是采购融资的接口，isAvenger为true
        params.isAvenger = true;
        XnModalUtils.openInViewContainer(this.xn, this.vcr, AvengerMfilesViewModalComponent, [params]).subscribe(v => {
            if (v.action === 'cancel') {
                return;
            } else {
            }
        });
    }

    // 查看文件
    viewUploadFiles(files: any) {
        // 上传文件调用的是采购融资的接口，isAvenger为true
        files.forEach((file: any) => {
            file.isAvenger = true;
        });
        XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonMfilesViewModalComponent, files).subscribe(() => {
        });
    }

    ngAfterViewInit(){
        this.formResize();
    }
    ngOnDestroy() {
        // 在组件生命周期销毁里取消事件，防止出现页面多次执行之后卡顿
        if (this.subResize){
            this.subResize.unsubscribe();
        }
    }
    formResize(){
        const scrollBarWidth = $('.table-body', this.er.nativeElement).outerWidth(true) - $('.table-body>table').outerWidth(true);
        $('.table-head', this.er.nativeElement).css({'padding-right': scrollBarWidth ? scrollBarWidth + 'px' : '0px'});
    }
}
