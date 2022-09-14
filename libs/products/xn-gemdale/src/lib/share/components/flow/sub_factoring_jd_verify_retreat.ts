/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：SubFactoringJdVerifyRetreat
 * @summary：金地-退单流程-财务确认
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                hucongying       金地数据对接        2020-12-18
 * **********************************************************************
 */

import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { IFlowCustom } from './flow-custom';
import { SingleListParamInputModel } from 'libs/shared/src/lib/public/dragon-vanke/modal/single-searchList-modal.component';
import { XnGemdaleSingleSearchListModalComponent } from '../../modal/single-searchList-modal.component';

export class SubFactoringJdVerifyRetreat implements IFlowCustom {
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
    afterSubmitandGettip(svrConfig: any,): Observable<any> {
        if (svrConfig.procedure.procedureId === 'operate') {
            const beginInfo = svrConfig.actions;
            const Infos = beginInfo.filter(x => x.procedureId === '@begin');
            const checkType = JSON.parse(Infos[Infos.length - 1].checkers.filter((x: any) => x.checkerId === 'checkType')[0].data);
            const compareInfo = JSON.parse(Infos[Infos.length - 1].checkers.filter((x: any) => x.checkerId === 'retreatList')[0].data);
            // returnType 退回类型 1=退单 2=修改金额 3=更换渠道
            const returnType = checkType['proxy'];
            // returnReason 退回原因 1=资金方要求 2=金地要求 3=供应商要求
            const returnReason = checkType['status'];
            const list = compareInfo.map(x => { return { billNumber: x.billNumber, certificateFile: '' } });
            // 备注
            const msg = Infos[Infos.length - 1].checkers.filter((x: any) => x.checkerId === 'checkText_jd')[0].data;
            return this.xn.dragon.post('/sub_system/jd_system/jd_check_fail',
                // type 类型 0=审核失败 1=退单
                { type: 1, returnType, returnReason, list, msg })
                .pipe(map(x => {
                    if (x.ret === 0 && x.data.length) {
                        x.data.forEach(x => {
                            x.status = x.status === 0 ? '成功' : '失败';
                        });
                        const params: SingleListParamInputModel = {
                            title: '提交结果',
                            get_url: '',
                            get_type: '',
                            multiple: null,
                            heads: [
                                { label: '融资单号', value: 'billNumber', type: 'text' },
                                { label: '融资金额', value: 'financingAmount', type: 'money' },
                                { label: '项目名称', value: 'projectName', type: 'text' },
                                { label: '项目公司名称', value: 'projectCompanyName', type: 'text' },
                                { label: '收款单位名称', value: 'receiptCompanyName', type: 'text' },
                                { label: '状态结果', value: 'status', type: 'message', },
                                { label: '描述', value: 'msg', type: 'text' },
                            ],
                            searches: [],
                            key: 'billNumber',
                            data: x.data || [],
                            total: x.data.length || 0,
                            inputParam: {},
                            rightButtons: [{ label: '确定', value: 'submit' }],
                        };
                        return {
                            action: 'modal',
                            modal: XnGemdaleSingleSearchListModalComponent,
                            params
                        };
                    } else {
                        return of(null);
                    }
                }));
        } else {
            return of(null);
        }

    }

    preSubmit(svrConfig: any, formValue: any): Observable<any> {
        return of(null);

    }

    getTitleConfig(): any {
        return {
            hideTitle: true,
            titleName: '流程标题',
            def: '财务确认'
        };
    }
}
