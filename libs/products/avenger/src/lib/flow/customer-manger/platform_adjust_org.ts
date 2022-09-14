/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：SupplierUploadInformationFlow
 * @summary：客戶管理调整企业新流程
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 wangqing          增加功能1         2019-05-15
 * **********************************************************************
 */

import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { Observable, of } from 'rxjs';
import { IFlowCustom } from '../flow-custom';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';

export class PlatformAdjustOrgFlow implements IFlowCustom {
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

    preSubmit(svrConfig: any, formValue: any): Observable<any> {
        if (svrConfig.procedure.procedureId === '@begin') {
            const datalist = JSON.parse(formValue.adjustOrg);
            if (datalist.length === 0) {
                this.xn.msgBox.open(false, '未选择企业');
                return of({ action: stop });
            }
            if (this.adjustQuestion(datalist)) {
                return of(null);
            } else {
                return of({ action: stop });
            }
        } else {
            return of(null);

        }


    }

    getTitleConfig(): any {
        return {
            hideTitle: true,
            titleName: '流程标题',
            def: '调整企业'
        };
    }
    public adjustQuestion(datalist: any) {
        let valid = true;
        datalist.forEach(item => {
            if (item.whiteStatus === 0) {
                valid = true;
            } else {
                if (item.supplierType === 1 && (!item.subFactoringServiceFLV
                    || !item.subFactoringUseFLV || !item.subMaxAmount
                    || !item.subNowlimit || !item.subPlatformServiceFLV)) {
                    valid = false;
                    this.xn.msgBox.open(false, `${item.orgName}为强供应商,费率必填`);
                }
                if (!item.firstFactoringType || !item.secondFactoringType) {
                    valid = false;
                    this.xn.msgBox.open(false, `${item.orgName}保理类型补充不完整`);
                }
                if (!item.certification) {
                    valid = false;
                    this.xn.msgBox.open(false, `${item.orgName}确权凭证为空，不可以提交`);
                }
                if (item.depositRate === undefined) {
                    valid = false;
                    this.xn.msgBox.open(false, `${item.orgName}保证金比例补充不完整`);
                }
            }


        });
        return valid;

    }
}
