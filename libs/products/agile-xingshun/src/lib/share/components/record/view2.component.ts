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
export class AgileXingshunView2Component implements OnInit {

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
        console.log('this.svrConfig: ', this.svrConfig);
        let files: any = [];
        // let fileArr: any = [];
        const temp: any = [];

        const procedureIdArr = [];
        const proceIdArr = [];

        // 测试数据
        // this.svrConfig = configData.data;
        // console.log("this.svrConfigAfter: ", this.svrConfig);

        for (const action of this.svrConfig.actions) {
            if (action.procedureId !== '') {
                // 找出所有的流程ID
                if (procedureIdArr.indexOf(action.procedureId) === -1) {
                    procedureIdArr.push(action.procedureId);
                }
            }
        }


        for (const proceId of procedureIdArr) {
            const arr: any = [];
            for (const action of this.svrConfig.actions) {
                if (action.procedureId === proceId) {
                    // 构建一个数组，选出最后一个流程id
                    arr.push(action);
                }
            }
            files = this.selectFiles(arr[arr.length - 1], files);
        }
        if (files.length) {
            // 拼接文件名
            const appId = this.xn.user.appId;
            const orgName = this.xn.user.orgName;
            const time = new Date().getTime();
            const filename = appId + '-' + orgName + '-' + time + '.zip';
            this.xn.loading.open();
            this.xn.api.dragon.download('/file/down_file', {
                files
            }).subscribe((v: any) => {
                console.log('download subscribe', v);
                this.xn.loading.close();
                this.xn.api.dragon.save(v._body, filename);
            });
        } else {
            this.xn.msgBox.open(false, '无可下载项');
        }
    }

    selectFiles(action, fileArr) {
        const newFileArrId: any = [];

        for (const checker of action.checkers) {
            if (!checker.data) {
                continue;
            }
            if (checker.type === 'file') {
                fileArr.push(checker && checker.data && JSON.parse(checker.data));
            }
            if (checker.type === 'mfile' || checker.type === 'invoice' || checker.type === 'honour') {
                for (const file of JSON.parse(checker.data)) {
                    fileArr.push(file);
                }
            }
            if (checker.type === 'contract') {
                for (const row of JSON.parse(checker.data)) {
                    for (const file of row.files) {
                        fileArr.push(file);
                    }
                }
            }
        }

        // 数组去重复
        const hash = {} as any;
        fileArr = fileArr.reduce(function(item, next) {
            hash[next.fileId] ? '' : hash[next.fileId] = true && item.push(next);
            return item;
        }, []);

        console.log('fileArr: ', fileArr);
        return fileArr;
    }
}
