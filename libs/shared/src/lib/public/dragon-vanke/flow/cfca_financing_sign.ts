import { FormGroup, FormControl, Validators } from '@angular/forms';
/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：SupplierUploadInformationFlow
 * @summary：通用签章流程供应商盖章
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 wangqing          增加功能1         2021-06-23
 * **********************************************************************
 */

import { XnService } from '../../../services/xn.service';
import { Observable, of } from 'rxjs';
import { LoadingService } from '../../../services/loading.service';
import { IFlowCustom } from './flow-custom';
import XnFlowUtils from '../../../common/xn-flow-utils';
import { XnUtils } from '../../../common/xn-utils';
import { map } from 'rxjs/operators';
import { DragonFinancingContractModalComponent } from '../modal/dragon-asign-contract.modal';
import { CfcaSignCustomModalComponent } from 'libs/console/src/lib/management/common-cfca-signlist/modal/cfca-sign-custom-modal.component';
import { SingleListParamInputModel, SingleSearchListModalComponent } from '../modal/single-searchList-modal.component';
import { XnModalUtils } from '../../../common/xn-modal-utils';
import { ViewContainerRef } from '@angular/core';

export class CfcaFinancingSign implements IFlowCustom {
    constructor(private xn: XnService, private loading: LoadingService, private vcr: ViewContainerRef,) {
    }

    preShow(): Observable<any> {
        return of(null);
    }

    postShow(svrConfig: any, form: FormGroup): Observable<any> {
        return of(null);
    }

    postGetSvrConfig(svrConfig: any): void {
    }

    preSubmit(svrConfig: any, formValue: any): Observable<any> {
        if (svrConfig.procedure.procedureId === 'operate' && formValue.signType === '1') {

            const params: SingleListParamInputModel = {
                title: '快递信息',
                get_url: '',
                get_type: '',
                multiple: null,
                heads: [
                    // { label: '当前所在城市', value: 'invoiceNum', type: 'text' }, 接口未返回城市
                    { label: '轨迹发生时间', value: 'accept_time', type: 'text' },
                    { label: '轨迹描述', value: 'accept_station', type: 'text' },
                ],
                searches: [],
                key: 'invoiceCode',
                data: [],
                total: 0,
                inputParam: {},
                rightButtons: [{ label: '确定', value: 'submit' }]
            };
            this.xn.loading.open();
            return this.xn.dragon.post('/cfca/get_express_info', { expressNum: formValue.expressNum }).pipe(map(x => {
                this.xn.loading.close();
                if (x.ret === 0) {
                    params.data = x.data;
                    params.data.reverse();
                    params.total = x.data.length;
                    return {
                        action: 'modal',
                        modal: SingleSearchListModalComponent,
                        params: params,
                    };
                } else {
                    return of(null);
                }
            }));
        } else {
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
                    json.data.flowId = 'sub_cfca_financing_sign';
                    json.data.recordId = svrConfig.record.recordId;
                    json.data.caType = formValue.caType;
                    const contracts = json.data;
                    return {
                        action: 'modal',
                        modal: CfcaSignCustomModalComponent,
                        params: contracts
                    };
                }));

        }


    }

    afterSubmitandGettip(svrConfig: any,): Observable<any> {
        return of(null);
    }
    getTitleConfig(): any {
        return {
            hideTitle: true,
            titleName: '流程标题',
            def: '通用签章'
        };
    }
    /**
* 查看快递信息
* @param expressNum 快递单号
*/
    public viewExpressNum(expressNum: string | number) {
        const params: SingleListParamInputModel = {
            title: '快递信息',
            get_url: '',
            get_type: '',
            multiple: null,
            heads: [
                // { label: '当前所在城市', value: 'invoiceNum', type: 'text' }, 接口未返回城市
                { label: '轨迹发生时间', value: 'accept_time', type: 'text' },
                { label: '轨迹描述', value: 'accept_station', type: 'text' },
            ],
            searches: [],
            key: 'invoiceCode',
            data: [],
            total: 0,
            inputParam: {},
            rightButtons: [{ label: '确定', value: 'submit' }]
        };
        this.xn.loading.open();

        return this.xn.dragon.post('/cfca/get_express_info', { expressNum }).subscribe((x: any) => {
            this.xn.loading.close();
            if (x.ret === 0) {
                params.data = x.data;
                params.data.reverse();
                params.total = x.data.length;
                return {
                    action: 'modal',
                    modal: SingleSearchListModalComponent,
                    params: params,
                };
            } else {
                return of(null);
            }
        });
    }
}
