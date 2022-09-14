/*************************************************************************
 * Copyright (c) 2017 - 2020 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：xn-lr-web\apps\src\app\pages\portal\block-chain-browser\info\info.component.ts
 * @summary：init info.component.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  zigui              init             2020-11-11
 ***************************************************************************/
import { Component, OnInit } from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import { StoreService } from '../../shared/services/store.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ApiService } from '../../shared/services/api.service';
@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.less']
})
export class InfoComponent implements OnInit {
  public tableData: any[] = [];
  public accessId = '';
  pageNum = 1;
  constructor(private router: Router, private store: StoreService, private $message: NzMessageService, private api: ApiService,) { }
  public toDetail(row, index) {
    const path = `/block-chain-info/index/${this.accessId}/info/detail`;
    this.api.queryDetail({ hash: row.hash}).subscribe((res: any) => {
      if (res.code === 0 && res.data) {
        this.store.saveData('block', res.data);
        this.router.navigate([path]).then(() => {});
      } else {
        this.$message.error(res.message);
      }
    });
  }
  get tableDataPage() {
    if (this.tableData && this.tableData.length) {
      return this.tableData.slice((this.pageNum - 1) * 10, this.pageNum * 10);
    } else {
      return [];
    }
  }
  pageChange(e) {
    this.pageNum = e;
  }
  ngOnInit(): void {
    this.tableData = this.store.getData('blockTable', true);
    this.accessId = this.store.getData('searchVal');
    this.router.events.subscribe((data: any) => {
      if (data instanceof NavigationEnd) {
        this.tableData = this.store.getData('blockTable', true);
        this.accessId = this.store.getData('searchVal');
      }
    });
  }
}
