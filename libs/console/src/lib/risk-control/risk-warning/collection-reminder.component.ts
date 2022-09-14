import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CollectionReminderModel} from '../model/risk-warning-model';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {CollectionEnum} from '../enum/risk-control-enum';
import {XnFormUtils} from 'libs/shared/src/lib/common/xn-form-utils';
import {FormGroup} from '@angular/forms';
import {DateTypeModel} from './risk-warning-index.component';

import * as moment from 'moment';

/**
 *  交易列表
 */
@Component({
    selector: 'app-risk-warning-collection-reminder-component',
    template: `
        <h5 style="word-wrap: break-spaces;font-weight: bold">交易清单 - {{collectionEnum[data.title]}}</h5>
        <div style="padding: 10px">
            <div class="form-group clearfix" *ngIf="dateSelectedConfig.isSelectDate">
                <div style="float: left;margin-top: 5px">日期选择：</div>
                <div style="padding: 0;float: left;width: 300px" *ngFor="let row of shows">
                    <xn-input [form]="mainForm" [row]="row"></xn-input>
                </div>
            </div>
            <!--具体天数选则，风险预警-->
            <div class="form-group clearfix" *ngIf="dateSelectedConfig.isDate&&dateSelectedConfig.isDays">
                <div style="float: left;margin-top: 5px">距离保理到期日：</div>
                <div style="padding: 0;float: left;width: 300px">
                    <input type="number" class="form-control" [value]="selectDays" (input)="handleSelectDays(selectDays)">
                </div>
            </div>
            <table class="table table-bordered table-hover text-center">
                <thead>
                <tr class="label-text">
                    <th rowspan="2">交易ID</th>
                    <th rowspan="2">供应商</th>
                    <th rowspan="2">核心企业</th>
                    <th rowspan="2">保理金额(元)</th>
                    <th rowspan="2">利率(%)</th>
                    <th rowspan="2">交易模式</th>
                    <th rowspan="2">保理到期日</th>
                    <th colspan="3" *ngIf="proportion">资金到位比例</th>
                    <th rowspan="2">管户人</th>
                    <th rowspan="2">操作</th>
                </tr>
                <tr *ngIf="proportion" class="label-text">
                    <th>到期前5日</th>
                    <th>到期前3日</th>
                    <th>到期日</th>
                </tr>
                </thead>
                <tbody>
                <ng-container *ngIf="data.list && data.list.length ;else block">
                    <tr *ngFor="let item of data.list">
                        <td><a href="javaScript:void(0)" (click)="viewFlow(item.mainFlowId)">{{item.mainFlowId}}</a></td>
                        <td>{{item.supplierOrgName}}</td>
                        <td>{{item.enterpriseOrgName}}</td>
                        <td>{{item.contractAmount | number:'1.2-3'}}</td>
                        <td>{{item.price}}</td>
                        <td>{{item.isProxy | xnProxyStatus}}</td>
                        <td>{{item.factoringDueTime | xnDate: 'date'}}</td>
                        <ng-container *ngIf="proportion">
                            <td [ngClass]="calcClass(item.due01,1)">{{item.due01}}</td>
                            <td [ngClass]="calcClass(item.due02,2)">{{item.due02}}</td>
                            <td [ngClass]="calcClass(item.due03,3)">{{item.due03}}</td>
                        </ng-container>
                        <td>{{item.operator}}</td>
                        <td><a href="javaScript:void(0)" (click)="handleClick(item)">融资详情</a></td>
                    </tr>
                    <tr>
                        <td colspan="3">合计</td>
                        <td [attr.colspan]="proportion?11:8" style="text-align: left">{{calcTotal() | number:'1.2-3'}}</td>
                    </tr>
                </ng-container>
                </tbody>
            </table>
            <ng-template #block>
                <tr>
                    <td [attr.colspan]="proportion?12:9">
                        <div class="empty-message"></div>
                    </td>
                </tr>
            </ng-template>
            <app-simple-page-component [size]="pagination.pageSize" [total]="pagination.total" [inputCurrentPage]="pagination.currentPage"
                                       (change)="handleChange($event)"></app-simple-page-component>
        </div>

    `,
    styles: [`
        .table th, .table td {
            vertical-align: middle;
        }

        .tip-text {
            color: #d00000;
        }

        .table tr td:nth-child(2), .table tr td:nth-child(3) {
            text-align: left;
        }

        .table tr:first-child th:nth-child(2), .table tr:first-child th:nth-child(3) {
            width: 200px;
            word-wrap: break-word;
        }
    `]

})
export class CollectionReminderComponent implements OnInit {
    @Input() data: any;
    @Input() pagination: any; // 分页配置
    @Input() proportion: boolean; // 是否显示资金比例
    @Input() tip: any;
    @Output() change: EventEmitter<any> = new EventEmitter(true);
    @Output() pageChange: EventEmitter<any> = new EventEmitter(true);
    @Input() dateSelectedConfig: DateTypeModel;
    selectDays = 7; // 默认选中七天
    // 合计金额
    public total = 0;
    collectionEnum = CollectionEnum;
    shows = [];
    mainForm: FormGroup;
    searches = [];

