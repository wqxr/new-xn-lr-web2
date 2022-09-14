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

import { Component, OnInit, ViewContainerRef, Input } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import XnFlowUtils from 'libs/shared/src/lib/common/xn-flow-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { IFlowCustom, FlowCustom } from '../flow/flow-custom';
import { PublicCommunicateService } from 'libs/shared/src/lib/services/public-communicate.service';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { OperateType } from 'libs/shared/src/lib/config/enum/common-enum';
import { PointService } from 'libs/shared/src/lib/services/point.service';

@Component({
    templateUrl: './step-view-component.html',
    selector: 'step-vanke-view',
    styleUrls: ['./step.less'],
    styles: [
        `.box-title {
            font-size: 14px;
        }

        .xn-panel-sm {
            margin-bottom: 10px;
        }

        .xn-panel-sm .panel-heading {
            padding: 5px 15px;
        }

        .xn-panel-sm .panel-heading .panel-title {
            font-size: 14px
        }

        .tipsDataRow {
            max-height: 450px;
            overflow: auto
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
export class VankeStepViewComponent implements OnInit {
    @Input() svrConfig: any;
    @Input() mainForm: FormGroup;

    pageTitle = '查看流程记录';
    pageDesc = '';
    data: any[] = [];
    @Input() baseInfo: any[] = [];
    contracts: any[] = [];
    newSvrConfig: any;
    public flowCustom: IFlowCustom;

    flowId = '';
    public mainFlowId: string = this.svrConfig && this.svrConfig.record && this.svrConfig.record.mainFlowId || '';
    isshowProgress: boolean; // 是否显示导航进度条

    constructor(private xn: XnService,
        private route: ActivatedRoute,
        private loading: LoadingService,
        private vcr: ViewContainerRef,
        private localStorageService: LocalStorageService,
        public communicateService: PublicCommunicateService,
        public hwModeService: HwModeService,
        public pointService: PointService) {
    }

    ngOnInit() {
        this.flowId = this.svrConfig.flow.flowId;
        this.flowCustom = FlowCustom.build(this.flowId, this.xn,
            this.vcr, this.loading, this.communicateService, this.localStorageService, this.pointService);
        this.flowCustom.postGetSvrConfig(this.svrConfig);
        // 拷贝对象
        this.newSvrConfig = JSON.parse(JSON.stringify(this.svrConfig));
        this.isshowProgress = this.flowId.startsWith('sub');


    }

    /**
     *  合并面板
     * @param paramItem
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
     *  下载附件
     */
    public download() {
        this.xn.dragon.post('/list/main/flow_relate_file',
            { mainFlowId: this.mainFlowId, start: 0, length: Number.MAX_SAFE_INTEGER }).subscribe(x => {
                if (x.data && x.data.data && x.data.data.length) {
                    this.data = x.data.data;
                    let files = this.data.map((x) => JSON.parse(x[0]));
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

    // 控制展示注释
    showMemo(operator:number){
        return operator===OperateType.REJECT || operator===OperateType.SUSPENSION;
    }

}
