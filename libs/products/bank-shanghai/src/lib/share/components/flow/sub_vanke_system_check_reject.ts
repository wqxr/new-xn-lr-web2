/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：SupplierUploadInformationFlow
 * @summary：预审不通过
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 wangqing          增加功能1         2019-08-28
 * **********************************************************************
 */

import { Observable, of } from 'rxjs';
import { IFlowCustom } from './flow-custom';
import { map } from 'rxjs/operators';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { ShSingleListParamInputModel, ShSingleSearchListModalComponent } from '../../modal/single-searchList-modal.component';

export class VankesystemCheck implements IFlowCustom {
    constructor(private xn: XnService, private loading: LoadingService) {
    }

    preShow(): Observable<any> {
        return of(null);
    }

    postShow(svrConfig: any): Observable<any> {
        return of(null);
    }
    afterSubmitandGettip(svrConfig: any, formValue: any): Observable<any> {
        if (svrConfig.procedure.procedureId === 'review') {
            const beginInfo = svrConfig.actions;
            const Infos = beginInfo.filter(x =>
                x.procedureId === '@begin'
            );
            const compareInfo = JSON.parse(Infos[Infos.length - 1].checkers.filter((x: any) => x.checkerId === 'rejectList')[0].data);
            const checkType = Infos[Infos.length - 1].checkers.filter((x: any) => x.checkerId === 'checkType')[0].data;
            const checkText = Infos[Infos.length - 1].checkers.filter((x: any) => x.checkerId === 'checkText')[0].data;

            const idList = compareInfo.map(x => {
                return { id: x.id, billNumber: x.billNumber };
            });
            return this.xn.dragon.post('/sub_system/sh_vanke_system/audit_refund_bill',
                { auditRefundType: 1, list: idList, updateType: checkType, msg: checkText })
                .pipe(map(x => {
                    if (x.ret === 0) {
                        x.data.data.forEach(x => {
                            x.result = x.result === 0 ? '成功' : '失败';
                        });
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
                                // { label: '发票文件', value: 'invoiceFile',type: 'file' },
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

    postGetSvrConfig(svrConfig: any): void {
    }

    preSubmit(svrConfig: any, formValue: any): Observable<any> {
        return of(null);
    }

    getTitleConfig(): any {
        return {
            hideTitle: true,
            titleName: '流程标题',
            def: '预审不通过'
        };
    }
}
