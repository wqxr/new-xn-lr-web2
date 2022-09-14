/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：contract-input.component.ts
 * @summary：合同文件
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          增加功能1         2019-04-22
 * **********************************************************************
 */

import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { Observable, of } from 'rxjs';
import { IFlowCustom } from '../flow-custom';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import * as lodashall from 'lodash';
import { AvengeruploadErrorInfoComponent } from '../../shared/components/modal/avenger-upload-errorinfo.modal';
import { map } from 'rxjs/operators';

export class Financing501 implements IFlowCustom {
    vanke = {
        contract: '',
        invoiceticket: '',
    };
    upstream = {
        contract: '',
        invoiceticket: '',
    };
    constructor(private xn: XnService, private loading: LoadingService, private localservice: LocalStorageService, ) {
    }

    preShow(svrConfig: any): Observable<any> {
        return of(null);
    }

    postShow(svrConfig: any): Observable<any> {
        return of(null);
    }

    postGetSvrConfig(svrConfig: any): void {
    }

    preSubmit(svrConfig: any, formValue: any): Observable<any> {
        if (svrConfig.procedure.procedureId !== 'operate' || svrConfig.record.mainFlowId === ''
            || svrConfig.record.mainFlowId === undefined) {
            return of(null);
        }
        if (svrConfig.record.mainFlowId !== '') {
            const params: any = {
                mainFlowId: svrConfig.record.mainFlowId,
            };
            const invoicedata = this.localservice.caCheMap.get('invoicedata').map((x: any) => x.invoiceNum);
            const contractdata = this.localservice.caCheMap.get('contractdata').map((x: any) => x.contractId);
            return this.xn.avenger.post('/apply/applyInfo/compare', params)
              .pipe(map(x => {
                if (x.data) {
                    this.vanke.contract = x.data.supplierContract;
                    this.vanke.invoiceticket = x.data.supplierInvoice;
                    this.upstream.invoiceticket = invoicedata;
                    this.upstream.contract = contractdata;
                    const contractarray = lodashall.intersection(this.vanke.contract, this.upstream.contract);
                    const invoicefit = lodashall.intersection(this.vanke.invoiceticket, this.upstream.invoiceticket);
                    if (contractarray.length === 0 || invoicefit.length === 0 ||
                        this.vanke.contract.length !== this.upstream.contract.length
                        || this.vanke.invoiceticket.length !== this.upstream.invoiceticket.length
                        || contractarray.length !== this.vanke.contract.length
                        || contractarray.length !== this.upstream.contract.length
                        || invoicefit.length !== this.vanke.invoiceticket.length
                        || invoicefit.length !== this.upstream.invoiceticket.length) {// 判断上游客户与供应商发票号或者合同号是否相等
                        return {
                            action: 'modal',
                            modal: AvengeruploadErrorInfoComponent,
                            params: { vanke: this.vanke, upstream: this.upstream }
                        };
                    } else {
                        return of(null);
                    }




                }
            }));
        }
    }

    getTitleConfig(): any {
        return {
            hideTitle: true,
            titleName: '流程标题',
            def: '上游客户上传资料'
        };
    }
}
