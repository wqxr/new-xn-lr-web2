import { Component, OnInit, OnDestroy, AfterViewInit, Input, ElementRef, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { DragonMfilesViewModalComponent } from '../../../modal/mfiles-view-modal.component';
import { JsonTransForm } from '../../../../../public/pipe/xn-json.pipe';
import { Observable, of, fromEvent } from 'rxjs';
import DragonpaymentDownloadTabConfig from '../../../../../../../../products/dragon/src/lib/common/download-payment-confirmation';
import { DynamicForm } from '../../../../../common/dynamic-form/dynamic.decorators';
import { XnService } from '../../../../../services/xn.service';
import { DragonTableSortService } from '../../../../../services/table-sort.service';
import { HwModeService } from '../../../../../services/hw-mode.service';
import { XnFormUtils } from '../../../../../common/xn-form-utils';
import { XnInputOptions } from '../../../../form/xn-input.options';
import { XnUtils } from '../../../../../common/xn-utils';
import { XnModalUtils } from '../../../../../common/xn-modal-utils';
import { DragonQrsDetailModalComponent } from '../../../modal/dragon-qrs-detail.modal';

@Component({
    selector: 'dragon-qrs-manual-verify-list',
    template: `
    <div style="width:100%;">
        <div class="table-head">
            <table class="table">
                <thead>
                    <tr>
                        <!-- 全选按钮 -->
                        <!-- title -->
                        <th style='width:3%'>序号</th>
                        <th *ngFor="let head of currentTab.heads"
                            [ngStyle]="{'width':head.width}">
                            <ng-container *ngIf="head._inList?.sort;else normal">
                                <span [ngClass]="onSortClass(head?.value)" (click)="onSort(head?.value)">{{head.label}}</span>
                            </ng-container>
                            <ng-template #normal>{{head.label}}</ng-template>
                        </th>
                        <!-- 行操作 -->
                        <th style='width:10%'>操作</th>
                    </tr>
                </thead>
            </table>
        </div>
        <div class="table-body">
            <table class="table">
                <tbody>
                    <ng-container *ngIf="items.length>0;">
                        <tr *ngFor="let item of items;let i=index">
                            <td style='width:3%'>{{i+1}}</td>
                            <td *ngFor="let head of currentTab.heads"
                                [ngStyle]="{'width':head.width}"
                                style="max-width: 70px;word-wrap:break-word">
                                <ng-container [ngSwitch]="head.type">
                                    <ng-container *ngSwitchCase="'mainFlowId'">
                                        <a href="javaScript:void(0)"
                                            (click)="hwModeService.DragonviewProcess(item[head.value])">{{item[head.value]}}
                                        </a>
                                    </ng-container>
                                    <ng-container *ngSwitchCase="'qrsfile'">
                                        <ng-container *ngIf=" item[head.value] && item[head.value]!==''">
                                            <a href="javaScript:void(0)" (click)="viewFiles(item, i)">
                                            {{(item.payConfimFile | xnJson).length>1 ? (item.payConfimFile | xnJson)[0].fileName + '，...' : (item.payConfimFile | xnJson)[0].fileName}}
                                            </a>
                                        </ng-container>
                                    </ng-container>
                                    <ng-container *ngSwitchCase="'verifyPayConfimStatus'">
                                        <div [innerHTML]="item[head.value] | xnSelectTransform:'verifyPayConfimStatus'" [ngStyle]='{"color": item.verifyPayConfimStatus===2 ? "red":""}'></div>
                                    </ng-container>
                                    <ng-container *ngSwitchCase="'invoice'">
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
                                    <ng-container *ngSwitchCase="'vankeAddIntermediary'">
                                        <div [innerHTML]="item[head.value] | xnSelectTransform:'vankeAddIntermediary'"></div>
                                    </ng-container>
                                    <ng-container *ngSwitchCase="'intermediarySatus'">
                                        <div [innerHTML]="item[head.value] | xnSelectTransform:'intermediarySatus'"></div>
                                    </ng-container>
                                    <!-- 应收账款金额 -->
                                    <ng-container *ngSwitchCase="'receive'">
                                        <ng-container *ngIf=" item[head.value] !==undefiend &&item[head.value] !==null && item[head.value]!==0">
                                            <div>{{item[head.value] | xnMoney}}</div>
                                        </ng-container>
                                    </ng-container>
                                    <ng-container *ngSwitchDefault>
                                        <div [innerHTML]="item[head.value] | xnGatherType: {head:head,row:item}"></div>
                                    </ng-container>
                                </ng-container>
                            </td>
                            <td style='width:10%'>
                                <a class="xn-click-a" (click)='verifyClick(item,i)'>{{item['verifyPayConfimStatus']===3 ? '取消确认':'人工确认一致'}}</a>
                            </td>
                        </tr>
                    </ng-container>
                </tbody>
            </table>
        </div>
    </div>
    <span>共{{items.length}}笔业务</span>
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

        .table-head .sorting, .table-head .sorting_asc, .table-head .sorting_desc {
            /*position: relative;*/
            cursor: pointer
        }
        .table-head .sorting:after, .table-head .sorting_asc:after, .table-head .sorting_desc:after {
            font-family: 'Glyphicons Halflings';
            opacity: 0.5;
        }
        .table-head .sorting:after {
            content: "\\e150";
            opacity: 0.2
        }
        .table-head .sorting_asc:after {
            content: "\\e155"
        }
        .table-head .sorting_desc:after {
            content: "\\e156"
        }
        `
    ]
})
@DynamicForm({ type: 'qrs-verify-list', formModule: 'dragon-input' })
export class DragonQrsVerifyListComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() row: any;
    @Input() form: FormGroup;
    @Input() svrConfig: any;
    public ctrl: AbstractControl;

    public items: any[] = [];
    public Tabconfig: any;
    selectValue = '';
    currentTab: any; // 当前标签页
    alert = '';
    public xnOptions: XnInputOptions;
    public myClass = '';

    subResize: any;
    public allHeads = {
        sub_vanke_system_hand_verify: DragonpaymentDownloadTabConfig.manualVerify,
    };

    private sorting = ''; // 共享该变量 列排序
    private naming = ''; // 共享该变量 列css样式
    constructor(private xn: XnService, private vcr: ViewContainerRef,
                private cdr: ChangeDetectorRef, private er: ElementRef,
                private tableSortService: DragonTableSortService,
                public hwModeService: HwModeService) {
    }

    ngOnInit() {
        this.ctrl = this.form.get(this.row.name);

        this.currentTab = this.allHeads[this.row.flowId];
        this.items = this.row.value ? JSON.parse(this.row.value) : this.items;

        this.ctrl.statusChanges.subscribe(() => {
            this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
        });
        this.ctrl.valueChanges.subscribe((x) => {
            this.items = x ? JSON.parse(x) : [];
            this.cdr.markForCheck();
            setTimeout(() => { this.formResize(); }, 0);
        });
        this.fromValue();
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
        this.subResize = fromEvent(window, 'resize').subscribe((event) => {
            this.formResize();
        });
    }

    /**
     * 人工确认是否一致
     */
    verifyClick(item: {verifyPayConfimStatus: number}, index: number) {
        if (item.verifyPayConfimStatus === 3) {
            // 取消确认
            this.items[index].verifyPayConfimStatus = 2;
        } else if (item.verifyPayConfimStatus === 2) {
            // 人工确认一致
            this.items[index].verifyPayConfimStatus = 3;
        }
        this.toValue();
    }

    // 查看文件
    viewFiles(items, index) {
        const itemsCopy = this.deepCopy(items, {});
        const checkers = this.deepCopy(DragonpaymentDownloadTabConfig.qrsConfig.checkers, []);
        checkers.forEach((el) => {
            if (el.checkerId === 'factoringEndDate') {
                el.value = itemsCopy[el.checkerId] || '';
            } else {
                el.value = itemsCopy[el.checkerId] || '';
            }
        });
        const payConfimFiles = JSON.parse(itemsCopy.payConfimFile);
        payConfimFiles.forEach((file) => file.isAvenger = false);
        itemsCopy.payConfimFile = payConfimFiles;
        const params = {
            checkers,
            value: itemsCopy,
            copies: Number(index + 1),  // 第几行
            title: '查看付款确认书',
            isShow: false,
            isAvenger: false,
            qrsType: '付款确认书'
        };
        XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonQrsDetailModalComponent, params).subscribe((v) => {
            if (v.action === 'ok') {
                this.items[index].verifyPayConfimStatus = v.verifyPayConfimStatus;
                this.toValue();
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

    private deepCopy(obj, c) {
        c = c || {};
        for (const i in obj) {
            if (typeof obj[i] === 'object') {
                c[i] = obj[i].constructor === Array ? [] : {};
                this.deepCopy(obj[i], c[i]);
            } else {
                c[i] = obj[i];
            }
        }
        return c;
    }

    /**
     *  列表头样式
     * @param paramsKey
     */
    public onSortClass(paramsKey: string): string {
        if (paramsKey === this.sorting) {
            return 'sorting_' + this.naming;
        } else {
            return 'sorting';
        }
    }
    /**
     *  按当前列排序
     * @param sort
     */
    public onSort(sort: string) {
        const params = {
          order: 'asc'
        };
        if (this.sorting === sort) {
            this.naming = this.naming === 'desc' ? 'asc' : 'desc';
        } else {
            this.sorting = sort;
            this.naming = 'asc';
        }
        // 排序处理
        if (this.sorting && this.naming) {
            params.order = this.sorting + ',' + this.naming;
        }
        this.tableSortService.tableSort(this.items, params.order);
        this.toValue();
    }
}

export enum qrsStatus {
    '一致' = 1,
    '不一致' = 2,
    '人工确认一致' = 3,
}
