/*************************************************************************
 * Copyright (c) 2017 - 2020 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：xn-lr-web\apps\src\app\pages\portal\help\help.component.ts
 * @summary：init help.component.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  zigui             init             2020-11-19
 ***************************************************************************/
import {Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.less']
})
export class HelpComponent implements OnInit {
  tabList: any[] = [
    {
      id: 1,
      name: '注册指引',
    },
    {
      id: 2,
      name: '常见问题',
    },
  ];
  currentTab: any =  {
    id: 1,
    name: '注册指引',
  };
  constructor(private route: ActivatedRoute) {}
  ngOnInit() {
    this.route.queryParams.subscribe(data => {
      if (data?.tab) {
        this.currentTab = this.tabList[data.tab - 1];
      }
    });
  }
  onSelectChange(tab) {
    if (this.currentTab === tab) {
      return;
    }
    const url = window.location.href;
    if (/#/.test(url)) {
      const handleUrl = url.split('#')[0];
      window.history.pushState({}, '', handleUrl);
    }
    this.currentTab = tab;
  }
}
