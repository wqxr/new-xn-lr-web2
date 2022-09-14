/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：SupplierUploadInformationFlow
 * @summary：中介机构用户新增流程
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 yutianbao          增加功能1         2019-09-20
 * **********************************************************************
 */
import { XnService } from '../../../services/xn.service';
import { Observable, of } from 'rxjs';
import { LoadingService } from '../../../services/loading.service';
import { IFlowCustom } from './flow-custom';
import { XnUtils } from '../../../common/xn-utils';
import * as lodashall from 'lodash';

export class DragonIntermediaryUserAdd implements IFlowCustom {
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
    afterSubmitandGettip(svrConfig: any): Observable<any> {
        if (svrConfig.procedure.procedureId === '@begin') {
            this.xn.msgBox.open(false, ['提交成功！', '请“高管复核人”在首页待办进行复核，此账号在复核后生效。']);
        } else if (svrConfig.procedure.procedureId === 'windReview') {
            this.xn.msgBox.open(false, '提交成功！');
        }
        return of(null);
    }

    preSubmit(svrConfig: any, formValue: any): Observable<any> {
        if (svrConfig.procedure.procedureId === 'windReview') {
            const rolesArr = this.xn.user.roles.filter((x) => {
                return x === 'windReviewer';
            });
            if (!(rolesArr && rolesArr.length)) {
                this.xn.msgBox.open(false, '您好，您的权限不够，仅【高管复核人】可进行操作');
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
            def: '新增中介机构用户'
        };
    }
}
