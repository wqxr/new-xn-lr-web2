/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：
* @summary：注册企业列表
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                 hucongying           init          2021-07-20
***************************************************************************/

import { Component, Input, OnInit } from '@angular/core';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { FlowProcessStatusEnum } from '../../../../logic/public-enum';
import { LocalFlowProcessModel } from '../flow-process.model';
import { supplierProcessJson } from './puhui-flow-process-config';
@Component({
  selector: 'xn-oct-puhui-flow-process-component',
  template: `
    <div class="tc-15-step col8">
      <ol>
        <ng-container *ngFor="let node of localFlowProcess as lists;let i=index">
          <li [ngStyle]="calcStyle(lists)">
            <ng-container *ngFor="let subNode of node.subList">
              <div [ngClass]="flowProcessStatusEnum[subNode.status]"
                class="tc-15-step-name">{{subNode.name}}</div>
            </ng-container>
            <div [hidden]="i=== lists.length-1" class="tc-15-step-arrow"></div>
          </li>
        </ng-container>
      </ol>
    </div>
  `,
  styles: [
    `.tc-15-step {
      margin: 0 0;
      border: none;
      color: #00b9a3
    }

    .tc-15-step-name {
      text-align: center;
      line-height: 1.3;
      margin: 0 auto;
    }

    .tc-15-step-arrow {
      top: -3px;
    }

    .tc-15-step-name + .tc-15-step-name {
      border-top: 1px solid #eaeaea;
    }

    div.disabled {
      color: #c7ccd1;
    }

    div.success {
      color: #1ba208
    }

    div.current {
      color: #cc0000;
    }
    `
  ]
})
export class XnOctPuhuiFlowProcessComponent implements OnInit {
  @Input() flowProcess: LocalFlowProcessModel[];
  // 本地转化配置
  public localFlowProcess: LocalFlowProcessModel[];
  // 流程节点状态
  public flowProcessStatusEnum = FlowProcessStatusEnum;


  constructor(private xn: XnService) {
  }

  ngOnInit(): void {
    this.localFlowProcess = this.flowProcess || supplierProcessJson;
  }

  /**
  *  计算每列宽度
  *  paramLists 显示的总记录流程
  */
  public calcStyle(paramLists: LocalFlowProcessModel[]): any {
    const len = paramLists.length;
    return { width: `${100 / len}%`, padding: '0 15px' };
  }

}
