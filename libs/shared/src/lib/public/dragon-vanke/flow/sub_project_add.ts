/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：SupplierUploadInformationFlow
 * @summary：上传付确替换文件
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 wangqing          增加功能1         2019-09-20
 * **********************************************************************
 */

import { XnService } from '../../../services/xn.service';
import { Observable, of } from 'rxjs';
import { LoadingService } from '../../../services/loading.service';
import { IFlowCustom } from './flow-custom';
import * as lodashall from 'lodash';
import XnFlowUtils from '../../../common/xn-flow-utils';
import { XnUtils } from '../../../common/xn-utils';
import { DragonFinancingContractModalComponent } from '../modal/dragon-asign-contract.modal';
import { map } from 'rxjs/operators';

export class SubProjectAdd implements IFlowCustom {
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
    afterSubmitandGettip(svrConfig: any, ): Observable<any> {
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
                console.log(json, 'pre_submit');
                json.data.flowId = 'sub_project_add';
                const contracts = json.data;
                contracts.forEach(element => {
                    if (!element.config) {
                        element.config = {
                            text: ''
                        };
                    }
                });
                contracts.forEach(x => {
                    if (x.label === '应收账款转让通知之补充说明') {
                        x.config.text = '项目公司(盖章)';
                    } else if (x.label === '债权转让及账户变更通知的补充说明' || x.label === '应收账款转让登记协议') {
                        x.config.text = '甲方（出让方）';
                    } else {
                        x.config.text = '（盖章）';
                    }
                });
                return {
                    action: 'modal',
                    modal: DragonFinancingContractModalComponent,
                    params: contracts
                };
            }));
    }

    getTitleConfig(): any {
        return {
            hideTitle: true,
            titleName: '流程标题',
            def: '项目公司签署补充协议'
        };
    }
}
