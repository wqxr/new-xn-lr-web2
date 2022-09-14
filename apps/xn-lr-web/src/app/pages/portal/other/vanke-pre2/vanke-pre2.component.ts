/*************************************************************************
 * Copyright (c) 2017 - 2020 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：xn-lr-web\apps\src\app\pages\portal\product\solution\solution.component.ts
 * @summary：init solution.component.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  zigui             init             2021-10-19
 ***************************************************************************/
 import { Component, OnInit, AfterViewInit } from '@angular/core';
 import { StoreService } from '../../shared/services/store.service';
 @Component({
    selector: 'app-vanke-pre2',
    templateUrl: './vanke-pre2.component.html',
    styleUrls: ['./vanke-pre2.component.less']
  })
  export class VankePre2Component implements OnInit, AfterViewInit {
    current = 0
    navList = [
      {
        title: '产品要素',
      },
      {
        title: '产品优势',
      },
      {
        title: '办理流程',
      },
      {
        title: '联系客服',
      },

    ]

    onClick(index): void {
      this.current = index
    }

    onDownload() {
      let a = document.createElement('a')
      a.href = '/assets/lr/doc/vanke-pre/进度款前置融资业务申请书 20220105 LR.xlsx'
      a.click()
      a = null
    }
    constructor(public store: StoreService) { }
    ngOnInit() {}
    ngAfterViewInit(): void {

        const throttle = (fn, wait) => {
          let timer = null
          return (...args) => {
              if (!timer) {
                  timer = setTimeout(() => {
                      timer = null
                      fn(...args)
                  }, wait)
              }
          }
      }

      window.onscroll = throttle(() => {
          const scrollTop = document.documentElement.scrollTop  || document.body.scrollTop;
          if (scrollTop <= 377) {
              this.onClick(0)
          } else if (scrollTop > 377 && scrollTop <= 670) {
              this.onClick(1)
          } else if (scrollTop > 670 && scrollTop <= 1190) {
              this.onClick(2)
          } else if (scrollTop > 1190) {
              this.onClick(3)
          }
      }, 300)
    }

  }