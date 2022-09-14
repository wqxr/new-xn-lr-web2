/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：zd-record.ts
 * @summary：发票查询结果详情
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 wangqing            新增        2021-06-17
 * **********************************************************************
 */

import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Column, TableChange } from '@lr/ngx-table';
import ZdRecordConfig from '../../config/zd-record';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { EnterZdType } from 'libs/shared/src/lib/config/enum/common-enum';
import { XnTableComponent } from '@lr/ngx-table/lib/table.component';
import { SearchDetailHeads } from '../zd-search-record';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { forkJoin } from 'rxjs';

@Component({
    templateUrl: `./zd-search-record-detail.component.html`,
    styles: [`
    .setdiv ul {
        display:flex;
        justify-content:space-between;
        margin-bottom:15px;
        padding-left: 2px;
    }
    .setdiv h3{
        margin-bottom:20px;
    }
    .setdiv ul li{
        width:33%;
        font-size:14px;
        display:flex;
    }
    .setdiv ul li label{
        color: #707880;
        margin-right:20px;
        text-align: right;
        display: inline-block;
        flex: 2

    }
    .setdiv ul li span{
        color: #1F2B38;
        flex:5;
    }
    .speciallab{
        width: 9.2%;
        text-align: right;
        margin-right: 20px;
        color: #707880;
    }
    .speciallab + span{
        color: #1F2B38;
    }
    }
    p{
        line-height:20px;
        font-size: 14px;
        color: #707880;
    }
    .content-header span{
        color: rgba(0,0,0,.85);
        font-weight: 600;
        font-size: 20px;
    }
    .btn-primary{
        background-color:#1D67C7;
        width:70px;
        height:34px;
    }
    .content-header p a{
        color:#626A73;
        font-weight: 400;
        font-size: 14px;
    }
    `]
})
export class ZdSearchRecordDetailComponent implements OnInit {
    @ViewChild('reviewTable') reviewTable: XnTableComponent;
    @ViewChild('invoiceRecord') invoiceRecordInfo: ElementRef;
    public items: any;
    id = 0;
    detailRecord: any[] = [];
    tableTitle = '';
    paramInfo: any;
    public loading = false;
    columns: Column[] = [...SearchDetailHeads,
    {
        title: '中登附件',
        width: 120,
        fixed: 'right',
        buttons: [
            {
                text: '查看',
                type: 'link',
                click: (e: any) => {
                    this.xn.loading.open();
                    this.xn.api
                        .post('/custom/zhongdeng/zd/attachment_preview', {
                            registerNo: e.register_no,
                        })
                        .subscribe((x) => {
                            this.xn.loading.close();
                            const base64Str = x.data.attachment;
                            const blobObj = XnUtils.base64ToBlob(base64Str, 'application/pdf');
                            const dataUrl = URL.createObjectURL(blobObj);
                            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                                window.navigator.msSaveOrOpenBlob(blobObj);
                            } else {
                                window.open(dataUrl);
                            }
                        });
                }
            },
        ]
    }
    ]; // 表头
    pageConfig = {
        pageIndex: 1,
        pageSize: 10,
        total: 0
    };
    public enterUrl = [{
        label: '中登查询',
        url: '/console/manage/invoice-search/main/list',
    },
    {
        label: '中登查询记录',
        url: '/console/manage/invoice-search/records/search/list',
    }
    ];

    constructor(public xn: XnService,
        private route: ActivatedRoute) {
    }


    ngOnInit() {
        this.route.params.subscribe(x => {
            this.id = Number(x.id);
            this.onPage({ pageIndex: 1, pageSize: 10 });
        });
    }

    public onPage(e?: { pageIndex: number, pageSize?: number, total?: number }): void {
        this.loading = true;
        this.pageConfig = Object.assign({},this.pageConfig,e)
        forkJoin(
            this.xn.api.dragon.post('/zhongdeng/zd_manage/zd_history_query_param', {
                id: this.id,
            }),
            this.xn.api.dragon.post('/zhongdeng/zd_manage/zd_history_query_detail', {
                page_no: this.pageConfig.pageIndex,
                page_size: this.pageConfig.pageSize,
                id: this.id,
            }),
        ).subscribe(([paramInfo, datalist]) => {
            if (paramInfo.ret === 0) {
                this.paramInfo = paramInfo.data;
                this.paramInfo.transferor = paramInfo.data.transferor.join(',');
            }
            if (datalist.ret === 0 && !!datalist.data) {
                this.detailRecord = datalist.data.list;
                this.pageConfig.total = datalist.data.total;
            }
            this.loading = false;
        }, (err: any) => {
            console.error(err);
            this.loading = false;
        }, () => {
            this.loading = false;
        }
        )
    }
    /**
  *  返回
  */
    public comeBack() {
        this.xn.user.navigateBack();
    }
    handleTableChange(e: TableChange) {
        switch (e.type) {
            case 'pageIndex':
                this.onPage(e);
                break;
            case 'pageSize':
                this.onPage(e);
                break;
            default:
                break;
        }
    }


    /**
     *  返回
     */
    public onCancel() {
        this.xn.user.navigateBack();
    }
}
