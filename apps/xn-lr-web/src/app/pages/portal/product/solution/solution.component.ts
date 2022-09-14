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
 * 1.0                  zigui             init             2020-11-18
 ***************************************************************************/
import { Component, OnInit } from '@angular/core';
import { StoreService } from '../../shared/services/store.service';

@Component({
  selector: 'app-product-solution',
  templateUrl: './solution.component.html',
  styleUrls: ['./solution.component.less']
})
export class ProductSolutionComponent implements OnInit {

  constructor(public store: StoreService) { }

  ngOnInit(): void {
  }

}
