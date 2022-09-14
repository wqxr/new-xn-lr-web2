import { FormGroup, FormControl, Validators } from '@angular/forms';
/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：SupplierUploadInformationFlow
 * @summary：分布提交万科ABS保理商回传合同
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                wangqing        保理商回传合同         2021-09-09
 * **********************************************************************
 */

import { Observable, of } from 'rxjs';
import { IFlowCustom, buttonListType } from './flow-custom';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import * as _ from 'lodash';

export class VankeFactoringPassbackStep implements IFlowCustom {
    public buttonList:buttonListType = _.cloneDeep(buttonList);

    constructor(private xn: XnService, private loading: LoadingService) {
    }

    preShow(svrConfig): Observable<any> {
        return of(null);
    }
    afterSubmitandGettip(svrConfig: any,): Observable<any> {
        return of(null);
    }
    postShow(svrConfig: any, form: FormGroup): Observable<any> {
        if(svrConfig.rejectType===0){
            this.buttonList[svrConfig.procedure.procedureId].rightButtons.push({
                label: '中止流程', operate: 'suspension', danger: false, color: 'default', click: (mainForm, svrConfig, xn, vcr) => {
                }
            })
        }
        return of({ buttonList: this.buttonList[svrConfig.procedure.procedureId] });
    }

    postGetSvrConfig(svrConfig: any, rows: any): void {
        if (svrConfig.actions && svrConfig.actions.length > 0) {
            svrConfig.actions.forEach((x, index) => {
                if (x.checkers.length) {
                    x.stepList.forEach(y => {
                        y.checkerIdList = x.checkers.filter(z => z.stepId === y.stepId);
                    })
                }
            })
        }
        if (svrConfig.stepList && svrConfig.stepList.length > 0) {
            svrConfig.stepList.forEach(x => {
                x.checkerIdList = svrConfig.checkers.filter(y => y.stepId === x.stepId);
            });
        }
    }
    preSubmit(svrConfig: any, formValue: any): Observable<any> {
        return of(null);
    }

    getTitleConfig(): any {
        return {
            hideTitle: true,
            titleName: '流程标题',
            def: '保理商回传合同'
        };
    }
}
const buttonList: buttonListType = {
    '@begin': {
        leftButtons: [],
        rightButtons: []
    },
    operate: {
        leftButtons: [],
        rightButtons: [{
            label: '拒绝', danger: false, color: 'default', operate: 'reject', click: () => {
            }
        }]
    },
    review: {
        leftButtons: [],
        rightButtons: [
            {
                label: '拒绝', danger: false, color: 'default', operate: 'reject', click: () => {

                }
            }
        ]
    },

}
