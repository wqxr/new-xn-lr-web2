/**
 * 定义流程的个性化信息
 */
import { ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { DragonPersonMatchVerify } from './person_match_qrs';
import { DragonSystemMatchVerify } from './sub_system_match_qrs';
import { DragonReplaceQrs } from './replace_qrs';
import { SubSpecialStart } from './sub_special_start';
import { SubSpecialVerfication } from './sub_special_verification';
import { DragonOnceContractGroupAdd } from './sub_first_contract_add';
import { DragonOnceContractGroupModify } from './sub_first_contract_modify';
import { DragonOnceContractGroupDelete } from './sub_first_contract_delete';
import { DragonSpecialCapitalMark } from './sub_special_capital_mark';
import { DragonDisposeSpecialCapital } from './sub_dispose_special_capital';
import { SubLawManagerSurvey } from './sub_law_manager_survey';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { PublicCommunicateService } from 'libs/shared/src/lib/services/public-communicate.service';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { SubBgyCheckFail } from './sub_bgy_check_fail';
import { CountryGradenFinancingPre } from './bgy_financing_pre';
import { CountryGradenFinancing } from './bgy_financing';
import { BgyPlatformVerify } from './bgy_platform_verify';
import { BgyFactoringRisk } from './bgy_factoring_risk';
import { BgyFinancingSign } from './bgy_financing_sign';
import { SubVankeChange } from './sub_vanke_change';
import { SubFactoringVerifyRetreat } from './sub_factoring_verify_retreat';
import { SubChangeVerification } from './sub_change_verification';
import { SubChangeVerificationShort } from './sub_change_verification_short';


interface a { }
interface b extends a {

}
export interface IFlowCustom {
    /**
     * 显示界面之前的调用函数
     * @return { action: 'navigate-back|const-params' } or null
     */
    preShow(svrConfig: any): Observable<any>;

    /**
     * 显示完成后的调用函数
     * @param svrConfig
     * @return { action: 'navigate-back|const-params' } or null
     */
    postShow(svrConfig: any, mainForm: FormGroup): Observable<any>;

    /**
     * 收到服务器返回的svrConfig时做的额外处理工作
     * @param svrConfig
     */
    postGetSvrConfig(svrConfig: any): void;

    /**
     * 提交后处理
     * @param svrConfig
     * @param x 提交接口返回数据
     */
    afterSubmitandGettip(svrConfig: any, formValue?: any, x?: any): Observable<any>;

    /**
     * 显示时返回流程标题的配置信息
     * @return { hideTitle: false, def: '', titleName: '项目名称' }
     */
    getTitleConfig(): any;

    /**
     * 新建/提交流程之前的调用函数
     * @param svrConfig
     * @param formValue
     * @return { action: 'navigate-back|const-params' } or null
     */
    preSubmit(svrConfig: any, formValue: any,): Observable<any>;
}

class DefaultFlow implements IFlowCustom {
    constructor(private xn: XnService, private loading: LoadingService) {
    }

    preShow(svrConfig: any): Observable<any> {
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

    preSubmit(svrConfig: any, formValue: any,): Observable<any> {
        return of(null);
    }

    afterSubmitandGettip(svrConfig: any, formValue?: any, x?: any,): Observable<any> {
        return of(null);
    }
}

/**
 *  定义流程的个性化信息
 */
export class FlowCustom {

    static build(
        name: string,
        xn: XnService,
        vcr: ViewContainerRef,
        loading: LoadingService,
        communicate: PublicCommunicateService,
        localservice: LocalStorageService,
    ): IFlowCustom {

        switch (name) {
            // 账号变更
            case 'sub_vanke_change':
                return new SubVankeChange(xn, loading);
            // 账号变更流程保理审核
            case 'sub_change_verification':
                return new SubChangeVerification(xn, loading);
            // 账号变更流程保理审核
            case 'sub_change_verification_short':
                return new SubChangeVerificationShort(xn, loading);
            // 人工匹配付款确认书
            case 'sub_person_match_qrs':
                return new DragonPersonMatchVerify(xn, loading);
            // 系统匹配付款确认书
            case 'sub_system_match_qrs':
                return new DragonSystemMatchVerify(xn, loading);
            // 替换付款确认书
            case 'sub_replace_qrs':
                return new DragonReplaceQrs(xn, loading);
            // 特殊事项审批
            case 'sub_special_start':
                return new SubSpecialStart(xn, loading);
            // 开票管理流程
            case 'sub_special_verification':
                return new SubSpecialVerfication(xn, loading);
            // 一转让合同组新增
            case 'sub_first_contract_add':
                return new DragonOnceContractGroupAdd(xn, loading);
            // 一转让合同组修改
            case 'sub_first_contract_modify':
                return new DragonOnceContractGroupModify(xn, loading);
            // 一转让合同组删除
            case 'sub_first_contract_delete':
                return new DragonOnceContractGroupDelete(xn, loading);
            // 特殊资产标记
            case 'sub_special_asset_sign':
                return new DragonSpecialCapitalMark(xn, loading);
            // 处置特殊资产
            case 'sub_special_asset_dispose':
                return new DragonDisposeSpecialCapital(xn, loading);
            // 尽调流程
            case 'sub_law_manager_survey':
                return new SubLawManagerSurvey(xn, loading);
            // 碧桂园-发起提单
            case 'bgy_financing_pre':
                return new CountryGradenFinancingPre(xn);
            // 碧桂园-发起审核失败
            case 'sub_bgy_check_fail':
                return new SubBgyCheckFail(xn, loading);
            // 退单流程
            case 'sub_factoring_verify_retreat':
                return new SubFactoringVerifyRetreat(xn, loading);
            // 碧桂园-供应商上传资料
            case 'bgy_financing':
                return new CountryGradenFinancing(xn, loading);
            // 碧桂园-平台审核
            case 'bgy_platform_verify':
                return new BgyPlatformVerify(xn, loading);
            // 碧桂园-保理商风险审核
            case 'bgy_factoring_risk':
                return new BgyFactoringRisk(xn, loading);
            // 碧桂园-供应商签署合同
            case 'bgy_financing_sign':
                return new BgyFinancingSign(xn, loading, localservice);
            default:
                return new DefaultFlow(xn, loading);
        }
    }
}
