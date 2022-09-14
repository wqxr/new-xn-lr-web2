/*************************************************************************
 * Copyright (c) 2017 - 2020 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：xn-lr-web\apps\src\app\pages\portal\news\news.component.ts
 * @summary：init news.component.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  zigui             init             2020-11-18
 ***************************************************************************/
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { StoreService } from '../shared/services/store.service';
import { XnUtils } from '../shared/utils';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.less'],
})
export class NewsComponent implements OnInit, AfterViewInit, OnDestroy {
  spinning: boolean = false;
  page: any = {
    num: 1,
    size: this.store.isPhone ? 5 : 10,
    total: 0,
  };
  tabIndex: number = 0; // 当前激活 tab 面板
  newsList: any[] = [];
  tabList: any[] = [
    {
      id: '111',
      name: '公司新闻',
    },
    // {
    //   id: '113',
    //   name: '行业动态',
    // },
    {
      id: '114',
      name: '监管政策',
    },
  ];
  columnId: string =  '111';
  constructor(public store: StoreService, private router: Router, private xn: XnService) {}
  onView(news: any) {
    this.router
      .navigate(['/portal/news/detail', news.id])
      .then(() => {});
  }
  ngOnInit(): void {}
  ngAfterViewInit(): void {
    this.getList();
    if (this.store.isPhone) {
      const doc = document.documentElement;
      const body = document.body;
      const target = doc || body;
      const box = document.getElementById('portal-inner-box');
      let [startX, startY, moveX, moveY, endX, endY] = [0, 0, 0, 0, 0, 0];
      XnUtils.addEvent(window, 'scroll', () => {
        const clientHeight = doc.clientHeight || body.clientHeight;
        const scrollHeight = doc.scrollHeight || body.scrollHeight;
        const scrollTop = doc.scrollTop || body.scrollTop;
        target.ontouchstart = (s) => {
          const startTouch = s.touches[0];
          startX = startTouch.pageX;
          startY = startTouch.pageY;
          endX = 0;
          endY = 0;
        };
        target.ontouchmove = (m) => {
          const moveTouch = m.touches[0];
          moveX = moveTouch.pageX;
          moveY = moveTouch.pageY;
          endX = moveX - startX;
          endY = moveY - startY;
          if (scrollTop + clientHeight + 2 >= scrollHeight && Math.abs(endX) < Math.abs(endY)) {
            if (endY < -30) {
              box.style.transform = `translateY(${endY / 75}rem)`;
            } else {}
          }
        };
        target.ontouchend = (e) => {
          box.style.transform = `translateY(0rem)`;
          if (endY < -30 && scrollTop + clientHeight + 2 >= scrollHeight && this.page.total > this.newsList.length && !this.spinning) {
            this.page.num ++;
            this.getList(true, scrollHeight);
          }
        };
      });
    }
  }
  ngOnDestroy(): void {
    XnUtils.removeEvent(window, 'scroll', () => {
      const doc = document.documentElement;
      const body = document.body;
      const target = doc || body;
      target.ontouchstart = null;
      target.ontouchmove = null;
      target.ontouchend = null;
    });
  }
  // 获取新闻数据
  getList(isScroll = false, y = 0) {
    if (!this.store.isPhone) { window.scrollTo(0, 0); }
    this.spinning = true;
    const start = this.page.size * (this.page.num - 1);
    try {
      this.xn.api
        .post('/portalsite/detail_list', {
          columnId: [this.columnId],
          length: this.page.size,
          start,
        })
        .subscribe((res: any) => {
          setTimeout(() => {
            this.spinning = false;
          }, 4000);
          if (this.store.isPhone) {
            this.newsList = this.newsList.concat(res.data ? res.data.data : []);
          } else {
            this.newsList = res.data ? res.data.data : [];
          }
          this.page.total = res.data.recordsTotal;
          this.spinning = false;
          if (isScroll) { window.scrollTo(0, y); }
        });
    } catch (e) {
      this.spinning = false;
    }
  }
  // tab切换
  onSelectChange(tab) {
    if (this.columnId === tab.id) { return; }
    if (this.store.isPhone) { window.scrollTo(0, 0); }
    this.page.num = 1;
    this.page.total = 0;
    this.columnId = tab.id;
    this.newsList = [];
    this.getList();
  }
  // 页码变化
  pageChange(e) {
    this.page.num = e;
    this.getList();
  }
}
