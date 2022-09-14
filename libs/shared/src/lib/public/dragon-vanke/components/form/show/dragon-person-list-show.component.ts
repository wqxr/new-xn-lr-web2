import { Component, OnInit, OnDestroy, AfterViewInit, Input, ElementRef, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { DragonMfilesViewModalComponent } from '../../../modal/mfiles-view-modal.component';
import { DragonOcrMfileDetailModalComponent } from '../../../modal/dragon-ocr-mfile-detail.modal';
import { DragonQrsDetailModalComponent } from '../../../modal/dragon-qrs-detail.modal';
import {Observable, fromEvent} from 'rxjs';
import { CheckersOutputModel } from '../../../../../config/checkers';
import { DynamicForm } from '../../../../../common/dynamic-form/dynamic.decorators';
import DragonInvoiceTabConfig from '../../../../../../../../products/dragon/src/lib/common/invoice-management';
import IntermediaryUserManagementTabConfig from '../../../../../../../../products/dragon/src/lib/common/intermediary-user-management';
import { HwModeService } from '../../../../../services/hw-mode.service';
import { XnService } from '../../../../../services/xn.service';
import DragonpaymentTabConfig from '../../../../../../../../products/dragon/src/lib/common/upload-payment-confirmation';
import { XnModalUtils } from '../../../../../common/xn-modal-utils';
import { SelectOptions } from '../../../../../config/select-options';
import DragonpaymentDownloadTabConfig from 'libs/products/vanke/src/lib/common/download-payment-confirmation';
@Component({
    selector: 'dragon-person-list-show',
    template:  `
    <div style="width:100%;">
        <div class="table-head">
            <table class="table">
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
                        <th style='width:4%' *ngIf="row.flowId === 'sub_system_match_qrs'">操作</th>
                    </tr>
                </thead>
            </table>
        </div>
        <div class="table-body">
            <table class="table">
                <tbody>
                    <ng-container *ngIf="items.length>0;">
                        <tr *ngFor="let item of items;let i=index">
                        <td style='width:4%' data-toggle="tooltip" [title]="item.manualModify?'人工修改信息':''" [class]="item.manualModify?'ocrinfo':''">{{i+1}}</td>
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
                                    <ng-container *ngSwitchCase="'qrsfile'">
                                        <ng-container *ngIf=" item[head.value] && item[head.value]!==''">
                                            <a href="javaScript:void(0)" (click)="viewQrsFiles(item, i)">
                                            {{(item.payConfimFile | xnJson).length>1 ? (item.payConfimFile | xnJson)[0].fileName + '，...' : (item.payConfimFile | xnJson)[0].fileName}}
                                            </a>
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
                                    <ng-container *ngSwitchCase="'date'">
                                        <ng-container *ngIf="item[head.value] && item[head.value]!==''">
                                        <div>
                                            {{item[head.value] | xnDate: 'date'}}
                                        </div>
                                        </ng-container>
                                    </ng-container>
                                    <ng-container *ngSwitchCase="'verifyPayConfimStatus'">
                                        <div [innerHTML]="item[head.value] | xnSelectTransform:'verifyPayConfimStatus'" [ngStyle]='{"color": item.verifyPayConfimStatus==="2" ? "red":""}'></div>
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
                                        <ng-container *ngIf=" item[head.value] !==undefiend &&item[head.value] !==null && item[head.value]!==0">
                                            <div>{{item[head.value].toFixed(2) | xnMoney}}</div>
                                        </ng-container>
                                    </ng-container>
                                    <ng-container *ngSwitchDefault>
                                        <div [innerHTML]="item[head.value] | xnGatherType: {head:head,row:item}"></div>
                                    </ng-container>
                                </ng-container>
                            </td>
                            <td style='width:4%' *ngIf="row.flowId === 'sub_system_match_qrs'">
                                <a class="xn-click-a"
                                    (click)='viewOcrInfo(item)'>查看ocr信息</a>
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
        `
    ]
})
@DynamicForm({ type: ['person-list', 'qrs-verify-list'], formModule: 'dragon-show' })
export class DragonPersonListShowComponent implements OnInit, AfterViewInit, OnDestroy {
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
        // 中机构
        sub_agency_user_delete: IntermediaryUserManagementTabConfig.intermediaryDeleteList,
        sub_vanke_system_hand_verify: DragonpaymentDownloadTabConfig.manualVerify,
    };
    constructor(private xn: XnService, private vcr: ViewContainerRef,
                private cdr: ChangeDetectorRef, private er: ElementRef,
                public hwModeService: HwModeService) {
    }
    ngOnInit() {
        if (this.row.flowId === 'sub_system_match_qrs'){
            const fileUploadCheckers = this.svrConfig.actions.find((action) => {
                return action.procedureId === '@begin';
            }).checkers;
            this.fileUploadData = fileUploadCheckers.find((hd) => {
                return hd.checkerId === 'fileUpload';
            }).data;
            this.currentTab = DragonpaymentTabConfig.systemMatch[QrsTypeEnum[this.fileUploadData]];
        }else if (this.row.flowId === 'sub_person_match_qrs'){
            const headquarters = this.svrConfig.actions[0].checkers.find(h => h.checkerId === 'headquarters');
            this.currentTab = DragonpaymentTabConfig.personMatch[headquarters.data];
        }else{
            this.currentTab = this.allHeads[this.row.flowId];
        }
        if (!!this.row.data) {
            this.items = JSON.parse(this.row.data);
        }
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
    // 查看ocr信息
    viewOcrInfo(item){
        const checkers = this.deepCopy(DragonpaymentTabConfig.ocrConfig[QrsTypeEnum[this.fileUploadData]].checkers, []);
        checkers.map((el) => {
            el.value = item[el.checkerId] || '';
            el.options = { readonly: true };
        });
        item.files.map((file) => {file.isAvenger = true; });
        const params = {
            checkers,
            value: item,
            title: '查看ocr信息',
            isShow: true,
            isAvenger: true,
            qrsName: QrsFileTypeEnum[this.fileUploadData]
        };
        XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonOcrMfileDetailModalComponent, params).subscribe((v) => {
        });
    }

    /**
     * 下载付确查看文件
     */
    viewQrsFiles(items: any, index){
        const itemsCopy = this.deepCopy(items, {});
        const checkers = this.deepCopy(DragonpaymentDownloadTabConfig.qrsConfig.checkers, []);
        checkers.forEach((el) => {
            el.value = itemsCopy[el.checkerId] || '';
        });
        // itemsCopy.files.map((file)=>{file.isAvenger = true;});
        const payConfimFiles = typeof itemsCopy.payConfimFile === 'string' ? JSON.parse(itemsCopy.payConfimFile) : itemsCopy.payConfimFile;
        payConfimFiles.forEach((file) => file.isAvenger = false);
        itemsCopy.payConfimFile = payConfimFiles;
        const params = {
            checkers,
            value: itemsCopy,
            copies: Number(index + 1),  // 第几行
            title: '查看付款确认书',
            isShow: true,
            isAvenger: false,
            qrsType: '付款确认书'
        };
        XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonQrsDetailModalComponent, params).subscribe((v) => {
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

    /**
     * 特殊字段处理
     * @parmas str
     */
    private strFormat(str: string): string{
        return str.match(/\d+\.*\d*/g)[1] || '';
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
export enum QrsFileTypeEnum {
    /** 万科 */
    '《付款确认书》' = 3,
    /** 雅居乐 */
    // '《付款确认书(总部致保理商)》' = 4,
    /** 龙光 */
    '《付款确认书(总部致保理商)》' = 1,
    '《付款确认书(总部致劵商)》' = 2,
}
