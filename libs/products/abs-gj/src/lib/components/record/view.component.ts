/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\abs-gj\src\lib\components\record\view.component.ts
 * @summary：view.component.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-11-23
 ***************************************************************************/
import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../../../../../../shared/src/lib/services/loading.service';
import { ActivatedRoute, Params } from '@angular/router';
import XnFlowUtils from '../../../../../../shared/src/lib/common/xn-flow-utils';
import { FormGroup } from '@angular/forms';
import { XnService } from '../../../../../../shared/src/lib/services/xn.service';
import { HwModeService } from '../../../../../../shared/src/lib/services/hw-mode.service';
import { XnUtils } from '../../../../../../shared/src/lib/common/xn-utils';
import { OperateType } from '../../../../../../shared/src/lib/config/enum';

@Component({
  templateUrl: './view.component.html',
  styles: [
    `
    .xn-panel-sm {
      margin-bottom: 10px;
    }

    .xn-panel-sm .panel-heading {
      padding: 5px 15px;
    }

    .xn-panel-sm .panel-heading .panel-title {
      font-size: 14px
    }

    .app-flow-process {
      border: 1px solid #ddd;
      padding: 4px;
      margin-bottom: 10px;
      border-radius: 3px;
      background-color: #fff;
    }`,
  ]
})
export class GjViewComponent implements OnInit {
  private recordId: string;
  svrConfig: any;
  mainForm: FormGroup;
  pageTitle = '查看流程记录';
  pageDesc = '';
  data: any[] = [];
  baseInfo: any[] = [];
  contracts: any[] = [];
  newSvrConfig: any;
  flowId = '';
  public mainFlowId: string = this.svrConfig && this.svrConfig.record && this.svrConfig.record.mainFlowId || '';
  showProgress: boolean; // 是否显示导航进度条

  OperateType = OperateType;

  constructor(
    private xn: XnService,
    private route: ActivatedRoute,
    private loading: LoadingService,
    public hwModeService: HwModeService
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.recordId = params.id;
      this.xn.api.dragon.post('/record/record/view', {
        recordId: this.recordId
      })
        .subscribe(json => {
          json.data.actions = json.data.actions.filter(action => action.operatorId !== '' && action.operatorName !== '');
          this.svrConfig = json.data;
          this.svrConfig = XnFlowUtils.handleSvrConfig(this.svrConfig);
          this.mainFlowId = this.svrConfig.record.mainFlowId;
          this.flowId = this.svrConfig.flow.flowId;
          // 拷贝对象
          this.newSvrConfig = JSON.parse(JSON.stringify(this.svrConfig));
          this.buildRows();
          this.showProgress = this.flowId.startsWith('sub');
        });
    });


  }

  /**
   *  合并面板
   * @param paramItem any
   */
  public collapse(paramItem) {
    const items = this.newSvrConfig.actions;
    if (!paramItem.collapse || paramItem.collapse === false) {
      items.forEach((x: any) => x.collapse = false); // 所有都至false
      paramItem.collapse = true;
    } else if (paramItem.collapse === true) {
      paramItem.collapse = false;
    }
  }

  public onCancel() {
    this.xn.user.navigateBack();
  }

  public panelCssClass(action) {
    if (action.operator === OperateType.PASS) {
      return 'panel panel-info xn-panel-sm';
    } else if (action.operator === OperateType.REJECT || action.operator === OperateType.SUSPENSION) {
      return 'panel panel-warning xn-panel-sm';
    } else {
      console.log('@@ else operator', action.operator);
      return '';
    }
  }

  /**
   *  下载附件
   */
  public download() {
    this.xn.dragon.post('/list/main/flow_relate_file',
      {mainFlowId: this.mainFlowId, start: 0, length: Number.MAX_SAFE_INTEGER}).subscribe(x => {
      if (x.data && x.data.data && x.data.data.length) {
        this.data = x.data.data;
        let files = this.data.map((y) => JSON.parse(y[0]));
        files = XnUtils.uniqueBoth(files);

        const appId = this.xn.user.appId;
        const orgName = this.xn.user.orgName;
        const time = new Date().getTime();
        const filename = appId + '-' + orgName + '-' + time + '.zip';
        this.xn.dragon.download('/file/downFile', {
          files,
          mainFlowId: this.mainFlowId
        }).subscribe((v: any) => {
          this.loading.close();
          this.xn.dragon.save(v._body, filename);
        });
      } else {
        this.xn.msgBox.open(false, '无可下载项');
      }
    });
  }

  /**
   * 把svrConfig.checkers转换为rows对象，方便模板输出
   */
  private buildRows(): void {
    this.baseInfo.push({
      type: 'text',
      title: '流程记录ID',
      data: this.svrConfig.record.recordId
    });

    if (!XnUtils.isEmpty(this.svrConfig.record.bcOrderId)) {
      this.baseInfo.push({
        type: 'text',
        title: '区块链账本ID',
        data: this.svrConfig.record.bcLedgerId
      });
      this.baseInfo.push({
        type: 'text',
        title: '区块链记录ID',
        data: this.svrConfig.record.bcOrderId
      });
    }

    if (!XnUtils.isEmpty(this.svrConfig.record.contracts)) {
      this.contracts = JSON.parse(this.svrConfig.record.contracts);
    } else {
      this.contracts = [];
    }
  }
}
