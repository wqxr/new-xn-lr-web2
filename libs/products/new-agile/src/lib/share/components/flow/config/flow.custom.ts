import { ViewContainerRef } from '@angular/core';
import { Observable, of } from 'rxjs';

import { PlatformPre18Flow } from './platform_pre18.flow';
import { Financing18Flow } from './financing18.flow';
import { FinancingSupplier18Flow } from './financing-supplier18.flow';
import { PayQrs18Flow } from './pay_qrs18.flow';
import { PayOver18Flow } from './pay_over18.flow';
import { PayPz18Flow } from './pay_pz18.flow';
import { EntryRegistration18Flow } from './entry_registration18.flow';
import { EntryRegistrationCode18Flow } from './entry_registration_code18.flow';
import { PayConfirm18Flow } from './pay-confirm18.flow';
import { AssignorInformationRegistration18Flow } from './assignor_information_registration18.flow';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';

/**
 * 这里定义流程的个性化信息
 */
export interface IFlowCustom {
    /**
     * 显示界面之前的调用函数
     * @return { action: 'navigate-back|const-params' } or null
     */
    preShow(): Observable<any>;

    /**
     * 显示完成后的调用函数
     * @param svrConfig
     * @return { action: 'navigate-back|const-params' } or null
     */
    postShow(svrConfig: any): Observable<any>;

    /**
     * 收到服务器返回的svrConfig时做的额外处理工作
     * @param svrConfig
     */
    postGetSvrConfig(svrConfig: any): void;

    /**
     * 显示时返回流程标题的配置信息
     * @return { hideTitle: false, def: '', titleName: '项目名称' }
     */
    getTitleConfig(): any;

    /**
     * 新建/提交流程之前的调用函数
     * @param svrConfig
     * @return { action: 'navigate-back|const-params' } or null
     */
    preSubmit(svrConfig: any, formValue: any): Observable<any>;
}

class DefaultFlow implements IFlowCustom {
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

    getTitleConfig(): any {
        return {
            hideTitle: false,
            titleName: '流程标题',
            def: ''
        };
    }

    preSubmit(svrConfig: any, formValue: any): Observable<any> {
        return of(null);
    }
}

/**
 *  基础模式，地产abs[万科，金地] ,定向支付
 */
export class FlowCustom {
    static build(
        name: string,
        xn: XnService,
        vcr: ViewContainerRef,
        loading: LoadingService
    ): IFlowCustom {
        switch (name) {
            // 万科abs3.0
            case 'financing_pre18':
                return new PlatformPre18Flow(xn);
            case 'financing18':
                return new Financing18Flow(xn, loading);
            case 'financing_supplier18':
                return new FinancingSupplier18Flow(xn, loading);
            case 'pay_qrs18':
                return new PayQrs18Flow(xn);
            case 'pay_qrs_real18':
                return new PayQrs18Flow(xn);

            case 'pay_over18':
                return new PayOver18Flow(xn);

            case 'pay_pz18':
                return new PayPz18Flow(xn);

            case 'entry_registration18':
                return new EntryRegistration18Flow(xn);

            case 'assignor_information_registration18':
                return new AssignorInformationRegistration18Flow(xn);

            case 'entry_registration_code18':
                return new EntryRegistrationCode18Flow(xn);
            // 万科模式，上传付款确认书
            case 'pay_confirm18':
                return new PayConfirm18Flow(xn);

            default:
                return new DefaultFlow(xn, loading);
        }
    }

    static calcFlowProcess(flowId: string): { show: boolean, steped: number | null, proxy: number | null } {
        switch (flowId) {
            // 标准保理（雅居乐-星顺）
            case 'financing_pre18':
                return { show: true, steped: 1, proxy: 18 };
            case 'financing18':
                return { show: true, steped: 2, proxy: 18 };
            case 'financing_supplier18':
                return { show: true, steped: 3, proxy: 18 };

            default:
                return { show: false, steped: 8, proxy: 0 };
        }
    }

    static get flowProcessSteps() {
        return [
            { id: 1, name: '平台预录入' },
            { id: 2, name: '供应商上传资料' },
            { id: 3, name: '平台审核' },
            { id: 4, name: '交易完成' },
            { id: 8, name: '终止' },
        ];
    }

    static get status() {
        return [
            { id: 1, name: '平台预录入' },
            { id: 2, name: '供应商上传资料' },
            { id: 3, name: '平台审核' },
            { id: 4, name: '交易完成' },
            { id: 5, name: '保理签署合同' },
            { id: 6, name: '供应商签署合同' },
            { id: 8, name: '终止' },
        ];
    }

    static getSteped(status: number) {
        return this.status.find((x: any) => x.id === status);
    }

    static getCurrentFlowProcessStep(paramsStatus) {
        const finish = 4;
        const terminal = 8;
        // 计算状态码下一位是否为 终止代码8
        const currStep = paramsStatus + 1 > terminal
            ? paramsStatus
            : (paramsStatus + 1 > finish ? finish : paramsStatus + 1);

        return this.flowProcessSteps.find((x: any) => x.id === currStep);
    }
}
