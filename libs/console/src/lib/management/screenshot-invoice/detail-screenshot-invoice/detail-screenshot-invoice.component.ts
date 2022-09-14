/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\console\src\lib\pages\register-company\register-company-list.component.ts
 * @summary：批量获取发票截图详情
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                 wangqing          upgrade         2021-10-18
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
import { detailScreenshotInvoice } from '../screenshot-invoice-list'
import { ActivatedRoute, Params } from '@angular/router';
import * as moment from 'moment';
import { DragonMfilesViewModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/mfiles-view-modal.component';

@Component({
    templateUrl: './detail-screenshot-invoice.component.html',
    styles: []
})
export class DetailScreenshotInvoiceComponent implements OnInit {
    @ViewChild('reviewTable') reviewTable: XnTableComponent;
    @ViewChild('searchForm') searchForm: SearchFormComponent;
    // 页码配置
    pageConfig = {
        pageIndex: 1,
        pageSize: 10,
        total: 0
    };
    public paging = 1;
    public listInfo: any[] = []; // 表格数据
    public selectedItems: any[] = []; // 选中项
    public loading = true;
    public sortModels: { [key: string]: any } = {}; // 排序
    // 表头
    public columns: Column[] = [...detailScreenshotInvoice.screenInvoicesearch.heads,
    {
        title: '操作',
        width: 120,
        fixed: 'right',
        buttons: [
            {
                text: '下载',
                type: 'link',
                click: (e: any) => {
                    if (!e.invoiceFile) {
                        this.xn.msgBox.open(false, '没有可供下载的发票文件');
                    } else {
                        this.xn.loading.open();
                        this.xn.dragon.getFileDownload('/chinatax/chinatax_download_invoice', { id: e.id }).subscribe(
                            (v: any) => {
                                const fileName = this.xn.api.getFileName(v._body.headers);
                                this.xn.loading.close();
                                this.xn.api.dragon.save(v._body.body, `${fileName}`);
                                this.xn.loading.close();
                            }
                        );
                    }
                }
            },
        ]
    },];
    // 搜索项
    public showFields: FormlyFieldConfig[] = detailScreenshotInvoice.screenInvoicesearch.searches;
    public chinataxRecordId: number;
    constructor(
        private xn: XnService,
        public hwModeService: HwModeService,
        private vcr: ViewContainerRef,
        private route: ActivatedRoute,
    ) { }

    ngOnInit(): void {
        this.route.params.subscribe((params: Params) => {
            this.chinataxRecordId = params.id;
            this.onPage({ pageIndex: this.paging }, {});
        });

    }


    /**
     * @param e  pageIndex 页码 pageSize 每页数量 total 数据总数
     * @param searchModel  搜索项
     * @summary
     */
    public onPage(e?: { pageIndex: number, pageSize?: number, total?: number }, searchModel?: { [key: string]: any }) {
        this.loading = true;
        this.selectedItems = [];
        this.paging = e?.pageIndex || 1;
        this.pageConfig = Object.assign({}, this.pageConfig, e);
        const params = this.buildParams(searchModel);
        this.xn.dragon.post('/chinatax/chinatax_invoice_list', params).subscribe(x => {
            this.loading = false;
            if (x.ret === 0) {
                this.listInfo = x.data.data;
                this.pageConfig.total = x.data.count;
            }
        }, (err: any) => {
            console.error(err);
            this.loading = false;
        }, () => {
            this.loading = false;
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
    *  返回
    */
    public comeBack() {
        this.xn.user.navigateBack();
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
 *  查看文件信息
 */
    public viewFiles(paramFile) {
        if (typeof paramFile === 'string') {
            paramFile = JSON.parse(paramFile);
        }
        XnModalUtils.openInViewContainer(
            this.xn,
            this.vcr,
            DragonMfilesViewModalComponent,
            paramFile
        ).subscribe();
    }

    /**
     * 构建列表请求参数
     * @param searchModel 原始数据
     */
    private buildParams(searchModel: { [key: string]: any }) {
        const params: any = {
            pageNo: this.paging,
            pageSize: this.pageConfig.pageSize,
            chinataxRecordId: this.chinataxRecordId,
        };
        // 搜索处理
        for (const key of Object.keys(searchModel)) {
            if (!XnUtils.isEmptys(searchModel[key], [0])) {
                if (key === 'invoiceDate') {
                    params.invoiceDateStartTime = moment(searchModel[key][0]).valueOf();
                    params.invoiceDateEndTime = moment(searchModel[key][1]).valueOf();
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
                this.selectedItems = e.checkbox || [];
                break;
            default:
                break;
        }
    }
    /**
     * 导出
     */
    exportDatalist() {
        const params = this.buildParams(this.searchForm.model);
        delete params.pageNo;
        delete params.pageSize;
        this.xn.dragon.download('/chinatax/chinatax_invoice_excel_download', params).subscribe((con: any) => {
            this.xn.loading.close();
            this.xn.api.save(con._body, '发票清单列表.xlsx');
        });
    }
    /** 失败任务重试 */
    retryFail() {
        this.xn.loading.open();
        this.xn.dragon.post('/chinatax/chinatax_batch_retry', { chinataxRecordId: this.chinataxRecordId }).subscribe(x => {
            this.onPage({ pageIndex: this.paging }, this.searchForm.model);
            this.xn.loading.close();
        });
    }
}
