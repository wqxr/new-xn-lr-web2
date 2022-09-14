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

import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { Observable, of } from 'rxjs';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { IFlowCustom } from './flow-custom';
import * as lodashall from 'lodash';

export class SubChangeCapital implements IFlowCustom {
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
        return of(null);
    }
    preSubmit(svrConfig: any, formValue: any): Observable<any> {
        // if (svrConfig.procedure.procedureId === '@begin') {
        //     console.info(formValue);
        //     let alert = '';
        //     let mainlist = JSON.parse(formValue.personList);
        //     let isOk = lodashall.some(mainlist, ['pdfProjectFiles', '']); // 判断文件是否存在
        //     mainlist.forEach(x => {
        //         if (formValue.headquarters === '深圳市龙光控股有限公司') {
        //             alert = '此交易列表缺少《付款确认书（总部致保理商）》或《付款确认书（总部致券商）》';
        //         }
        //         if (isOk || JSON.parse(x.pdfProjectFiles).length !== 2) {
        //             this.xn.msgBox.open(false, alert);
        //             return of({ action: 'stop' });
        //         } else {
        //         }
        //     });
        //     return of(null);

        // } else {
            return of(null);

      //  }
    }

    getTitleConfig(): any {
        return {
            hideTitle: true,
            titleName: '流程标题',
            def: '资产池变更'
        };
    }
}
