/**
 * 定义流程的个性化信息
 */
import { ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { PublicCommunicateService } from 'libs/shared/src/lib/services/public-communicate.service';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
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
import { DragonOnceContractGroupAdd } from './sub_first_contract_add';
import { DragonOnceContractGroupModify } from './sub_first_contract_modify';
import { DragonOnceContractGroupDelete } from './sub_first_contract_delete';
import { DragonOnceContractTemplateAdd } from './once_contract_template_add';
import { DragonSpecialCapitalMark } from './sub_special_capital_mark';
import { DragonDisposeSpecialCapital } from './sub_dispose_special_capital';
import { SubLawManagerSurvey } from './sub_law_manager_survey';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { DragonbookStop } from './dragon_book_stop';
import { DragonbookChange } from './dragon_book_change';
import { SubFactoringRetreat } from './sub_factoring_retreat';
import { SubPlatformRetreat } from './sub_platform_check_retreat';
import { SubFactoringVerifyRetreat } from './sub_factoring_verify_retreat';

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
        return svrConfig;
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
            // 发起提单
            case 'dragon_financing_pre':
                return new DragonFinancingPre(xn, loading);
            // 供应商上传资料
            case 'dragon_financing':
                return new DragonFinancing(xn, loading);
            // 平台审核
            case 'dragon_platform_verify':
                return new DragonPlatformVerify(xn, loading);
            // 供应商签署合同
            case 'dragon_supplier_sign':
                return new DragonSupplierSign(xn, loading);

            // 人工匹配付款确认书
            case 'sub_person_match_qrs':
                return new DragonPersonMatchVerify(xn, loading);
            // 系统匹配付款确认书
            case 'sub_system_match_qrs':
                return new DragonSystemMatchVerify(xn, loading);
            // 替换确认书
            case 'sub_replace_qrs':
                return new DragonReplaceQrs(xn, loading);


            /** 一次转让合同管理 */
            // 新增合同组
            case 'sub_first_contract_add':
                return new DragonOnceContractGroupAdd(xn, loading);
            // 修改合同组
            case 'sub_first_contract_modify':
                return new DragonOnceContractGroupModify(xn, loading);
            // 删除合同组
            case 'sub_first_contract_delete':
                return new DragonOnceContractGroupDelete(xn, loading);
            // 新增合同模板
            case 'once_contract_template_add':
                return new DragonOnceContractTemplateAdd(xn, loading);

            /** 台账相关流程 */
            // 中止交易流程
            case 'sub_dragon_book_stop':
                return new DragonbookStop(xn, loading);
            // 台账修改预录入
            case 'sub_dragon_book_change':
                return new DragonbookChange(xn, loading);
            // 退单流程
            case 'sub_factoring_retreat':
                return new SubFactoringRetreat(xn, loading);
            // 退单-平台审核
            case 'sub_platform_check_retreat':
                return new SubPlatformRetreat(xn, loading);
            // 退单-保理商审核
            case 'sub_factoring_verify_retreat':
                return new SubFactoringVerifyRetreat(xn, loading);

            /** 项目管理相关流程 */
            // 变更发行
            case 'sub_change_start':
                return new SubChangeStart(xn, loading);
            // 变更发行-供应商签署补充协议
            case 'sub_supplier_add':
                return new SubSupplierAdd(xn, loading);
            // 变更发行-项目公司签署补充协议
            case 'sub_project_add':
                return new SubProjectAdd(xn, loading);
            // 更改保理融资到期日
            case 'sub_change_date':
                return new SubChangeDate(xn, loading);
            // 资产池变更
            case 'sub_change_capital':
                return new SubChangeCapital(xn, loading);
            // 特殊资产标记
            case 'sub_special_asset_sign':
                return new DragonSpecialCapitalMark(xn, loading);
            // 处置特殊资产
            case 'sub_special_asset_dispose':
                return new DragonDisposeSpecialCapital(xn, loading);
            // 尽调流程
            case 'sub_law_manager_survey':
                return new SubLawManagerSurvey(xn, loading);
            default:
                return new DefaultFlow(xn, loading);
        }
    }
}
