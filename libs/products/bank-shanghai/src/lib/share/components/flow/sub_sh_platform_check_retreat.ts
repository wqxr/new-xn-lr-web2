/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：SupplierUploadInformationFlow
 * @summary：退单流程--平台审核
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 yutinabao          增加功能1           2020-01-19
 * **********************************************************************
 */

import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { Observable, of } from 'rxjs';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { IFlowCustom } from './flow-custom';
import { ShSingleListParamInputModel, ShSingleSearchListModalComponent } from '../../modal/single-searchList-modal.component';
import { map } from 'rxjs/operators';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';

export class SubShPlatformRetreat implements IFlowCustom {
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

    afterSubmitandGettip(svrConfig: any, formValue: any): Observable<any> {
        if (svrConfig.procedure.procedureId === '@begin') {
            this.xn.msgBox.open(false, ['提交成功', '下一步请复核人在【首页-待办任务】中完成【复核】的待办任务' ], () => {});
            return of(null);
        } else if (svrConfig.procedure.procedureId === 'review') {
            const checkers = svrConfig.actions.filter((x: any) => x.recordSeq === svrConfig.record.recordSeq)[0].checkers;
            const retreatList = checkers.find((x: any) => x.checkerId === 'retreatList')?.data || [];
            const checkType = checkers.find((x: any) => x.checkerId === 'checkType')?.data || '';
            const checkText = checkers.find((x: any) => x.checkerId === 'checkText')?.data || '';
            const query = {
                auditRefundType: 2,
                updateType: checkType,
                msg: checkText,
                list: XnUtils.parseObject(retreatList, [])
            };
            return this.xn.dragon.post('/sub_system/sh_vanke_system/audit_refund_bill', query)
            .pipe(map(x => {
                if (x.ret === 0 && x.data && x.data.data.length > 0) {
                    x.data.data.forEach(x => {
                        x.result = x.result === 0 ? '成功' : '失败';
                    });
                    // 打开弹框
                    const params: ShSingleListParamInputModel = {
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
                        modal: ShSingleSearchListModalComponent,
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
            def: '退单流程'
        };
    }
}
