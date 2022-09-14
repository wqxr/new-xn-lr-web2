import {Component, Input, OnInit} from '@angular/core';
import {CollectionReminderModel} from '../model/risk-warning-model';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {Observable, of} from 'rxjs';
import {FormGroup} from '@angular/forms';
import {XnFormUtils} from 'libs/shared/src/lib/common/xn-form-utils';
import {XnUtils} from 'libs/shared/src/lib/common/xn-utils';
import { map } from 'rxjs/operators';

/**
 *  风险预警 ：逾期
 */
@Component({
    selector: 'app-risk-warning-collection-reminder-index1',
    template: `
        <section class="content">
            <div style="padding: 10px">
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
                        <th colspan="4">资金到位比例</th>
                        <th rowspan="2">管户人</th>
                        <th rowspan="2">操作</th>
                    </tr>
                    <tr class="label-text">
                        <th>到期前5日</th>
                        <th>到期前3日</th>
                        <th>到期日</th>
                        <th>当前</th>
                    </tr>
                    </thead>
                    <tbody>
                    <ng-container *ngIf="info && info.length ;else block">
                        <tr *ngFor="let item of info">
                            <td><a href="javaScript:void(0)" (click)="viewFlow(item.mainFlowId)">{{item.mainFlowId}}</a></td>
                            <td>{{item.supplierOrgName}}</td>
                            <td>{{item.enterpriseOrgName}}</td>
                            <td>{{item.contractAmount | number:'1.2-3'}}</td>
                            <td>{{item.price}}</td>
                            <td>{{item.isProxy | xnProxyStatus}}</td>
                            <td>{{item.factoringDueTime | xnDate: 'date'}}</td>
                            <ng-container>
                                <td [ngClass]="calcClass(item.due01,1)">{{item.due01}}</td>
                                <td [ngClass]="calcClass(item.due02,2)">{{item.due02}}</td>
                                <td [ngClass]="calcClass(item.due03,3)">{{item.due03}}</td>
                                <td [ngClass]="calcClass(item?.due04,4)">{{item.due04}}</td>
                            </ng-container>
                            <td>{{item.operator}}</td>
                            <td><a href="javaScript:void(0)" (click)="handleClick(item)">融资详情</a></td>
                        </tr>
                        <tr>
                            <td colspan="3">合计</td>
                            <td [attr.colspan]="11" style="text-align: left">{{calcTotal() | number:'1.2-3'}}</td>
                        </tr>
                    </ng-container>
                    </tbody>
                </table>
                <ng-template #block>
                    <tr>
                        <td [attr.colspan]="13">
                            <div class="empty-message"></div>
                        </td>
                    </tr>
                </ng-template>
                <app-simple-page-component [size]="pageSize" [total]="total" [inputCurrentPage]="paging"
                                           (change)="pageChange($event)"></app-simple-page-component>
            </div>
        </section>
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
export class CollectionReminderIndex1Component implements OnInit {
    @Input() urlData: any;
    @Input() tip: any;
    // 时间选择

    total = 0;
    pageSize = 10;
    mainForm: FormGroup;
    arrObjs = {} as any;
    paging = 0;
    searches: any[] = [];
    shows: any[] = [];
    info: CollectionReminderModel[] = [];
    postUrl = '/llz/risk_warning/warning/over_due';
    resCache = new Map<string, CollectionReminderModel[]>();

    constructor(private xn: XnService) {
    }

    ngOnInit() {
        this.pageChange(1);
    }

    // 点击跳转至融资详情导航
    handleClick(val: CollectionReminderModel) {
        this.xn.router.navigate([`/console/risk-control/risk-warning/${val.mainFlowId}`]);
    }

    // 搜索
    searchMsg() {
        this.paging = 1; // 重置
        this.pageChange(this.paging);
    }

    calcTotal() {
        if (this.info.length) {
            const arr = this.info.map((x: any) => x.contractAmount);
            if (arr.length) {
                return arr.reduce((total, val) => parseFloat(total) + parseFloat(val));
            }
            return '';
        }
        return '';
    }

    viewFlow(item) {
        this.xn.router.navigate([`console/main-list/detail/${item}`]);
    }

    /**
     *  翻页
     * @param page 选择的页码
     * @param label 表单名称
     */
    pageChange(page) {
        this.xn.loading.open();
        this.paging = page || 1;
        this.onUrlData(); // 导航回退取值
        this.searches = []; // 搜索项
        this.buildShow(this.searches);
        const params = this.buildParams();
        delete params.start;
        delete params.length;
        // 前段进行分页
        this.splitPage(this.postUrl, params, this.paging, this.pageSize).subscribe(x => {
            this.info = x.list;
            this.total = x.total;
            this.xn.loading.close();
        });
    }

    // 构建搜索项
    private buildShow(searches) {
        this.shows = [];
        // this.onUrlData();
        this.buildCondition(searches);
    }

    calcClass(val, num) {
        let str = '';
        if (!!val) {
            if (val.includes('%')) {
                val.replace(/[%]/i, '');
            }
            switch (num) {
                case 1:
                    str = parseFloat(val.toString()) < 10 ? 'tip-text' : '';
                    break;
                case 2:
                    str = parseFloat(val.toString()) < 50 ? 'tip-text' : '';
                    break;
                case 3:
                    str = parseFloat(val.toString()) < 100 ? 'tip-text' : '';
                    break;
                case 4:
                    str = parseFloat(val.toString()) < 100 ? 'tip-text' : '';
                    break;
            }
        }
        return str;
    }

    // 分页
    private splitPage(url, params, start, length): Observable<any> {
        if (this.resCache.has('data')) {
            const data = this.resCache.get('data');
            if (this.resCache.get('data').length) {
                return of({list: data.slice((start - 1) * length, start * length), total: data.length});
            }
            return of({list: [], total: 0});
        } else {
            return this.xn.api.post(url, params).pipe(map(x => {
                this.resCache.set('data', x.data.data);
                if (x.data.data.length) {
                    return {list: x.data.data.slice((start - 1) * length, start * length), total: x.data.data.length};
                }
                return {list: [], total: 0};
            }));
        }
    }

    private buildChecker(stepRows) {
        for (const row of stepRows) {
            XnFormUtils.convertChecker(row);
        }
    }

    // 构建参数
    private buildParams() {
        // 分页处理
        const params: any = {
            start: (this.paging - 1) * this.pageSize,
            length: this.pageSize,
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

    // 搜索项值格式化
    private buildCondition(searches) {
        const objList = [];
        for (let i = 0; i < searches.length; i++) {
            const obj = {} as any;
            obj.title = searches[i].title;
            obj.checkerId = searches[i].checkerId;
            obj.required = false;
            obj.type = searches[i].type;
            obj.number = searches[i].number;
            obj.options = searches[i].options;
            obj.value = this.arrObjs[searches[i].checkerId] || 7; // 默认七天
            objList.push(obj);
        }
        this.shows = $.extend(true, [], objList.sort(function(a, b) {
            return a.number - b.number;
        })); // 深拷贝，并排序;
        XnFormUtils.buildSelectOptions(this.shows);
        this.buildChecker(this.shows);
        this.mainForm = XnFormUtils.buildFormGroup(this.shows);
        this.mainForm.valueChanges.subscribe((v) => {
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


    // 回退操作
    private onUrlData(data?) {
        const urlData = this.urlData || this.xn.user.getUrlData(this.xn.router.url);
        if (urlData && urlData.pop) {
            this.paging = urlData.data.paging || this.paging;
            this.arrObjs = urlData.data.arrObjs || this.arrObjs;
        } else {
            this.xn.user.setUrlData(this.xn.router.url, {
                paging: this.paging,
                arrObjs: this.arrObjs,
                code: 1.2
            });
        }
        // 删除 this.urlData 数据
        Object.keys(this.urlData).map(key => delete this.urlData[key]);
    }
}
