/*************************************************************************
 * Copyright (c) 2017 - 2020 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：xn-lr-web\apps\src\app\pages\portal\block-chain-browser\layout\layout.component.ts
 * @summary：init layout.component.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  zigui              init             2020-11-11
 ***************************************************************************/
import { Component, OnInit } from '@angular/core';
import { StoreService } from '../../shared/services/store.service';
import { ApiService } from '../../shared/services/api.service';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.less']
})
export class LayoutComponent implements OnInit {
  public searchVal = '';
  private loading: boolean = false;
  constructor(
    private store: StoreService,
    private api: ApiService,
    private router: Router,
    private $message: NzMessageService,
  ) { }
  // 回车键触发
  onEnter() {
    if (this.loading) { return; }
    this.loading = true;
    // 判断搜索的区块链是否存在，存在则跳转查询结果页
    const inputVal = this.searchVal.trim();
    if (inputVal.length) {
      this.api.queryInput({input: inputVal}).subscribe((res: any) => {
        this.loading = false;
        if (res.code === 0) {
          if (Array.isArray(res.data)) {
            this.store.saveData('blockTable', res.data);
            this.router.navigate([`/block-chain-info/index/${inputVal}/info`]).then(() => {});
          } else {
            this.store.saveData('block', res.data);
            this.router.navigate([`/block-chain-info/index/${inputVal}/detail`]).then(() => {});
          }
          this.store.saveData('searchVal', inputVal);
        } else {
          this.$message.error(res.message);
        }
      });
    }
  }
  ngOnInit(): void {
    this.searchVal = this.store.getData('searchVal');
    console.log('router', this.router.url);
  }

}
