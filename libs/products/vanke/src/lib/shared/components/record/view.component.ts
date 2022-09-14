/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\vanke\src\lib\shared\components\record\view.component.ts
 * @summary：万科查看流程组件
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                 hucongying           init          2021-08-24
 ***************************************************************************/

import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import XnFlowUtils from 'libs/shared/src/lib/common/xn-flow-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { IFlowCustom, FlowCustom } from '../flow/flow-custom';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';

@Component({
  templateUrl: './view.component.html',
  styles: [
    `
      .box-title {
        font-size: 14px;
      }

      .xn-panel-sm {
        margin-bottom: 10px;
      }

      .xn-panel-sm .panel-heading {
        padding: 5px 15px;
      }

      .xn-panel-sm .panel-heading .panel-title {
        font-size: 14px;
      }

      .tipsDataRow {
        max-height: 450px;
        overflow: auto;
      }

      .app-flow-process {
        border: 1px solid #ddd;
        padding: 4px;
        margin-bottom: 10px;
        border-radius: 3px;
        background-color: #fff;
      }
    `,
  ],
})
export class VankeViewComponent implements OnInit {
  @Output() afterBuildFormGroup: EventEmitter<void> = new EventEmitter();
  private recordId: string;

  svrConfig: any;
  mainForm: FormGroup;
  shows: any[];
  flowCustom: IFlowCustom;
  pageTitle = '查看流程记录';
  pageDesc = '';
  data: any[] = [];

  baseInfo: any[] = [];
  contracts: any[] = [];
  newSvrConfig: any;
  flowId = '';
  public mainFlowId: string =
    (this.svrConfig &&
      this.svrConfig.record &&
      this.svrConfig.record.mainFlowId) ||
    '';
  isshowProgress: boolean; // 是否显示导航进度条

  constructor(
    private xn: XnService,
    private route: ActivatedRoute,
    private loading: LoadingService,
    public hwModeService: HwModeService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params)=>{
      this.mainFlowId=params.mainFlowId;
  })

    this.route.params.subscribe((params: Params) => {
      this.recordId = params.id;
      this.xn.api.dragon
        .post('/record/record/view', {
          recordId: this.recordId,
        })
        .subscribe((json) => {
          json.data.actions = json.data.actions.filter(
            (action) => action.operatorId !== '' && action.operatorName !== ''
          );
          this.svrConfig = json.data;
          this.svrConfig = XnFlowUtils.handleSvrConfig(this.svrConfig);
          this.mainFlowId=!this.mainFlowId?this.svrConfig.record.mainFlowId:this.mainFlowId;
          this.flowId = this.svrConfig.flow.flowId;
          // 拷贝对象
          this.newSvrConfig = JSON.parse(JSON.stringify(this.svrConfig));
          this.buildRows();
          this.isshowProgress = this.flowId.startsWith('sub');
        });
    });
  }

  /**
   *  合并面板
   * @param paramItem
   */
  public collapse(paramItem) {
    const items = this.newSvrConfig.actions;
    if (!paramItem.collapse || paramItem.collapse === false) {
      items.forEach((x: any) => (x.collapse = false)); // 所有都至false
      paramItem.collapse = true;
    } else if (paramItem.collapse === true) {
      paramItem.collapse = false;
    }
  }

  public onCancel() {
    this.xn.user.navigateBack();
  }

  public panelCssClass(action) {
    if (action.operator === 1) {
      return 'panel panel-info xn-panel-sm';
    } else if (action.operator === 2 || action.operator === 3) {
      return 'panel panel-warning xn-panel-sm';
    } else {
      console.log('@@ else operator', action.operator);
      return '';
    }
  }

  /**
   * 把svrConfig.checkers转换为rows对象，方便模板输出
   */
  private buildRows(): void {
    this.baseInfo.push({
      type: 'text',
      title: '流程记录ID',
      data: this.svrConfig.record.recordId,
    });

    if (!XnUtils.isEmpty(this.svrConfig.record.bcOrderId)) {
      this.baseInfo.push({
        type: 'text',
        title: '区块链账本ID',
        data: this.svrConfig.record.bcLedgerId,
      });
      this.baseInfo.push({
        type: 'text',
        title: '区块链记录ID',
        data: this.svrConfig.record.bcOrderId,
      });
    }
    this.shows = [].concat(this.svrConfig.actions);
    this.mainForm = XnFormUtils.buildFormGroup(this.shows);
    this.afterBuildFormGroup.emit();
    if (!XnUtils.isEmpty(this.svrConfig.record.contracts)) {
      this.contracts = JSON.parse(this.svrConfig.record.contracts);
    } else {
      this.contracts = [];
    }
  }
}
