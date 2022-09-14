/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\products\home\src\lib\pages\estate-register\estate-register.component.ts
* @summary：注册待办列表
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                 hucongying          init           2021-09-16
***************************************************************************/

import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'libs/shared/src/lib/services/api.service';
import { PublicCommunicateService } from 'libs/shared/src/lib/services/public-communicate.service';

@Component({
  templateUrl: './estate-register.component.html',
  styles: [
    `.table {
            font-size: 13px;
        }`,
  ]
})
export class RegisterEstateComponent implements OnInit {
  // 待办列表配置
  public todoConfig: any;
  // 待办数量
  public count1: number;
  // 产品标识
  public productIdent: string = '';

  constructor(
    public xn: XnService,
    private api: ApiService,
    private route: ActivatedRoute,
    private publicCommunicateService: PublicCommunicateService
  ) { }

  ngOnInit() {

    // 获取产品标识
    this.route.paramMap.subscribe((v: any) => {
      this.productIdent = v.params?.productIdent
    })

    // 路由参数
    this.route.data.subscribe((config: any) => {
      this.todoConfig = config.todo;
      this.todoConfig.productIdent = this.productIdent;
    });

    // 获取待办数量
    this.xn.dragon.post('/list/todo_record/todo_count', {}).subscribe((json) => {
      if (this.productIdent) {
        this.count1 = json.data[this.productIdent]
      }
      this.publicCommunicateService.change.emit({ todoCount: json.data });
    });

  }






}
