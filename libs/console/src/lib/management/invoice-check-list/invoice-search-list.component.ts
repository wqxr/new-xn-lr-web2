/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：invoice-search-list.component.ts
 * @summary：发票批量查询记录表
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                  zigui                             2021-01-12
 * **********************************************************************
 */

import { Component, OnInit } from '@angular/core';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: `./invoice-search-list.component.html`,
  styles: [`
        table {
            border: 1px solid #ddd !important
        }

        th {
            border-color: #d2d6de !important;
            border-bottom-width: 1px !important;

        }

        td {
            padding: 6px;
            border-color: #d2d6de !important;
            font-size: 12px !important;
        }

        tr th, tr td {
            vertical-align: middle !important;
        }
    `,
  ]
})
export class InvoiceSearchListComponent implements OnInit {
  list: any[] = [];
  paging = 1;
  json: any;
  pageSize = 10;
  total = 0;
  first = 0;
  pageConfig = {
    pageSize: 10,
    first: 0,
    total: 0,
  };
  statusMap = {
    0: '未完成',
    1: '已完成',
    2: '查验中',
  };

  constructor(public xn: XnService, private route: ActivatedRoute) {}


  ngOnInit() {
    this.onPage({page: this.paging});
  }


  checkDetailInfo(item: any) {
    this.xn.router.navigate([`/console/manage/invoice-check-list/search/detail`], {
      queryParams: { ...item }
    });
  }

  onPage(event: any): void {
    this.paging = event.page || 1;
    this.pageSize = event.pageSize || this.pageSize;
    this.first = (this.paging - 1) * this.pageSize;
    this.onUrlData();
    this.xn.dragon.post('/invoice/list_task', {pageNo: this.paging, pageSize: this.pageSize})
      .subscribe(res => {
        if (res?.data?.data?.length) {
          this.total = res.data.count;
          this.list = res.data.data;
        }
      });
  }


  public onCancel() {
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
