import {Component, Input, OnInit} from '@angular/core';
import {ReminderOutputModel} from '../model/risk-warning-model';
import {XnService} from 'libs/shared/src/lib/services/xn.service';
import {BankManagementService} from '../../bank-management/bank-mangement.service';
import {Observable, of} from 'rxjs';
import {DateTypeModel} from './risk-warning-index.component';
import { map } from 'rxjs/operators';

import * as moment from 'moment';

/**
 *  常规检测
 */
@Component({
    selector: 'app-risk-warning-collection-reminder-index',
    template: `
        <section class="content">
            <app-risk-warning-collection-reminder-component [data]="{list:info.vanke,title:'vanke'}" [pagination]="pagination.vanke"
                                                            (change)="handleChange($event,'vanke')"
                                                            (pageChange)="pageChange($event,'vanke')"
                                                            [tip]="tip" [dateSelectedConfig]="dateSelectedConfig">
            </app-risk-warning-collection-reminder-component>
            <app-risk-warning-collection-reminder-component [data]="{list:info.base,title:'base'}" (change)="handleChange($event,'base')"
                                                            [pagination]="pagination.base" (pageChange)="pageChange($event,'base')"
                                                            [tip]="tip" [dateSelectedConfig]="dateSelectedConfig">
            </app-risk-warning-collection-reminder-component>
            <app-risk-warning-collection-reminder-component [proportion]=true [data]="{list:info.jinde,title:'jinde'}"
                                                            (change)="handleChange($event,'jinde')"
                                                            (pageChange)="pageChange($event,'jinde')"
                                                            [pagination]="pagination.jinde" [tip]="tip"
                                                            [dateSelectedConfig]="dateSelectedConfig">
            </app-risk-warning-collection-reminder-component>
            <app-risk-warning-collection-reminder-component [proportion]=true [data]="{list:info.direcpay,title:'direcpay'}"
                                                            (change)="handleChange($event,'direcpay')"
                                                            (pageChange)="pageChange($event,'direcpay')"
                                                            [pagination]="pagination.direcpay" [tip]="tip"
                                                            [dateSelectedConfig]="dateSelectedConfig">
            </app-risk-warning-collection-reminder-component>
        </section>
    `
})
export class CollectionReminderIndexComponent implements OnInit {
    @Input() tip: any;
    @Input() customerInfo: any;
    @Input() dateSelectedConfig: DateTypeModel;

    pagination = {
        vanke: {total: 0, pageSize: 10, currentPage: 1},
        base: {total: 0, pageSize: 10, currentPage: 1},
        jinde: {total: 0, pageSize: 10, currentPage: 1},
        direcpay: {total: 0, pageSize: 10, currentPage: 1},
    };
    info: ReminderOutputModel = new ReminderOutputModel();
    // vanke 后段分页，base,direcpay,jinde前段分页
    postUrl = {
        vanke: '/llz/risk_warning/prompting/prompting_list01',
        base: '/llz/risk_warning/prompting/prompting_list03',
        jinde: '/llz/risk_warning/prompting/prompting_list02',
        direcpay: '/llz/risk_warning/prompting/prompting_list04',
    };
    searches = [];
    resCache = new Map<string, ReminderOutputModel[]>();

    constructor(private xn: XnService, private bankManagementService: BankManagementService) {
    }

    ngOnInit() {
        this.init(1, 'vanke', this.searches);
        this.init(1, 'base', this.searches);
        this.init(1, 'direcpay', this.searches);
        this.init(1, 'jinde', this.searches);
    }

    /**
     *  默认加载、选择时间匹配加载
     * @param e 匹配时间段 [{key:'createTime,value:{'beginTime':15555555555,'endTime':15555555555}]
     * @param label 表单名称
     */
    // [moment().subtract(7, 'days'), moment()],
    handleChange(e, label) {
        this.searches = e || [];
        this.init(1, label, this.searches); // 搜索默认加载第一页
        this.pagination[label].currentPage = 1;
    }

    /**
     *  翻页
     * @param page 选择的页码
     * @param label 表单名称
     */
    pageChange(page, label) {
        const currentPage = page || 1;
        this.init(currentPage, label, this.searches);
    }

    /**
     * @param page 页码
     * @param label 表单名称
     * @param searches 时间段
     */
    private init(page, label, searches) {
        if (searches.length === 0) { // 如果没有搜索期日，默认加载近90天的数据
            const obj = {} as any;
            obj.key = 'createTime';
            obj.value = JSON.stringify({beginTime: moment().subtract(90, 'days').format('x'), endTime: moment().format('x')});
            searches.push(obj);
        }
        const currentPage = page || 1; // 当前页
        const param = this.bankManagementService.searchFormat(currentPage, this.pagination[label].pageSize, searches); // 构建参数
        if (this.customerInfo !== null) {
            param.company = this.customerInfo.orgName; // 过程控制选择企业
        }
        // 默认加载最近七天数据
        if (label === 'direcpay' || label === 'base' || label === 'jinde') {
            delete param.start;
            delete param.length;
            // 前段进行分页
            this.splitPage(this.postUrl[label], param, currentPage, this.pagination[label].pageSize, label).subscribe(x => {
                this.info[label] = x.list;
                this.pagination[label].total = x.total;
            });

        } else {
            this.xn.api.post(this.postUrl[label], param).subscribe(x => {
                // 如果成功
                if (x.data && x.data.rows && x.data.rows.length) {
                    this.info[label] = x.data.rows;
                    this.pagination[label].total = x.data.recordsTotal; // 接口返回
                } else {
                    this.info[label] = [];
                    this.pagination[label].total = 0;
                }
            });
        }
    }

    // 分页
    private splitPage(url, params, start, length, label): Observable<any> {
        if (this.resCache.has(label)) {
            const data = this.resCache.get(label);
            if (this.resCache.get(label).length) {
                return of({list: data.slice((start - 1) * length, start * length), total: data.length});
            }
            return of({list: [], total: 0});
        } else {
            return this.xn.api.post(url, params).pipe(map(x => {
                this.resCache.set(label, x.data.rows);
                if (x.data.rows.length) {
                    return {list: x.data.rows.slice((start - 1) * length, start * length), total: x.data.rows.length};
                }
                return {list: [], total: 0};
            }));
        }
    }
}
