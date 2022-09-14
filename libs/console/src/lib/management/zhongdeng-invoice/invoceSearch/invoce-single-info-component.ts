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
import ZdRecordConfig from '../config/zd-record';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { EnterZdType } from 'libs/shared/src/lib/config/enum/common-enum';


@Component({
    templateUrl: `./invoce-single-info-component.html`,
    styles: [`
    .setdiv ul {
        display:flex;
        justify-content:space-between;
        margin-bottom:15px;
        padding-left: 2px;
    }
    .setdiv ul li{
        width:33%;
        font-size:14px;
    }
    .setdiv ul li:last-child{
        flex:1;
    }
    .setdiv ul li label{
        color: #707880;
        margin-right:60px;
    }
    .setdiv ul li span{
        color: #1F2B38;
    }
    p{
        line-height:20px;
        font-size: 14px;
        color: #707880;
        margin-top:10px;
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
export class InvoceSingleInfoComponent implements OnInit {
    @ViewChild('invoiceRecord') invoiceRecordInfo: ElementRef;
    public items: any;
    record_id = 0;
    paging = 1;
    detailRecord: any[] = [];
    pageSize = 10;
    total = 0;
    first = 0;
    tableTitle = '';
    public loading = false;
    columns: Column[] = ZdRecordConfig.commonConfig.singleDetailHeads; // 表头
    pageConfig = {
        pageIndex: 1,
        pageSize: 10,
        total: 0
    };
    public enterUrl = [{
        label: '中登查询',
        url: '/console/manage/invoice-search/main/list',
        records: EnterZdType.ZD_SEARCH,
        secondUrl: '/console/manage/invoice-search/record'
    },
    {
        label: '更新中登数据',
        url: '/console/manage/invoice-search/update-zd',
        records: EnterZdType.ZD_UPDATE,
        secondUrl: '/console/manage/invoice-search/record'
    }
    ];

    constructor(public xn: XnService,
        private route: ActivatedRoute) {
    }


    ngOnInit() {
        this.route.queryParams.subscribe(x => {
            this.enterUrl = this.enterUrl.filter(y => y.records === Number(x.records));
            this.record_id = x.record_id;
            this.onPage({ pageIndex: 1, pageSize: 10 });
        });
    }

    public onPage(e?: { pageIndex: number, pageSize?: number, total?: number }): void {
        this.paging = e.pageIndex || 1;
        this.pageSize = e.pageSize || this.pageSize;
        this.first = (this.paging - 1) * this.pageSize;
        this.loading = true;
        this.xn.api.post('/custom/zhongdeng/invoice/get_invoicesingle', {
            page: this.paging,
            size: this.pageSize,
            record_id: this.record_id,
            type: 1
        }).subscribe(json => {
            if (json.data.data.errcode !== 0) {
                this.loading = false;
                this.xn.msgBox.open(true, json.data.data.errmsg);
            } else {
                this.loading = false;
                this.items = json.data.data.record;
                this.detailRecord = json.data.data.detail_list;
                this.pageConfig.total = json.data.data.total;
            }

        });
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
     * 下载记录详情
     */
    public onload_invoice() {
        const address = this.xn.user.env === 'production' ? 'https://gateway.lrscft.com/api/zd/download/record/detail?xwappid=eb2812c67d0740c292f9f9f70c31b542&record_id=' + this.record_id : 'https://gateway.test.lrscft.com/api/zd/download/record/detail?xwappid=eb2812c67d0740c292f9f9f70c31b542&record_id=' + this.record_id;
        this.invoiceRecordInfo.nativeElement.href = address;
    }

    /**
     *  返回
     */
    public onCancel() {
        this.xn.user.navigateBack();
    }
}
