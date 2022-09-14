/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：view.component.component.ts
 * @summary：查看流程
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 wangqing          增加功能1         2019-08-28
 * **********************************************************************
 */

import { Component, OnInit } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import XnFlowUtils from 'libs/shared/src/lib/common/xn-flow-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { FormGroup } from '@angular/forms';


@Component({
    templateUrl: './view.component.html',
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
export class CountryGradenViewComponent implements OnInit {

    private recordId: string;

    svrConfig: any;
    mainForm: FormGroup;

    pageTitle = '查看流程记录';
    pageDesc = '';

    baseInfo: any[] = [];
    contracts: any[] = [];
    newSvrConfig: any;
    flowId = '';
    public mainFlowId: string = this.svrConfig && this.svrConfig.record && this.svrConfig.record.mainFlowId || '';
    isshowProgress: boolean; // 是否显示导航进度条
    data: any[] = [];

    constructor(private xn: XnService,
                private route: ActivatedRoute,
                private loading: LoadingService,
                public hwModeService: HwModeService) {
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

    // private selectFiles(action, fileArr) {
    //     for (const checker of action.checkers) {
    //         if (checker.data) {
    //             if (checker.type === 'file') {
    //                 if (checker.data !== '') {
    //                     fileArr.push(JSON.parse(checker.data)[0]);

    //                 }
    //             }
    //             if ((checker.type === 'dragonMfile' || checker.type === 'honour' || checker.type === 'invoice-vanke' || checker.type === 'mfile-info') && checker.checkerId !== 'otherFile') {
    //                 for (const file of JSON.parse(checker.data)) {
    //                     fileArr.push(file);
    //                 }
    //             }
    //             if (checker.checkerId === 'invoice') {
    //                 // let contractFile = [];
    //                 JSON.parse(checker.data).forEach(x => {
    //                     fileArr.push({ fileId: x.fileId, fileName: x.fileName, filePath: x.filePath });

    //                 });
    //             }
    //             if (checker.type === 'contract') {
    //                 for (const row of JSON.parse(checker.data)) {
    //                     for (const file of row.files) {
    //                         fileArr.push(file);
    //                     }
    //                 }
    //             }

    //             if (checker.checkerId === 'performanceFile') {
    //                 const tf = JSON.parse(checker.data);
    //                 if (tf.length === 0) {
    //                     // contractFile = '';
    //                 } else {
    //                     if (tf[0].performanceFile === undefined) {
    //                         // const isArrayList = JSON.parse(tf[0]);
    //                         tf.forEach(x => {
    //                             fileArr.push({ fileId: x.fileId, fileName: x.fileName, filePath: x.filePath });
    //                         });
    //                     } else {
    //                         for (let i = 0; i < tf.length; i++) {
    //                             JSON.parse(tf[0].performanceFile).forEach(x => {
    //                                 fileArr.push({ fileId: x.fileId, fileName: x.fileName, filePath: x.filePath });
    //                             });
    //                         }
    //                     }
    //                 }
    //             }
    //             if (checker.checkerId === 'otherFile') {
    //                 const tf = JSON.parse(checker.data);
    //                 if (tf.length === 0) {
    //                 } else {
    //                     if (tf[0].otherFile === undefined) {
    //                         tf.forEach(x => {
    //                             fileArr.push({ fileId: x.fileId, fileName: x.fileName, filePath: x.filePath });
    //                         });
    //                     } else {
    //                         if (tf[0].otherFile !== '') {
    //                             for (let i = 0; i < tf.length; i++) {
    //                                 JSON.parse(tf[0].otherFile).forEach(x => {
    //                                     fileArr.push({ fileId: x.fileId, fileName: x.fileName, filePath: x.filePath });
    //                                 });
    //                             }
    //                         }

    //                     }

    //                 }
    //             }
    //             if (checker.type === 'plat-contract') {
    //                 const tf = JSON.parse(checker.data);

    //                 for (let i = 0; i < tf.length; i++) {
    //                     JSON.parse(tf[0].contractFile).forEach(x => {
    //                         fileArr.push({ fileId: x.fileId, fileName: x.fileName, filePath: x.filePath });
    //                     });
    //                 }
    //             }
    //             if (checker.type === 'deal-contract') {
    //                 const tf = JSON.parse(checker.data);

    //                 const isArrayList = JSON.parse(tf[0]);
    //                 isArrayList.forEach(x => {
    //                     fileArr.push({ fileId: x.fileId, fileName: x.fileName, filePath: x.filePath });
    //                 });
    //             }
    //             if (checker.type === 'contract-office' || checker.type === 'contract-vanke') {
    //                 for (const row of JSON.parse(checker.data)) {
    //                     for (const file of row.files.img) {
    //                         fileArr.push(file);
    //                     }
    //                 }
    //             }
    //         }
    //     }

    //     // 添加合同
    //     if (action.contracts !== '') {
    //         for (const contract of JSON.parse(action.contracts)) {
    //             if (contract.hide !== true) {
    //                 fileArr.push(contract);
    //             }
    //         }
    //     }

    //     // 数组去重复
    //     fileArr = XnUtils.uniqueBoth(fileArr);

    //     return fileArr;
    // }

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
