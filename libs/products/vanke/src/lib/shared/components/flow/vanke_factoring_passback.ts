/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\products\vanke\src\lib\shared\components\flow\vanke_factoring_passback.ts
* @summary：保理商回传合同
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                 hucongying          init           2021-08-24
***************************************************************************/


import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { Observable, of } from 'rxjs';
import { IFlowCustom } from './flow-custom';

export class VankeFactoringPassback implements IFlowCustom {
    constructor(private xn: XnService, private loading: LoadingService) {

    }

    preShow(): Observable<any> {
        return of(null);
    }

    postShow(svrConfig: any): Observable<any> {
        return of(null);
    }
    afterSubmitandGettip(svrConfig: any): Observable<any> {
        if (svrConfig.procedure.procedureId === 'operate') {
            this.xn.msgBox.open(false, '提交成功,下一步请复核人在【首页-待办任务】中完成【复核】的待办任务');

        } else if (svrConfig.procedure.procedureId === 'review') {
            this.xn.msgBox.open(false, '提交成功！请风险复核人在【首页-待办任务】中完成【风险复核】的待办任务。');

        } else if (svrConfig.procedure.procedureId === 'riskReview') {
            this.xn.msgBox.open(false, '提交成功！');
        }
        return of(null);

    }

    postGetSvrConfig(svrConfig: any): void {
    }

    preSubmit(svrConfig: any, formValue: any): Observable<any> {
        return of(null);
    }

    getTitleConfig(): any {
        return {
            hideTitle: true,
            titleName: '流程标题',
            def: '保理商回传合同'
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
