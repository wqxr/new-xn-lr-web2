/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：BgyFinancingSign
 * @summary:碧桂园-供应商签署合同
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                hucongying      碧桂园数据对接       2020-11-04
 * **********************************************************************
 */

import { Observable, of } from 'rxjs';
import { IFlowCustom } from './flow-custom';
import { map } from 'rxjs/operators';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import XnFlowUtils from 'libs/shared/src/lib/common/xn-flow-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { DragonFinancingContractModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/dragon-asign-contract.modal';

export class BgyFinancingSign implements IFlowCustom {
    constructor(private xn: XnService, private loading: LoadingService,
        private localStorageService: LocalStorageService) {
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
            if (this.localStorageService.caCheMap.get('bgy_financing_sign').onLineStatus) {
                // 线上签署
                this.xn.msgBox.open(false, [
                    '签署合同成功！',
                    '本笔交易操作已全部完成！请等待放款！',
                    `该笔交易进度可在左侧导航栏【我的交易】-【台账】-【已完成】查看，交易id为${svrConfig.record.mainFlowId}`]);

            } else {
                // 线下签署
                this.xn.msgBox.open(false, [
                    '本笔交易需线下签署合同！请将已签署合同的影印件交给保理商！',
                    '本笔交易操作已全部完成，请等待放款！',
                    `该笔交易进度可在左侧导航栏【我的交易】-【台账】-【已完成】查看，交易id为${svrConfig.record.mainFlowId}`]);
            }
            this.localStorageService.caCheMap.delete('bgy_financing_sign');

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
        return this.xn.dragon.post('/flow/preSubmit', params)
            .pipe(map(json => {
                if (json.data.length === 0) {
                    this.xn.msgBox.open(false, '无合同可签署');
                    return of({
                        action: 'stop',
                    });
                } else {
                    json.data.flowId = 'bgy_financing_sign';
                    json.data.isProxy = 54;
                    const contracts = json.data;
                    this.localStorageService.setCacheValue('bgy_financing_sign', { onLineStatus: !contracts.readonly });
                    contracts.forEach(element => {
                        if (!element.config) {
                            element.config = {
                                text: ''
                            };
                        }
                    });
                    contracts.forEach(x => {
                        if (x.label.includes('国内商业保理合同-标准版')) {
                            x.config.text = '甲方(电子签章、数字签名)';
                        } else if (x.label === '应收账款债权转让通知书（供应商向项目公司出具）') {
                            x.config.text = '（盖章）';
                        } else if (x.label === '应收账款债权转让通知书（供应商向碧桂园地产出具）') {
                            x.config.text = '（盖章）';
                        } else {
                            x.config.text = '（盖章）';
                        }
                    });
                    return {
                        action: 'modal',
                        modal: DragonFinancingContractModalComponent,
                        params: contracts
                    };
                }

            }));
    }

    getTitleConfig(): any {
        return {
            hideTitle: true,
            titleName: '流程标题',
            def: '供应商签署合同'
        };
    }
}
