/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：invoce-single-info-component.ts
 * @summary：发票查验结果详情
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                  zigui               新增           2021-01-13
 * **********************************************************************
 */

import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  templateUrl: `./invoice-search-detail.component.html`,
  styles: [`.fr {
        float: right !important
    }

    .frdiv {
        clear: both;
        margin-top: 60px;
    }
    `]
})
export class InvoiceSearchDetailComponent implements OnInit {
  @ViewChild('invoiceRecord') invoiceRecordInfo: ElementRef;
  public items: any;
  taskId = null;
  paging = 1;
  list: any[] = [];
  info: any = {};
  pageSize = 10;
  total = 0;
  first = 0;
  tableTitle = '';
  pageConfig = {
    pageSize: 10,
    first: 0,
    total: 0,
  };
  statusMap = {
    0: '未完成',
    1: '已完成',
    2: '查验中'
  };
  finishStatus = {
    0: '未完成',
    1: '已完成',
  };
  constructor(public xn: XnService,
              private route: ActivatedRoute) {
  }


  ngOnInit() {
    this.route.queryParams.subscribe(x => {
      this.info = x;
    });
    this.onPage({ page: this.paging });
  }

  public onPage(event: any): void {
    this.paging = event.page || 1;
    this.pageSize = event.pageSize || this.pageSize;
    this.first = (this.paging - 1) * this.pageSize;
    this.xn.dragon.post('/invoice/list_detail', {
      pageNo: this.paging,
      pageSize: this.pageSize,
      taskId: this.info?.id,
    }).subscribe(res => {
      if (res?.data?.data?.length) {
        this.list = res.data.data;
        this.total = res.data.count;
      }
      console.log('res', res);
    });
  }

  /**
   * 下载记录详情
   */
  public onload_invoice() {
    // const address = this.xn.user.env === 'production' ? 'https://gateway.lrscft.com/api/zd/download/record/detail?xwappid=eb2812c67d0740c292f9f9f70c31b542&record_id=' + this.record_id : 'https://gateway.test.lrscft.com/api/zd/download/record/detail?xwappid=eb2812c67d0740c292f9f9f70c31b542&record_id=' + this.record_id;
    // this.invoiceRecordInfo.nativeElement.href = address;
  }

  /**
   *  返回
   */
  public onCancel() {
    this.xn.user.navigateBack();
  }
}
