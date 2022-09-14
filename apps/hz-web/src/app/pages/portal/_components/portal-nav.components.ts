/*************************************************************************
 * Copyright (c) 2017 - 2020 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：xn-lr-web\apps\src\app\pages\portal\_components\portal-nav.components.ts
 * @summary：init portal-nav.components.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  zigui             init             2020-11-17
 ***************************************************************************/
import { Component, Output, EventEmitter, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { StoreService } from '../shared/services/store.service';
import { XnUtils } from '../shared/utils';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { NzMessageService } from 'ng-zorro-antd/message';
@Component({
  selector: 'portal-nav',
  template: `
    <nav [ngClass]="{'isFixed': isFixed}" #nav>
      <div class="portal-panel">
        <div class="nav">
          <img class="logo" [src]="navLrLogo" alt="链融科技" />
          <nz-divider [ngStyle]="{'backgroundColor': isFixed?'#f0f0f0':'#52538a'}" style="height: 20px;
           width: 2px;margin: 0 20px;" nzType="vertical"></nz-divider>
          <img class="logo" [src]="navHzLogo" alt="恒泽商业保理" />
          
          <div class="button-group" *ngIf="!logined">
            <button style="height: 28px;padding: 2px 15px;" nz-button (click)="onLogin()">登录</button>
            <button style="height: 28px;padding: 2px 15px;" nz-button (click)="onRegistry()">注册</button>
          </div>
          <div class="user-info" *ngIf="logined">
            <img class="user-icon" [src]="userIcon" alt="">
            <span>{{xn.user.userName}}</span>
            <img class="arrow-icon" [src]="arrowIcon" alt="">
            <div class="user-info-dropdown">
              <a [routerLink]="enterPath">进入控制台</a>
              <a (click)="onLogout(1)">退出登录</a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  `,
  styleUrls: ['./styles.less'],
})

export class PortalNavComponents implements OnInit, AfterViewInit {
  @Output() navigation: any = new EventEmitter();
  @ViewChild('mask') mask: any;
  currentNav: any = { title: '' };
  isFixed = false;
  navList: any[] = [
    {
      path: 'home',
      title: '首页',
      banner: 'assets/images/banner/banner-homepage.png',
      h5Banner: 'assets/images/banner/banner-homepage-h5.png',
      desc: '链融科技',
      height: 670,
      h5Height: 240,
    },
    {
      path: 'product',
      title: '产品服务',
      banner: 'assets/images/banner/banner-product.png',
      h5Banner: 'assets/images/banner/banner-product-h5.png',
      desc: '产品体系',
      height: 300,
      redirect: '产品体系',
      h5Height: 200,
      children: [
        {
          path: 'system',
          title: '产品体系',
          banner: 'assets/images/banner/banner-product.png',
          h5Banner: 'assets/images/banner/banner-product-h5.png',
          desc: '',
          height: 300,
          h5Height: 200,
        },
        {
          path: 'solution',
          title: '解决方案',
          banner: 'assets/images/banner/banner-product.png',
          h5Banner: 'assets/images/banner/banner-product-h5.png',
          desc: '金融科技私有化解决方案',
          height: 300,
          h5Height: 200,
        },
      ],
    },
    {
      path: 'technology',
      title: '技术体系',
      banner: 'assets/images/banner/banner-technology.png',
      h5Banner: 'assets/images/banner/banner-technology-h5.png',
      desc: '',
      height: 300,
      h5Height: 200,
    },
    {
      path: 'news',
      title: '新闻中心',
      banner: 'assets/images/banner/banner-news.png',
      h5Banner: 'assets/images/banner/banner-news-h5.png',
      desc: '',
      height: 300,
      h5Height: 200,
    },
    {
      path: 'about',
      title: '关于我们',
      banner: 'assets/images/banner/banner-about.png',
      h5Banner: 'assets/images/banner/banner-about-h5.png',
      desc: '',
      height: 300,
      h5Height: 200,
    },
    {
      path: 'help',
      title: '帮助中心',
      banner: 'assets/images/banner/banner-help.png',
      h5Banner: 'assets/images/banner/banner-help-h5.png',
      desc: '',
      height: 300,
      h5Height: 200,
    },
  ];
  showBreadcrumb = false;
  logined = false;
  isScrollDown = false;
  scrollTimer = null;
  // timer = null;
  enterPath = '/home/sys-messages';
  // 导航logo
  get navLrLogo() {
    return `assets/images/bg/logo-${this.isFixed ? 'black' : 'white'}.png`;
  }
  get navHzLogo() {
    return `assets/images/bg/logo-${this.isFixed ? 'blue' : 'white'}-hz.png`;
  }
  get menuIcon() {
    return `assets/images/icon/menu-${this.isFixed ? 'black' : 'white'}.png`;
  }
  get userIcon() {
    return `assets/images/icon/user-${this.isFixed ? 'black' : 'white'}.png`;
  }
  get arrowIcon() {
    return `assets/images/icon/arrow-down-${this.isFixed ? 'black' : 'white'}.png`;
  }
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public store: StoreService,
    private xn: XnService,
    private $message: NzMessageService,
  ) { }
  ngOnInit(): void {
    if (!this.store.isPhone) {
      this.route.url.subscribe(v => {
        this.xn.user.checkLogin().subscribe(logined => {
          this.logined = logined;
          this.store.saveData('isLogin', logined);
          if (!logined) {
            this.store.saveData('isLogin', false);
            this.xn.user.logout(false);
          }
        });
      });
      const res = this.xn.user.roles.filter((item, index, array) => {
        return !(item === undefined || item === null || item === '');
      });
      if (this.xn.user.isNewAgile) {
        this.enterPath = '/home/sys-messages';
      } else if (this.xn.user.orgType === 3 && res.length === 1 && res[0] === 'checkerLimit') {
        this.enterPath = '/console/main-list/list';
      }
      // 有菜单配置 默认进入菜单配置的第一个菜单
      const menuRoot = this.xn.user.menus || {};
      let homeUrl = Object.keys(menuRoot).length === 0 || menuRoot.subMenuItem.length === 0 ?
        '/home/sys-messages' : menuRoot.subMenuItem[0].subMenuItem[0].url;
      if (!homeUrl) {
        homeUrl = menuRoot.subMenuItem[0].subMenuItem[0].subMenuItem[0].url;
      }
      this.enterPath = homeUrl;
    }
    // 首次进入页面，设置导航样式
    const { url } = this.router;
    this.setNavType({ url });
    // 路由变化时，设置导航样式
    this.router.events.subscribe((data: any) => {
      if (data instanceof NavigationEnd) {
        if (!/#/.test(data.url)) {
          this.setNavType(data);
        }
      }
    });
  }
  ngAfterViewInit(): void {
    // 滚动事件
    let currentTop = document.documentElement.scrollTop || document.body.scrollTop;
    XnUtils.addEvent(window, 'scroll', (e) => {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      clearTimeout(this.scrollTimer);
      this.scrollTimer = setTimeout(() => {
        this.isScrollDown = false;
      }, 3000);
      if (this.store.isPhone) {
        // 移动端向下滑动时隐藏导航菜单
        if (scrollTop > currentTop && scrollTop > 50) {
          this.isScrollDown = true;
        } else {
          this.isScrollDown = false;
        }
      }
      currentTop = scrollTop;
      this.isFixed = scrollTop > 60 && !this.showBreadcrumb || this.showBreadcrumb;
    });
  }
  // 退出登录
  onLogout(type?: number) {
    this.logined = false;
    if (type) {
      this.xn.api.post('/user/logout', {}).subscribe(() => {
        this.$message.success('您已成功退出登录!');
        this.router.navigate(['/login']).then();
      });
    }
    this.xn.user.logoutNoRedirect();
  }
  // 设置导航样式，是否fixed
  setNavType(data) {
    if (!['/login', '/registry'].includes(data.url)) {
      this.navList.forEach(c => {
        const re1 = new RegExp(`/portal/${c.path}`, 'g');
        if (re1.test(data.url)) {
          this.currentNav = c;
        }
      });
      if (this.currentNav?.children?.length) {
        const temp = JSON.parse(JSON.stringify(this.currentNav.children));
        const path = data.url.split('/');
        if (path.length === 3) {
          this.currentNav = temp[0];
        } else if (path.length === 4) {
          temp.forEach(c => {
            if (c.path === path[3]) {
              this.currentNav = c;
            }
          });
        }
      }
      const newsRe = new RegExp(`/portal/news/detail`, 'g');
      this.showBreadcrumb = newsRe.test(data.url);
      this.isFixed = newsRe.test(data.url);
      this.handleEmit();
    } else {
      this.logined = false;
    }
  }
  isActive(nav) {
    if (nav.children && nav.children.length) {
      return nav.children.some(c => c.title === this.currentNav.title);
    } else {
      return false;
    }
  }
  handleNavigation(item, nav) {
    this.router.navigate([`/portal/${item.path}/${nav.path}`]).then(() => {
      this.currentNav = nav;
      this.handleEmit();
    });
  }

  handleEmit() {
    this.navigation.emit({ currentNav: this.currentNav, showBreadcrumb: this.showBreadcrumb });
  }
  // 移动端打开菜单
  onShowMenu() {
    this.mask.nativeElement.style.display = 'block';
    this.mask.nativeElement.ontouchmove = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };
  }
  // 移动端关闭菜单
  onCloseMenu() {
    this.mask.nativeElement.style.display = 'none';
    this.mask.nativeElement.ontouchmove = null;
  }
  // 注册
  onRegistry() {
    this.router.navigate(['/registry']);
  }

  // 登入
  onLogin() {
    this.router.navigate(['/login']);
  }
  // logo回到首页
  navToHome() {
    this.router.navigate(['/portal/home']);
  }


}
