/**
 * 定义流程的个性化信息
 */
import { ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { XnService } from '../../../services/xn.service';
import { LoadingService } from '../../../services/loading.service';
import { PublicCommunicateService } from '../../../services/public-communicate.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import { DragonSupplierSign } from './dragon_supplier_sign';
import { DragonPlatformVerify } from './dragon-platform_verify';
import { DragonFinancingPre } from './dragon_financing_pre';
import { DragonFinancing } from './dragon_financing';
import { DragonPersonMatchVerify } from './person_match_qrs';
import { DragonSystemMatchVerify } from './sub_system_match_qrs';
import { DragonReplaceQrs } from './replace_qrs';
import { SubChangeStart } from './sub_change_start';
import { SubChangeDate } from './sub_change_date';
import { SubSupplierAdd } from './sub_supplier_add';
import { SubProjectAdd } from './sub_project_add';
import { SubChangeCapital } from './sub_change_capital';
import { SubSpecialStart } from './sub_special_start';
import { DragonNuonuocsBlue } from './sub_nuonuocs_blue';
import { DragonNuonuocsRed } from './sub_nuonuocs_red';
import { DragonIntermediaryAdd } from './sub_intermediary_add';
import { DragonIntermediaryModify } from './sub_intermediary_modify';
import { DragonIntermediaryDelete } from './sub_intermediary_delete';
import { DragonIntermediaryUserAdd } from './sub_intermediary_user_add';
import { DragonIntermediaryUserModify } from './sub_intermediary_user_modify';
import { DragonIntermediaryUserDelete } from './sub_intermediary_user_delete';
import { SubSpecialVerfication } from './sub_special_verification';
import { SubVankeChange } from './sub_vanke_change';
import { SubChangeVerification } from './sub_change_verification';
import { SubChangeVerificationShort } from './sub_change_verification_short';
import { DragonOnceContractGroupAdd } from './sub_first_contract_add';
import { DragonOnceContractGroupModify } from './sub_first_contract_modify';
import { DragonOnceContractGroupDelete } from './sub_first_contract_delete';
import { DragonOnceContractTemplateAdd } from './once_contract_template_add';
import { DragonQrsDownloadManualVerify } from './sub_qrs_manual_verify';
import { VankesystemCheck } from './sub_vanke_system_check_reject';
import { DragonbookStop } from '../../../../../../products/machine-account/src/lib/flow/dragon_book_stop';
import { DragonbookChange } from '../../../../../../products/machine-account/src/lib/flow/dragon_book_change';
import { ZhongdengRegister } from '../../../../../../products/machine-account/src/lib/flow/zhongdeng_register';
import { SubPlatformRetreat } from '../../../../../../products/machine-account/src/lib/flow/sub_platform_check_retreat';
import { SubFactoringRetreat } from '../../../../../../products/machine-account/src/lib/flow/sub_factoring_retreat';
import { SubFactoringVerifyRetreat } from '../../../../../../products/machine-account/src/lib/flow/sub_factoring_verify_retreat';
import { DragonSpecialCapitalMark } from './sub_special_capital_mark';
import { DragonDisposeSpecialCapital } from './sub_dispose_special_capital';
import { SubLawManagerSurvey } from './sub_law_manager_survey';
import { CfcaSignPre } from './cfca_sign_pre';
import { CfcaFinancingSign } from './cfca_financing_sign';
import { SubPlatformCertify } from './sub_platform_certify';
import {SubDebtUnitCertify} from './sub_debtUnit_upload_certify';
import {SubDebtUnitPlatCertify} from './sub_debtUnit_certify';
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
            case 'dragon_financing_pre':
                return new DragonFinancingPre(xn, loading);
            case 'dragon_financing':
                return new DragonFinancing(xn, loading);
            case 'dragon_platform_verify':
                return new DragonPlatformVerify(xn, loading);
            case 'dragon_supplier_sign':
                return new DragonSupplierSign(xn, loading);
            case 'sub_person_match_qrs':
                return new DragonPersonMatchVerify(xn, loading);
            case 'sub_system_match_qrs':
                return new DragonSystemMatchVerify(xn, loading);
            case 'sub_replace_qrs':
                return new DragonReplaceQrs(xn, loading);
            case 'sub_vanke_system_hand_verify':
                return new DragonQrsDownloadManualVerify(xn, loading);
            case 'sub_change_start':
                return new SubChangeStart(xn, loading);
            case 'sub_change_date':
                return new SubChangeDate(xn, loading);
            case 'sub_supplier_add':
                return new SubSupplierAdd(xn, loading);
            case 'sub_project_add':
                return new SubProjectAdd(xn, loading);
            case 'sub_change_capital':
                return new SubChangeCapital(xn, loading);
            case 'sub_special_start':
                return new SubSpecialStart(xn, loading);
            // 开票管理流程
            case 'sub_nuonuocs_blue':
                return new DragonNuonuocsBlue(xn, loading);
            case 'sub_nuonuocs_red':
                return new DragonNuonuocsRed(xn, loading);
            case 'sub_special_verification':
                return new SubSpecialVerfication(xn, loading);
            // 中介机构
            case 'sub_intermediary_add':
                return new DragonIntermediaryAdd(xn, loading);
            case 'sub_intermediary_modify':
                return new DragonIntermediaryModify(xn, loading);
            case 'sub_intermediary_delete':
                return new DragonIntermediaryDelete(xn, loading);
            case 'sub_agency_user_add':
                return new DragonIntermediaryUserAdd(xn, loading);
            case 'sub_agency_user_modify':
                return new DragonIntermediaryUserModify(xn, loading);
            case 'sub_agency_user_delete':
                return new DragonIntermediaryUserDelete(xn, loading);
            case 'sub_vanke_change':
                return new SubVankeChange(xn, loading);
            case 'sub_change_verification':
                return new SubChangeVerification(xn, loading);
            case 'sub_change_verification_short':
                return new SubChangeVerificationShort(xn, loading);
            // 一次转让合同管理
            case 'sub_first_contract_add':
                return new DragonOnceContractGroupAdd(xn, loading);
            case 'sub_first_contract_modify':
                return new DragonOnceContractGroupModify(xn, loading);
            case 'sub_first_contract_delete':
                return new DragonOnceContractGroupDelete(xn, loading);
            case 'once_contract_template_add':
                return new DragonOnceContractTemplateAdd(xn, loading);
            case 'sub_vanke_system_check_reject':
                return new VankesystemCheck(xn, loading);
            case 'sub_dragon_book_stop':
                return new DragonbookStop(xn, loading);
            case 'sub_dragon_book_change':
                return new DragonbookChange(xn, loading);
            case 'sub_zhongdeng_register':
                return new ZhongdengRegister(xn, loading);
            case 'sub_factoring_retreat':
                return new SubFactoringRetreat(xn, loading);
            case 'sub_platform_check_retreat':
                return new SubPlatformRetreat(xn, loading);
            case 'sub_factoring_verify_retreat':
                return new SubFactoringVerifyRetreat(xn, loading);
            case 'sub_special_asset_sign':
                return new DragonSpecialCapitalMark(xn, loading);
            case 'sub_special_asset_dispose':
                return new DragonDisposeSpecialCapital(xn, loading);
            case 'sub_law_manager_survey':
                return new SubLawManagerSurvey(xn, loading);
            // 通用签章流程-cfca
            case 'sub_cfca_sign_pre':
                return new CfcaSignPre(xn, loading);
            case 'sub_cfca_financing_sign':
                return new CfcaFinancingSign(xn, loading, vcr);
            case 'sub_platform_certify':
                return new SubPlatformCertify(xn, loading);
            case 'sub_debtUnit_upload_certify':
                return new SubDebtUnitCertify(xn, loading);
            case 'sub_debtUnit_certify':
                return new SubDebtUnitPlatCertify(xn,loading);
            default:
                return new DefaultFlow(xn, loading);
        }
    }
}
