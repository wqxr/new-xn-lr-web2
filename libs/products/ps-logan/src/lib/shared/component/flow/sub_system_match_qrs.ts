/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：SupplierUploadInformationFlow
 * @summary：上传付确系统匹配
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

export class DragonSystemMatchVerify implements IFlowCustom {
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

    preSubmit(svrConfig: any, formValue: any): Observable<any> {
        if (svrConfig.procedure.procedureId === '@begin') {
            const mainlist = JSON.parse(formValue.systemList);
            const isOk = lodashall.some(mainlist, ['isMatching', 0]); // 判断影印件是否全部匹配
            const alert = '此列表存在【未匹配】的影印件';
            if (isOk) {
                this.xn.msgBox.open(false, alert);
                return of({ action: 'stop' });
                // return of(null);
            } else {
                return of(null);
            }
        } else {
            return of(null);
        }
    }

    afterSubmitandGettip(svrConfig: any): Observable<any> {
        if (svrConfig.procedure.procedureId === '@begin') {
            this.xn.msgBox.open(false, '提交成功！下一步请财务复核人在【首页 - 待办任务】中完成【复核】的待办任务。', () => {
            });
        } else if (svrConfig.procedure.procedureId === 'review') {
            this.xn.msgBox.open(false, '提交成功！', () => {
            });
        }
        return of(null);

    }
    getTitleConfig(): any {
        return {
            hideTitle: true,
            titleName: '流程标题',
            def: '系统匹配付款确认书'
        };
    }
}
