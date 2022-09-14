/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：SupplierUploadInformationFlow
 * @summary：供应商提交资料
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 wangqing          增加功能1         2019-08-28
 * **********************************************************************
 */

import { XnService } from '../../../services/xn.service';
import { Observable, of } from 'rxjs';
import { LoadingService } from '../../../services/loading.service';
import { IFlowCustom } from './flow-custom';
import { FormGroup } from '@angular/forms';
import { XNCurrency } from '../../../common/xncurrency';

export class DragonFinancing implements IFlowCustom {
    constructor(private xn: XnService, private loading: LoadingService) {
    }

    preShow(): Observable<any> {
        return of(null);
    }

    postShow(svrConfig: any, mainForm: FormGroup): Observable<any> {
        return of(null);
    }

    postGetSvrConfig(svrConfig: any): void {
    }

    preSubmit(svrConfig: any, formValue: any): Observable<any> {
        if (svrConfig.procedure.procedureId === 'operate') {
            let payables = formValue.receive.toString().replace(/,/g, '');
            const contractFile = formValue.dealContract;
            let invoiceFile = formValue.invoice;
            const certificateFile = formValue.certificateFile;
            const accountInfo = formValue.accountInfo;
            payables = new XNCurrency(payables).value;
            const alert = [];

            try {
                if (contractFile === '') {
                    alert.push(`${alert.length + 1}、交易合同没上传`);
                } else {

                }
                if (certificateFile === '') {
                    alert.push(`${alert.length + 1}、资质证明文件没上传`);
                } else {

                }

                if (invoiceFile === '') {
                    alert.push(`${alert.length + 1}、发票没上传`);
                }
                invoiceFile = JSON.parse(invoiceFile);
                let invoiceAmount = new XNCurrency(0);

                invoiceFile.forEach(x => {
                    invoiceAmount = invoiceAmount.add(x.invoiceAmount);
                });
                const contractTypeBool = []; // 必须每张发票都包含发票号，金额，开票日期
                for (let i = 0; i < invoiceFile.length; i++) {
                    contractTypeBool.push(!!(invoiceFile[i].invoiceAmount) && !!(invoiceFile[i].invoiceNum) && !!invoiceFile[i].invoiceDate);
                }
                contractTypeBool.indexOf(false) > -1 ? alert.push(`${alert.length + 1}、发票沒进行验证，请验证`) : '';
                const statusList = invoiceFile.filter(x => x.status === 4 || x.status === 6 || x.status === 7 || x.status === 8);
                if (statusList.length > 0) {
                    alert.push(`${alert.length + 1}、发票状态异常`);
                }

                if (payables > invoiceAmount.value) {
                    alert.push(`${alert.length + 1}、发票金额${invoiceAmount.value}小于应收账款金额${payables}`);
                }
                if (alert.length) {
                    alert[alert.length - 1] = alert[alert.length - 1] + '，无法提交';
                    this.xn.msgBox.open(false, alert);
                    return of({
                        action: 'stop',
                    });
                }
                // 只有在填了合同金额时，比较合同金额和应收账款金额大小

            } catch (e) {
                console.log('msg:', e);
            }
            // 不做操作
            return of(null);
        } else {
            return of(null);
        }

    }

    getTitleConfig(): any {
        return {
            hideTitle: true,
            titleName: '流程标题',
            def: `供应商提交资料`
        };
    }
    afterSubmitandGettip(svrConfig: any, ): Observable<any> {
        return of(null);
    }
    // 计算应收账款转让金额
    public ReceiveData(item: any) {
        let tempValue = item.replace(/,/g, '');
        tempValue = parseFloat(tempValue).toFixed(2);
        return Number(tempValue);
    }
}
