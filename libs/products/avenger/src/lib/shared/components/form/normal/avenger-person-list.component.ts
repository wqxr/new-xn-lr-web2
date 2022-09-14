import { Component, OnInit, OnDestroy, AfterViewInit, Input, ElementRef, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import DragonInvoiceTabConfig from '../../../../invoice-management/invoice-management';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { AvengerMfilesViewModalComponent } from 'libs/shared/src/lib/public/avenger/modal/mfiles-view-modal.component';
import { DragonMfilesViewModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/mfiles-view-modal.component';
import {Observable, of, fromEvent} from 'rxjs';
import { EditModalComponent } from '../../modal/edit-modal.component';

@Component({
    selector: 'dragon-person-list-input',
    template:  `
    <div style="width:100%;">
        <div class="table-head">
            <table class="table table-bordered table-hover text-center table-display" style='width:100%'>
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
                    </tr>
                </thead>
            </table>
        </div>
        <div class="table-body">
            <table class="table table-bordered table-hover text-center table-display" style='width:100%'>
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
                                    <ng-container *ngSwitchCase="'file'">
                                        <ng-container *ngIf=" item[head.value]&& item[head.value]!==''">
                                            <div *ngFor="let sub of item[head.value] | xnJson">
                                                <a href="javaScript:void(0)" (click)="viewFiles(sub)">{{sub.fileName}}</a>
                                            </div>
                                        </ng-container>
                                    </ng-container>
                                    <ng-container *ngSwitchCase="'uploadFile'">
                                        <button type="button" style="padding: 3px;" (click)="uploadInvoice(item, i)" class="btn btn-default">上传文件</button>
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
        .view-file {
            margin-top: 8px;
        }
        `
    ]
})
@DynamicForm({ type: 'person-list', formModule: 'avenger-input' })  // invoice-apply
export class AvengerPersonListComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() row: any;
    @Input() form: FormGroup;
    @Input() svrConfig: any;
    @Input() allFiles?: any;
    public ctrl: AbstractControl;
    public ctrl_file: AbstractControl;

    public selectFileType: any = 'default';
    public items: any[] = [];
    public Tabconfig: any;
    selectValue = '';
    currentTab: any; // 当前标签页
    alert = '';
    public xnOptions: XnInputOptions;
    public flag = ''; // 判断合同账户信息与供应商收款账户信息是否一致
    public myClass = '';
    subResize: any;
    public allHeads = {
        sub_nuonuocs_blue: DragonInvoiceTabConfig.nuonuocs_blue,
        sub_nuonuocs_red: DragonInvoiceTabConfig.nuonuocs_red,
        sub_nuonuocs_blue_offline: DragonInvoiceTabConfig.nuonuocs_blue_offline,
    };

    private sorting = ''; // 共享该变量 列排序
    private naming = ''; // 共享该变量 列css样式
    constructor(private xn: XnService, private vcr: ViewContainerRef,
                private cdr: ChangeDetectorRef, private er: ElementRef,
                public hwModeService: HwModeService) {
    }
    ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        this.currentTab = this.allHeads[this.row.flowId];
        // this.items = this.row.value ? JSON.parse(this.row.value) : this.items;
        this.items = XnUtils.parseObject(this.row.value, []);
        this.ctrl.statusChanges.subscribe(() => {
            this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
        });
        this.ctrl.valueChanges.subscribe((x) => {
            this.items = x ? JSON.parse(x) : [];
            this.cdr.markForCheck();
            setTimeout(() => {this.formResize(); }, 0);
        });
        this.fromValue();
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
        this.subResize = fromEvent(window, 'resize').subscribe((event) => {
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
        XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonMfilesViewModalComponent, files).subscribe(v => {
        });
    }

    // 线下开票
    uploadInvoice(item: any, index: number) {
        const params = {
            checker: [{
                title: '上传开票文件',
                checkerId: 'invoiceFile',
                type: 'mfile',
                required: false,
                options: {fileext: 'jpg, jpeg, png, pdf'},
                value: item.invoiceFile ? this.deepCopy(item.invoiceFile, []) : [],
                memo: '请上传图片、PDF'
            }],
            title: '开票文件',
        };
        XnModalUtils.openInViewContainer(this.xn, this.vcr, EditModalComponent, params).subscribe(v => {
            if (!!v) {
                this.items[index].invoiceFile = v.invoiceFile ? XnUtils.parseObject(v.invoiceFile, []) : [];
                this.toValue();
            }
        });
    }

    // 删除文件
    delFile(index: number) {
        this.items.splice(index, 1);
        this.toValue();
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
    private fromValue() {
        this.items = XnUtils.parseObject(this.ctrl.value, []);
        this.toValue();
    }

    // 上传完后取回值
    private toValue() {
        if (this.items.length === 0) {
            this.ctrl.setValue('');
        }
        else {
            this.items.forEach(() => {
                this.ctrl.setValue(JSON.stringify(this.items));
            });
        }
        this.ctrl.markAsTouched();
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }
    /**
     * 特殊字段处理
     * @parmas str
     */
    private strFormat(str: string): string{
        return str.match(/\d+\.*\d*/g) ? str.match(/\d+\.*\d*/g)[1] : '';
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
        const params = {} as any;
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
        this.toValue();
    }
}
