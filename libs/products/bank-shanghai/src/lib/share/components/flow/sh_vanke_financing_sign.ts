/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：sh_vanke_financing_sign.ts
 * @summary: 待供应商签署合同
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 wangqing          增加功能1         2019-08-28
 * **********************************************************************
 */
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { IFlowCustom } from './flow-custom';
import XnFlowUtils from 'libs/shared/src/lib/common/xn-flow-utils';
import { ShanghaiFinancingContractModalComponent } from '../../modal/shanghai-asign-contract.modal.component';

export class ShangHaiFinancingSign implements IFlowCustom {
    constructor(private xn: XnService, private loading: LoadingService) {
    }

    preShow(): Observable<any> {
        return of(null);
    }

    postShow(svrConfig: any): Observable<any> {
        return of(null);
    }

    postGetSvrConfig(svrConfig: any): void {
    }

    afterSubmitandGettip(svrConfig: any): Observable<any> {
        if (svrConfig.procedure.procedureId === 'operate') {
            this.xn.msgBox.open(false, ['提交成功', '下一步请复核人在【首页-待办任务】中完成【复核】的待办任务']);
        } else if (svrConfig.procedure.procedureId === 'review') {
            // 线上签署
            this.xn.msgBox.open(false, [
                '签署合同成功！',
                `该笔交易进度可在左侧导航栏【我的交易】-【普惠通-万科-上海银行】-【台账】查看，交易id为${svrConfig.record.mainFlowId}`],
            () => {});
        }
        return of(null);
    }

    preSubmit(svrConfig: any, formValue: any): Observable<any> {
        if (svrConfig.procedure.procedureId !== 'review') {
            return of(null);
        }
        const params: any = {
            flowId: svrConfig.flow.flowId,
            procedureId: svrConfig.procedure.procedureId,
            recordId: svrConfig.record && svrConfig.record.recordId || '',
            title: formValue.title,
            memo: formValue.memo,
            checkers: XnFlowUtils.buildSubmitCheckers(svrConfig.checkers, formValue)
        };
        XnUtils.checkLoading(this);
        return this.xn.dragon.post('/flow/preSubmit', params).pipe(map(json => {
            const contracts = json?.data || [];
            if (contracts && !contracts.length) {
                this.xn.msgBox.open(false, '无合同可签署');
                return of({
                    action: 'stop',
                });
            } else if (contracts && !!contracts.length){
                contracts.map((x: any) => {
                    if (!x.config) {
                        x['config'] = { text: '' };
                    }
                    if (x.label.includes('链融科技供应链金融服务平台服务合同')) {
                        x['config']['text'] = '甲方（盖章）';
                    } else {
                        x['config']['text'] = '（盖章）';
                    }
                });
                const contractObj = {
                    flowId: 'sh_vanke_financing_sign',
                    isProxy: 60,
                    contracts,
                };
                return {
                    action: 'modal',
                    modal: ShanghaiFinancingContractModalComponent,
                    params: contractObj
                };
            }
        }));
    }

    getTitleConfig(): any {
        return {
            hideTitle: true,
            titleName: '流程标题',
            def: '待供应商签署合同'
        };
    }
}
