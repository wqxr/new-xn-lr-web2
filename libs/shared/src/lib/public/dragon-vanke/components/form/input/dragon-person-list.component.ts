import { Component, OnInit, OnDestroy, AfterViewInit, Input, ElementRef, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { DragonMfilesViewModalComponent } from '../../../modal/mfiles-view-modal.component';
import {Observable, fromEvent} from 'rxjs';
import { DragonOcrMfileDetailModalComponent } from '../../../modal/dragon-ocr-mfile-detail.modal';
import { DynamicForm } from '../../../../../common/dynamic-form/dynamic.decorators';
import { XnInputOptions } from '../../../../form/xn-input.options';
import { XnService } from '../../../../../services/xn.service';
import { HwModeService } from '../../../../../services/hw-mode.service';
import DragonInvoiceTabConfig from '../../../../../../../../products/dragon/src/lib/common/invoice-management';
import DragonpaymentTabConfig from '../../../../../../../../products/dragon/src/lib/common/upload-payment-confirmation';
import IntermediaryUserManagementTabConfig from '../../../../../../../../products/dragon/src/lib/common/intermediary-user-management';
import { DragonTableSortService } from '../../../../../services/table-sort.service';
import { XnFormUtils } from '../../../../../common/xn-form-utils';
import { XnModalUtils } from '../../../../../common/xn-modal-utils';
import { XnUtils } from '../../../../../common/xn-utils';
import { SelectOptions } from '../../../../../config/select-options';

@Component({
    selector: 'dragon-person-list-input',
    template:  `
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
                        <th style='width:4%' *ngIf="row.flowId !== 'sub_nuonuocs_blue'&&row.flowId !== 'sub_nuonuocs_red'&&row.flowId !== 'sub_agency_user_delete'">操作</th>
                    </tr>
                </thead>
            </table>
        </div>
        <div class="table-body">
            <table class="table">
                <tbody>
                    <ng-container *ngIf="items.length>0;">
                        <tr *ngFor="let item of items;let i=index">
                            <td style='width:3%' data-toggle="tooltip" [title]="item.manualModify?'人工修改信息':''" [class]="item.manualModify?'ocrinfo':''">
                                {{item.manualModify?(i+1+'人工'):(i+1)}}</td>
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
                                    <ng-container *ngSwitchCase="'result'">
                                        <div *ngIf='item.flag===0 || item.isMatching===0'  style='color: red;'>未匹配</div>
                                        <div *ngIf='item.flag===1 || item.flag===2 || item.isMatching===1'>匹配成功</div>
                                        <div *ngIf='item.isMatching===2' style='color: red;'>账号变更</div>
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
                                    <ng-container *ngSwitchCase="'userStatus'">
                                        <div [innerHTML]="item[head.value] | xnSelectTransform:'agencyStatus'"></div>
                                    </ng-container>
                                    <ng-container *ngSwitchCase="'agencyRoles'">
                                        <div [innerHTML]="getUserRoleList(item[head.value]) | xnArrayListToString"></div>
                                    </ng-container>
                                    <!-- 应收账款金额 -->
                                    <ng-container *ngSwitchCase="'receive'">
                                        <ng-container *ngIf="!!item[head.value]">
                                            <div>{{item[head.value].toFixed(2) | xnMoney}}</div>
                                        </ng-container>
                                    </ng-container>
                                    <ng-container *ngSwitchDefault>
                                        <div [innerHTML]="item[head.value] | xnGatherType: {head:head,row:item}"></div>
                                    </ng-container>
                                </ng-container>
                            </td>
                            <td style='width:4%' *ngIf="row.flowId !== 'sub_nuonuocs_blue'&&row.flowId !== 'sub_nuonuocs_red'&&row.flowId !== 'sub_agency_user_delete'">
                                <a class="xn-click-a" *ngIf="row.flowId === 'sub_system_match_qrs'"
                                    (click)='viewOcrInfo(item,i)'>查看ocr信息</a>
                                <br *ngIf="row.flowId === 'sub_system_match_qrs'" />
                                <br *ngIf="row.flowId === 'sub_system_match_qrs'" />
                                <a class="xn-click-a" (click)='delFile(i)'>删除</a>
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
        `
    ]
})
@DynamicForm({ type: 'person-list', formModule: 'dragon-input' })  // invoice-apply
export class DragonPersonListComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() row: any;
    @Input() form: FormGroup;
    @Input() svrConfig: any;
    @Input() allFiles?: any;
    public ctrl: AbstractControl;
    public ctrl_file: AbstractControl;
    public ctrl_upCount: AbstractControl;
    public ctrl_successCount: AbstractControl;
    public ctrl_failCount: AbstractControl;

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
        // 中机构用户管理
        sub_agency_user_delete: IntermediaryUserManagementTabConfig.intermediaryDeleteList
    };

    private sorting = ''; // 共享该变量 列排序
    private naming = ''; // 共享该变量 列css样式
    constructor(private xn: XnService, private vcr: ViewContainerRef,
                private cdr: ChangeDetectorRef, private er: ElementRef,
                private tableSortService: DragonTableSortService,
                public hwModeService: HwModeService) {
    }
    ngOnInit() {
        let headquarters;
        this.ctrl = this.form.get(this.row.name);
        if (this.row.flowId === 'sub_system_match_qrs'){
            this.currentTab = DragonpaymentTabConfig.systemMatch[this.selectFileType];
            this.ctrl_file = this.form.get('fileUpload');
            this.ctrl_upCount = this.form.get('upCount');
            this.ctrl_successCount = this.form.get('successCount');
            this.ctrl_failCount = this.form.get('failCount');
            // this.items = this.allFiles[QrsTypeEnum[this.ctrl_file.value]];
            this.ctrl_file.valueChanges.subscribe((f) => {
                this.selectFileType = f ? QrsTypeEnum[f] : 'default';
                this.currentTab = DragonpaymentTabConfig.systemMatch[this.selectFileType];
                this.items = this.ctrl_file.value ? this.allFiles[QrsTypeEnum[this.ctrl_file.value]] : [];
                setTimeout(() => {this.formResize(); }, 0);
                this.cdr.markForCheck();
            });
        }else if (this.row.flowId === 'sub_person_match_qrs'){
            headquarters = this.svrConfig.checkers.find(h => h.checkerId === 'headquarters');

            this.currentTab = DragonpaymentTabConfig.personMatch[headquarters.value];
        }else{
            this.currentTab = this.allHeads[this.row.flowId];
            this.items = this.row.value ? JSON.parse(this.row.value) : this.items;
        }
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
        XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonMfilesViewModalComponent, [params]).subscribe(v => {
            if (v.action === 'cancel') {
                return;
            } else {
            }
        });
    }
    // 删除文件
    delFile(index: number) {
        this.items.splice(index, 1);
        if (this.row.flowId === 'sub_system_match_qrs'){
            this.allFiles[QrsMatchEnum[this.ctrl_file.value]].upCount = this.items.length;
            this.allFiles[QrsMatchEnum[this.ctrl_file.value]].successCount = this.items.filter((item) => item.isMatching === 1 || item.isMatching === 2).length;
            this.allFiles[QrsMatchEnum[this.ctrl_file.value]].failCount = this.items.filter((item) => item.isMatching === 0).length;
            this.ctrl_upCount.setValue(JSON.stringify(this.allFiles[QrsMatchEnum[this.ctrl_file.value]].upCount));
            this.ctrl_successCount.setValue(JSON.stringify(this.allFiles[QrsMatchEnum[this.ctrl_file.value]].successCount));
            this.ctrl_failCount.setValue(JSON.stringify(this.allFiles[QrsMatchEnum[this.ctrl_file.value]].failCount));
        }
        this.toValue();
    }
    // 查看ocr信息
    viewOcrInfo(item, index){
        const checkers = this.deepCopy(DragonpaymentTabConfig.ocrConfig[QrsTypeEnum[this.ctrl_file.value]].checkers, []);
        checkers.map((el) => {el.value = item[el.checkerId] || ''; });
        item.files.map((file) => {file.isAvenger = true; });
        const params = {
            checkers,
            value: item,
            title: '查看ocr信息',
            isShow: false,
            isAvenger: true,
            qrsType: this.ctrl_file.value
        };
        XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonOcrMfileDetailModalComponent, params).subscribe((v: any) => {
            if (v.action === 'ok') {
                this.items[index] = v.updateObj;
                if (JSON.stringify(v.updateObj.newInfo) == '{}'){ // 原始ocr信息
                    this.items[index].newInfo = this.deepCopy(item, {});
                }else{
                    this.items[index].newInfo = v.updateObj.newInfo;
                }
                this.items[index].manualModify = true;
                // console.log(this.items);
                this.toValue();
            }else if (v.action === 'cancel'){
            }
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
    private fromValue() {
        this.items = XnUtils.parseObject(this.ctrl.value, []);
        this.toValue();
    }

    /**
     * 机构类型处理
     */
    getUserRoleList(typeList: string[]){
        let arr = [];
        if (typeList && typeList.length > 0){
            arr = typeList.map(element => SelectOptions.getConfLabel('agencyRoles', element));
        }
        return arr;
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
        this.tableSortService.tableSort(this.items, params.order);
        this.toValue();
    }
}
/***
 *  付确类型
 */
export enum QrsTypeEnum {
    /** 万科 */
    vanke = 3,
    /** 雅居乐 */
    yjl1 = 4,
    yjl2 = 5,
    /** 龙光 */
    dragon1 = 1,
    dragon2 = 2,
    /**默认 */
    default = 100
}
export enum QrsMatchEnum {
    /** 万科 */
    vk = 3,
    /** 雅居乐 */
    yj1 = 4,
    yj2 = 5,
    /** 龙光 */
    dg1 = 1,
    dg2 = 2
}
export enum QrsFileTypeEnum {
    /** 万科 */
    '《付款确认书》' = 3,
    /** 雅居乐 */
    // '《付款确认书(总部致保理商)》' = 4,
    /** 龙光 */
    '《付款确认书(总部致保理商)》' = 1,
    '《付款确认书(总部致劵商)》' = 2,
}
