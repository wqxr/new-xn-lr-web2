/*************************************************************************
 * Copyright (c) 2017 - 2020 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：xn-lr-web\apps\src\app\pages\portal\about\about.component.ts
 * @summary：init about.component.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  zigui             init             2020-11-19
 ***************************************************************************/
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { StoreService } from '../shared/services/store.service';

declare var BMap: any;
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.less']
})
export class AboutComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('map') map: ElementRef;
  @ViewChild('logBox') logBox: ElementRef;
  @ViewChild('line') line: ElementRef;
  @ViewChild('tabNav') tabNav: ElementRef;
  spinning = false;
  logSpinning = false;
  tabList: any[] = [
    {
      id: 1,
      name: '公司介绍',
    },
    {
      id: 2,
      name: '企业文化',
    },
    {
      id: 3,
      name: '企业大事记',
    },
    {
      id: 4,
      name: '公司资质',
    },
    {
      id: 5,
      name: '联系我们',
    },
  ];
  currentTab: any = {
    id: 1,
    name: '企业介绍',
  };
  cultureList: any[] = [
    {
      title: '公司使命',
      desc: '让真实、合法、有效的交易快速获得资金支持',
    },
    {
      title: '公司愿景',
      desc: '成为最具价值的产融联盟专业服务商',
    },
    {
      title: '核心价值',
      desc: '业界领先技术、跨界专家团队、标准化产品体系、产融发展机制',
    },
  ];
  infoList: any[] = [
    {
      label: '电话',
      value: '0755-29966132',
      isImg: false,
    },
    {
      label: '传真',
      value: '0755-29966132',
      isImg: false,
    },
    {
      label: '邮箱',
      value: 'contact@lrscft.com',
      isImg: false,
    },
    {
      label: '邮编',
      value: '518000',
      isImg: false,
    },
    {
      label: '地址',
      value: '深圳市福田区莲花街道海田路民生金融大厦14F',
      isImg: false,
    },
    {
      label: '公众号',
      value: 'assets/images/pic/footer-QRcode.png',
      isImg: true,
    },
  ];
  qualificationList: any[] = [
    {
      title: '技术资质',
      id: 'roll-text',
      src: 'assets/images/pic/zizhi001.png',
      list: [
        '工信部ICP主体及网站认证备案',
        '全国互联网安全管理服务平台备案',
        '《链融科技普惠通业务管理系统》等软件著作权30多项',
        "'双软'企业资质认证",
        '科技型中小企业',
        '国家网信办备案区块链平台',
        '可信区块链认证',
        '已提交受理发明专利11项',
        '信息安全管理体系ISO27001认证',
        '质量管理体系ISO9001认证',
        'IT服务管理体系ISO20000认证'
      ],
    },
    {
      title: '协会资质',
      id: 'ass-text',
      src: 'assets/images/pic/zizhi002.png',
      list: ['深圳市供应链金融协会会员', '深圳市软件业协会会员'],
    },
    {
      title: '公司荣誉',
      id: 'company-text',
      src: 'assets/images/pic/zizhi003.png',
      list: ['年度最佳房企供应链金融保理ABS/ABN'],
    },
  ];
  companyLogList: any[] = [];
  intervalTimer: any = null;
  constructor(private xn: XnService, public store: StoreService) { }
  onSelectChange(tab) {
    if (this.currentTab === tab) {
      return;
    }
    this.currentTab = tab;
    if (this.currentTab.id === 3) {
      this.logSpinning = true;
      this.xn.api
        .post('/portalsite/detail_list', {
          columnId: ['169'],
          length: 9999,
          start: null,
        })
        .subscribe((res: any) => {
          this.companyLogList = res.data ? res.data.data : [];
          this.logSpinning = false;
          setTimeout(() => {
            const children = this.logBox.nativeElement.children;
            const len = this.companyLogList.length;
            if (len > 1) {
              const height = children[len - 1].children[1].offsetTop - children[0].children[1].offsetTop;
              this.line.nativeElement.style.height = height + 'px';
            }
          }, 0);
          setTimeout(() => {
            this.logSpinning = false;
          }, 4000);
        });
    }
    if (this.currentTab.id === 5) {
      setTimeout(() => {
        this.spinning = true;
        this.map.nativeElement.style.display = 'none';
        setTimeout(() => {
          this.spinning = false;
          this.map.nativeElement.style.display = 'block';
          const map: any = new BMap.Map(this.map.nativeElement);  // 创建地图实例
          const point = new BMap.Point(114.071377, 22.547984);     // 创建点坐标
          const marker = new BMap.Marker(point, { title: '民生金融大厦' }); // 添加标志
          const label = new BMap.Label('民生金融大厦', { position: point, offset: new BMap.Size(-48, -52) });
          label.setStyle({
            border: '1px solid #ccc',
            backgroundColor: '#fff',
            maxWidth: 'none',
            padding: '4px 10px',
          });
          map.addOverlay(label);
          map.centerAndZoom(point, 17); // 初始化地图，设置中心点坐标和地图级别
          map.addOverlay(marker);
          map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
        }, 10);
      }, 0);
    }
    // 公司资质: 文字垂直循环滚动
    if(this.currentTab.id === 4) {
      setTimeout(() => this.startRoll(50, 673), 500);
    }
  }
  ngOnInit(): void {
    if (this.store.isPhone) {
      this.infoList.pop();
    }
  }
  ngAfterViewInit(): void {
    if (this.store.isPhone) {
      const tabNav = this.tabNav.nativeElement;
      let [currentPosition, startX, startY, moveX, moveY, endX, endY] = [0, 0, 0, 0, 0, 0, 0];
      tabNav.ontouchstart = (s) => {
        const startTouch = s.touches[0];
        startX = startTouch.pageX;
        startY = startTouch.pageY;
        endX = 0;
        endY = 0;
        currentPosition = +tabNav.style.transform.replace(/[^0-9|.|\-]/ig, '');
      };
      tabNav.ontouchmove = (m) => {
        m.stopPropagation();
        const moveTouch = m.touches[0];
        moveX = moveTouch.pageX;
        moveY = moveTouch.pageY;
        endX = moveX - startX;
        endY = moveY - startY;
        if (Math.abs(endX) > Math.abs(endY)) {
          m.preventDefault();
          tabNav.style.transform = `translateX(${currentPosition + endX / 75}rem)`;
        }
      };
      tabNav.ontouchend = (e) => {
        if (currentPosition + endX / 75 > 0) {
          tabNav.style.transform = `translateX(${0}rem)`;
        } else if (currentPosition + endX / 75 < -1.82) {
          tabNav.style.transform = `translateX(${-1.82}rem)`;
        }
      };
    }
  }

  /**
   * @description: 垂直滚动
   * @param {number} speed 滚动速度，值越大越慢
   * @param {number} distance
   * @return {*}
   */  
  startRoll(speed: number = 20, distance: number) {
    let rollWrapper = document.getElementById("roll-text__wrapper");
    let rollList = document.getElementById("roll-text__list");
    let rollBoundary = document.getElementById("roll-text__boundary");
    if(rollWrapper) {
      rollBoundary.innerHTML = rollList.innerHTML;
      let marquee = () => {
        if(rollBoundary.offsetTop - rollWrapper.scrollTop <= distance) {
          //当滚动至交界处时跳到最顶端
          rollWrapper.scrollTop -= rollList.offsetHeight - 5;
        } else{
          rollWrapper.scrollTop++;
        }
      }
      this.intervalTimer = setInterval(marquee, speed);
      rollWrapper.onmouseover = () => {
        clearInterval(this.intervalTimer);
      };//鼠标移上时清除定时器达到滚动停止的目的
      rollWrapper.onmouseout = () =>  {
        this.intervalTimer = setInterval(marquee, speed);
      };//鼠标移开时重设定时器
    }
  }

  ngOnDestroy(): void {
    if(!!XnUtils.isEmptys(this.intervalTimer, [0])) {
      clearInterval(this.intervalTimer);
    }
  }
}
