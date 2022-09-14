/**
 * 定义流程的个性化信息
 */
import { ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
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
import { SubJdCheckFail } from './sub_jd_check_fail';
import { JdFinancingPre } from './jd_financing_pre';
import { NewGemdaleFinancing } from './jd_financing';
import { JdPlatformVerify } from './jd_platform_verify';
import { JdFactoringRisk } from './jd_factoring_risk';
import { JdFinancingSign } from './jd_financing_sign';
import { SubVankeChange } from './sub_vanke_change';
import { JdAccountChangePre } from './sub_jd_change';
import { SubFactoringJdVerifyRetreat } from './sub_factoring_jd_verify_retreat';
import { SubFactoringJdRetreat } from './sub_factoring_jd_retreat';
import { SubProjectConfirmation } from './sub_project_confirmation';
import { JdFactoringPassback } from './jd_factoring_passback';
import { DragonbookStop } from './dragon_book_stop';
import { SubChangeVerification } from './sub_change_verification';
import { SubChangeVerificationShort } from './sub_change_verification_short';
import { JdProjectFinancingSign } from './sub_jd_change_project_sign';
import { SubJdChangeVerification } from './sub_jd_change_verification';
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



            // 金地-发起审核失败
            case 'sub_jd_check_fail':
                return new SubJdCheckFail(xn, loading);
            // 金地-台账发起退单流程
            case 'sub_factoring_jd_retreat':
                return new SubFactoringJdRetreat(xn, loading);
            // 台账退单流程-保理商财务确认-调用金地接口
            case 'sub_factoring_jd_verify_retreat':
                return new SubFactoringJdVerifyRetreat(xn, loading);
            // 台账-中止交易
            case 'sub_dragon_book_stop':
                return new DragonbookStop(xn, loading);

            // 金地-发起提单
            case 'jd_financing_pre':
                return new JdFinancingPre(xn);
            // 金地-供应商上传资料
            case 'jd_financing':
                return new NewGemdaleFinancing(xn, loading);
            // 金地-平台审核
            case 'jd_platform_verify':
                return new JdPlatformVerify(xn, loading);
            // 金地-保理商风险审核
            case 'jd_factoring_risk':
                return new JdFactoringRisk(xn, loading);
            // 金地-项目公司确认应收账款金额
            case 'sub_project_confirmation':
                return new SubProjectConfirmation(xn);
            // 金地-供应商签署合同
            case 'jd_financing_sign':
                return new JdFinancingSign(xn, loading, localservice);
            // 金地-保理商回传合同
            case 'jd_factoring_passback':
                return new JdFactoringPassback(xn, loading);
            // 金地发起变更流程
            case 'sub_jd_change_project_sign':
                return new JdProjectFinancingSign(xn, loading);
            case 'sub_jd_change':
                return new JdAccountChangePre(xn);
            case 'sub_jd_change_verification':
                return new SubJdChangeVerification(xn);
            default:
                return new DefaultFlow(xn, loading);
        }
    }
}
