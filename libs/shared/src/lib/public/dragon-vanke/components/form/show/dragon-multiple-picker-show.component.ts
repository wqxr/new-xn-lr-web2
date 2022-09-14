import { Component, ElementRef, Input, OnInit, OnDestroy, AfterViewInit, ViewContainerRef } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import {Observable, of, fromEvent} from 'rxjs';
import { PdfSignModalComponent } from '../../../../../public/modal/pdf-sign-modal.component';
import { OnceContractMultipeSelectModalComponent } from '../../../modal/once-contract-template-multipe-modal.component';
import { DragonPdfSignModalComponent } from '../../../modal/pdf-sign-modal.component';
import { DynamicForm } from '../../../../../common/dynamic-form/dynamic.decorators';
import { XnService } from '../../../../../services/xn.service';
import { LocalStorageService } from '../../../../../services/local-storage.service';
import { SelectOptions } from '../../../../../config/select-options';
import { XnModalUtils } from '../../../../../common/xn-modal-utils';
import { JsonTransForm } from '../../../../pipe/xn-json.pipe';

declare let $: any;

@Component({
    selector: 'app-xn-dragon-multiple-picker-show',
    template: `
    <div class="input-group">
        <ng-container *ngIf="row.checkerId!=='contractTemplate'">
            <select class="form-control xn-input-font"  [(ngModel)]="selectValue" [disabled]="true">
                <option value="">请选择</option>
                <option *ngFor="let option of row.selectOptions" value="{{option.value}}">{{option.label}}</option>
            </select>
        </ng-container>
        <span class="input-group-btn">
            <button type="button" class="btn btn-default btn-flat xn-input-font" [disabled]="true">选择</button>
        </span>
        </div>
        <div style="width: 100%;margin-top: 15px;" *ngIf="selectValue!='通用'">
        <div class="table-head">
            <table class="table">
            <thead>
                <tr>
                    <th style='width:6%'>序号</th>
                    <th *ngFor="let head of config[row.checkerId].heads" [ngStyle]="{'width':head.width}">{{head.label}}</th>
                </tr>
            </thead>
            </table>
        </div>
        <div class="table-body" *ngIf="items.length>0">
            <table class="table">
            <tbody>
                <ng-container>
                <tr *ngFor="let item of items;let i=index">
                    <td style='width:6%'>{{(i+1)}}</td>
                    <td *ngFor="let head of config[row.checkerId].heads" [ngStyle]="{'width':head.width}"
                        style="max-width: 70px;word-wrap:break-word">
                        <ng-container [ngSwitch]="row.checkerId">
                            <!--contract-->
                            <ng-container *ngSwitchCase="'contractTemplate'">
                                <ng-container *ngIf=" item && item!==''">
                                    <a href="javaScript:void(0)" (click)="showContract(item)">{{item.label}}</a>
                                </ng-container>
                            </ng-container>
                            <ng-container *ngSwitchDefault>
                                <div [innerHTML]="item"></div>
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
    styles: [`
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
    `]
})
@DynamicForm({ type: 'multiple-picker', formModule: 'dragon-show' })
export class DragonMultiplePickerShowComponent implements OnInit, AfterViewInit, OnDestroy {

    @Input() row: any;
    @Input() form: FormGroup;
    @Input() svrConfig?: any;
    selectValue = '';

    items: any[] = [];   // 已选项目/收款单位/合同模板
    subResize: any;
    // 根据checker项的checkerId配置
    config = {
        fitProject: {
            label: '适用项目',
            heads: [{ label: '适用项目', value: 'projectName', width: '94%', type: 'text' }],
            key: 'id',  // 去重唯一标识
            view: false  // 是否可点击查看
        },
        fitDebtUnit: {
            label: '适用收款单位',
            heads: [{ label: '适用收款单位', value: 'orgName', width: '94%', type: 'text' }],
            key: 'appId',
            view: false
        },
        contractTemplate: {
            label: '合同模板',
            heads: [{ label: '合同模板', value: 'templateFile', width: '94%', type: 'contract' }],
            key: 'id',
            view: true
        }
    };

    constructor(private xn: XnService, private er: ElementRef,
                private vcr: ViewContainerRef, private localStorageService: LocalStorageService) {
    }

    ngOnInit() {
       this.row.selectOptions = SelectOptions.get('applyOptions');
       if (!!this.row.data
          && JSON.parse(this.row.data)
          && this.judgeDataType(JSON.parse(this.row.data))
          && JSON.parse(this.row.data)[0] === '通用') {
            this.selectValue = '通用';
        } else if (!!this.row.data) {
            this.selectValue = '非通用';
            this.items = JSON.parse(this.row.data);
        }
       this.subResize = fromEvent(window, 'resize').subscribe((event) => {
            this.formResize();
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
        $('.table-head', this.er.nativeElement).css({'padding-right': scrollBarWidth ? scrollBarWidth + 'px' : '0px'});
    }

    // 当为合同模板时，可查看合同
    viewDetail(file) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, PdfSignModalComponent, {
            id: file.id,
            secret: file.secret,
            label: file.label,
            readonly: true
        }).subscribe(() => {
        });
    }
    /**
     *  格式化数据
     * @param data
     */
    public jsonTransForm(data) {
        return JsonTransForm(data);
    }

    /**
     *  查看合同，只读
     * @param con
     */
    public showContract(con) {
        const params = Object.assign({}, con, { readonly: true });
        XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonPdfSignModalComponent, params).subscribe(() => {
        });
    }

    /**
     *  判断数据类型
     * @param value
     */
    public judgeDataType(value: any): boolean {
        if (typeof Array.isArray === 'function') {
            return Array.isArray(value);
        } else {
            return Object.prototype.toString.call(value) === '[object Array]';
        }
    }
}