    constructor(private xn: XnService) {
    }

    ngOnInit() {
        if (this.dateSelectedConfig.isSelectDate) { // 如果非时间段，不构建搜索项
            this.buildForm();
        }
    }

    // 点击跳转至融资详情导航
    handleClick(val: CollectionReminderModel) {
        this.xn.router.navigate([`/console/risk-control/risk-warning/${val.mainFlowId}`]);
    }

    handleChange(e) {
        this.pageChange.emit(e);
    }

    handleSelectDays(page: number) {
        this.change.emit([{key: 'leftTime', value: page}]); // 选择具体天数
    }

    viewFlow(item) {
        this.xn.router.navigate([`console/main-list/detail/${item}`]);
    }

    calcClass(val, num) {
        let str = '';
        if (!!val) {
            switch (num) {
                case 1:
                    str = parseFloat(val.toString()) < 10 && this.tip === 1.2 ? 'tip-text' : '';
                    break;
                case 2:
                    str = parseFloat(val.toString()) < 50 && this.tip === 1.2 ? 'tip-text' : '';
                    break;
                case 3:
                    str = parseFloat(val.toString()) < 100 && this.tip === 1.2 ? 'tip-text' : '';
                    break;
            }
        }
        return str;
    }

    calcTotal() {
        if (this.data.list.length) {
            const arr = this.data.list.map((x: any) => x.contractAmount);
            if (arr.length) {
                return arr.reduce((total, val) => parseFloat(total) + parseFloat(val));
            }
            return '';
        }
        return '';
    }

    // 默认显示近7天
    buildForm() {
        this.shows = [
            {
                title: '日期选择',
                checkerId: 'createTime',
                type: 'quantum',
                required: false,
                // 常规建设 默认显示最近90天
                value: JSON.stringify({beginTime: moment().subtract(90, 'days').format('x'), endTime: moment().format('x')})
            }
        ];
        XnFormUtils.buildSelectOptions(this.shows);
        this.buildChecker(this.shows);
        this.mainForm = XnFormUtils.buildFormGroup(this.shows);
        this.mainForm.valueChanges.subscribe(v => {
            const search = [];
            for (const key in this.mainForm.value) {
                if (this.mainForm.value.hasOwnProperty(key)) {
                    if (this.mainForm.value[key] !== '') {
                        const obj = {} as any;
                        obj.key = key;
                        obj.value = this.mainForm.value[key];
                        search.push(obj);
                    }
                }
            }
            this.searches = search;
            // 发送请求
            this.change.emit(search);
        });
    }

    buildChecker(stepRows) {
        for (const row of stepRows) {
            XnFormUtils.convertChecker(row);
        }
    }
}
