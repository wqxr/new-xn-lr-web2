/*************************************************************************
 * Copyright (c) 2017 - 2020 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：xn-lr-web\apps\src\app\pages\portal\block-chain-browser\block-chain-browser.component.ts
 * @summary：init block-chain-browser.component.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  zigui              init             2020-11-11
 ***************************************************************************/
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../shared/http';
import { StoreService } from '../shared/services/store.service';
import { ApiService } from '../shared/services/api.service';
import { NzMessageService } from 'ng-zorro-antd/message';
@Component({
  selector: 'app-block-chain-browser',
  templateUrl: './block-chain-browser.component.html',
  styleUrls: ['./block-chain-browser.component.less']
})
export class BlockChainBrowserComponent implements OnInit, OnDestroy {
  public tableData: any[] = [];
  public searchVal = '';
  appType = 'wanke';
  appList = [
    {
      label: '保理通',
      value: 'wanke',
    },
    {
      label: '保函通',
      value: 'guarantee',
    }
  ];
  currentApp: {
    label: '保理通',
    value: 'wanke',
  };
  placeholder: '基础资产ID/审批流ID/Hash'
  timer: any = null;
  // 统计
  public statistics: any = {
    blockHeight: 0,   // 区块高度
    nodes: 0,  // 节点数量
    evCount: 0,  // 存在数量
  };
  private loading: boolean = false;
  constructor(
    private router: Router,
    private http: HttpService,
    private store: StoreService,
    private api: ApiService,
    private $message: NzMessageService) {}

  // 回车键触发
  public onEnter() {
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
  getData() {
    this.api.getStatistics({}).subscribe((res) => {
      if (res.code === 0 && res.data) {
        this.statistics = res.data;
      } else {
        this.$message.error(res.message);
      }
    });
    this.api.getRecentList({}).subscribe((res) => {
      if (res.code === 0 && res.data && Array.isArray(res.data)) {
        this.tableData = res.data.reverse();
      } else {
        this.tableData = []
      }
    });
  }
  onSelect(app) {
    if (app !== this.store.getData('businessType')) {
      this.searchVal = ''
    }
    this.store.saveData('businessType', app);
    this.getData();
  }
  ngOnInit(): void {
    if (this.store.getData('businessType')) {
      this.appType = this.store.getData('businessType');
    } else {
      this.store.saveData('businessType', 'wanke');
    }
    this.getData();
    if (!this.timer) {
      this.timer = window.setInterval(() => {
        this.getData();
      }, 30000);
    }
  }
  ngOnDestroy(): void {
    clearInterval(this.timer);
  }
}
