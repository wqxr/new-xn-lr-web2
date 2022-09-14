/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：flow-detail-record.component.ts
 * @summary：交易详情
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          增加功能1         2019-05-18
 * **********************************************************************
 */

import { Component, OnInit, Input, ViewContainerRef } from '@angular/core';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { BuildXmlModalComponent } from 'libs/shared/src/lib/public/modal/build-xml-modal.component';
import { MapAddModalComponent } from 'libs/shared/src/lib/public/modal/map-add-modal.component';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { AvengerPdfSignModalComponent } from 'libs/shared/src/lib/public/avenger/modal/pdf-sign-modal.component';
@Component({
    selector: 'xn-avenger-flow-detail-record-component',
    templateUrl: './flow-detail-record.component.html',
    styles: [
        `
            .app-flow-process {
                border: 1px solid #ddd;
                padding: 4px;
                margin-bottom: 10px;
                border-radius: 3px;
                background-color: #fff;
            }

            .box-body {
                font-size: 12px;
                padding-bottom: 20px;
            }

            .this-title-color {
                color: #9a9a9a;
            }

            .this-flex-status {
                width: 200px;
                padding-top: 7px;
            }

            .detail-status {
                font-size: 18px;
                color: #71b247;
            }

            .this-log {
                border: 1px solid #ddd;
                font-size: 13px;
                padding: 10px 0;
                border-radius: 5px;
                margin-bottom: 10px;
                background-color: #eee;
            }

            .this-log-seq {
                float: left;
                width: 60px;
                text-align: center;
                font-size: 18px;
                color: #00b9a3;
            }

            .this-seq {
                margin-right: 0;
                color: #00b9a3;
                border: 2px solid #00b9a3;
            }

            .this-log-line {
                overflow: hidden;
                line-height: 24px;
            }

            .this-operator-name {
                color: #ff5500;
            }

            .this-operator-action {
                color: #00b9a3;
            }

            .no-top {
                border: 0;
                margin-bottom: 0
            }

            .blue {
                color: #3c8dbc;
            }`
    ]
})
export class AvengerFlowDetailRecordComponent implements OnInit {

    @Input() params: any;
    @Input() mainFlowId: string;


    public showBuildBtn = false;
    public showAddBtn = false;
    public showMapBtn = false;
    public showAll = true;

    public steped = 0;
    public proxy = 0;
    public data: Array<number>; // 图片数组
    public nocanWatchDetail: string[] = ['wait_verification_500', 'verificating_500', 'factoring_sign_500', 'wait_loan_500', 'loaded_500', 'repayment_500']; // 里面的flowId不可让他查看子流程

    // 供应商操作的保存日志
    public supplierOperateAppId: any;

    constructor(public xn: XnService, private vcr: ViewContainerRef, private loading: LoadingService) {
    }

    ngOnInit() {
        this.steped = parseInt(this.params.status, 10);
        this.proxy = parseInt(this.params.isProxy, 10);
        this.showBuildBtn = this.xn.user.orgType === 3;
        this.showMapBtn = this.xn.user.orgType === 99; // 平台

        // 数字资产补录条件： 必须是保理商，必须状态大于5， 必须是复核。
        this.showAddBtn = this.xn.user.orgType === 3 && this.steped >= 5 && this.xn.user.roles.indexOf('reviewer') >= 0;
        for (const row of this.params.logs) {
            row.contracts = this.calcContract(row.contracts);
            row.operatorDesc = this.calcOperatorDesc(row);
        }
        if (this.params && this.params.billRegister && this.params.billRegister.length > 0) {
            this.params.billRegister = XnUtils.distinctArray(this.params.billRegister);
            this.params.billRegister = this.params.billRegister.filter(v => {
                return v !== '';
            });
        }

        // 过滤所有供应商的操作日志, 登陆企业为供应商时
        if (this.xn.user.orgType === 1) {
            this.supplierAppIdSet();
        }

    }

    /**
     *  判断是否显示可查看流程记录
     * @param paramsRow
     */
    public normalHasOrCanViewDetail(paramsRow): boolean {
        return paramsRow.appId === this.xn.user.appId
            && paramsRow.flowId !== 'flowIdIsNotChild'
            && paramsRow.flowId !== 'zichanchi'
            && paramsRow.flowId !== 'wait_verification_500'
            && paramsRow.flowId !== 'verificating_500'
            && paramsRow.flowId !== 'factoring_sign_500'
            && paramsRow.flowId !== 'wait_loan_500'
            && paramsRow.flowId !== 'loaded_500'
            && paramsRow.flowId !== 'repayment_500';
    }

