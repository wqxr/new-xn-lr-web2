/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @SubBgyCheckFail
 * @summary：碧桂园-发起审核失败流程
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 hucongying       碧桂园数据对接      2020-10-27
 * **********************************************************************
 */

import { Observable, of } from 'rxjs';
import { IFlowCustom } from './flow-custom';
import { map } from 'rxjs/operators';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { SingleListParamInputModel, SingleSearchListModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/single-searchList-modal.component';

export class SubBgyCheckFail implements IFlowCustom {
    constructor(private xn: XnService, private loading: LoadingService) {
    }

    preShow(): Observable<any> {
        return of(null);
    }

    postShow(svrConfig: any): Observable<any> {
        return of(null);
    }
    afterSubmitandGettip(svrConfig: any, formValue: any): Observable<any> {

        if (svrConfig.procedure.procedureId === '@begin') {
            this.xn.msgBox.open(false, '提交成功！下一步请复核人在【首页 - 待办任务】中完成【复核】的待办任务。');
            return of(null);
        }
        if (svrConfig.procedure.procedureId === 'review') {

            const beginInfo = svrConfig.actions;
            const Infos = beginInfo.filter(x =>
                x.procedureId === '@begin'
            );
            const compareInfo = JSON.parse(Infos[Infos.length - 1].checkers.filter((x: any) => x.checkerId === 'rejectListBgy')[0].data);
            const msg = Infos[Infos.length - 1].checkers.filter((x: any) => x.checkerId === 'checkTextBgy')[0].data;

            const list = compareInfo.map(x => { return { billNumber: x.bgyPaymentUuid, certificateFile: '' } });
            return this.xn.dragon.post('/sub_system/bgy_system/bgy_check_fail',
                // type 类型 0=审核失败 1=退单
                { type: 0, msg: msg, list })
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
                                { label: '碧桂园系统唯一标识码', value: 'bgyPaymentUuid', type: 'text' },
                                { label: '付款单号', value: 'bgyPaymentNo', type: 'text' },
                                { label: '供应商名称', value: 'debtUnit', type: 'text' },
                                { label: '项目公司名称', value: 'projectCompany', type: 'text' },
                                { label: '应收账款金额', value: 'receive', type: 'money' },
                                { label: '状态结果', value: 'status', type: 'message', },
                                { label: '描述', value: 'msg', type: 'text' },
                            ],
                            searches: [],
                            key: 'bgyPaymentUuid',
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
            def: '发起审核失败'
        };
    }
}
