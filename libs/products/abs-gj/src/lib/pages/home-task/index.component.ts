/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\abs-gj\src\lib\pages\home-task\index.component.ts
 * @summary：index.component.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-11-23
 ***************************************************************************/
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PublicCommunicateService } from '../../../../../../shared/src/lib/services/public-communicate.service';
import { OrgTypeEnum } from '../../../../../../shared/src/lib/config/enum';
import { XnService } from '../../../../../../shared/src/lib/services/xn.service';
import { ApiService } from '../../../../../../shared/src/lib/services/api.service';
import { IToDoConfig, ToDoConfig } from './home-task.config';
import { zip } from 'rxjs';

@Component({
  selector: 'lib-home-task-gj',
  templateUrl: './index.component.html',
  styles: [``]
})
export class GjHomeTaskComponent implements OnInit {
  public dragonTodo: IToDoConfig;
  public countLg = 0;
  /** 产品标识 */
  public productIdent = '';

  constructor(
    public xn: XnService,
    private api: ApiService,
    private route: ActivatedRoute,
    private publicCommunicateSrv: PublicCommunicateService
  ) {}

  ngOnInit() {
    this.dragonTodo = new ToDoConfig();

    // 获取产品标识
    this.route.paramMap.subscribe((v) => {
      this.productIdent = v.get('productIdent');
      // 修改产品标识
      this.dragonTodo.productIdent = this.productIdent;

      this.route.data.subscribe((config: any) => {
        // isPerson是否个人待办标识
        this.dragonTodo.isPerson = config.isPerson;

        this.getToDoCount().subscribe({
          next: (res) => {
            const personData = res[0];
            const productData = res[1];
            this.publicCommunicateSrv.change.emit({todoCount: personData.data, isPerson: true});
            this.publicCommunicateSrv.change.emit({todoCount: productData.data, isPerson: false});
            this.countLg = config.isPerson ? personData.data[this.productIdent] : productData.data[this.productIdent];
          },
          error: err => {
            this.xn.msgBox.open(false, err.msg || '请求异常', () => {});
          },
        });
      });
    });


    if (this.xn.user.orgType === OrgTypeEnum.PLATFORM) {
      this.dragonTodo.fieldConfig = [...this.dragonTodo.fieldConfig, ...this.dragonTodo.fieldExt];
    }
  }

  /** 获取【个人，产品】待办数量 */
  getToDoCount() {
    return zip(
      this.xn.dragon.post('/list/todo_record/todo_count', {isPerson: true}),
      this.xn.dragon.post('/list/todo_record/todo_count', {})
    );
  }
}
