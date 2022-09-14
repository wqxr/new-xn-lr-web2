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
import { Component, Output, EventEmitter, AfterViewInit, OnInit, ViewChild, Input } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute  } from '@angular/router';
import { StoreService } from '../shared/services/store.service';
import { XnUtils } from '../shared/utils';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { NzMessageService } from 'ng-zorro-antd/message';
@Component({
  selector: 'portal-nav',
  template: `
    <nav [ngClass]="{'isFixed': isFixed}" #nav *ngIf="!store.isPhone">
      <div class="portal-panel">
        <div class="nav">
          <img class="logo" [src]="navLogo" alt="链融科技" (click)="navToHome()" title="回到首页"/>
          <ul nz-menu nzMode="horizontal">
            <ng-container *ngFor="let item of navList">
              <li *ngIf="!item.children" nz-menu-item nzMatchRouter class="menu">
                <a [routerLink]="['/', 'portal', item.path]">
                  {{item.title}}
                </a>
              </li>
              <li *ngIf="item.children && item.children?.length > 0"
              nz-menu-item
              nzMatchRouter
              class="menu">
                <a nz-dropdown [routerLink]="['/', 'portal', item.path]" [nzDropdownMenu]="menuTpl">
                  {{item.title}}
                  <!-- <i nz-icon nzType="down"></i> -->
                </a>
                <nz-dropdown-menu #menuTpl="nzDropdownMenu">
                  <ul nz-menu class="dropdown">
                    <ng-container *ngFor="let childNav of item.children">
                      <li class="dropdown-li"
                      nz-menu-item
                      *ngIf="!childNav.children">
                        <span (click)="handleNavToProduct(item, childNav)">{{childNav.title}}</span>
                      </li>
                      <li class="dropdown-li-submenu"
                      nz-submenu
                      *ngIf="childNav.children && childNav.children?.length > 0"
                      [nzTitle]="childNav.title"
                      (click)="handleNavigation(item, childNav)"
                      >
                        <ul>
                          <li class="dropdown-submenu-li"
                          nz-menu-item
                          *ngFor="let grantChildNav of childNav.children">
                            <span (click)="handleNavToProduct(item, grantChildNav)">{{grantChildNav.title}}</span>
                          </li>
                        </ul>
                      </li>
                    </ng-container>
                  </ul>
                </nz-dropdown-menu>
              </li>
            </ng-container>
          </ul>

          <div class="button-group" *ngIf="!logined">
            <button nz-button (click)="onLogin()">登录</button>
            <button nz-button (click)="onRegistry()">注册</button>
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
    <nav #h5nav *ngIf="store.isPhone && !isScrollDown" [ngClass]="{'isFixed': isFixed}" [ngStyle]="{'width':isHomePage?'50%':'100%'}">
      <div class="h5-portal-panel">
        <div class="h5-nav">
          <img (click)="onShowMenu()" [src]="menuIcon" alt="菜单">
          <img [src]="navLogo" (click)="navToHome()" alt="链融科技">
        </div>
      </div>
    </nav>
    <div class="mask" #mask>
      <div [ngClass]="['h5-menu']">
        <span>
            <img (click)="onCloseMenu()" src="assets/images/icon/close.png" alt="">
        </span>
        <div *ngFor="let nav of navList;">
          <a (click)="onCloseMenu()" *ngIf="nav.title !== '帮助中心'"
          [ngClass]="['nav-item', currentNav.title === nav.title || isActive(nav) ? 'active' : '']"
          [routerLink]="['/portal/' + nav.path]">
            {{nav.title}}
          </a>
          <div *ngFor="let navChild of nav.children;">
            <a (click)="handleNavToProduct(nav, navChild);onCloseMenu()"
            [ngClass]="['nav-item', 'nav-child-item' ,[currentNav.title, currentNav.redirect].includes(navChild.title) ? 'nav-child-active' : '']"
            ><span></span>{{navChild.title}}</a>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./styles.less'],
})

export class PortalNavComponents implements OnInit, AfterViewInit{
  @Output() navigation: any = new EventEmitter();
  @ViewChild('mask') mask: any;
  currentNav: any = { title: '' };
  isFixed = false;
  navList: any[] = [
    {
      path: 'home',
      title: '首页',
      banner: [
        'assets/images/banner/banner-homepage.png',
        'assets/images/banner/banner-homepage1.png',
        'assets/images/banner/banner-baohan.png',
        'assets/images/banner/banner-runmiaotie.png',
      ],
      h5Banner: [
        'assets/images/banner/banner-homepage-h5.png',
        'assets/images/banner/banner-miniprogram-h5.png',
        'assets/images/banner/banner-baohan-h5.png',
        'assets/images/banner/banner-runmiaotie-h5.png',
      ],
      desc: '链融科技',
      height: 670,
      h5Height: 240,
    },
    {
      path: 'product',
      title: '平台产品',
      banner: 'assets/images/banner/banner-product.png',
      h5Banner: 'assets/images/banner/banner-product-h5.png',
      desc: '平台产品',
      height: 300,
      redirect: '平台产品',
      h5Height: 200,
      children: [
        {
          path: '/portal/product',
          title: '普惠通',
          queryParams: { hash: 'pht' },
          banner: 'assets/images/banner/banner-product.png',
          h5Banner: 'assets/images/banner/banner-product-h5.png',
          desc: '',
          height: 300,
          h5Height: 200,
          disabled: true,
          newWindow: false
        },
        {
          path: '/portal/product',
          title: '证券通',
          queryParams: { hash: 'zqt' },
          banner: 'assets/images/banner/banner-product.png',
          h5Banner: 'assets/images/banner/banner-product-h5.png',
          desc: '',
          height: 300,
          h5Height: 200,
          disabled: true,
          newWindow: false
        },
        {
          path: '/portal/product',
          title: '保理通',
          queryParams: { hash: 'blt' },
          banner: 'assets/images/banner/banner-product.png',
          h5Banner: 'assets/images/banner/banner-product-h5.png',
          desc: '',
          height: 300,
          h5Height: 200,
          disabled: true,
          newWindow: false
        },
        {
          path: '/portal/product',
          title: '保函通',
          queryParams: { hash: 'bht' },
          banner: 'assets/images/banner/banner-product.png',
          h5Banner: 'assets/images/banner/banner-product-h5.png',
          desc: '',
          height: 300,
          h5Height: 200,
          disabled: false,
          newWindow: false
        },
        {
          path: '/portal/product',
          title: '票据通',
          queryParams: { hash: 'pjt' },
          banner: 'assets/images/banner/banner-product.png',
          h5Banner: 'assets/images/banner/banner-product-h5.png',
          desc: '',
          height: 300,
          h5Height: 200,
          disabled: false,
          newWindow: false
        },
      ],
    },
    {
      path: 'technology',
      title: '技术服务',
      banner: 'assets/images/banner/banner-technology.png',
      h5Banner: 'assets/images/banner/banner-technology-h5.png',
      desc: '',
      height: 300,
      h5Height: 200,
      children: [
        {
          path: '/portal/technology',
          title: '技术体系',
          queryParams: { hash: 'system' },
          banner: 'assets/images/banner/banner-technology.png',
          h5Banner: 'assets/images/banner/banner-technology-h5.png',
          desc: '',
          height: 300,
          h5Height: 200,
          newWindow: false
        },
        {
          path: '/portal/technology',
          queryParams: { hash: 'service' },
          title: '服务方案',
          banner: 'assets/images/banner/banner-technology.png',
          h5Banner: 'assets/images/banner/banner-technology-h5.png',
          desc: '金融科技私有化服务方案',
          height: 300,
          h5Height: 200,
          newWindow: false
        },
      ],
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
  get navLogo() {
    return `assets/images/bg/logo-${this.isFixed ? 'black' : 'white'}.png`;
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
  ) {}
  ngOnInit(): void{
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
      const productIdent = Object.keys(menuRoot).length === 0 || menuRoot.subMenuItem.length === 0 ?
      '' : menuRoot.subMenuItem[0].subMenuItem[0].productIdent;
      if (!homeUrl) {
        homeUrl = menuRoot.subMenuItem[0].subMenuItem[0].subMenuItem[0].url;
      }
      if(productIdent) {
        this.enterPath = `${homeUrl}/${productIdent}`;
      } else {
        this.enterPath = homeUrl;
      }

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
  ngAfterViewInit(): void{
    // 滚动事件
    let currentTop = document.documentElement.scrollTop  || document.body.scrollTop;
    XnUtils.addEvent(window, 'scroll', (e) => {
      const scrollTop = document.documentElement.scrollTop  || document.body.scrollTop;
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
        } else if (path.length === 4){
          temp.forEach(c => {
            if (c.path === path[3]) {
              this.currentNav = c;
            }
          });
        }
      }
      this.showBreadcrumb = data.url.indexOf('/portal/news/detail') !== -1;
      this.isFixed = data.url.indexOf('/portal/news/detail') !== -1;
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
  handleNavigation(item: any, nav: any) {
    this.router.navigate([`${nav.path}`]).then(() => {
      this.currentNav = nav;
      this.handleEmit();
    });
  }

  handleNavToProduct(item: any, nav: any) {
    if(!nav.path) {
      console.log('This feature is not implemented');
      return
    }
    if(nav.newWindow){
      window.open(`${window.location.origin}${nav.path}`, '_blank');
    } else {
      this.router.navigate([`${nav.path}`],{
        queryParams: nav?.queryParams ? nav.queryParams : undefined
       }
      ).then(()=>{
          this.currentNav.title = item.title;
          this.handleEmit();
        });
    }
  }

  handleEmit() {
    this.navigation.emit({currentNav: this.currentNav, showBreadcrumb: this.showBreadcrumb});
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
