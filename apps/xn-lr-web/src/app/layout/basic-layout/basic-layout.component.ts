/*************************************************************************
 * Copyright (c) 2017 - 2020 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：xn-lr-web\apps\src\app\layout\basic-layout\basic-layout.component.ts
 * @summary：init basic-layout.component.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  WuShenghui        init             2020-11-11
 ***************************************************************************/
 import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { Settings, SettingsService } from '@lr/ngx-layout';
import { WatermarkService } from '@lr/ngx-shared';
import { ActivatedRoute } from '@angular/router';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { PublicCommunicateService } from 'libs/shared/src/lib/services/public-communicate.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-basic-layout',
  templateUrl: 'basic-layout.component.html',
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  host: {
    '[class.colorweak]': 'settings.colorWeak',
  },
  styles: [`
  .ant-xn-sider-menu-logo i {
    display: inline-block;
    vertical-align: middle;
    margin-left: 4px;
    font-size: 105px;
    margin-top: -26px;
  }
  .ant-xn-basicLayout-content {
    margin:0px;
    width: auto !important;
  }
`],
})
export class BasicLayoutComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('linkIconTemplate', { static: true })
  linkIconTemplate!: TemplateRef<void>;

  settings!: Settings;

  menuData = [];
  menus = [];
  todoCount: any = {};
  showTodo = false;
  todoDraw: any = {};
  count_sysMsg: any;
  loginUrl = ['/login'];
  currentUrl: string;
  showRegister = false;
  showProcess = false;
  showMenu = false;
  factorViewPermission = true;
  homeUrl = '/home/sys-messages';
  isVisible = true;

  footer: any;

  private publicCommunicateSubscription!: Subscription;
  private todoSysMsgSubscription!: Subscription;

  constructor(
    private watermarkService: WatermarkService, private route: ActivatedRoute,
    public xn: XnService, private er: ElementRef,
    private settingService: SettingsService,
    private cdr: ChangeDetectorRef,
    private publicCommunicateService: PublicCommunicateService
  ) { }

  ngOnInit(): void {

    this.initWatermark();
    this.onEnter();

    this.publicCommunicateSubscription = this.publicCommunicateService.change.subscribe(x => {
      if (x && x.todoCount) {
        this.todoCount = x.todoCount;
        // 是否是个人待办
        const isPerson = x?.isPerson;
        this.xn.user.geTodoSysMsg();
        const menuData = XnUtils.deepClone(this.menuData);

        /** 给待办菜单添加待办数量 */
        menuData.map((menu: any) => {
          if (menu.name.includes('待办列表')) {
            this.setUrlCount(menu, isPerson)
          }
        })
        this.menuData = menuData;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      }
    });

    this.todoSysMsgSubscription = this.xn.user.todoSysMsg$.subscribe(data => {
      const menuData = XnUtils.deepClone(this.menuData);
      /** 给系统消息菜单添加待办数量 */
      menuData.map((menu: any) => {
        if (menu.name === '待办列表') {
          menu.children.map(x => {
            if (x.path === '/home/sys-messages') {
              x.count = data;
            }
          });
        }
      })
      this.menuData = menuData;
      this.cdr.markForCheck();
    });
    this.settings = this.settingService.settings;
    this.er.nativeElement.ownerDocument.body.style.backgroundColor = '#ecf0f5';
    // this.er.nativeElement.ownerDocument.body.style.overflow = 'auto';
    this.er.nativeElement.ownerDocument.body.style.overflowX = 'hidden';
  }
  ngAfterViewInit() {
    // 路由传参
    if (this.xn.user.isNewAgile) {
      this.homeUrl = '/home/sys-messages';
    }
    this.currentUrl = this.xn.router.url;
  }

  /**
   * 待办菜单数量设置
   * @param menus 待办菜单配置
   */
  setUrlCount(menus: any, isPerson: boolean | undefined) {
    menus?.children.map((x: any) => {
      for (const key in this.todoCount) {
        if (x?.productIdent && x?.productIdent === key) {
          // 个人待办数量
          if (x.path.includes('person') && isPerson) {
            x.count = this.todoCount[key]
          }
          // 产品待办数量
          if (!isPerson && !x.path.includes('person')) {
            x.count = this.todoCount[key]
          }
        }
      }
    });
  }

  private initMenus(menus: any) {
    // 清空上次构建菜单
    this.menus = [];
    const keysMap = {
      url: 'path',
      icon: 'iconfont',
      subMenuItem: 'children',
    };
    const menuslist = XnUtils.deepRename(
      menus?.subMenuItem,
      keysMap,
      (obj: any) => {
        if (obj.url_opts) {
          obj.url = this.getUrlInfo(obj);
          obj.external = true;
          obj.target = '_self';
        }
        // 产品标识。产品id或者待办类别
        if (obj?.productIdent) {
          obj.url = `${obj.url}/${obj.productIdent}`;
          obj.external = false;
        }
      }
    );
    // 没path的配置path
    menuslist.forEach((x, i) => {
      if (x.children) {
        x.children.forEach((y, index) => {
          if (!y.path) {
            y.path = `/vanke${i}/transaction${index}`;
          }
        });
      }
      if (!x.path) {
        x.path = `/vanke${i}`;
      }

    });
    menuslist[0].path = '/vanke';
    this.menus = menuslist;

  }
  private getUrlInfo(item: any) {
    const obj = JSON.parse(item.url_opts || '{}');
    const params = Object.keys(obj).reduce(
      (prev, curr) => `${prev}${prev ? '&' : '?'}${curr}=${obj[curr]}`,
      ''
    );
    return `${window.location.origin}${item.url.split('?')[0]}${params}`;
  }
  /**
  *  根据配置构建导航
  */
  private buildMenu() {
    this.showTodo = true;
    this.initMenus(this.xn.user.menus);
    this.menuData = this.menus;
  }
  /**
  *  加载菜单栏，导航改变时刷新
  */
  private onEnter() {
    this.showRegister = false;
    this.showProcess = false;
    this.showMenu = false;
    this.currentUrl = this.xn.router.url;
    // 注册
    const urls = ['/user/register'];
    if (urls.indexOf(this.currentUrl) >= 0) {
      this.showRegister = true;
      return;
    }

    this.xn.user.isLogin().subscribe((logined) => {
      // 未登录时
      if (!logined) {
        this.watermarkService.removeWatermark();
        this.xn.user.setRedirectUrl(this.xn.router.url);
        return;
      }

      // 审核中
      if (this.xn.user.status !== 2) {
        this.showProcess = true;
        return;
      }

      this.initWatermark();
      this.showMenu = true;
      this.buildMenu();

    });
  }
  initWatermark() {
    try {
      const text = this.xn.user.accountId
        ? `${this.xn.user.userName}\n${this.xn.user.accountId.slice(0, 3) + '****' +
        this.xn.user.accountId.slice(7)}`
        : `${this.xn.user.userName}`;
      this.watermarkService.initWatermark(text);
    } catch (err) {
      console.error('watermark load err: >>', err);
    }
  }
  ngOnDestroy() {
    this.watermarkService.removeWatermark();
    this.publicCommunicateSubscription.unsubscribe();
    this.todoSysMsgSubscription.unsubscribe();
  }



  settingChange(event: any) {
    console.log(event);
  }

  menuHeaderClick(event: Event) {
    console.log(`onMenuHeaderClick:${event}`);
  }

  collapse(event: boolean) {
    console.log(`onCollapse:${event}`);
  }
}
