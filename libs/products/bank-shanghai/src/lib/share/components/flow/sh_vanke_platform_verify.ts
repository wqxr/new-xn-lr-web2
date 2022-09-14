/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：SupplierUploadInformationFlow
 * @summary：平台审核
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 wangqing          增加功能1         2019-08-28
 * **********************************************************************
 */
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { XNCurrency } from 'libs/shared/src/lib/common/xncurrency';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { Observable, of } from 'rxjs';
import { IFlowCustom } from './flow-custom';

export class ShVankePlatformVerify implements IFlowCustom {
    constructor(private xn: XnService, private loading: LoadingService) { }

    preShow(): Observable<any> {
        return of(null);
    }

    postShow(svrConfig: any): Observable<any> {
        return of(null);
    }

    postGetSvrConfig(svrConfig: any): void { }

    afterSubmitandGettip(svrConfig: any, formValue: any, x?: any): Observable<any> {
        if (svrConfig.procedure.procedureId === 'operate') {
            this.xn.msgBox.open(false, ['提交成功', '下一步请复核人在【首页-待办任务】中完成【复核】的待办任务' ], () => {});
        } else if (svrConfig.procedure.procedureId === 'review') {
            if (x && x.ret === 0 && x.data && x.data.backMsg) {
                this.xn.msgBox.open(false, x.data.backMsg, () => { });
            } else {
                this.xn.msgBox.open(false, ['平台审核通过，请耐心等待上银复核。',
                    `该笔交易进度可在台账列表中查看，交易id为${svrConfig.record.mainFlowId}`,
                    ], () => {}
                );
            }
        }
        return of(null);
    }

    preSubmit(svrConfig: any, formValue: any): Observable<any> {
        console.log('sh_vanke_platform_verify', formValue);
        if (svrConfig.procedure.procedureId === 'operate') {
            // let pdfProjectFiles = formValue.pdfProjectFiles;
            const creditPublicityFile = formValue.creditPublicityFile;
            const enterpriseExecutorFile = formValue.enterpriseExecutorFile;
            const checkCertFile = formValue.checkCertFile;
            const registerCertFile = formValue.registerCertFile;
            const isAddFiles = formValue.isAddFiles;
            const contractFile = XnUtils.parseObject(formValue.dealContract, []);
            const isExistEmptyContractFile = contractFile.some((x: any) => !x.contractFile);
            const hasDealContract = contractFile.every((contract: any) =>
                !!contract.contractName && !!contract.contractId && !XnUtils.isEmptys(contract.contractMoney, [0]) &&
                !!contract.payRate && !!contract.contractType && !!contract.contractJia && !!contract.contractYi
            );
            const hasDealPerformanceFile = XnUtils.parseObject(formValue.performanceFile, []).every((performance: any) =>
                !!performance.payType && !XnUtils.isEmptys(performance.percentOutputValue, [0])
            );
            const payables = new XNCurrency(formValue.receive.toString().replace(/,/g, '')).value;
            const transferAll = JSON.parse(formValue.invoice);
            let transferAmount = new XNCurrency(0);
            let contractAmount = new XNCurrency(0);
            transferAll.forEach((x: any) => {
                transferAmount = transferAmount.add(x.transferMoney);
            });
            contractFile.forEach((x) => {
                contractAmount = contractAmount.add(x.contractMoney);
            });
            // 工商状态提示
            const businessRelated = XnUtils.parseObject(formValue.businessRelated, []) || [];
            const businessStatusArr = businessRelated.map((x: number, index: number) => {
                return {
                    idx: index,
                    value: Number(x)
                };
            }).filter((y: { idx: number, value: number }) => !!y.value).map((z: { idx: number, value: number }) => z.idx);
            const alert = [];
            try {
                // if (!pdfProjectFiles) {
                //     alert.push(`${alert.length + 1}、付款确认书文件未上传`);
                // }
                if (!creditPublicityFile) {
                    alert.push(`${alert.length + 1}、国家企业信用公示文件未上传，`);
                }
                if (!enterpriseExecutorFile) {
                    alert.push(`${alert.length + 1}、企业被执行人查询文件未上传，`);
                }
                if (!checkCertFile) {
                    alert.push(`${alert.length + 1}、查询证明文件未上传，`);
                }
                if (!registerCertFile) {
                    alert.push(`${alert.length + 1}、登记证明文件未上传，`);
                }
                if (isExistEmptyContractFile) {
                    alert.push(`${alert.length + 1}、交易合同文件未上传，`);
                }
                if (!hasDealContract) {
                    alert.push(`${alert.length + 1}、交易合同补录未完成，`);
                }
                if (!hasDealPerformanceFile) {
                    alert.push(`${alert.length + 1}、履约证明补录未完成，`);
                }
                if (XnUtils.isEmptys(isAddFiles, [0])) {
                    alert.push(`${alert.length + 1}、未确定是否需要后补资料，`);
                }
                if (transferAmount.value !== payables) {
                    alert.push(`${alert.length + 1}、发票转让金额总和${transferAmount.value}不等于应收账款金额${payables}，`);
                }
                if (payables > contractAmount.value) {
                    alert.push(`${alert.length + 1}、合同金额${contractAmount.value}小于应收账款金额${payables}，`);
                }
                if (businessStatusArr.includes(1) || businessStatusArr.includes('1')) {
                    alert.push(`${alert.length + 1}、该企业经营异常，`);
                }
                if (alert.length > 0) {
                    alert.push('无法提交！');
                    this.xn.msgBox.open(false, alert);
                    return of({ action: 'vankestop' });
                } else {
                    if (businessStatusArr.includes(2) || businessStatusArr.includes('2')) {
                        return of({ action: 'msgBox', type: 'shanghai'});
                    } else if (svrConfig.wkType && svrConfig.wkType === 1) {
                        return of({ action: 'msgBox' });
                    } else {
                        return of(null);
                    }
                }
            } catch (e) { }
        } 
        // else if (svrConfig.procedure.procedureId === 'review'){
        //     const eAccountStatus = formValue.eAccountStatus;
        //     if (!!XnUtils.isEmptys(eAccountStatus, [0])){
        //         this.xn.msgBox.open(false, `${svrConfig.debtUnit}普惠开户状态查询中，请稍后再操作`);
        //         return of({ action: 'stop' });
        //     } else if (['2', 2].includes(eAccountStatus)){
        //         this.xn.msgBox.open(false, `开户状态查询异常，请稍后重试或联系管理员`);
        //         return of({ action: 'stop' });
        //     } else if (['0', 0].includes(eAccountStatus)){
        //         this.xn.msgBox.open(false, `${svrConfig.debtUnit}在普惠APP上未开户成功，请等待开户成功后再操作`);
        //         return of({ action: 'stop' });
        //     } else {
        //         return of(null);
        //     }
        // } 
        else {
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
