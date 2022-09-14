/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\console\src\lib\pages\register-company\register-company-list.component.ts
 * @summary：资质文件录入列表
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                 wangqing         upgrade         2022-03-10
 ***************************************************************************/
import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormlyFieldConfig } from '@lr/ngx-formly';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { SearchFormComponent } from '@lr/ngx-shared';
import { Column, TableChange, TableData } from '@lr/ngx-table';
import { XnTableComponent } from '@lr/ngx-table/lib/table.component';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { EditModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/edit-modal.component';
import * as moment from 'moment';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { entryCertifylist, entryCertifySearch } from './entry-certify-list';
import { CertifyFileEntryModal } from 'libs/shared/src/lib/public/dragon-vanke/modal/certify-file-entry-modal.component';

@Component({
    templateUrl: './entry-certify-file.component.html',
    styles: []
})
export class EntryCertifyComponent implements OnInit {
    @ViewChild('reviewTable') reviewTable: XnTableComponent;
    @ViewChild('searchForm') searchForm: SearchFormComponent;
    // 页码配置
    pageConfig = {
        pageIndex: 1,
        pageSize: 10,
        total: 0
    };
    public paging = 1;
    alert = '';
    public listInfo: any[] = []; // 表格数据
    public selectedItems: any[] = []; // 选中项
    public loadings = true;
    public sortModels: { [key: string]: any } = {}; // 排序
    // 表头
    public columns: Column[] = [...entryCertifylist, {
        title: '操作',
        width: 120,
        fixed: 'right',
        buttons: [
            {
                text: '查看流程记录',
                type: 'link',
                click: (e: any) => {
                    this.xn.router.navigate([`/logan/record/view/${e.record_id}`]);
                }
            },
        ]
    }]
    // 搜索项
    public showFields: FormlyFieldConfig[] = entryCertifySearch;

    constructor(
        private xn: XnService,
        public hwModeService: HwModeService,
        private vcr: ViewContainerRef,
        private loading: LoadingService
    ) { }

    ngOnInit(): void {
        this.onUrlData();
        this.onPage({ pageIndex: this.paging }, {});
    }
 /**
   * 值发生变化时触发
   * @param value
   */
  onChanges(value: any): void {
    console.log('value', value);
}

    /**
     * @param e  pageIndex 页码 pageSize 每页数量 total 数据总数
     * @param searchModel  搜索项
     * @summary
     */
    public onPage(e?: { pageIndex: number, pageSize?: number, total?: number }, searchModel?: { [key: string]: any }) {
        this.loadings = true;
        this.selectedItems = [];
        this.paging = e?.pageIndex || 1;
        this.onUrlData(); // 导航回退取值
        this.pageConfig = Object.assign({}, this.pageConfig, e);
        const params = this.buildParams(searchModel);
        this.xn.dragon.post('/certify/certify_record_list', params).subscribe(x => {
            this.loadings = false;
            if (x.ret === 0) {
                this.listInfo = x.data.data;
                this.pageConfig.total = x.data.count;
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
    entryCertifyFile(){
        this.xn.router.navigate(
            [
              `/logan/record/new/`,
            ],
            {
              queryParams: {
                id: 'sub_platform_certify',
              },
            }
          );
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

    exportCertifyFile() {
        this.xn.loading.open();
        const params = this.buildParams(this.searchForm.model);
        delete params.pageNo;
        delete params.pageSize;
        if (this.selectedItems.length > 0) {
            const idList = this.selectedItems.map(v => v.id); // 企业id列表
            params.idList = idList;
        }
        this.xn.api.dragon.download('/certify/certify_record_excel', params).subscribe((v: any) => {
            this.xn.api.dragon.save(v._body, `资质清单.xlsx`);
            this.xn.loading.close();
        }, () => {
            this.xn.loading.close();
        });
    }


    /**
     * 构建列表请求参数
     * @param searchModel 原始数据
     */
    private buildParams(searchModel: { [key: string]: any }) {
        const params: any = {
            pageNo: this.paging,
            pageSize: this.pageConfig.pageSize,
        };
        // 排序处理
        for (const sortKey in this.sortModels) {
            if (this.sortModels.hasOwnProperty(sortKey)) {
                params.order = [{name:Number(sortKey), asc:this.sortModels[sortKey]==='asc'?1:-1}];
            }
        }
        // 搜索处理
        for (const key of Object.keys(searchModel)) {
            if (!XnUtils.isEmptys(searchModel[key], [0])) {
                if (key === 'createTime') {
                    params.operator_start_time = moment(searchModel[key][0]).valueOf();
                    params.operator_end_time = moment(searchModel[key][1]).valueOf();
                }else if(key==='record_status'){
                    params[key] = Number(searchModel[key]);
                } else {
                    params[key] = searchModel[key]?.toString()?.trim();
                }
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
            case 'checkbox':
                console.log('checkbox', e);
                this.selectedItems = e.checkbox || [];
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
            this.paging = urlData.data.paging || this.paging;
            this.pageConfig = urlData.data.pageConfig || this.pageConfig;
        } else {
            this.xn.user.setUrlData(this.xn.router.url, {
                paging: this.paging,
                pageConfig: this.pageConfig,
            });
        }
    }
}
