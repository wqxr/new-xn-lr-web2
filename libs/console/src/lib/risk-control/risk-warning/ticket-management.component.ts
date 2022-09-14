import {Component, Input, OnInit} from '@angular/core';
import {TicketInfoModel} from '../model/risk-warning-model';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {FormGroup} from '@angular/forms';
import {XnUtils} from 'libs/shared/src/lib/common/xn-utils';
import {XnFormUtils} from 'libs/shared/src/lib/common/xn-form-utils';

/**
 * 商票管理
 */
@Component({
    selector: 'app-risk-warning-ticket-management',
    template: `
        <div style="padding-top: 3rem">
            <div class="form-group col-sm-6 flex" *ngFor="let row of shows">
                <div class="title xn-control-label">
                    {{row.title}}
                    <span *ngIf="row.required !== false" class="required-label">*</span>
                </div>
                <div class="label">
                    <xn-input [row]="row" [form]="mainForm"></xn-input>
                </div>
            </div>
            <div class="col-sm-12 form-group text-right">
                <button class="btn btn-primary" (click)="searchMsg()">查询</button>
                <button class="btn btn-danger" (click)="reset()">重置</button>
            </div>
            <table class="table table-bordered table-hover text-center">
                <thead>
                <tr class="label-text">
                    <th>商票号码</th>
                    <th>商票金额</th>
                    <th>开票日期</th>
                    <th>开票人</th>
                    <th>承兑人</th>
                    <th>持票人</th>
                    <th>商票到期日</th>
                    <th>是否质押</th>
                    <th>是否保理</th>
                </tr>
                </thead>
                <tbody>
                <ng-container *ngIf="lists && lists.length ; else block">
                    <tr *ngFor="let item of lists">
                        <td>{{item.billNumber}}</td>
                        <td>{{item.billAmount | number:'1.2-3'}}</td>
                        <td>{{item.issueDate}}</td>
                        <td>{{item.drawerName}}</td>
                        <td>{{item.acceptorName}}</td>
                        <td>{{item.payeeName}}</td>
                        <td>{{item.dueDate}}</td>
                        <td>{{item.status | xnZhiya}}</td>
                        <td>{{item.isUseQuota | xnUseQuotaStatus}}</td>
                    </tr>
                </ng-container>
                </tbody>
            </table>
            <app-simple-page-component [size]="pageSize" [total]="total"
                                       (change)="pageChange($event)" [inputCurrentPage]="paging"></app-simple-page-component>
        </div>
        <ng-template #block>
            <tr>
                <td colspan="9">
                    <div class="empty-message"></div>
                </td>
            </tr>
        </ng-template>
    `,
    styles: [`
        .title {
            width: 100px;
        }

        .label {
            font-weight: normal;
            flex: 1;
        }

        .flex {
            display: flex;
        }
    `]
})
export class TicketManagementComponent implements OnInit {
    @Input() urlData: any;
    lists: TicketInfoModel[];
    mainForm: FormGroup;
    total = 0;
    pageSize = 10;
    paging = 0;
    arrObjs = {} as any;
    searches: any[] = [];
    shows: any[] = [];
    beginTime: any;
    endTime: any;
    timeId = [];
    nowTimeCheckId = '';

    public constructor(private xn: XnService) {
    }

    public ngOnInit() {
        this.pageChange(1);
    }

    // 搜索
    searchMsg() {
        this.paging = 1; // 重置
        this.pageChange(this.paging);
    }

    // 重置
    reset() {
        this.mainForm.reset(); // 清空
        for (const key in this.arrObjs) {
            if (this.arrObjs.hasOwnProperty(key)) {
                delete this.arrObjs[key];
            }
        }
        this.buildCondition(this.searches);
        this.searchMsg(); // 清空之后自动调一次search
    }

    pageChange(e) {
        this.xn.loading.open();
        this.paging = e || 1;
        this.onUrlData(); // 导航回退取值
        this.searches = [
            {
                title: '商票号码',
                checkerId: 'billNumber',
                type: 'text',
                required: false,
            },
            {
                title: '开票人',
                checkerId: 'drawerName',
                type: 'text',
                required: false,
            },
            {
                title: '承兑人',
                checkerId: 'acceptorName',
                type: 'text',
                required: false,
            }, {
                title: '商票到期日',
                checkerId: 'dueDate',
                type: 'quantum1',
                required: false,
            }, {
                title: '是否保理',
                checkerId: 'isUseQuota',
                type: 'select',
                options: {ref: 'isUseQuota'},
                base: 'number',
                required: false,
            },
        ]; // 搜索项
        this.buildShow(this.searches);
        const params = this.buildParams();
        this.xn.api.post('/llz/risk_warning/honour_management/honour_get', params).subscribe(x => {
            this.xn.loading.close();
            if (x.data && x.data.rows && x.data.rows.length) {
                this.lists = x.data.rows;
                this.total = x.data.recordsTotal;
            } else {
                this.lists = [];
                this.total = 0;
            }
        });
    }

