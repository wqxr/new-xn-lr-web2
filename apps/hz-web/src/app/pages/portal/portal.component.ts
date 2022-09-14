/*************************************************************************
 * Copyright (c) 2017 - 2020 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：xn-lr-web\apps\src\app\pages\portal\portal.component.ts
 * @summary：init portal.component.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  zigui             init             2020-11-16
 ***************************************************************************/
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { StoreService } from './shared/services/store.service';

@Component({
  selector: 'portal',
  templateUrl: './portal.component.html',
  styleUrls: ['./portal.component.less'],
})

export class PortalComponent implements OnInit, AfterViewInit {
  currentNav: any = {
    height: 0,
    title: '',
  };
  showBreadcrumb = false;
  contentStyle: any = {};
  style: any = {};
  timer: any = null;
  constructor(public store: StoreService) {}
  // 判断是否是首页
  get isHomePage() {
    return this.currentNav.title === '首页';
  }
  ngOnInit(): void {}
  ngAfterViewInit(): void {
    window.onload = () => {
      const body = document.getElementsByTagName('body')[0];
      window.onresize = () => {
        if (!this.store.isPhone) {
          if (document.documentElement.clientWidth < 1200) {
            body.style['overflow-x'] = ['auto'];
          } else {
            body.style['overflow-x'] = ['hidden'];
          }
        }
      };
    };
  }

  handleNavigation({currentNav, showBreadcrumb}) {
    this.currentNav = currentNav;
    this.showBreadcrumb = showBreadcrumb;
    this.style = {
      'background-image': `url(${this.store.isPhone ? this.currentNav.h5Banner : this.currentNav.banner})`,
      height: this.store.isPhone ? `${this.currentNav.h5Height / 75}rem` : `${this.currentNav.height}px`,
    };
    this.contentStyle = this.showBreadcrumb
      ? {minHeight: 'calc(100vh - (' + 410 + 'px))'}
      : {minHeight: 'calc(100vh - (' + (this.currentNav.height + 300) + 'px))'};
  }
  toTop() {
    if (this.timer) { return false; }
    this.timer = setInterval(() => {
      let top = document.documentElement.scrollTop || document.body.scrollTop;
      top -= 200;
      if (top > 0) {
        window.scrollTo(0, top);
      } else {
        window.scrollTo(0, 0);
        clearInterval(this.timer);
        this.timer = null;
      }
    }, 40);
  }
}
