import { Component, OnInit, Input, ViewContainerRef } from '@angular/core';
import { ShAuditStandardModalComponent } from 'libs/products/bank-shanghai/src/lib/share/modal/audit-standard-modal.component';
import { ShangHaiFinancingContractModalComponent } from 'libs/products/bank-shanghai/src/lib/share/modal/financing-asign-contract.modal';
import { ShangHaiMfilesViewModalComponent } from 'libs/products/bank-shanghai/src/lib/share/modal/mfiles-view-modal.component';
import { ShangHaiPdfSignModalComponent } from 'libs/products/bank-shanghai/src/lib/share/modal/pdf-sign-modal.component';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { BuildXmlModalComponent } from 'libs/shared/src/lib/public/modal/build-xml-modal.component';
import { MapAddModalComponent } from 'libs/shared/src/lib/public/modal/map-add-modal.component';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { XnService } from 'libs/shared/src/lib/services/xn.service';

@Component({
    selector: 'xn-oct-sh-flow-detail-record-component',
    templateUrl: './flow-detail-record.component.html',
    styles: [
        `.box-body {
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
export class OctFlowDetailRecordComponent implements OnInit {
    @Input() params: any;
    @Input() mainFlowId: string;

    public showBuildBtn = false;
    public showAddBtn = false;
    public showMapBtn = false;

    public steped = 0;
    public proxy = 0;
    public data: Array<number>; // ????????????
    public showAll = true;
    // ??????????????????????????????
    public supplierOperateAppId: any;
    public mainFlowIds = [
        'contract_20200611_37309_wk',
        'contract_20200611_37308_wk',
        'contract_20200611_37297_wk',
    ];

    constructor(public xn: XnService, private vcr: ViewContainerRef, private loading: LoadingService) {
    }

    ngOnInit() {
        this.steped = parseInt(this.params.status, 10);
        this.proxy = parseInt(this.params.isProxy, 10);
        this.showBuildBtn = this.xn.user.orgType === 3;
        this.showMapBtn = this.xn.user.orgType === 99; // ??????

        // ??????????????????????????? ???????????????????????????????????????5??? ??????????????????
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

        // ????????????????????????????????????, ???????????????????????????
        if (this.xn.user.orgType === 1) {
            this.supplierAppIdSet();
        }
    }

    /**
     *  ???????????????--???????????????
     * @param paramCons
     */
    public againSignCons(paramCons: any): void {
        let contract = paramCons;
        if (contract.length === 0) {
            return this.xn.msgBox.open(false, '????????????????????????????????????');
        }
        contract = contract.filter((x: any) => x.label.includes('????????????????????????????????????'));
        contract.forEach(element => {
            if (!element.config) {
                element.config = {
                    text: ''
                };
            }
        });
        contract.forEach(x => {
            if (x.label.includes('????????????????????????????????????')) {
                x.config.text = '?????????????????????????????????????????????';
            } else {
                x.config.text = '????????????';
            }
        });
        XnModalUtils.openInViewContainer(this.xn, this.vcr, ShangHaiFinancingContractModalComponent, contract).subscribe(() => {
        });
    }

    /**
     * ??????????????????--???????????????
     * @param paramCons
     */
    public againSign(paramCons: any): void {
        const contract = paramCons;
        if (contract.length === 0) {
            return this.xn.msgBox.open(false, '????????????????????????????????????');
        }
        // contract = contract.filter((x: any) => x.label === '???????????????????????????');
        contract.forEach(element => {
            if (!element.config) {
                element.config = {
                    text: ''
                };
            }
        });
        contract.forEach(x => {
            if (x.label.includes('????????????????????????????????????')) {
                x.config.text = '?????????????????????????????????????????????';
            } else if (x.label.includes('???????????????????????????') || x.label.includes('??????????????????????????????')) {
                x.config.text = '?????????????????????';
            } else if (x.label.includes('?????????????????????????????????')) {
                x.config.text = '?????????';
            } else if (x.label === '????????????-??????') {
                x.config.text = '?????????????????????';
            } else if (x.label.includes('??????')) {
                x.config.text = '????????? ????????????';
            } else if (x.label.includes('??????')) {
                x.config.text = '??? ??? ??? ???  ??? ??? ??? ??? ??? ??? ??? ??????';
            } else {
                x.config.text = '????????????';
            }
        });
        XnModalUtils.openInViewContainer(this.xn, this.vcr, ShangHaiFinancingContractModalComponent, contract).subscribe(() => {
        });
    }

    /**
     *  ???????????????????????????????????????
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
            && paramsRow.flowId !== 'repayment_500'
            && paramsRow.flowId !== 'vanke_suspend';
    }

    /**
     *  ???????????????????????????????????????????????????
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
            && paramsRow.flowId !== 'repayment_500'
            && paramsRow.flowId !== 'vanke_suspend';
    }

    /**
     * @param paramCurrentContract ??????????????????
     */
    public showAuditingstandard(paramsRow): boolean {
        return (paramsRow.appId === this.xn.user.appId || this.xn.user.orgType === 3) &&
            paramsRow.flowId === 'so_platform_verify';
    }

    /**
     * ??????????????????
     */
    public viewaduitStandard(row: any) {
        const contractObj = [];
        // ??????
        const invCheckers = [];
        const step = '';
        const contractTemp = XnUtils.parseObject(this.params.dealContract, []);
        const invoiceObj = XnUtils.parseObject(this.params.invoice, []);
        const invoiceArray = [];
        invoiceObj.forEach((invoice) => {
            invoiceArray.push({
                invoiceNum: invoice.invoiceNum,
                invoiceCode: invoice.invoiceCode,
                isHistory: invoice.mainFlowIds && this.judgeDataType(invoice.mainFlowIds) && invoice.mainFlowIds.length ? true : false
            });
        });
        const params: any = {
            mainFlowId: this.params.mainFlowId,
            invoice: invoiceArray,
            contractJia: contractTemp[0]?.contractJia || '',   // ????????????????????????
            contractYi: contractTemp[0]?.contractYi || '',   // ????????????????????????
            payType: contractTemp[0]?.payType || '',    // ????????????
            percentOutputValue: contractTemp[0]?.percentOutputValue || '',   // ??????????????????
            payRate: contractTemp[0]?.payRate || '',    // ????????????
            contractSignTime: contractTemp[0]?.contractSignTime || ''      // ??????????????????
        };
        if (['so_platform_verify'].includes(row.flowId)) {
            params['debtUnit'] = row.orgName || '';
            params['debtUnitId'] = row.appId || '';
        }
        this.xn.dragon.post('/list/main/checker_list_box', params).subscribe(x => {
            if (x.ret === 0 && x.data && x.data.length > 0) {
                const params1 = Object.assign({}, { value: '', checkers: x.data });
                XnModalUtils.openInViewContainer(this.xn, this.vcr, ShAuditStandardModalComponent, params1).subscribe(() => {
                });
            }
        });
    }

    /**
     *  ??????????????????
     * @param value
     */
    public judgeDataType(value: any): boolean {
        if (typeof Array.isArray === 'function') {
            return Array.isArray(value);
        } else {
            return Object.prototype.toString.call(value) === '[object Array]';
        }
    }

    /**
     *  ????????????
     * @param paramCurrentContract
     */
    public showContract(paramCurrentContract: any): void {
        if (!!paramCurrentContract.secret) {
            // ????????????[{"id":"","label":"","secret":"","signer":""},...]
            const param = {
                id: paramCurrentContract.id,
                label: paramCurrentContract.label,
                secret: paramCurrentContract.secret,
                readonly: true
            };
            XnModalUtils.openInViewContainer(this.xn, this.vcr, ShangHaiPdfSignModalComponent, param).subscribe(() => {
            });
        } else if (!!paramCurrentContract.fileId) {
            // ???????????????[{"fileId": "","fileName": "","filePath": ""}]
            XnModalUtils.openInViewContainer(this.xn, this.vcr, ShangHaiMfilesViewModalComponent, [paramCurrentContract]).subscribe(() => {
            });
        }
    }

    /**
     *  ??????
     */
    public onCancel(): void {
        this.xn.user.navigateBack();
    }

    /**
     *  ??????xml
     */
    public onBuildXml(): void {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, BuildXmlModalComponent, { mainFlowId: this.mainFlowId, isAvenger: false })
        .subscribe(() => {});
    }

    /**
     *  ??????????????????
     */
    public addMap(): void {
        this.xn.api.post('/data/map/get', { mainFlowId: this.mainFlowId }).subscribe(json => {
            const obj: any = {} as any; // ???????????????????????????????????????mainFlowId
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
     * ???????????????  routerLink="/record/view/{{row.recordId}}"
     * @param paramRow
     */
    public checkSubprocess(paramRow: any) {
        this.xn.router.navigate([`/oct-shanghai/record/view/${paramRow.recordId}`]);
        // { queryParams: { recordId: paramRow.recordId, appId: paramRow.appId } });
    }

    /**
     *  ????????????
     *  ?????????????????????????????????????????????????????????
     *  ?????????????????????????????????????????????????????????ID??????????????????????????????
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
                    this.xn.msgBox.open(false, '???????????????');
                }
            })
        }

    /**
     *  ??????????????????????????????
     * @param paramAction
     * @param paramFileArr
     */
    private selectFiles(paramAction, paramFileArr): Array<any> {
        // ?????????????????????id????????????????????????????????????
        const checkerFile = [];
        // ????????????????????????????????????????????????
        const checkerMoneyFile = ['factoring_loan', 'factoring_repayment'];
        this.params.logs.map(v => {
            if (v && v.flowId && (v.flowId !== 'factoring_loan' || v.flowId !== 'factoring_repayment')) {
                checkerFile.push(v.flowId);
            }
        });
        // ??????????????????
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
        // ????????????
        if (paramAction && paramAction.contracts) {
            for (const contract of paramAction.contracts) {
                paramFileArr.push(contract);
            }
        }
        // ?????????????????????
        paramFileArr = XnUtils.uniqueBoth(paramFileArr);
        return paramFileArr;
    }

    /**
     *  ??????checker?????????????????????
     * @param checkers ?????????????????????checkers
     * @param fileArr  ?????????????????????
     */
    private getCheckerFile(checkers, fileArr): Array<any> {
        // ????????????
        const contractArr = ['contractFile', 'contractInfo'];
        // ?????????pdf ,excel???????????????
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
            'performanceFile', // ????????????
            'proofFile',
            'ZDWFile',
            'qrs',  // ?????????
            'pz',   // ??????
            'qrsReal',  // ???????????????
            'paymentFile',  // ????????????
            'receivableFile', // ??????????????????
            'cotherFile',
            'supplyInvoice', // ??????????????????
            'businessLicenseFile', // ????????????
            'businessLicense',
            'projectLicense', // ??????????????????
            'projectAuthority',
            'payFile',
            'contractFile',
            'companyDecision',
            'invoice',
            'otherFile',
            'factoringOtherFile',
            'checkCertFile',
            'dealContract',
            'registerCertFile',
            'projectBusinessLicense',
        ];
        const process = ['begin', 'operate'];
        for (const contract of contractArr) {
            for (const proce of process) {
                if (checkers && checkers[proce] && checkers[proce][contract]) {
                    for (const row of JSON.parse(checkers[proce][contract])) {
                        // row.files ?????????{}???[{}]
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

        // ????????????
        for (const infile of fileArrays) {
            for (const proce of process) {
                if (checkers && checkers[proce] && checkers[proce][infile]) {
                    const tf = JSON.parse(checkers[proce][infile]);
                    if (Array.isArray(tf)) {
                        if (infile === 'dealContract') {
                            const contractFile = [];
                            if (typeof tf[0] === 'string') {
                                const isArrayList = JSON.parse(tf[0]);
                                isArrayList.forEach(x => {
                                    contractFile.push({ fileId: x.fileId, fileName: x.fileName, filePath: x.filePath });
                                });

                            } else {
                                for (let i = 0; i < tf.length; i++) {
                                    JSON.parse(tf[0].contractFile).forEach(x => {
                                        contractFile.push({ fileId: x.fileId, fileName: x.fileName, filePath: x.filePath });
                                    });
                                }
                            }
                            checkers[proce][infile] = JSON.stringify(contractFile);
                        } else if (infile === 'invoice') {
                            const contractFile = [];
                            tf.forEach(x => {
                                contractFile.push({ fileId: x.fileId, fileName: x.fileName, filePath: x.filePath });

                            });
                            checkers[proce][infile] = JSON.stringify(contractFile);
                        } else if (infile === 'performanceFile') {
                            const contractFile = [];
                            if (tf.length === 0) {
                                // contractFile = '';
                            } else {
                                if (tf[0].performanceFile === undefined) {
                                    // const isArrayList = JSON.parse(tf[0]);
                                    tf.forEach(x => {
                                        contractFile.push({ fileId: x.fileId, fileName: x.fileName, filePath: x.filePath });
                                    });
                                } else {
                                    for (let i = 0; i < tf.length; i++) {
                                        JSON.parse(tf[0].performanceFile).forEach(x => {
                                            contractFile.push({ fileId: x.fileId, fileName: x.fileName, filePath: x.filePath });
                                        });
                                    }
                                }
                                // contractFile = JSON.stringify(contractFile);
                            }
                            checkers[proce][infile] = JSON.stringify(contractFile);
                        } else if (infile === 'otherFile') {
                            const contractFile = [];
                            if (tf.length === 0) {
                                // contractFile = '';
                            } else {
                                if (tf[0].otherFile === undefined) {
                                    // const isArrayList = JSON.parse(tf[0]);
                                    tf.forEach(x => {
                                        contractFile.push({ fileId: x.fileId, fileName: x.fileName, filePath: x.filePath });
                                    });
                                } else {
                                    if (tf[0].otherFile !== '') {
                                        for (let i = 0; i < tf.length; i++) {
                                            JSON.parse(tf[0].otherFile).forEach(x => {
                                                contractFile.push({ fileId: x.fileId, fileName: x.fileName, filePath: x.filePath });
                                            });
                                        }
                                    }
                                }
                            }
                            checkers[proce][infile] = JSON.stringify(contractFile);
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
     * ???????????????????????????
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
     *  ??????????????????????????????
     * @param paramViewData
     */
    private openView(paramViewData: string) {
        XnModalUtils.openInViewContainer(this.xn, this.vcr, MapAddModalComponent, paramViewData)
        .subscribe(() => {});
    }

    /**
     * ???????????????
     * @param paramCompanyInfo
     * @param paramContracts
     */
    private getContracts(paramCompanyInfo, paramContracts) {
        // ????????????
        paramCompanyInfo.sort(function (a: any, b: any): number {
            if (a.updateTime > b.updateTime) {
                return 1;
            } else {
                return -1;
            }
        });
        const contractInfoData = paramCompanyInfo.slice(paramContracts.length * -1);
        // ????????????
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
     * ??????????????????
     * @param contracts ????????????
     */
    private calcContract(contracts: any): any {
        if (typeof contracts === 'string' && contracts.length > 0) {
            return this.calcContract(JSON.parse(contracts));
        }
        return contracts;
    }

    /**
     * ??????????????????????????????????????? appId ??????
     */
    private supplierAppIdSet() {
        this.xn.api.post('/custom/vanke_v5/app/get_app', { orgName: this.xn.user.orgName }).subscribe(x => {
            this.supplierOperateAppId = x.data;
        });
    }

    /**
     *  ??????????????????
     * @param paramRow
     */
    private calcOperatorDesc(paramRow: any): string {
        if (paramRow.operator === 1) {
            return paramRow.flowId === 'financing'
                ? '??????'
                : paramRow.flowId === 'financing_bank7' && paramRow.memo.indexOf('????????????????????????????????????') >= 0
                    ? '?????????????????????'
                    : '????????????';
        } else if (paramRow.operator === 2) {
            return '??????';
        } else if (paramRow.operator === 3) {
            return '??????';
        } else {
            return paramRow.operator.toString();
        }
    }

    /**
     *  ???????????????????????? todo ????????????
     * type:1 ????????????????????????type???2  ????????????????????????
     * @param paramCons
     */
    public againSignCon(type: number): void {
        if (type === 1) {
            this.SignAgain('/re_sign_contract/signMainContract', '/re_sign_contract/update');
        } else {
            this.SignAgain('/re_sign_contract/sign', '/re_sign_contract/update');
        }
    }

    SignAgain(firstUrl: string, secondUrl: string) {
        this.xn.api.dragon.post(firstUrl, { mainFlowId: this.mainFlowId }).subscribe(json => {
            // json.data.flowId = 'contract_20200106_29992';
            const contracts = json.data;
            contracts.forEach(element => {
                if (!element.config) {
                    element.config = {
                        text: ''
                    };
                }
            });
            contracts.forEach(x => {
                if (x.label.includes('???????????????????????????')) {
                    x.config.text = '?????????????????????';
                } else {
                    x.config.text = '????????????';
                }
            });
            XnModalUtils.openInViewContainer(this.xn, this.vcr, ShangHaiFinancingContractModalComponent, contracts).subscribe((x) => {
                this.xn.loading.open();
                // ??????????????????
                if (x === 'ok') {
                    // ????????????????????????????????????????????????
                    const p = json.data;
                    this.xn.api.dragon.post(secondUrl, { mainFlowId: this.mainFlowId, contracts: p }).subscribe((x) => {
                        if (x.ret === 0) {
                            // this.cdr.markForCheck();
                        }
                    });
                }
                this.xn.loading.close();
            });
        });
    }
}
