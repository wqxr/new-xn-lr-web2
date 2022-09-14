/*************************************************************************
 * Copyright (c) 2017 - 2020 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：xn-lr-web\apps\src\app\pages\portal\home\home.component.ts
 * @summary：init home.component.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  zigui             init             2020-11-16
 ***************************************************************************/
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { StoreService } from '../shared/services/store.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild('advantageCard') advantageCard: any;
  @ViewChild('advantageBox') advantageBox: any;
  style: any = {};
  cardList: any[] = [
    {
      title: '跨界专业团队',
      src: 'assets/images/pic/adv-pic01.png',
      h5Src: 'assets/images/pic/adv-pic01-h5.png',
      desc: '公司拥有一批产业、金融、科技、运营、风控等领域的专家，为链融提供顶层设计和专业指导；拥有一支熟悉市场和客户、精通产品和技术、擅长运营和风控的专业团队，为产融生态发展提供专业服务。',
    },
    {
      title: '先进的技术体系',
      src: 'assets/images/pic/adv-pic02.png',
      h5Src: 'assets/images/pic/adv-pic02-h5.png',
      desc: '借助区块链、云计算、人工智能、大数据等技术在供应链金融领域的应用，基于业务场景和资源整合，对平台链属企业进行全景画像，有效解决交易真实性核验和付款能力研判等问题。资产和资金端通过平台实现无缝对接，达成可信赖的发展生态。',
    },
    {
      title: '系列标准化产品',
      src: 'assets/images/pic/adv-pic03.png',
      h5Src: 'assets/images/pic/adv-pic03-h5.png',
      desc: '帮助企业运用权益类、实物类、信用类资产解决日常资金需求；帮助金融企业精准获客，灵活适配融资产品；通过系列标准化产品，实现企业融资需求上平台，平台通过行业判断、数据分析整理、智能决策完成产品适配，连接金融机构。',
    },
    {
      title: '全方位服务体验',
      src: 'assets/images/pic/adv-pic04.png',
      h5Src: 'assets/images/pic/adv-pic04-h5.png',
      desc: '基于技术创新，为生态内各方提供系统、运营、风控和生态培育等全方位服务；实现服务全流程标准化、线上化、可视化、智能化，缩短服务响应时间，有效满足生态各方的效率需求，持续提升生态各方服务体验。',
    },
  ];
  practiceList: any[] = [
    {
      label: '交易规模(亿元)',
      value: 2500,
    },
    {
      label: '企业客户',
      value: 9000,
    },
    {
      label: '金融机构',
      value: 100,
    },
    {
      label: '覆盖地区',
      value: 190,
    },
  ];
  imgList: any[] = [
    {
      title: '核心企业 + 上下游企业',
      src: 'assets/images/company/com-hexinqiye.png',
      h5Src: 'assets/images/company/com-hexinqiye-h5.png',
      alt: '',
    },
    {
      title: '商业银行',
      src: 'assets/images/company/com-bank.png',
      h5Src: 'assets/images/company/com-bank-h5.png',
      alt: '',
    },
    {
      title: '券商 + 基金',
      src: 'assets/images/company/com-shangquan.png',
      h5Src: 'assets/images/company/com-shangquan-h5.png',
      alt: '',
    },
    {
      title: '信托 + 保险 + 担保',
      src: 'assets/images/company/com-xintuo.png',
      h5Src: 'assets/images/company/com-xintuo-h5.png',
      alt: '',
    },
    {
      title: '中介机构',
      src: 'assets/images/company/com-zhongjie.png',
      h5Src: 'assets/images/company/com-zhongjie-h5.png',
      alt: '',
    },
    {
      title: '保理商',
      src: 'assets/images/company/com-baolishang.png',
      h5Src: 'assets/images/company/com-baolishang-h5.png',
      alt: '',
    },
    {
      title: '科技企业',
      src: 'assets/images/company/com-kejiqiye.png',
      h5Src: 'assets/images/company/com-kejiqiye-h5.png',
      alt: '',
    },
  ];
  deadline = '2021-12-31';  // 截至日期
  currentAdvCard = 0;  // 移动端--我们的优势
  constructor(public store: StoreService) { }

  ngOnInit(): void {
    this.style = {background: `url(${this.store.isPhone ? 'assets/images/bg/bg-managepractices-h5.png) no-repeat' : 'assets/images/bg/bg-managepractices.png) center center no-repeat'}`};
  }
  ngAfterViewInit(): void {
    if (this.store.isPhone) {
      const advantageBox = this.advantageBox.nativeElement;
      let [currentPosition, startX, startY, moveX, moveY, endX, endY] = [0, 0, 0, 0, 0, 0, 0];
      // touch-start
      advantageBox.ontouchstart = (s) => {
        const startTouch = s.touches[0];
        endX = 0;
        endY = 0;
        startX = startTouch.pageX;
        startY = startTouch.pageY;
        currentPosition = +advantageBox.style.transform.replace(/[^0-9|.|\-]/ig, '');
      };
      // touch-move
      advantageBox.ontouchmove = (m) => {
        m.stopPropagation();
        const moveTouch = m.touches[0];
        moveX = moveTouch.pageX;
        moveY = moveTouch.pageY;
        endX = moveX - startX;
        endY = moveY - startY;
        // 判断是横向滑动还是纵向滑动
        if (Math.abs(endX) > Math.abs(endY)) {
          m.preventDefault();
          advantageBox.style.transform = `translateX(${currentPosition + endX / 75}rem)`;
        }
      };
      // touch-end
      advantageBox.ontouchend = (e) => {
        e.preventDefault();
        // 判断手势左移还是右移，当偏移量大于30时执行
        if (endX > 30) {
          // 右移
          if (this.currentAdvCard !== 0) {
            this.currentAdvCard --;
          }
        } else if (endX < -30) {
          // 左移
          if (this.currentAdvCard !== 3) {
            this.currentAdvCard ++;
          }
        }
        if (Math.abs(endX) > 30) {
          advantageBox.style.transform = `translateX(-${(this.currentAdvCard === 3 ? 281 : 301) * this.currentAdvCard / 75}rem)`;
        } else {
          advantageBox.style.transform = `translateX(${currentPosition}rem)`;
        }
      };
    }
  }
}
