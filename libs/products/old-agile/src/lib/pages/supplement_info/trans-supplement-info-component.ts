import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {XnModalUtils} from 'libs/shared/src/lib/common/xn-modal-utils';
import {InvoiceDataViewModalComponent} from 'libs/shared/src/lib/public/modal/invoice-data-view-modal.component';
import {LocalStorageService} from 'libs/shared/src/lib/services/local-storage.service';
import {BankManagementService} from '../../../../../../console/src/lib/bank-management/bank-mangement.service';
import {ActivatedRoute} from '@angular/router';
import {PdfSignModalComponent} from 'libs/shared/src/lib/public/modal/pdf-sign-modal.component';
import {XnFormUtils} from 'libs/shared/src/lib/common/xn-form-utils';
import {FormGroup} from '@angular/forms';
import {CalendarData} from 'libs/shared/src/lib/config/calendar';

/**
 *  保理商 - 标准保理- 补充保理到期日,受让价格
 */
@Component({
    template: `
        <section class="content-header">
            <h1>{{tabConfig.title}}</h1>
        </section>
        <section class="content">
            <div class="box">
                <div class="box-body">
                    <div class="form-group">
                        <table class="table table-bordered table-striped text-center">
                            <thead>
                            <tr>
                                <!-- title -->
                                <th *ngFor="let head of currentTab?.headText">{{head.label}}</th>
                            </tr>
                            </thead>
                            <tbody>
                            <ng-container *ngIf="data.length">
                                <tr *ngFor="let item of data;let i=index">
                                    <!-- 列内容 -->
                                    <td *ngFor="let head of currentTab?.headText">
                                        <!-- 根据head type 类型配置显示方式 -->
                                        <ng-container [ngSwitch]="head.type">
                                            <ng-container *ngSwitchCase="'mainFlowId'">
                                                <a href="javaScript:void(0)"
                                                   (click)="bankManagementService.viewProcess(item[head.value])">{{item[head.value]}}</a>
                                            </ng-container>
                                            <ng-container *ngSwitchCase="'money'">
                                                <div>{{item[head.value] | xnMoney}}</div>
                                            </ng-container>
                                            <ng-container *ngSwitchCase="'invoiceNum'">
                                                <ng-container *ngIf="arrayLength(item[head.value]);else block2">
                                                    <a class="xn-click-a" href="javaScript:void(0)" (click)="viewMore(item[head.value])"
                                                       [innerHtml]="(item[head.value] | xnArrayTruncate:2:'等;')">
                                                    </a>
                                                </ng-container>
                                                <ng-template #block2>
                                                    <div [innerHtml]="(item[head.value] | xnArrayTruncate:2:'等;')"></div>
                                                </ng-template>

                                            </ng-container>
                                            <ng-container *ngSwitchCase="'contract'">
                                                <ng-container *ngIf=" item[head.value]&& item[head.value]!==''">
                                                    <div *ngFor="let sub of item[head.value] | xnJson; let i=index">
                                                        <a href="javaScript:void(0)" (click)="showContract(sub)">{{sub.label}}</a>
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
                    <div class="form-group clearfix" *ngFor="let row of shows">
                        <div class="col-sm-2" style="padding-top: 7px"
                             [ngClass]="row.required===true?'required-star':''">{{row.title}}
                        </div>
                        <div class="col-sm-6">
                            <xn-input [row]="row" [form]="form"></xn-input>
                        </div>
                        <div class="col-sm-4" style="padding-top: 7px">
                            <span *ngIf="alert===''" class="xn-control-desc">{{row.memo}}</span>
                            <span *ngIf="row.checkerId==='factoringDueDate'" class="xn-input-alert">{{alert}}</span>
                        </div>
                    </div>
                </div>
                <div class="box-footer clearfix">
                    <button class="btn btn-default pull-left" (click)="xn.user.navigateBack()">返回</button>
                    <button class="btn btn-primary pull-right" (click)="save()">提交</button>
                </div>
            </div>
        </section>


    `
})
export class TransSupplementInfoComponent implements OnInit {
    // 默认激活第一个标签页 {do_not,do_down}
    label = 'do_not';
    // 数据
    data: any[] = [];
    currentTab: any; // 当前标签页
    tabConfig: any;
    shows: any[] = [
        {
            title: '保理融资到期日',
            checkerId: 'factoringDueDate',
            type: 'date',
            required: 1,
            number: 1,
            memo: '日期不得少于当前系统日期、不能为节假日且为当前系统得时间T+300 - T+420之间'
        },
        {
            title: '受让价格',
            checkerId: 'assigneePrice',
            type: 'text',
            required: 0,
            number: 2,
            memo: ''
        },
    ];
    form: FormGroup;
    alert = '';
    calendar: any[];

