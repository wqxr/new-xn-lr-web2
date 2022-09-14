/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：DragonPersonMatchVerify
 * @summary：雅居乐-星顺 人工匹配付款确认书
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0               hucongying         雅居乐改造项目     2021-02-01
 * **********************************************************************
 */

import { Observable, of } from 'rxjs';
import { IFlowCustom } from './flow-custom';
import * as lodashall from 'lodash';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { HeadquartersTypeEnum } from 'libs/shared/src/lib/config/select-options';

export class DragonPersonMatchVerify implements IFlowCustom {
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
            this.xn.msgBox.open(false, `提交成功！下一步请财务复核人在【待办列表-保理通-雅居乐-星顺】中完成【复核】的待办任务。`);
        } else if (svrConfig.procedure.procedureId === 'review') {
            this.xn.msgBox.open(false, '提交成功！');
        }
        return of(null);

    }

    preSubmit(svrConfig: any, formValue: any): Observable<any> {
        if (svrConfig.procedure.procedureId === '@begin') {
            let alert = '';
            const mainlist = JSON.parse(formValue.personList);
            const isOk = lodashall.some(mainlist, ['flag', 0]); // 判断文件是否存在
            const headquarters = svrConfig.checkers.filter((x: any) => x.checkerId === 'headquarters');
            if (headquarters[0].value === HeadquartersTypeEnum[4]) {
                alert = '此交易列表缺少《付款确认书（适用于雅居乐控股向供应商出具）》文件';
            }
            if (isOk) {
                this.xn.msgBox.open(false, alert);
                return of({ action: 'stop' });
            } else {
                return of(null);
            }
        } else {
            return of(null);

        }
    }

    getTitleConfig(): any {
        return {
            hideTitle: true,
            titleName: '流程标题',
            def: '人工匹配'
        };
    }
}
