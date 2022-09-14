/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：SubFactoringVerifyRetreat
 * @summary：碧桂园-退单流程
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                hucongying       碧桂园数据对接      2020-11-11
 * **********************************************************************
 */

import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { IFlowCustom } from './flow-custom';
import { SingleSearchListModalComponent, SingleListParamInputModel } from 'libs/shared/src/lib/public/dragon-vanke/modal/single-searchList-modal.component';
import { HeadquartersTypeEnum } from 'libs/shared/src/lib/config/select-options';

export class SubFactoringVerifyRetreat implements IFlowCustom {
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
            const list = JSON.parse(svrConfig.checkers[0].value);
            const { headquarters } = list[0];
            switch (headquarters) {

                case HeadquartersTypeEnum[9]:
                    // 碧桂园数据对接退单流程-保理商财务经办提交后(特殊处理)展示碧桂园退单接口返回的结果
                    const bgyList = list.map(v => { return { billNumber: v.billNumber, certificateFile: v.certificateFile } })
                    return this.xn.dragon.post('/sub_system/bgy_system/bgy_check_fail',
                        // type 类型 0=审核失败 1=退单
                        { type: 1, msg: svrConfig.checkers[2].value, list: bgyList })
                        .pipe(map(x => {
                            if (x.ret === 0) {
                                x.data.forEach(x => {
                                    x.status = x.status === 0 ? '成功' : '失败';
                                });
                                const params: SingleListParamInputModel = {
                                    title: '提交结果',
                                    get_url: '',
                                    get_type: '',
                                    multiple: null,
                                    heads: [
                                        { label: '交易ID', value: 'mainFlowId', type: 'text' },
                                        { label: '碧桂园系统唯一标识码', value: 'bgyPaymentUuid', type: 'text' },
                                        { label: '付款单号', value: 'bgyPaymentNo', type: 'text' },
                                        { label: '供应商名称', value: 'debtUnit', type: 'text' },
                                        { label: '项目公司名称', value: 'projectCompany', type: 'text' },
                                        { label: '应收账款金额', value: 'receive', type: 'money' },
                                        { label: '状态结果', value: 'status', type: 'message', },
                                        { label: '描述', value: 'msg', type: 'text' },
                                    ],
                                    searches: [],
                                    key: 'mainFlowId',
                                    data: x.data || [],
                                    total: x.data.length || 0,
                                    inputParam: {},
                                    rightButtons: [{ label: '确定', value: 'submit' }],
                                };
                                return {
                                    action: 'modal',
                                    modal: SingleSearchListModalComponent,
                                    params
                                };

                            }
                        }));
                    break;

                default:
                    return of(null);
                    break;
            }
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
