import { ActivatedRoute, Params } from '@angular/router';
/*************************************************************************
 * Copyright (c) 2017 - 2020 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：xn-lr-web\apps\src\app\pages\portal\technology\technology.component.ts
 * @summary：init technology.component.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  zigui             init             2020-11-18
 ***************************************************************************/
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StoreService } from '../shared/services/store.service';

@Component({
  selector: 'app-technology',
  templateUrl: './technology.component.html',
  styleUrls: ['./technology.component.less']
})
export class TechnologyComponent implements OnInit {
  cardList: CardConfig[] = [
    {
      title: '区块链',
      src: 'assets/images/technology/technology-blockchain.png',
      h5src: 'assets/images/technology/technology-blockchain-h5.png',
      url: '/block-chain-info',
      desc: '实现参与各方多节点部署，确保底层资产和信息数据存证、取证，推动参与各方的可信和共识',
    },
    {
      title: '大数据',
      src: 'assets/images/technology/technology-bigdata.png',
      h5src: 'assets/images/technology/technology-bigdata-h5.png',
      desc: '运用大数据分析技术，形成行业、客户、交易、资金等四维信息画像，助力资产和资金数字化对接',
    },
    {
      title: '人工智能',
      src: 'assets/images/technology/technology-ai.png',
      h5src: 'assets/images/technology/technology-ai-h5.png',
      desc: '运用OCR识别、智能匹配、机器学习、智能核验、智能决策等人工智能技术，助力业务流程自动化、智能化',
    },
    {
      title: '云计算',
      src: 'assets/images/technology/technology-cloudcomputing.png',
      h5src: 'assets/images/technology/technology-computing-h5.png',
      desc: '利用云计算、云存储、云服务等技术，构建全方位一体化安全体系，便捷高效的线上服务',
    },
  ];
  // 解决方案 翻转card配置信息
  overCardList: CardConfig[] = [
    {
      serial: '01',
      title: '中登服务数字解决方案',
      src: 'assets/images/technology/fuwufangan-bg.png',
      desc: '链融科技通过灵活运用OCR、NLP等人工智能技术，实现中登数据的结构化处理，全面提升动产融资登记和查询的处理效能，为产业金融赋能。',
    },
    {
      serial: '02',
      title: '税票验证数字解决方案',
      src: 'assets/images/technology/fuwufangan-bg.png',
      desc: '链融科技瞄准税票验证痛点，整合政务及业务资源，突破数据孤岛，提升税票验证处理效能，最大程度发挥税票数据的业务价值。',
    },
    {
      serial: '03',
      title: '智能审单数字解决方案',
      src: 'assets/images/technology/fuwufangan-bg.png',
      desc: '链融科技基于核心技术创新能力和海量数据运营经验，全面打造“场景+服务”的智能审单数字解决方案，创新业务运营和服务模式，实现降本增效。',
    },
    {
      serial: '04',
      title: '智能风控系统解决方案',
      src: 'assets/images/technology/fuwufangan-bg.png',
      desc: '链融科技依托丰富的供应链金融行业数据，与链融产融联盟共享风控经验，结合业务场景，致力于提供高质量、全方位的智能风控系统解决方案。',
    },
    {
      serial: '05',
      title: '供应链金融数字解决方案',
      src: 'assets/images/technology/fuwufangan-bg.png',
      desc: '链融科技通过运用金融科技，携手核心企业，深入探索供应链核心应用场景，有效结合金融资源，助力实体经济，践行普惠金融。',
    },
    {
      serial: '06',
      title: '保理业务系统化解决方案',
      src: 'assets/images/technology/fuwufangan-bg.png',
      desc: '链融科技为保理行业客户量身定制安全合规、低成本、高性能、高可用的云服务，助力客户科技升级，打造云上保理，智创未来。',
    },
    {
      serial: '07',
      title: '保函业务系统化解决方案',
      src: 'assets/images/technology/fuwufangan-bg.png',
      desc: '链融科技聚焦保函电子化升级，为保函需求方、出函机构、业主方、交易中心等打造电子保函服务平台，简化保函申请手续，提升保函出函效率。',
    },
    {
      serial: '08',
      title: '资产证券化系统解决方案',
      src: 'assets/images/technology/fuwufangan-bg.png',
      desc: '链融科技为客户构建面向资产证券化业务的智能化、高扩展、可维护的智慧ABS云平台，一站式解决客户在日常业务、技术、运维等层面面临的各种难题，推动资产证券化业务快速落地。',
    },
    {
      serial: '09',
      title: '可信区块链数字化解决方案',
      src: 'assets/images/technology/fuwufangan-bg.png',
      desc: '信区块链数字化解决方案以产融业务数据上链为手段，以解决联盟内数据信任难题为目的，利用区块链技术对业务数据进行链上存证，从而保证交易真实可靠、无法篡改。',
    },
  ]
  constructor(private route: ActivatedRoute, public store: StoreService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params)=>{
      if(params?.hash){
        const id = params.hash
        // 根据路由hash值 滚动到对应元素
        setTimeout(()=>{
          document.getElementById(`${id}`).scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' })
        },100)
      }
    })
  }

  onClick(item) {
    const { url } = item;
    if (url && !this.store.isPhone) {
      window.open(url);
    }
  }

}

/** 技术服务信息配置 */
interface CardConfig {
  /** 序号 */
  serial?: string,
  /** 标题 */
  title: string,
  /** pc背景图url */
  src: string,
  /** h5背景图url */
  h5src?: string,
  /** 描述文字 */
  desc: string,
  /** 路由 */
  url?: string,
}
