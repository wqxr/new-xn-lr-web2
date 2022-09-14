/**
 * 定义流程的个性化信息
 */
import { ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { PublicCommunicateService } from 'libs/shared/src/lib/services/public-communicate.service';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
// 上海银行主流程
import { ShVankeFinancingPre } from './sh_vanke_financing_pre';
import { ShVankeFinancing } from './sh_vanke_financing';
import { ShVankePlatformVerify } from './sh_vanke_platform_verify';
import { ShVankeBankVerify } from './sh_vanke_bank_verify';
import { ShangHaiFinancingSign } from './sh_vanke_financing_sign';
// 其他子流程
import { SubShSupplementaryInfoInput } from './sub_sh_supplementaryinfo_input';
import { SubShSupplementaryInfoPlatformVerify } from './sub_sh_supplementaryinfo_platform_verify';
import { SubShPlatformRetreat } from './sub_sh_platform_check_retreat';
import { SubTradeStop } from './sub_trade_stop';
import { SubSupplierAdd } from './sub_supplier_add';
import { SubProjectAdd } from './sub_project_add';
import { SubSpecialStart } from './sub_special_start';
import { SubSpecialVerfication } from './sub_special_verification';
import { SubVankeChange } from './sub_vanke_change';
import { SubChangeVerification } from './sub_change_verification';
import { SubChangeVerificationShort } from './sub_change_verification_short';
import { VankesystemCheck } from './sub_vanke_system_check_reject';
import { ZhongdengRegister } from 'libs/products/machine-account/src/lib/flow/zhongdeng_register';
import { SubShPrattwhitneyInput } from './sub_sh_prattwhitney_input';
import { SubShPrattwhitneyPlatformVerify } from './sub_sh_prattwhitney_platform_verify';

export interface IFlowCustom {
    /**
     * 显示界面之前的调用函数
     * @return Observable or null
     */
    preShow(svrConfig: any): Observable<any>;

    /**
     * 显示完成后的调用函数
     * @param svrConfig
     * @return Observable or null
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
    preSubmit(svrConfig: any, formValue: any): Observable<any>;
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

    preSubmit(svrConfig: any, formValue: any): Observable<any> {
        return of(null);
    }

    afterSubmitandGettip(svrConfig: any, formValue?: any, x?: any): Observable<any> {
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
            // 平台预录入
            case 'sh_vanke_financing_pre':
                return new ShVankeFinancingPre(xn, loading);
            // 待供应商上传资料
            case 'sh_vanke_financing':
                return new ShVankeFinancing(xn, loading);
            // 待平台审核
            case 'sh_vanke_platform_verify':
                return new ShVankePlatformVerify(xn, loading);
            // 待上银复核
            case 'sh_vanke_bank_verify':
                return new ShVankeBankVerify(xn, loading);
            // 待供应商签署合同
            case 'sh_vanke_financing_sign':
                return new ShangHaiFinancingSign(xn, loading);
            // 供应商上传准入资料
            case 'sub_sh_supplementaryinfo_input':
                return new SubShSupplementaryInfoInput(xn, loading);
            // 平台审核供应商准入资料
            case 'sub_sh_supplementaryinfo_platform_verify':
                return new SubShSupplementaryInfoPlatformVerify(xn, loading);
            // 退单流程-平台审核
            case 'sub_sh_platform_check_retreat':
                return new SubShPlatformRetreat(xn, loading);
            // 中止
            case 'sub_dragon_book_stop':
                return new SubTradeStop(xn, loading);
            // 预审不通过
            case 'sub_vanke_system_check_reject':
                return new VankesystemCheck(xn, loading);
            // 中登登记
            case 'sub_zhongdeng_register':
                return new ZhongdengRegister(xn, loading);

            // 供应商签署补充协议
            case 'sub_supplier_add':
                return new SubSupplierAdd(xn, loading);
            // 项目公司签署补充协议
            case 'sub_project_add':
                return new SubProjectAdd(xn, loading);
            // 特殊事项审批
            case 'sub_special_start':
                return new SubSpecialStart(xn, loading);
            // 特殊事项保理审核
            case 'sub_special_verification':
                return new SubSpecialVerfication(xn, loading);
            // 变更账户流程
            case 'sub_vanke_change':
                return new SubVankeChange(xn, loading);
            // 变更流程保理审核
            case 'sub_change_verification':
                return new SubChangeVerification(xn, loading);
            // 变更流程保理审核
            case 'sub_change_verification_short':
                return new SubChangeVerificationShort(xn, loading);

            // 供应商普惠记账簿开户申请
            case 'sub_sh_prattwhitney_input':
                return new SubShPrattwhitneyInput(xn, loading);
            // 平台审核普惠记账簿开户申请
            case 'sub_sh_prattwhitney_platform_verify':
                return new SubShPrattwhitneyPlatformVerify(xn, loading);

            default:
                return new DefaultFlow(xn, loading);
        }
    }
}
