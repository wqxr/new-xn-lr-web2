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

import { AgilePlatformVerify } from './agile_platform_verify';
import { AgileFactoringRisk } from './agile_factoring_risk';
import { AgileFinancingSign } from './agile_financing_sign';
import { SubAgileChange } from './sub_agile_change';
import { SubFactoringAgileVerifyRetreat } from './sub_factoring_agile_verify_retreat';
import { SubFactoringAgileRetreat } from './sub_factoring_agile_retreat';
import { AgileFactoringPassback } from './agile_factoring_passback';
import { DragonbookStop } from './dragon_book_stop';
import { SubAgileChangeVerification } from './sub_change_verification';

import { AgileXingshunFinancingPre } from './agile_xingshun_financing_pre';
import { AgileXingshunFinancing } from './agile_xingshun_financing';
import { DragonPersonMatchVerify } from './person_match_qrs';
import { DragonReplaceQrs } from './replace_qrs';
import { DragonbookChange } from './dragon_book_change';


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
            // 台账修改预入录信息
            case 'sub_dragon_book_change':
                return new DragonbookChange(xn, loading);
            // 供应商账号变更
            case 'sub_yjl_change':
                return new SubAgileChange(xn, loading);
            // 供应商账号变更流程平台审核
            case 'sub_yjl_change_verification':
                return new SubAgileChangeVerification(xn, loading);
            // 人工匹配付款确认书
            case 'sub_person_match_qrs':
                return new DragonPersonMatchVerify(xn, loading);
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



            // 雅居乐-星顺-台账发起退单流程
            case 'sub_factoring_retreat':
                return new SubFactoringAgileRetreat(xn, loading);
            // 台账退单流程-保理商财务确认
            case 'sub_factoring_verify_retreat':
                return new SubFactoringAgileVerifyRetreat(xn, loading);
            // 台账-中止交易
            case 'sub_dragon_book_stop':
                return new DragonbookStop(xn, loading);

            // 雅居乐-星顺-发起提单
            case 'yjl_financing_pre_common':
                return new AgileXingshunFinancingPre(xn);
            // 雅居乐-星顺-供应商上传资料
            case 'yjl_financing_common':
                return new AgileXingshunFinancing(xn, loading);
            // 雅居乐-星顺-平台审核
            case 'yjl_platform_verify_common':
                return new AgilePlatformVerify(xn, loading);
            // 雅居乐-星顺-保理商风险审核
            case 'yjl_factoring_risk_common':
                return new AgileFactoringRisk(xn, loading);
            // 雅居乐-星顺-供应商签署合同
            case 'yjl_financing_sign_common':
                return new AgileFinancingSign(xn, loading, localservice);
            // 雅居乐-星顺-保理商回传合同
            case 'yjl_factoring_passback_common':
                return new AgileFactoringPassback(xn, loading);

            default:
                return new DefaultFlow(xn, loading);
        }
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
}