    // 搜索项值格式化
    private buildCondition(searches) {
        const tmpTime = {
            beginTime: this.beginTime,
            endTime: this.endTime
        };
        const objList = [];
        this.timeId = $.extend(true, [], this.searches.filter(v => v.type === 'quantum').map(v => v.checkerId));
        for (let i = 0; i < searches.length; i++) {
            const obj = {} as any;
            obj.title = searches[i].title;
            obj.checkerId = searches[i].checkerId;
            obj.required = false;
            obj.type = searches[i].type;
            obj.number = searches[i].number;
            obj.options = searches[i].options;
            if (searches[i].checkerId === this.timeId[0]) {
                obj.value = JSON.stringify(tmpTime);
            } else {
                obj.value = this.arrObjs[searches[i].checkerId];
            }
            objList.push(obj);
        }
        this.shows = $.extend(true, [], objList.sort(function(a, b) {
            return a.number - b.number;
        })); // 深拷贝，并排序;
        XnFormUtils.buildSelectOptions(this.shows);
        this.buildChecker(this.shows);
        this.mainForm = XnFormUtils.buildFormGroup(this.shows);
        const time = this.searches.filter(v => v.type === 'quantum');
        const timeCheckId = time[0] && time[0].checkerId;
        this.nowTimeCheckId = timeCheckId;
        this.mainForm.valueChanges.subscribe((v) => {
            // 时间段
            const changeId = v[timeCheckId];
            delete v[timeCheckId];
            if (changeId !== '' && this.nowTimeCheckId) {
                const paramsTime = JSON.parse(changeId);
                const beginTime = paramsTime.beginTime;
                const endTime = paramsTime.endTime;

                if (beginTime === this.beginTime && endTime === this.endTime) {
                    // return;
                } else {
                    this.beginTime = beginTime;
                    this.endTime = endTime;
                    this.paging = 1;
                    this.pageChange(this.paging);
                }
            }
            const arrObj = {} as any;
            for (const item in v) {
                if (v.hasOwnProperty(item) && v[item] !== '') {
                    const searchFilter = this.searches.filter(v1 => v1 && v1.base === 'number').map(c => c.checkerId);
                    if (searchFilter.indexOf(item) >= 0) {
                        arrObj[item] = Number(v[item]);
                    } else {
                        arrObj[item] = v[item];
                    }
                }
            }
            this.arrObjs = $.extend(true, {}, arrObj); // 深拷贝;要进行搜索的变量
            this.onUrlData();
        });

    }

    // 构建搜索项
    private buildShow(searches) {
        this.shows = [];
        // this.onUrlData();
        this.buildCondition(searches);
    }

    // 构建参数
    private buildParams() {
        // 分页处理
        const params: any = {
            start: (this.paging - 1) * this.pageSize,
            length: this.pageSize,
            beginTime: this.beginTime,
            endTime: this.endTime
        };
        // 搜索处理
        if (this.searches.length > 0) {
            for (const search of this.searches) {
                if (!XnUtils.isEmpty(this.arrObjs[search.checkerId])) {
                    params[search.checkerId] = this.arrObjs[search.checkerId];
                }
            }
        }
        return params;
    }

    private buildChecker(stepRows) {
        for (const row of stepRows) {
            XnFormUtils.convertChecker(row);
        }
    }

    // 回退操作
    private onUrlData(data?) {
        const urlData = this.urlData || this.xn.user.getUrlData(this.xn.router.url);
        if (urlData && urlData.pop) {
            this.paging = urlData.data.paging || this.paging;
            this.arrObjs = urlData.data.arrObjs || this.arrObjs;
            this.beginTime = urlData.data.beginTime || this.beginTime;
            this.endTime = urlData.data.endTime || this.endTime;

        } else {
            this.xn.user.setUrlData(this.xn.router.url, {
                paging: this.paging,
                arrObjs: this.arrObjs,
                beginTime: this.beginTime,
                endTime: this.endTime,
                code: 1.4
            });
        }
        Object.keys(this.urlData).map(key => delete this.urlData[key]);
    }
}
