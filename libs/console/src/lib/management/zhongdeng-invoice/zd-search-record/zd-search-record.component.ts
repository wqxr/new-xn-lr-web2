/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\console\src\lib\pages\register-company\register-company-list.component.ts
 * @summary：中登查询记录
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                 wangqing          upgrade         2021-11-04
 ***************************************************************************/
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormlyFieldConfig } from '@lr/ngx-formly';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { SearchFormComponent } from '@lr/ngx-shared/lib/components/search-form/search-form.component';
import { Column, TableChange } from '@lr/ngx-table/lib/interfaces';
import { XnTableComponent } from '@lr/ngx-table/lib/table.component';
import { zdSearchRecordfieldList, zdSearchRecordList } from './zd-search-record'
import * as moment from 'moment';

@Component({
    templateUrl: './zd-search-record.component.html',
    styles: []
})
export class ZdSearchRecordComponent implements OnInit {
    @ViewChild('reviewTable') reviewTable: XnTableComponent;
    @ViewChild('searchForm') searchForm: SearchFormComponent;
    // 页码配置
    pageConfig = {
        pageIndex: 1,
        pageSize: 10,
        total: 0
    };
    alert = '';
    public listInfo: any[] = []; // 表格数据
    public selectedItems: any[] = []; // 选中项
    public loadings = false;
    public sortModels: { [key: string]: any } = {}; // 排序
    // 表头
    public columns: Column[] = [...zdSearchRecordList, {
        title: '筛选记录',
        width: 120,
        fixed: 'right',
        buttons: [
            {
                text: '详情',
                type: 'link',
                click: (e: any) => {
                    console.log('11111', e);
                    this.xn.router.navigate([`/console/manage/invoice-search/records/search/detail/${e.id}`]);
                }
            },
        ]
    },];
    // 搜索项
    public showFields: FormlyFieldConfig[] = zdSearchRecordfieldList;

    constructor(
        private xn: XnService,
    ) { }

    ngOnInit(): void {
        this.onUrlData();
        this.onPage({ pageIndex: this.pageConfig.pageIndex }, {});
    }


    /**
     * @param e  pageIndex 页码 pageSize 每页数量 total 数据总数
     * @param searchModel  搜索项
     * @summary
     */
    public onPage(e?: { pageIndex: number, pageSize?: number, total?: number }, searchModel?: { [key: string]: any }) {
        this.loadings = true;
        this.selectedItems = [];
        this.onUrlData(); // 导航回退取值
        this.pageConfig = Object.assign({}, this.pageConfig, e);
        const params = this.buildParams(searchModel);
        this.xn.dragon.post('/zhongdeng/zd_manage/zd_history_query_list', params).subscribe(x => {
            this.loadings = false;
            if (x.ret === 0) {
                this.listInfo = x.data.list
                this.pageConfig.total = x.data.total;
            }
        }, (err: any) => {
            console.error(err);
            this.loadings = false;
        }, () => {
            this.loadings = false;
        });

    }

    /**
     * 搜索条件查询
     */
    onSearch(data: any) {
        this.pageConfig.pageIndex = 1;
        this.selectedItems = [];
        this.onPage(this.pageConfig, data);
    }


    /**
     * 重置搜索项表单
     */
    onReset(searchForm: any) {
        this.selectedItems = [];
        this.sortModels = {};
        searchForm.form.reset();
        this.reviewTable.clearStatus();
        this.onSearch({});
    }

    /**
     * 构建列表请求参数
     * @param searchModel 原始数据
     */
    private buildParams(searchModel: { [key: string]: any }) {
        const params: any = {
            page_no: this.pageConfig.pageIndex,
            page_size: this.pageConfig.pageSize,
        };
        // 搜索处理
        for (const key of Object.keys(searchModel)) {
            if (key === 'operateTime' && !!searchModel[key]) {
                params.operate_date = moment(searchModel['operateTime']).format('YYYY-MM-DD');
            }
            if (!XnUtils.isEmptys(searchModel[key], [0])) {
                params[key] = searchModel[key]?.toString()?.trim();
            }
        }
        return params;
    }
    /**
     * table事件处理
     * @param e 分页参数
     * @param searchForm 搜索项
     */
    handleTableChange(e: TableChange, searchForm: { [key: string]: any }) {
        switch (e.type) {
            case 'pageIndex':
                this.onPage(e, searchForm.model);
                break;
            case 'pageSize':
                this.onPage(e, searchForm.model);
                break;
            case 'sort':
                this.sortModels = e?.sort?.map || {};
                this.onPage(e, searchForm.model);
                break;
            default:
                break;
        }
    }
    /**
     * 回退操作，路由存储
     */
    private onUrlData() {
        const urlData = this.xn.user.getUrlData(this.xn.router.url);
        if (urlData && urlData.pop) {
            this.pageConfig = urlData.data.pageConfig || this.pageConfig;
        } else {
            this.xn.user.setUrlData(this.xn.router.url, {
                pageConfig: this.pageConfig,
            });
        }
    }
}
