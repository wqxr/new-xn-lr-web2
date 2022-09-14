/*************************************************************************
 * Copyright (c) 2017 - 2020 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：xn-lr-web\apps\src\app\pages\portal\product\system\system.component.ts
 * @summary：init system.component.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  zigui             init             2020-11-18
 ***************************************************************************/
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { StoreService } from '../../shared/services/store.service';

@Component({
  selector: 'app-product-system',
  templateUrl: './system.component.html',
  styleUrls: ['./system.component.less']
})
export class ProductSystemComponent implements OnInit {
  productList: any[] = [
    {
      name: '普惠通',
      desc: '普惠通依托场景交易数据，运用量化模型分析，为资产端客户适配标准化产品或产品组合，链接资金端，帮助资产方高效便捷地获取价格合理的资金，助力资金方在风险可控的前提下，实现批量获客、精准普惠。',
      src: 'assets/images/pic/product-puhuitong.png',
      h5Src: 'assets/images/pic/product-puhuitong-h5.png',
      path: '/login',
      scrollToEl: 'pht',
      linkText: '进入平台'
    },
    {
      name: '证券通',
      desc: '证券通为资产证券化业务参与各方提供全流程标准化供应链资产服务，实现资产数字化收集、标准化作业、电子化运营，可视化管理。',
      src: 'assets/images/pic/product-zhengquantong.png',
      h5Src: 'assets/images/pic/product-zhengquantong-h5.png',
      path: '/login',
      scrollToEl: 'zqt',
      linkText: '进入平台'
    },
    {
      name: '保理通',
      desc: '保理通为应收账款债权人及金融服务商提供非标供应链资产全流程线上服务，实现标准化作业、电子化运营、可视化管理。',
      src: 'assets/images/pic/product-baolitong.png',
      h5Src: 'assets/images/pic/product-baolitong-h5.png',
      path: '/login',
      scrollToEl: 'blt',
      linkText: '进入平台'
    },
    {
      name: '保函通',
      desc: '保函通为投标企业提供全线上保函申请服务，为企业减负增效，助力社会经济发展。',
      src: 'assets/images/pic/product-baohantong.png',
      h5Src: 'assets/images/pic/product-baohantong-h5.png',
      routerLink: '/guarantee/register/flow/index',
      routerLinkTitle: '去注册',
      path: '/guarantee/user/login',
      scrollToEl: 'bht',
      newWindow: true,
      linkText: '进入平台'
    },
    {
      name: '票据通',
      desc: '票据通为票据持有人及金融机构提供便捷、可靠、及时、高价值的全线上票据管理服务。',
      src: 'assets/images/pic/product-piaojutong.png',
      h5Src: 'assets/images/pic/product-piaojutong-h5.png',
      path: '/portal/runmiaotie',
      linkText: '去查看',
      scrollToEl: 'pjt',
      newWindow: true,
    },
  ];

  constructor(
    public store: StoreService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      if (params?.hash) {
        const id = params.hash;
        // 根据路由hash值 滚动到对应元素
        setTimeout(() => {
          document.getElementById(`${id}`).scrollIntoView({behavior: 'smooth', block: 'start', inline: 'start'});
        }, 100);
      }
    });
  }

  /**
   * 进入平台
   * @param product 产品配置信息
   */
  handleNavToProduct(product: any) {
    if (!product.path) {
      return;
    }
    if (product?.newWindow) {
      window.open(`${window.location.origin}${product.path}`, '_blank');
    } else {
      this.router.navigate([`${product.path}`]).then();
    }
  }

}
