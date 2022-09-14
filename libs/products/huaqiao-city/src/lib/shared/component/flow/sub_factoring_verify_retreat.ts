/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：SupplierUploadInformationFlow
 * @summary：退单流程
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 wangqing          增加功能1         2020-01-19
 * **********************************************************************
 */

import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { IFlowCustom } from './flow-custom';
import { SingleSearchListModalComponent, SingleListParamInputModel } from 'libs/shared/src/lib/public/dragon-vanke/modal/single-searchList-modal.component';

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
        return svrConfig;
    }
    afterSubmitandGettip(svrConfig: any, ): Observable<any> {
        if (svrConfig.procedure.procedureId === 'operate') {
            // 万科数据对接退单流程-保理商财务经办提交后(特殊处理)展示万科退单接口返回的结果
            const query = {
                auditRefundType: 2,
                updateType: svrConfig.checkers[1].value,
                msg: svrConfig.checkers[2].value,
                list: JSON.parse(svrConfig.checkers[0].value)
            };
            return this.xn.dragon.post('/sub_system/vanke_system/audit_refund_bill', query)
            .pipe(map(x => {
                if (x.ret === 0 && x.data && x.data.data.length > 0) {
                    x.data.data.forEach(x => {
                        x.result = x.result === 0 ? '成功' : '失败';
                    });
                    // 打开弹框
                    const params: SingleListParamInputModel = {
                        title: '提交结果',
                        get_url: '',
                        get_type: '',
                        multiple: null,
                        heads: [
                            { label: '付款确认书编号', value: 'transNumber', type: 'text' },
                            { label: '收款单位', value: 'applyCompanyName', type: 'text' },
                            { label: '申请付款单位', value: 'supplierName', type: 'text' },
                            { label: '信息', value: 'message', type: 'message', },
                            { label: '结果', value: 'result', type: 'text' },
                        ],
                        searches: [],
                        key: 'invoiceCode',
                        data: x.data.data || [],
                        total: x.data.data.length || 0,
                        inputParam: {},
                        rightButtons: [{label: '确定', value: 'submit'}],
                    };
                    return {
                        action: 'modal',
                        modal: SingleSearchListModalComponent,
                        params
                    };
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
