/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：zd-record.ts
 * @summary：中登查询关联记录
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                   wangqing           新增         2021-06-21
 * **********************************************************************
 */

import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Column, TableChange } from '@lr/ngx-table';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import ZdRecordConfig from '../../config/zd-record';

@Component({
  templateUrl: `./zd-record-component.html`,
  styles: [`
  .content-header span{
    color: rgba(0,0,0,.85);
    font-weight: 600;
    font-size: 20px;
}
    `,
  ]
})
export class ZhongdengRecordViewComponent implements OnInit {
  public items: any[];
  paging = 1;
  json: any;
  pageSize = 10;
  total = 0;
  first = 0;
  registerNo: '';
  public loading = false;
  public columns: Column[] = ZdRecordConfig.commonConfig.relationRecord; // 表头
  pageConfig = {
    pageIndex: 1,
    pageSize: 10,
    total: 0
  };

  constructor(private router: ActivatedRoute, public xn: XnService, private route: ActivatedRoute) {
    this.items = [];
  }


  ngOnInit() {
    this.router.queryParams.subscribe(v => {
      this.registerNo = v.registerNo;
      this.onPage({ pageIndex: 1, pageSize: 10 });
    });
  }
  /**
 *  查看附件，只读
 * @param con
 */
  public showContract(con) {
    this.xn.loading.open();
    this.xn.api.post('/custom/zhongdeng/zd/attachment_preview', { registerNo: con.registerNo }).subscribe(x => {
      this.xn.loading.close();
      const base64Str = x.data.attachment;
      const blobObj = XnUtils.base64ToBlob(base64Str, 'application/pdf')
      const dataUrl = URL.createObjectURL(blobObj);
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blobObj);
      } else {
        window.open(dataUrl);
      }
    });
  }


  /**
   * @param event  event.page: 新页码 <br> event.pageSize: 页面显示行数<br>event.first: 新页面之前的总行数<br>event.pageCount : 页码总数
   */
  public onPage(e?: { pageIndex: number, pageSize?: number, total?: number }, searchModel?: { [key: string]: any }): void {
    this.paging = e.pageIndex || 1;
    this.pageSize = e.pageSize || this.pageSize;
    this.first = (this.paging - 1) * this.pageSize;
    this.loading = true;
    this.onUrlData();
    this.xn.api.post('/custom/zhongdeng/zd/associate_records', {
      pageNo: this.paging,
      pageSize: this.pageConfig.pageSize,
      registerNo: this.registerNo
    }).subscribe(json => {
      if (json.data && json.data.list) {
        this.loading = false;
        this.items = json.data.list;
      }
      this.pageConfig.total = json.data.total;
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
