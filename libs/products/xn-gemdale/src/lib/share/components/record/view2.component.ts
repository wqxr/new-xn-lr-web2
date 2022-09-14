import {Component, OnInit} from '@angular/core';
import {Params, ActivatedRoute} from '@angular/router';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import XnFlowUtils from 'libs/shared/src/lib/common/xn-flow-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';


// import {configData} from '../../../../config/svrConfig'; // 引入测试数据

@Component({
    templateUrl: './view.component.html',
    styles: [
            `.box-title {
            font-size: 14px;
        }`,
            `.xn-panel-sm {
            margin-bottom: 10px;
        }`,
            `.xn-panel-sm .panel-heading {
            padding: 5px 15px;
        }`,
            `.xn-panel-sm .panel-heading .panel-title {
            font-size: 14px
        }`,
            `.tipsDataRow {
            max-height: 450px;
            overflow: auto
        }`,
            `.app-flow-process {
            border: 1px solid #ddd;
            padding: 4px;
            margin-bottom: 10px;
            border-radius: 3px;
            background-color: #fff;
        }`,
    ]
})
export class XnGemdaleView2Component implements OnInit {

    private recordId: string;

    svrConfig: any;

    pageTitle = '查看流程记录';
    pageDesc = '';

    baseInfo: any[] = [];
    contracts: any[] = [];
    flowId = '';
    isshowProgress: boolean; // 是否显示导航进度条
    public mainFlowId: string = this.svrConfig && this.svrConfig.record && this.svrConfig.record.mainFlowId || '';

    flowProcess = {
        show: false,
        proxy: 0,
        steped: 0
    };
    newSvrConfig: any;

    constructor(private xn: XnService,
                private route: ActivatedRoute,
                public hwModeService: HwModeService) {
    }

    ngOnInit() {
        this.route.queryParams.subscribe((params: Params) => {
            // this.recordId = params['id'];
            this.xn.api.dragon.post('/record/record/view', {
                recordId: params.recordId,
                appId: params.appId
            }).subscribe(json => {
                json.data.actions = json.data.actions.filter(action => action.operatorId !== '' && action.operatorName !== '');
                this.svrConfig = json.data;
                this.flowProcess = XnFlowUtils.calcFlowProcess(this.svrConfig.flow.flowId);
                this.mainFlowId = this.svrConfig.record.mainFlowId;

                this.svrConfig = XnFlowUtils.handleSvrConfig(this.svrConfig);
                this.flowId = this.svrConfig.flow.flowId;
                // 拷贝对象
                this.newSvrConfig = JSON.parse(JSON.stringify(this.svrConfig));
                this.buildRows();
                this.isshowProgress = this.flowId.startsWith('sub');

            });
        });
    }

    // 把svrConfig.checkers转换为rows对象，方便模板输出
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
            // console.log(this.contracts, 'contracts');
        } else {
            this.contracts = [];
        }
    }

    onSubmit() {
    }

    collapse(item) {
        const items = this.newSvrConfig.actions;
        if (!item.collapse || item.collapse === false) {
            items.forEach((x: any) => x.collapse = false); // 所有都至false
            item.collapse = true;
        } else if (item.collapse = true) {
            item.collapse = false;
        }
    }

    onCancel() {
        this.xn.user.navigateBack();
    }

    panelCssClass(action) {
        if (action.operator === 1) {
            return 'panel panel-info xn-panel-sm';
        }
        else if (action.operator === 2 || action.operator === 3) {
            return 'panel panel-warning xn-panel-sm';
        }
        else {
            console.log('@@ else operator', action.operator);
            return '';
        }
    }

    download() {
        this.xn.dragon.post('/list/main/flow_relate_file',
        { mainFlowId: this.mainFlowId, start: 0, length: Number.MAX_SAFE_INTEGER }).subscribe(x => {
            if (x.data && x.data.data && x.data.data.length) {
                let files = x.data.data.map((x) => JSON.parse(x[0]));
                files = XnUtils.uniqueBoth(files);
                const appId = this.xn.user.appId;
                const orgName = this.xn.user.orgName;
                const time = new Date().getTime();
                const filename = appId + '-' + orgName + '-' + time + '.zip';
                this.xn.dragon.download('/file/downFile', {
                    files,
                    mainFlowId: this.mainFlowId
                }).subscribe((v: any) => {
                    this.xn.dragon.save(v._body, filename);
                });
            } else {
                this.xn.msgBox.open(false, '无可下载项');
            }
        });
    }

}
