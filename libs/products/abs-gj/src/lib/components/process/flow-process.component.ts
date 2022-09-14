/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\abs-gj\src\lib\process\flow-process.component.ts
 * @summary：flow-process.component.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-11-23
 ***************************************************************************/

import { Component, Input, OnInit } from '@angular/core';
import {
  FlowProcessNodeOutputModel, FlowProcessOutputModel,
  LocalFlowProcessModel
} from './flow-process.class';
import Process from './process-config';
import { XnService } from '../../../../../../shared/src/lib/services/xn.service';
import { FlowProcessStatusEnum } from '../../../../../../shared/src/lib/common/dragon-vanke/public-enum';

@Component({
  selector: 'lib-flow-process-gj',
  template: `
    <div class="tc-15-step col8">
      <ol>
        <ng-container *ngFor="let node of localFlowProcess as lists;let i=index">
          <li [ngStyle]="calcStyle(lists)">
            <ng-container *ngFor="let subNode of node.subList">
              <div [ngClass]="flowProcessStatusEnum[subNode.status]"
                   class="tc-15-step-name">{{subNode.name}}</div>
            </ng-container>
            <div [hidden]="i=== lists.length - 1" class="tc-15-step-arrow"></div>
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
      top: 5px;
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
export class GjFlowProcessComponent implements OnInit {
  @Input() mainFlowId: string;
  @Input() flowId: string;
  @Input() showAll: boolean;
  // 后他获取流程配置
  public flowProcess: FlowProcessOutputModel = new FlowProcessOutputModel();
  public flowProessmain: FlowProcessOutputModel = new FlowProcessOutputModel();
  // 本地转化配置
  public localFlowProcess: LocalFlowProcessModel[];
  // 流程节点状态
  flowProcessStatusEnum = FlowProcessStatusEnum;
  private mainfromlist: any;

  constructor(
    private xn: XnService
  ) {}

  ngOnInit(): void {
    this.mainfromlist = Process.get(this.flowId);
    const param = this.mainFlowId ? {mainFlowId: this.mainFlowId} : {mainFlowId: ''};

    if (this.mainfromlist && this.mainfromlist.length > 0 &&
      (param.mainFlowId === undefined || param.mainFlowId === '' || param.mainFlowId === '1')) {
      this.xn.api.dragon.post('/flow/navigation', {
        modelId: this.mainfromlist[0].modelId,
        ntype: nType.UseModelId,
      }).subscribe(res => {

        this.flowProessmain = res.data;
        // if (this.flowProessmain.modelId === 'dragon') {
        //   this.flowProessmain.nodeList = this.flowProessmain.nodeList.splice(0, 4);
        //   this.localFlowProcess = this.buildRows(this.flowProessmain.nodeList);
        // } else {
        this.localFlowProcess = this.buildRows(this.flowProessmain.nodeList);
        // }
      });
    } else {
      this.xn.api.dragon.post('/flow/navigation', {
        mainFlowId: param.mainFlowId,
        ntype: nType.UseMainFlowId,
      }).subscribe(res => {
        this.flowProessmain = res.data;

        // if (this.flowProessmain.modelId === 'dragon' && this.showAll === undefined) {
        //   this.flowProessmain.nodeList = this.flowProessmain.nodeList.splice(0, 4);
        //   this.localFlowProcess = this.buildRows(this.flowProessmain.nodeList);
        // } else {
        this.localFlowProcess = this.buildRows(res.data.nodeList);
        // }
      });
    }
  }

  /**
   *  计算每列宽度
   *  paramLists 显示的总记录流程
   */
  public calcStyle(paramLists: LocalFlowProcessModel[]): any {
    const len = paramLists.length;
    return {width: `${100 / len}%`, padding: '0 15px'};
  }

  /**
   *  将流程配置，输出为前端显示格式 ，适用于流程中只有一个链表节点即 linked= true 只有一处
   * @param paramNode FlowProcessNodeOutputModel[]
   */
  private buildRows(paramNode: FlowProcessNodeOutputModel[]): LocalFlowProcessModel[] {
    return JSON.parse(JSON.stringify(paramNode));
  }
}

enum nType {
  /** 使用 mainFlowId */
  UseMainFlowId = 0,
  /** 使用 modelId */
  UseModelId    = 1,
}
