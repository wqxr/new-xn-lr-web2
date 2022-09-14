/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：zd-record.ts
 * @summary：发票批量查询记录表
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 wq                  新增         2021-06-17
 * **********************************************************************
 */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import ZdRecordConfig from '../config/zd-record';
import { Column, TableChange } from '@lr/ngx-table';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { EnterZdType } from 'libs/shared/src/lib/config/enum/common-enum';


@Component({
    templateUrl: `./invoce-Search-component.html`,
    styles: [`
    .content-header span{
        color: rgba(0,0,0,.85);
        font-weight: 600;
        font-size: 20px;
    }
    p{
        line-height:20px;
        font-size: 14px;
        color: #707880;
        margin-top:10px;
    }
    .content-header p a{
        color:#626A73;
        font-weight: 400;
        font-size: 14px;
    }
    .btn-primary{
        background-color:#1D67C7;
        width:70px;
        height:34px;
    }
    ::ng-deep .ant-xn-basicLayout-content{
        margin:0px;
    }
    `,
    ]
})
export class InvoceSearchRecordComponent implements OnInit {
    public items: any[];
    paging = 1;
    json: any;
    pageSize = 10;
    total = 0;
    first = 0;
    public loading = false;
    public enterUrl = [{
        label: '中登查询',
        url: '/console/manage/invoice-search/main/list',
        records: EnterZdType.ZD_SEARCH,
    },
    {
        label: '更新中登数据',
        url: '/console/manage/invoice-search/update-zd',
        records: EnterZdType.ZD_UPDATE,
    }
    ];

    public columns: Column[] = ZdRecordConfig.commonConfig.heads; // 表头
    pageConfig = {
        pageIndex: 1,
        pageSize: 10,
        total: 0
    };

    constructor(private router: ActivatedRoute, public xn: XnService, private route: ActivatedRoute) {
        this.items = [];
    }


    ngOnInit() {
        this.router.queryParams.subscribe(y => {
            if (y.records) {
                this.enterUrl = this.enterUrl.filter(x => x.records === Number(y.records));
            }
            this.onPage({ pageIndex: 1, pageSize: 10 });
        });
    }

    /**
     *  查看记录详情
     * @param paramCurrentInfo
     */
    public checkDetailInfo(paramCurrentInfo: any) {
        this.xn.router.navigate([`console/manage/invoice-search/record/single`], {
            queryParams: { record_id: paramCurrentInfo.id, records: this.enterUrl[0].records }
        });

    }

    /**
     * @param event  event.page: 新页码 <br> event.pageSize: 页面显示行数<br>event.first: 新页面之前的总行数<br>event.pageCount : 页码总数
     */
    public onPage(e?: { pageIndex: number, pageSize?: number, total?: number }, searchModel?: { [key: string]: any }): void {
        this.paging = e.pageIndex || 1;
        this.pageSize = e.pageSize || this.pageSize;
        this.first = (this.paging - 1) * this.pageSize;
        this.columns = ZdRecordConfig.commonConfig.heads;
        this.onUrlData();
        this.loading = true;
        this.xn.api.post('/custom/zhongdeng/invoice/get_invoicerecord', {
            page: this.paging,
            size: this.pageSize
        }).subscribe(json => {
            if (json.data.errcode !== 0) {
                this.loading = false;
                this.xn.msgBox.open(true, json.data.errmsg);
            } else {
                this.items = json.data.record_list;
                this.total = json.data.total;
                this.pageConfig.total = json.data.total;
                this.loading = false;
            }
        });
    }
    /**
* table事件处理
* @param e 分页参数
* @param searchForm 搜索项
*/
    handleTableChange(e: TableChange) {
        console.log('handleTableChange',);
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
    public comeBack() {
        this.xn.user.navigateBack();
    }

    // 回退操作
    private onUrlData(data?) {
        const urlData = this.xn.user.getUrlData(this.xn.router.url);
        if (urlData && urlData.pop) {
            this.paging = urlData.data.paging || this.paging;
            this.pageSize = urlData.data.pageSize || this.pageSize;
            this.first = urlData.data.first || this.first;
        } else {
            this.xn.user.setUrlData(this.xn.router.url, {
                pageSize: this.pageSize,
                paging: this.paging,
                first: this.first,
            });
        }
    }
}
