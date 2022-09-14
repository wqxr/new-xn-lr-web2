/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：flow-process.component.ts
 * @summary：流程记录
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          新增                2019-05-05
 * **********************************************************************
 */

import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import {
  FlowProcessNodeOutputModel, FlowProcessOutputModel, FlowProcessSubNodeOutputModel,
  LocalFlowProcessModel
} from './flow-process.model';
import Process from './mock-process';
import { FlowProcessStatusEnum } from './process-enum';
import { XnService } from 'libs/shared/src/lib/services/xn.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'xn-new-gemdale-flow-process-component',
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
      top: -4px;
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
export class FlowProcessComponent implements OnInit, AfterViewInit {
  @Input() mainFlowId: string;
  @Input() flowId: string;
  @Input() showAll: boolean;
  // 后他获取流程配置
  public flowProcess: FlowProcessOutputModel = new FlowProcessOutputModel();
  public flowProessmain: FlowProcessOutputModel = new FlowProcessOutputModel();
  // 本地转化配置
  public localFlowProcess: LocalFlowProcessModel[];
  // 流程节点状态
  private flowProcessStatusEnum = FlowProcessStatusEnum;
  private mainfromlist: any;


  constructor(private xn: XnService) {
  }

  ngOnInit(): void {
    this.mainfromlist = Process.get(this.flowId);
    const param = this.mainFlowId ? { mainFlowId: this.mainFlowId } : { mainFlowId: '' };

    if (this.mainfromlist && this.mainfromlist.length > 0 &&
      (param.mainFlowId === undefined || param.mainFlowId === '' || param.mainFlowId === '1')) {
      this.xn.api.dragon.post('/flow/navigation', {
        modelId: this.mainfromlist[0].modelId, // 协议流程 对应cfg目录的model.json vanke万科流程
        ntype: 1,
      }).subscribe(res => {

        this.flowProessmain = res.data;
        if (this.flowProessmain.modelId === 'dragon') {
          this.flowProessmain.nodeList = this.flowProessmain.nodeList.splice(0, 4);
          this.localFlowProcess = this.buildRows(this.flowProessmain.nodeList);
        } else {
          this.localFlowProcess = this.buildRows(this.flowProessmain.nodeList);
        }
      });
    } else {
      this.xn.api.dragon.post('/flow/navigation', {
        mainFlowId: param.mainFlowId,
        ntype: 0,
      }).subscribe(res => {
        this.flowProessmain = res.data;

        if (this.flowProessmain.modelId === 'dragon' && this.showAll === undefined) {
          this.flowProessmain.nodeList = this.flowProessmain.nodeList.splice(0, 4);
          this.localFlowProcess = this.buildRows(this.flowProessmain.nodeList);
        } else {
          this.localFlowProcess = this.buildRows(res.data.nodeList);
        }
      });

    }


  }
  ngAfterViewInit() {
    // 新创建流程是，无mainFlowId，无需传值


  }

  /**
   *  计算每列宽度
   *  paramLists 显示的总记录流程
   */
  public calcStyle(paramLists: LocalFlowProcessModel[]): any {
    const len = paramLists.length;
    return { width: `${100 / len}%`, padding: '0 15px' };
  }

  /**
   *  将流程配置，输出为前端显示格式 ，适用于流程中只有一个链表节点即 linked= true 只有一处
   * @param paramNode
   */
  private buildRows(paramNode: FlowProcessNodeOutputModel[]): LocalFlowProcessModel[] {
    const outPut: FlowProcessNodeOutputModel[] = JSON.parse(JSON.stringify(paramNode));
    // 找出具有链表机构的下标，将其数据格式转化统一
    // const index: number = outPut.findIndex((node: FlowProcessNodeOutputModel) => node.subList && node.subList.length > 0);
    // if (index > -1) {
    //     // 链结构数组
    //     const listArr = outPut[index].subList.map((list: FlowProcessSubNodeOutputModel) => {
    //         return <LocalFlowProcessModel>{
    //             id: list.id,
    //             subList: [{
    //                 id: list.id,
    //                 name: list.name,
    //                 flowId: list.flowId,
    //                 status: list.status,
    //             }]
    //         };
    //     });
    //    // outPut.splice(index + 1, 0, ...listArr); // 重新拼接数组，紧随具有linked 的节点
    // }
    return outPut;
  }
}
