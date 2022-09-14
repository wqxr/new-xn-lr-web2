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

  constructor(
    private watermarkService: WatermarkService, private route: ActivatedRoute,
    public xn: XnService, private er: ElementRef,
    private settingService: SettingsService,
    private cdr: ChangeDetectorRef,
    private publicCommunicateService: PublicCommunicateService
  ) { }

  ngOnInit(): void {
    this.xn.api.post('/user/todo_count', {}).subscribe((json) => {
      this.todoCount = json.data;
      this.initWatermark();
      this.onEnter();
    });

    this.publicCommunicateService.change.subscribe(x => {
      if (x && x.todoCount) {
        this.todoCount = x.todoCount;
        this.xn.user.geTodoSysMsg();
        const menus = XnUtils.deepClone(this.menuData);
        menus[0]?.children.forEach(x => {
          x.count = this.todoCount[CountType[x.path]];
        });
        this.menuData = menus;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      }
    });

    // 订阅服务 未读系统消息数量
    this.xn.user.todoSysMsg$.subscribe(data => {
      const menus = XnUtils.deepClone(this.menuData);
      menus[0]?.children.forEach(x => {
        if (x.path === '/home/sys-messages') {
          x.count = data;
        }
      });
      this.menuData = menus;
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
  private initMenus(menus: any) {
    // 清空上次构建菜单
    this.menus = [];
    // 是不是经办
    // const isOperator = this.xn.user.roles.indexOf('operator') >= 0;
    // 当前的url
    // const url = this.xn.router.url;
    const keysMap = {
      url: 'path',
      icon: 'iconfont',
      subMenuItem: 'children',
    };
    const menuslist = XnUtils.deepRename(
      menus?.subMenuItem,
      keysMap,
      (obj: any) => {
        if (!obj.url && obj.subMenuItem?.length) {
          // 菜单层级默认最多三层，确保每一层级都包含 url 属性
          const path = obj.subMenuItem[0].url
            ? obj.subMenuItem[0].url
            : obj.subMenuItem[0].subMenuItem[0].url;
        }
        if (obj.url_opts) {
          obj.url = this.getUrlInfo(obj);
          obj.external = true;
          obj.target = '_self';
        }
      }
    );
    menuslist[0].children.forEach(x => {
      x.count = this.todoCount[CountType[x.path]];
    });
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
    if (this.showTodo) {
      // this.xn.user.todoCount$.subscribe(data => {
      //   this.todoCount = data;
      // });
      // this.xn.user.todoDraw$.subscribe(data => {
      //   this.todoDraw = { count_draw: Number(data) };
      // });
      // this.xn.user.todoSysMsg$.subscribe(res => {
      //   this.count_sysMsg = res; // 未读系统消息数量
      // });
      // if (this.loginUrl.indexOf(this.currentUrl) === -1) {
      //   this.xn.user.getTodoCount();
      //   // 获取提现列表数量--上银
      //   this.xn.user.getShDrawTodoCount();
      //   this.xn.user.geTodoSysMsg();
      // }
    }
    // this.menus = this.xn.user.menus;
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
      if (
        this.xn.user.orgType === 1 &&
        this.loginUrl.indexOf(this.currentUrl) === -1
      ) {
        this.xn.dragon
          .post('/trade/get_trade_count', {})
          .subscribe((x) => {
            const newMenus = [];
            // this.deepCopy(Menus.SUPPLIER, newMenus);
            if (
              x.ret === 0 &&
              x.data &&
              x.data.countList &&
              x.data.countList.length === 0
            ) {
              newMenus.forEach((item) => {
                item.subMenuItem = item.subMenuItem.filter(
                  (element) => {
                    return (
                      (element.url &&
                        element.url !==
                        '/machine-account') ||
                      !element.url
                    );
                  }
                );
              });
            }
            this.buildMenu();
          });
      } else {
        this.buildMenu();
      }
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
enum CountType {
  '/vanke/estate-vanke' = 'count_wk',
  '/xnvanke/estate-vanke' = 'count_wk_xn',
  '/logan/estate-dragon' = 'count_lg',
  '/home/agile' = 'count_yjl',
  '/gemdale/estate-gemdale' = 'count_jd',
  '/home/avenger' = 'count2',
  '/new-agile/new-agile' = 'count_xinshun',
  '/console/cfca/estate-cfca' = 'count_cfca',
  '/bank-shanghai/estate-shanghai' = 'count_sh',
  '/home/gtasks' = 'count1',
  '/oct/estate-oct' = 'count_oct',
  '/home/sys-messages' = 'count_sysMsg',
  '/home/angency' = 'count_agency',
  '/xnlogan/estate-dragon' = 'count_lg_xiangna',
  '/country-graden/estate-country-graden' = 'count_bgy',
  '/new-gemdale/estate-new-gemdale' = 'count_new_jd',
  '/agile-xingshun/estate-agile-xingshun' = 'count_new_yjl_xs',
  '/agile-hz/estate-agile-xingshun' = 'count_new_yjl_hz',
  '/agile-agile/estate-agile-xingshun' = 'count_new_yjl_xs',
  '/xn-gemdale/estate-new-gemdale' = 'count_jd_xn',
  '/zs-gemdale/estate-new-gemdale' = 'count_jd_zs',
  '/pslogan/estate-dragon' = 'count_lg_boshi',
  '/console/manage/eatate-sign' = 'count_cfca_sign',
}
