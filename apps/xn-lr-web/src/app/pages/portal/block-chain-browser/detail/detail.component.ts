/*************************************************************************
 * Copyright (c) 2017 - 2020 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：xn-lr-web\apps\src\app\pages\portal\block-chain-browser\detail\detail.component.ts
 * @summary：init detail.component.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  zigui              init             2020-11-11
 ***************************************************************************/
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { StoreService } from '../../shared/services/store.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.less']
})
export class DetailComponent implements OnInit, AfterViewInit {
  visible: boolean = false;
  block = {};
  isWanke = false;
  isGuarantee = false;
  constructor(private router: Router, private store: StoreService) { }
  ngOnInit(): void {

    this.getBlock();
    this.router.events.subscribe((data: any) => {
      if (data instanceof NavigationEnd) {
        this.getBlock();
      }
    });
  }
  getBlock() {
    const tempBlock = this.store.getData('block', true);
    const newBlock = {
      contracts: [
        {
          contractId: '',
          contractName: '',
          contractMoney: '',
          payRate: '',
          contractType: '',
          signTime: '',
          contractJia: '',
          contractYi: '',
          totalReceive: '',
          percentOutputValue: '',
          payType: '',
        }
      ],
      ...tempBlock,
    };
    this.block = tempBlock ? newBlock : {};
    this.isWanke = this.store.getData('businessType') === 'wanke'
    this.isGuarantee = this.store.getData('businessType') === 'guarantee'
  }
  setStyle() {
    if (this.isWanke) {
      const row = document.getElementsByClassName('block-chain-detail-row');
      Array.from(row).forEach((c: any) => {
        const leftDom = c.children[0].children[0].getElementsByClassName('ant-card')[0];
        const rightDom =  c.children[1].children[0].getElementsByClassName('ant-card')[0];
        if (leftDom.offsetHeight > rightDom.offsetHeight) {
          rightDom.style.height = leftDom.offsetHeight + 'px';
        } else {
          leftDom.style.height = rightDom.offsetHeight + 'px';
        }
      });
    }
  }
  ngAfterViewInit() {
    // 左右高度对齐
    setTimeout(() => {
      this.setStyle();
    }, 0);
  }
}
