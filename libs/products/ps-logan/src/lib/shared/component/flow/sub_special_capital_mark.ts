/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：SupplierUploadInformationFlow
 * @summary：特殊资产标记流程
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 yutianbao          增加功能1         2019-09-20
 * **********************************************************************
 */
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { Observable, of } from 'rxjs';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { IFlowCustom } from './flow-custom';
import * as lodashall from 'lodash';

export class DragonSpecialCapitalMark implements IFlowCustom {
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
    afterSubmitandGettip(svrConfig: any): Observable<any> {
        if (svrConfig.procedure.procedureId === '@begin') {
            this.xn.msgBox.open(false, ['提交成功！', '下一步请复核人在【首页-待办任务】中完成【复核】的待办任务。']);
        } else if (svrConfig.procedure.procedureId === 'review' || svrConfig.procedure.procedureId === 'windReview') {
            this.xn.msgBox.open(false, '特殊资产标记完成，可在【特殊资产列表】中进行查看。');
        }
        return of(null);
    }

    preSubmit(svrConfig: any, formValue: any): Observable<any> {
        if (svrConfig.procedure.procedureId === 'windReview') {
            const rolesArr = this.xn.user.roles.filter((x) => {
                return x === 'reviewer';
            });
            if (!(rolesArr && rolesArr.length)) {
                this.xn.msgBox.open(false, '您好，您的权限不够，仅【业务复核人】可进行操作');
                return of({ action: 'stop' });
            } else {
                return of(null);
            }
        }
        return of(null);
    }

    getTitleConfig(): any {
        return {
            hideTitle: true,
            titleName: '流程标题',
            def: '特殊资产标记'
        };
    }
}
