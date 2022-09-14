/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\console\src\lib\pages\register-company\register-company-list.component.ts
 * @summary：批量获取发票截图
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                 wangqing         upgrade         2021-10-18
 ***************************************************************************/
import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormlyFieldConfig } from '@lr/ngx-formly';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { SearchFormComponent } from '@lr/ngx-shared';
import { Column, TableChange, TableData } from '@lr/ngx-table';
import { XnTableComponent } from '@lr/ngx-table/lib/table.component';
import { screenshotInvoiceList, showFieldsInvoice } from './screenshot-invoice-list'
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { EditModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/edit-modal.component';
import * as moment from 'moment';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';

@Component({
    templateUrl: './screenshot-invoice-list.component.html',
    styles: []
})
export class ScreenshotInvoiceComponent implements OnInit {
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
    public columns: Column[] = [...screenshotInvoiceList, {
        title: '操作',
        width: 120,
        fixed: 'right',
        buttons: [
            {
                text: '查看',
                type: 'link',
                click: (e: any) => {
                    this.xn.router.navigate([`/console/manage/screenshot-invoice/detail/${e.id}`]);
                }
            },
            {
                text: '下载',
                type: 'link',
                click: (e: any) => {
                    this.xn.loading.open();
                    this.xn.dragon.getFileDownload('/chinatax/chinatax_download_batch_invoice', { chinataxRecordId: e.id }).subscribe(
                        (v: any) => {
                            const fileName = this.xn.api.getFileName(v._body.headers);
                            this.xn.loading.close();
                            this.xn.api.dragon.save(v._body.body, `${fileName}`);
                            this.xn.loading.close();
                        }
                    );
                }
            },
        ]
    },];
    // 搜索项
    public showFields: FormlyFieldConfig[] = showFieldsInvoice;

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
        this.xn.dragon.post('/chinatax/chinatax_record_list', params).subscribe(x => {
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
            pageNo: this.paging,
            pageSize: this.pageConfig.pageSize,
        };
        // 搜索处理
        for (const key of Object.keys(searchModel)) {
            if (!XnUtils.isEmptys(searchModel[key], [0])) {
                if (key === 'operatTime') {
                    params.operatorStartTime = moment(searchModel[key][0]).valueOf();
                    params.operatorEndTime = moment(searchModel[key][1]).valueOf();
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
            default:
                break;
        }
    }
    // 验证是否是excel
    private validateExcelExt(s: string): string {
        const exts = "xlsx,xls".replace(/,/g, '|').replace(/\s+/g, ''); // 删除所有空格
        if (s.match(new RegExp('\\.(' + exts + ')$', 'i'))) {
            return '';
        } else {
            return `只支持以下文件格式:xlsx,xls`;
        }
    }
    // 下载模板
    downloadTp() {
        const a = document.createElement('a');
        a.href = '/assets/lr/doc/发票查验清单(模板).xlsx';
        a.click();
    }

    /**
     * 导入清单
     */
    importDatalist(e) {
        XnUtils.checkLoading(this);
        if (e.target.files.length === 0) {
            this.loading.close();
            return;
        }

        const err = this.validateExcelExt(e.target.files[0].name);
        if (!XnUtils.isEmpty(err)) {
            this.alert = err;
            // 把file input的值置为空，这样下次选择同一个文件还能触发这个请求
            $(e.target).val('');
            this.loading.close();
            return;
        }

        const fd = new FormData();
        fd.append('file_data', e.target.files[0], e.target.files[0].name);
        this.xn.api.dragon.upload('/chinatax/chinatax_invoice_upload', fd).subscribe(json => {
            if (json.type === 'complete') {
                if (json.data.ret !== 0) {
                    this.xn.msgBox.open(false, json.data.msg);
                } else {
                    this.xn.msgBox.open(false, '导入成功');
                    this.onPage({ pageIndex: this.paging }, {});
                }
                $(e.target).val('');
                this.alert = '';
                this.loading.close();
            }
        });
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