    /**
     *  中介机构判断是否显示可查看流程记录
     * @param paramsRow
     */
    public intermediaryHasOrCanViewDetail(paramsRow): boolean {
        return [77, 102].includes(this.xn.user.orgType)
            && paramsRow.flowId !== 'flowIdIsNotChild'
            && paramsRow.flowId !== 'zichanchi'
            && paramsRow.flowId !== 'wait_verification_500'
            && paramsRow.flowId !== 'verificating_500'
            && paramsRow.flowId !== 'factoring_sign_500'
            && paramsRow.flowId !== 'wait_loan_500'
            && paramsRow.flowId !== 'loaded_500'
            && paramsRow.flowId !== 'repayment_500';
    }

    /**
     *  查看合同
     * @param paramCurrentContract
     */
    public showContract(paramCurrentContract: any): void {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, AvengerPdfSignModalComponent, {
            id: paramCurrentContract.id,
            label: paramCurrentContract.label,
            secret: paramCurrentContract.secret,
            readonly: true
        }).subscribe(() => {
        });
    }

    /**
     *  返回
     */
    public onCancel(): void {
        this.xn.user.navigateBack();
    }

    /**
     *  生成xml
     */
    public onBuildXml(): void {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, BuildXmlModalComponent, { mainFlowId: this.mainFlowId, isAvenger: true })
            .subscribe(() => {
            });
    }


    /**
     *  补录客户地图
     */
    public addMap(): void {
        this.xn.avenger.post('/data/map/get', {
            mainFlowId: this.mainFlowId
        }).subscribe(json => {
            const obj: any = {} as any; // 做成一个新的对象，带上一个mainFlowId
            let contracts: any = [];
            if (json.data.contractFile) {
                contracts = JSON.parse(json.data.contractFile);
            }

            const companyInfo = json.data.data;
            if (companyInfo.length > 0) {
                contracts = this.getContracts(companyInfo, contracts);
            }

            obj.contractInfo = JSON.stringify(contracts);
            obj.mainFlowId = this.mainFlowId;
            this.openView(obj);
        });

    }

    /**
     * 查看子流程  routerLink="/console/record/view/{{row.recordId}}"
     * @param paramRow
     */
    public checkSubprocess(paramRow: any) {
        this.xn.router.navigate([`/console/record/avenger/detail/view`],
            { queryParams: { recordId: paramRow.recordId, appId: paramRow.appId } });
    }

    /**
     *  下载附件
     *  供应商：只能下载自己上传的文件和合同；
     *  保理商、核心企业、中介机构：下载本交易ID下所有的文件和合同。
     */
    public download() {
        let files: any = [];
        const procedureIdArr = [];
        if (this.xn.user.orgType === 1) {
            let logsData: any[];
            if (this.params.logs.length) {
                logsData = this.params.logs
                    .filter(x => !!x.appId && x.appId === this.supplierOperateAppId.appId);
            }
            for (const action of logsData) {
                if (action.flowId !== '') {
                    // 找出所有的流程ID
                    if (procedureIdArr.indexOf(action.flowId) === -1) {
                        procedureIdArr.push(action.flowId);
                    }
                }
            }

            for (const proceId of procedureIdArr) {
                const arr: any = [];
                for (const action of logsData) {
                    if (action.flowId === proceId) {
                        // 构建一个数组，选出最后一个流程id
                        arr.push(action);
                    }
                }
                files = this.selectFiles(arr[arr.length - 1], files);
            }
        } else {
            for (const action of this.params.logs) {
                if (action.flowId !== '') {
                    // 找出所有的流程ID
                    if (procedureIdArr.indexOf(action.flowId) === -1) {
                        procedureIdArr.push(action.flowId);
                    }
                }
            }
            for (const proceId of procedureIdArr) {
                const arr: any = [];
                for (const action of this.params.logs) {
                    if (action.flowId === proceId) {
                        // 构建一个数组，选出最后一个流程id
                        arr.push(action);
                    }
                }
                // 这里是因为保理商收款可能有多个，所以不是取最后一个，而是全部都要
                for (const row of arr) {
                    if (row.flowId === 'factoring_repayment') {
                        files = this.selectFiles(row, files);
                    } else {
                        files = this.selectFiles(arr[arr.length - 1], files);
                    }
                }
            }
        }
        if (files.length) {
            // 拼接文件名
            const appId = this.xn.user.appId;
            const orgName = this.xn.user.orgName;
            const time = new Date().getTime();
            const filename = appId + '-' + orgName + '-' + time + '.zip';

            XnUtils.checkLoading(this);
            this.xn.file.download(
                files,
                this.mainFlowId,
                true
            ).subscribe((v: any) => {
                this.loading.close();
                this.xn.api.save(v._body, filename);
            });
        } else {
            this.xn.msgBox.open(false, '无可下载项');
        }

    }

    /**
     *  格式化需要下载的文件
     * @param paramAction
     * @param paramFileArr
     */
    private selectFiles(paramAction, paramFileArr): Array<any> {
        // 所有文件子流程id（不包含保理放款和回款）
        const checkerFile = [];
        // 放款和回款的格式不一样，单独处理
        const checkerMoneyFile = ['factoring_loan', 'factoring_repayment'];
        this.params.logs.map(v => {
            if (v && v.flowId && (v.flowId !== 'factoring_loan' || v.flowId !== 'factoring_repayment')) {
                checkerFile.push(v.flowId);
            }
        });
        // 其他文件信息
        for (const check of checkerFile) {
            if (paramAction && paramAction.flowId && paramAction.flowId === check) {
                const checkers = JSON.parse(paramAction.checkers);
                this.getCheckerFile(checkers, paramFileArr);
            }
        }

        for (const check of checkerMoneyFile) {
            if (paramAction && paramAction.flowId && paramAction.flowId === check) {
                const checkers = JSON.parse(paramAction.checkers);
                this.getMoneyCheckerFile(checkers, paramFileArr);
            }
        }
        // 合同文件
        if (paramAction && paramAction.contracts) {
            for (const contract of paramAction.contracts) {
                paramFileArr.push(contract);
            }
        }
        // 去除重复的文件
        paramFileArr = XnUtils.uniqueBoth(paramFileArr);
        return paramFileArr;
    }

    /**
     *  获取checker项中上传的文件
     * @param checkers 配置编辑页面的checkers
     * @param fileArr  所有文件属性名
     */
    private getCheckerFile(checkers, fileArr): Array<any> {
        // 合同文件
        const contractArr = ['contractFile', 'contractInfo'];
        // 图片，pdf ,excel等格式文件
        const fileArrays = [
            'dockFile',
            'honourFile',
            'invoiceFile',
            'honourInfo',
            'invoiceInfo',
            'checkFile',
            'goodsFile',
            'constitutionFile',
            'certificateFile',
            'supervisorFile',
            'otherFile',
            'performanceFile', // 履约证明
            'proofFile',
            'ZDWFile',
            'qrs',  // 确认书
            'pz',   // 凭证
            'qrsReal',  // 实际确认书
            'paymentFile',  // 付款文件
            'receivableFile', // 应收账款文件
            'cotherFile',
            'supplyInvoice', // 补充发票文件
            'businessLicenseFile', // 营业执照
            'businessLicense',
            'projectLicense', // 项目公司执照
            'projectAuthority',
            'payFile',
            'lvyue',
            'otherFile',
            'contract',
            'invoice',
            'contractDownstream'
        ];
        const process = ['begin', 'operate'];
        for (const contract of contractArr) {
            for (const proce of process) {
                if (checkers && checkers[proce] && checkers[proce][contract]) {
                    for (const row of JSON.parse(checkers[proce][contract])) {
                        // row.files 可能是{}，[{}]
                        if (row.files instanceof Array) {
                            for (const file of row.files) {
                                file.fileTitle = contract;
                                fileArr.push(file);
                            }
                        } else {
                            for (const file of row.files.img) {
                                file.fileTitle = contract;
                                fileArr.push(file);
                            }
                        }
                    }
                }
            }
        }

        // 遍历图片
        for (const infile of fileArrays) {
            for (const proce of process) {
                if (checkers && checkers[proce] && checkers[proce][infile]) {
                    const tf = JSON.parse(checkers[proce][infile]);
                    if (Array.isArray(tf)) {
                        if (infile === 'contract' || infile === 'contractDownstream') {
                            let contractFile;
                            tf.forEach(x => {

                                contractFile = x.contractFile;

                            });
                            checkers[proce][infile] = contractFile;
                        } else if (infile === 'invoice') {
                            const contractFile = [];
                            tf.forEach(x => {
                                contractFile.push({ fileId: x.fileId, fileName: x.fileName, filePath: x.filePath });

                            });
                            checkers[proce][infile] = JSON.stringify(contractFile);
                        } else if (infile === 'lvyue') {
                            let contractFile;
                            tf.forEach(x => {

                                contractFile = x.certificatecontractPic;

                            });
                            checkers[proce][infile] = contractFile;
                        }
                        for (const file of JSON.parse(checkers[proce][infile])) {

                            if (file && file.fileId) {
                                file.fileTitle = infile;
                                fileArr.push(file);
                            }
                            if (file && file.files) {
                                for (const i of file.files.img) {
                                    i.fileTitle = infile;
                                    fileArr.push(i);
                                }
                            }
                        }
                    } else {
                        if (tf.fileId) {
                            tf.fileTitle = infile;
                            fileArr.push(tf);
                        }
                    }

                }
            }
        }
        return fileArr;
    }

    /**
     * 放款和回款单独处理
     * @param paramCheckers
     * @param fileArr
     */
    private getMoneyCheckerFile(paramCheckers, fileArr) {
        const process = ['begin', 'operate'];
        for (const proce of process) {
            if (paramCheckers && paramCheckers[proce] && paramCheckers[proce].pic) {
                for (const file of JSON.parse(paramCheckers[proce].pic)) {
                    file.fileTitle = proce;
                    fileArr.push(file);
                }
            }
        }
        return fileArr;
    }

    /**
     *  打开客户地图补充弹框
     * @param paramViewData
     */
    private openView(paramViewData: string) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, MapAddModalComponent, paramViewData)
            .subscribe(() => {
            });
    }

    /**
     * 格式化合同
     * @param paramCompanyInfo
     * @param paramContracts
     */
    private getContracts(paramCompanyInfo, paramContracts) {
        // 时间排序
        paramCompanyInfo.sort(function(a: any, b: any): number {
            if (a.updateTime > b.updateTime) {
                return 1;
            } else {
                return -1;
            }
        });
        const contractInfoData = paramCompanyInfo.slice(paramContracts.length * -1);

        // 拼接数据
        for (let i = 0; i < paramContracts.length; ++i) {
            paramContracts[i].appName = contractInfoData[i].appName;
            paramContracts[i].orgType = contractInfoData[i].appType;
            const objCity = {} as any;
            const objIndustry = {} as any;
            const commodityType = {} as any;
            objCity.first = contractInfoData[i].orgCityFirst;
            objCity.second = contractInfoData[i].orgCitySecond;
            objIndustry.first = contractInfoData[i].orgIndustryFirst;
            objIndustry.second = contractInfoData[i].orgIndustrySecond;
            paramContracts[i].orgIndustry = JSON.stringify(objIndustry);
            paramContracts[i].orgCity = JSON.stringify(objCity);
            paramContracts[i].commodity = JSON.stringify(commodityType);
        }

        return paramContracts;
    }

    /**
     * 递归解析合同
     * @param paramContract
     */
    private calcContract(paramContract: any): any {
        if (typeof paramContract === 'string') {
            return this.calcContract(JSON.parse(paramContract));
        }
        return paramContract;
    }

    /**
     * 找出所有企业类型为供应商的 appId 合集
     */
    private supplierAppIdSet() {
        this.xn.api.post('/custom/vanke_v5/app/get_app',
            { orgName: this.xn.user.orgName }).subscribe(x => {
                this.supplierOperateAppId = x.data;
            });
    }

    /**
     *  构建流程提示
     * @param paramRow
     */
    private calcOperatorDesc(paramRow: any): string {
        if (paramRow.operator === 1) {
            return paramRow.flowId === 'financing'
                ? '申请'
                : paramRow.flowId === 'financing_bank7' && paramRow.memo.indexOf('保理商向供应商退款并背书') >= 0
                    ? '拒绝并发起退款'
                    : '审核通过';
        } else if (paramRow.operator === 2) {
            return '退回';
        } else if (paramRow.operator === 3) {
            return '中止';
        } else {
            return paramRow.operator.toString();
        }
    }
}
