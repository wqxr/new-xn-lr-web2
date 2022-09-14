/**
 * 定义流程的个性化信息
 */
import { ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { DragonPersonMatchVerify } from './person_match_qrs';
import { DragonSystemMatchVerify } from './sub_system_match_qrs';
import { DragonReplaceQrs } from './replace_qrs';
import { SubChangeStart } from './sub_change_start';
import { SubChangeDate } from './sub_change_date';
import { SubSupplierAdd } from './sub_supplier_add';
import { SubProjectAdd } from './sub_project_add';
import { SubChangeCapital } from './sub_change_capital';
import { VankeFinancing } from './vanke_financing';
import { VankeFinancingSign } from './vanke_financing_sign';
import { VankePlatformVerify } from './vanke_platform_verify';
import { VankeFactoringPassback } from './vanke_factoring_passback';
import { VankeFactoringRisk } from './vanke_factoring_risk';
import { SubSpecialStart } from './sub_special_start';
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
import { DragonSpecialCapitalMark } from './sub_special_capital_mark';
import { DragonDisposeSpecialCapital } from './sub_dispose_special_capital';
import { SubLawManagerSurvey } from './sub_law_manager_survey';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { PublicCommunicateService } from 'libs/shared/src/lib/services/public-communicate.service';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { DragonbookStop } from 'libs/products/machine-account/src/lib/flow/dragon_book_stop';
import { DragonbookChange } from 'libs/products/machine-account/src/lib/flow/dragon_book_change';
import { ZhongdengRegister } from 'libs/products/machine-account/src/lib/flow/zhongdeng_register';
import { SubFactoringRetreat } from 'libs/products/machine-account/src/lib/flow/sub_factoring_retreat';
import { SubPlatformRetreat } from 'libs/products/machine-account/src/lib/flow/sub_platform_check_retreat';
import { SubFactoringVerifyRetreat } from 'libs/products/machine-account/src/lib/flow/sub_factoring_verify_retreat';
import { VankeFinancingPre } from './vanke_financing_pre';
import { ButtonConfigModel } from 'libs/shared/src/lib/config/list-config-model';
import { VankeFinancingStepPre } from './vanke_abs_step_financing_pre';
import { VankeFinancingStep } from './vanke_abs_step_financing';
import { VankePlatFormStep } from './vanke_abs_step_platform_verify_operate';
import { VankePlatFormStepReview } from './vanke_abs_step_platform_verify_review';
import { VankeFactoringRiskStep } from './vanke_abs_step_factoring_risk';
import { VankeFinancingSignStep } from './vanke_abs_step_financing_sign';
import { VankeFactoringPassbackStep } from './vanke_abs_step_factoring_passback';
import { PointService } from 'libs/shared/src/lib/services/point.service';
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
  postGetSvrConfig(svrConfig: any, rows?: any): void;

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
    pointService: PointService
  ): IFlowCustom {

    switch (name) {
      // 人工匹配付款确认书
      case 'sub_person_match_qrs':
        return new DragonPersonMatchVerify(xn, loading);
      // 系统匹配付款确认书
      case 'sub_system_match_qrs':
        return new DragonSystemMatchVerify(xn, loading);
      // 上传付确替换文件
      case 'sub_replace_qrs':
        return new DragonReplaceQrs(xn, loading);
      // 下载付确人工校验
      case 'sub_vanke_system_hand_verify':
        return new DragonQrsDownloadManualVerify(xn, loading);

      // 变更发行
      case 'sub_change_start':
        return new SubChangeStart(xn, loading);
      // 资产池变更
      case 'sub_change_capital':
        return new SubChangeCapital(xn, loading);
      // 更改保理融资到期日
      case 'sub_change_date':
        return new SubChangeDate(xn, loading);
      // 供应商签署补充协议
      case 'sub_supplier_add':
        return new SubSupplierAdd(xn, loading);
      // 项目公司签署补充协议
      case 'sub_project_add':
        return new SubProjectAdd(xn, loading);


      // 万科提单保理商预录入
      case 'vanke_financing_pre':
        return new VankeFinancingPre(xn, loading);
      // 供应商提交资料
      case 'vanke_financing':
        return new VankeFinancing(xn, loading, pointService);
      // 平台审核
      case 'vanke_platform_verify':
        return new VankePlatformVerify(xn, loading);
      // 保理商风险审核
      case 'vanke_factoring_risk':
        return new VankeFactoringRisk(xn, loading);
      // 供应商签署合同
      case 'vanke_financing_sign':
        return new VankeFinancingSign(xn, loading, localservice, pointService);
      // 保理商回传合同
      case 'vanke_factoring_passback':
        return new VankeFactoringPassback(xn, loading);
      // 平台发起特殊事项审批
      case 'sub_special_start':
        return new SubSpecialStart(xn, loading);
      // 平台特殊事项保理审核
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


      // 一次转让合同管理
      // 新增合同组
      case 'sub_first_contract_add':
        return new DragonOnceContractGroupAdd(xn, loading);
      // 合同模板组修改流程
      case 'sub_first_contract_modify':
        return new DragonOnceContractGroupModify(xn, loading);
      // 修改合同组
      case 'sub_first_contract_delete':
        return new DragonOnceContractGroupDelete(xn, loading);
      // 新增合同模板
      case 'once_contract_template_add':
        return new DragonOnceContractTemplateAdd(xn, loading);

      // 万科预审不通过流程
      case 'sub_vanke_system_check_reject':
        return new VankesystemCheck(xn, loading);
      // 中止
      case 'sub_dragon_book_stop':
        return new DragonbookStop(xn, loading);
      // 台账修改预录入
      case 'sub_dragon_book_change':
        return new DragonbookChange(xn, loading);
      // 保理商中登登记
      case 'sub_zhongdeng_register':
        return new ZhongdengRegister(xn, loading);
      // 退单流程
      case 'sub_factoring_retreat':
        return new SubFactoringRetreat(xn, loading);
      // 退单流程平台审核
      case 'sub_platform_check_retreat':
        return new SubPlatformRetreat(xn, loading);
      // 退单流程财务确认
      case 'sub_factoring_verify_retreat':
        return new SubFactoringVerifyRetreat(xn, loading);
      // 特殊资产标记流程
      case 'sub_special_asset_sign':
        return new DragonSpecialCapitalMark(xn, loading);
      // 处置特殊资产
      case 'sub_special_asset_dispose':
        return new DragonDisposeSpecialCapital(xn, loading);
      // 尽调流程
      case 'sub_law_manager_survey':
        return new SubLawManagerSurvey(xn, loading);
      // 万科提单预录入分布提交流程
      case 'vanke_abs_step_financing_pre':
        return new VankeFinancingStepPre(xn, loading);
      case 'vanke_abs_step_financing':
        return new VankeFinancingStep(xn, loading, pointService);
      case 'vanke_abs_step_platform_verify_operate':
        return new VankePlatFormStep(xn, loading);
      case 'vanke_abs_step_platform_verify_review':
        return new VankePlatFormStepReview(xn, loading);
      case 'vanke_abs_step_factoring_risk':
        return new VankeFactoringRiskStep(xn, loading);
      case 'vanke_abs_step_financing_sign':
        return new VankeFinancingSignStep(xn, loading, localservice, pointService);
      case 'vanke_abs_step_factoring_passback':
        return new VankeFactoringPassbackStep(xn, loading);
      default:
        return new DefaultFlow(xn, loading);
    }
  }
}
export interface buttonListType {
  '@begin': buttonType,
  operate: buttonType,
  review: buttonType,

}
export interface buttonType {
  leftButtons: ButtonConfigModel[],
  rightButtons: ButtonConfigModel[]
}