    constructor(public xn: XnService,
                private vcr: ViewContainerRef,
                public bankManagementService: BankManagementService,
                private router: ActivatedRoute,
                private localStorageService: LocalStorageService) {
    }

    ngOnInit(): void {
        this.router.data.subscribe(x => {
            this.tabConfig = x;
            this.currentTab = this.tabConfig.tabList.find(item => item.value === this.label); // 当前标签页
            this.data = this.localStorageService.caCheMap.get('staySupplementSelected');
            XnFormUtils.buildSelectOptions(this.shows);
            this.buildChecker(this.shows);
            this.form = XnFormUtils.buildFormGroup(this.shows);
        });
        CalendarData.getAllDate().subscribe(y => {
            this.calendar = y;
        });
    }

    /**
     * 查看合同
     * @param paramContract
     */
    public showContract(paramContract) {
        const params = Object.assign({}, paramContract, {readonly: true});
        XnModalUtils.openInViewContainer(this.xn, this.vcr, PdfSignModalComponent, params).subscribe(() => {
        });
    }

    /**
     * 查看更多发票
     * @param item
     */
    public viewMore(item) {
        if (typeof item === 'string') {
            item = this.stringToArray(item);
        }
        XnModalUtils.openInViewContainer(
            this.xn,
            this.vcr,
            InvoiceDataViewModalComponent,
            item
        ).subscribe(() => {
        });
    }

    /**
     * 补充信息
     */
    public save() {
        const mains = this.data.map((x: any) => x.mainFlowId);
        const dueDate = this.form.value.factoringDueDate;
        const nowTimes = new Date().getTime();
        const inputTimes = new Date(dueDate.toString()).getTime();
        const oneDayTimes = 24 * 60 * 60 * 1000;
        // 将日期转为'20180205';
        const calendarDate = dueDate.replace(/[-]/g, '');
        const find = this.calendar.find(f => f.dateTime === calendarDate);
        if (inputTimes <= nowTimes) {
            this.alert = '所选日期不能早于当前系统日期';
            return;
        } else if (inputTimes < nowTimes + 300 * oneDayTimes || inputTimes > nowTimes + 420 * oneDayTimes) {
            this.alert = '日期必须为“当前系统时间+360-60”-“当前系统时间+360+60”范围内';
            return;
        } else if (find && find.isWorking === 0) {
            this.alert = '日期不能为节假日';
            return;
        } else {
            this.xn.api.post('/custom/vanke_v5/list/update_factory_date', {
                mainFlowIds: mains,
                newDate: dueDate,
                assigneePrice: this.form.value.assigneePrice
            }).subscribe(x => {
                this.xn.user.navigateBack();
            });
        }

    }

    /**
     * 判断数组
     * @param value
     */
    public arrayLength(value: any) {
        if (!value) {
            return false;
        }
        const obj =
            typeof value === 'string'
                ? this.stringToArray(value)
                : JSON.parse(JSON.stringify(value));
        return !!obj && obj.length > 2;
    }

    private stringToArray(value: any) {
      return this.isJson(value) ? JSON.parse(value) : value.split(',');
    }

    private isJson(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    private buildChecker(stepRows) {
        for (const row of stepRows) {
            XnFormUtils.convertChecker(row);
        }
    }
}
