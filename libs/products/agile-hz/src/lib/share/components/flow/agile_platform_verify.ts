/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：AgilePlatformVerify
 * @summary：雅居乐-恒泽 平台审核流程
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                hucongying       雅居乐改造项目      2021-01-29
 * **********************************************************************
 */
import { Observable, of } from 'rxjs';
import { IFlowCustom } from './flow-custom';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { XNCurrency } from 'libs/shared/src/lib/common/xncurrency';

export class AgilePlatformVerify implements IFlowCustom {
    constructor(private xn: XnService, private loading: LoadingService) { }

    preShow(): Observable<any> {
        return of(null);
    }

    postShow(svrConfig: any): Observable<any> {
        return of(null);
    }

    postGetSvrConfig(svrConfig: any): void { }
    afterSubmitandGettip(
        svrConfig: any,
        formValue: any,
        x: any
    ): Observable<any> {
        // console.log("svr==", svrConfig, x);
        if (svrConfig.procedure.procedureId === 'operate') {
            this.xn.msgBox.open(
                false,
                [
                    '提交成功',
                    '下一步请复核人在【首页-待办任务】中完成【复核】的待办任务',
                ],
                () => { }
            );
        } else if (svrConfig.procedure.procedureId === 'review') {
            if (x && x.ret === 0 && x.data && x.data.backMsg) {
                this.xn.msgBox.open(false, x.data.backMsg, () => { });
            } else {
                this.xn.msgBox.open(
                    false,
                    [
                        '平台审核通过，请耐心等待保理商风险审查。',
                        `该笔交易进度可在交易列表中查看，交易id为${svrConfig.record.mainFlowId}`,
                    ],
                    () => { }
                );
            }
        }
        return of(null);
    }

    preSubmit(svrConfig: any, formValue: any): Observable<any> {
        if (svrConfig.procedure.procedureId === 'operate') {
            const checkCertFile = formValue.checkCertFile;
            const registerCertFile = formValue.registerCertFile;
            const isAddFiles = formValue.isAddFiles;
            const certificateFile = formValue.certificateFile;
            const hasDealContract = JSON.parse(formValue.dealContract).every(
                (contract) =>
                    !!contract.contractName &&
                    !!contract.contractId &&
                    contract.contractMoney !== '' &&
                    !!contract.payRate &&
                    !!contract.contractType &&
                    !!contract.contractJia &&
                    !!contract.contractYi
            );
            const hasPerformanceFile = formValue.performanceFile ? JSON.parse(
                formValue.performanceFile
            ).every(
                (performance) =>
                    !!performance.payType &&
                    performance.percentOutputValue !== ''
            ) : '';
            let payables = formValue.receive.toString().replace(/,/g, '');
            payables = new XNCurrency(payables).value;

            const contractFile = JSON.parse(formValue.dealContract);
            const transferAll = JSON.parse(formValue.invoice);
            const alert = [];
            try {
                if (checkCertFile === '') {
                    alert.push(`${alert.length + 1}、查询证明文件未上传，`);
                }
                if (certificateFile === '') {
                    alert.push(`${alert.length + 1}、资质证明文件未上传，`);
                }
                if (registerCertFile === '') {
                    alert.push(`${alert.length + 1}、登记证明文件未上传`);
                }
                if (!hasDealContract) {
                    alert.push(`${alert.length + 1}、交易合同补录未完成`);
                }
                if (hasPerformanceFile === '') {
                    alert.push(`${alert.length + 1}、项目公司未上传履约证明文件，暂时无法进行业务流程，`);
                }
                if (!hasPerformanceFile) {
                    alert.push(`${alert.length + 1}、履约证明补录未完成`);
                }
                if (isAddFiles === '') {
                    alert.push(`${alert.length + 1}、未确定是否需要后补资料`);
                }
                let transferAmount = new XNCurrency(0);
                transferAll.forEach((x) => {
                    transferAmount = transferAmount.add(x.transferMoney);
                });
                if (transferAmount.value !== payables) {
                    alert.push(
                        `${alert.length + 1}、发票转让金额总和${transferAmount.value
                        }不等于应收账款金额${payables}`
                    );
                }
                let contractAmount = new XNCurrency(0);
                contractFile.forEach((x) => {
                    contractAmount = contractAmount.add(x.contractMoney);
                });
                if (contractFile[0].contractFile === '') {
                    alert.push(`${alert.length + 1}、交易合同文件未上传`);
                }
                if (payables > contractAmount.value) {
                    alert.push(
                        `${alert.length + 1}、合同金额${contractAmount.value
                        }小于应收账款金额${payables}`
                    );
                }
                if (alert.length > 0) {
                    alert[alert.length - 1] =
                        alert[alert.length - 1] + '，无法提交';
                    this.xn.msgBox.open(false, alert);
                    return of({
                        action: 'vankestop',
                    });
                } else {
                    return of(null);
                }
            } catch (e) { }
        } else {
            return of(null);
        }
    }

    getTitleConfig(): any {
        return {
            hideTitle: true,
            titleName: '流程标题',
            def: '平台审核',
        };
    }
    // 计算应收账款转让金额
    public ReceiveData(item: any) {
        let tempValue = item.replace(/,/g, '');
        tempValue = parseFloat(tempValue).toFixed(2);
        return Number(tempValue);
    }
    private computeSum(array) {
        return array.reduce((prev, curr, idx, arr) => {
            return prev + curr;
        });
    }
}
