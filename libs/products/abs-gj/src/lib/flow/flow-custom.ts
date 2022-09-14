/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\abs-gj\src\lib\flow\flow-custom.ts
 * @summary：定义流程的个性化信息
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-11-22
 ***************************************************************************/

import { FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { GjSupplierSign } from './supplier-sign';
import { GjPlatformVerify } from './platform-verify';
import { GJFinancingPre } from './financing-pre';
import { GjFinancing } from './financing';
import { PersonMatchVerify } from './person-match-qrs';
import { DragonSystemMatchVerify } from './sub-system-match-qrs';
import { DragonReplaceQrs } from './replace-qrs';
import { SubChangeStart } from './sub-change-start';
import { SubChangeDate } from './sub-change-date';
import { SubSupplierAdd } from './sub-supplier-add';
import { SubProjectAdd } from './sub-project-add';
import { SubChangeCapital } from './sub-change-capital';
import { SubSpecialStart } from './sub-special-start';
import { DragonNuonuocsBlue } from './sub-nuonuocs-blue';
import { DragonNuonuocsRed } from './sub-nuonuocs-red';
import { SubSpecialVerfication } from './sub-special-verification';
import { SubChangeVerification } from './sub-change-verification';
import { SubChangeVerificationShort } from './sub-change-verification-short';
import { OnceContractGroupAdd } from './sub-first-contract-add';
import { OnceContractGroupModify } from './sub-first-contract-modify';
import { OnceContractGroupDelete } from './sub-first-contract-delete';
import { DragonOnceContractTemplateAdd } from './once-contract-template-add';
import { DragonQrsDownloadManualVerify } from './sub-qrs-manual-verify';
import { DragonSpecialCapitalMark } from './sub-special-capital-mark';
import { DragonDisposeSpecialCapital } from './sub-dispose-special-capital';
import { SubLawManagerSurvey } from './sub-law-manager-survey';
import { CfcaSignPre } from './cfca-sign-pre';
import { CfcaFinancingSign } from './cfca-financing-sign';
import { XnService } from '../../../../../shared/src/lib/services/xn.service';
import { LoadingService } from '../../../../../shared/src/lib/services/loading.service';
import { BookStop } from './book-stop';
import { BookChange } from './book-change';
import { ZhongdengRegister } from './zhongdeng-register';
import { SubFactoringRetreat } from './sub-factoring-retreat';
import { SubPlatformRetreat } from './sub-platform-check-retreat';
import { SubFactoringVerifyRetreat } from './sub-factoring-verify-retreat';
import { FlowId } from '../../../../../shared/src/lib/config/enum';
import { SubChangeAccount } from './sub-vanke-change';

export interface IFlowCustom {
  /**
   * 显示界面之前的调用函数
   */
  preShow(svrConfig: any): Observable<any>;

  /**
   * 显示完成后的调用函数
   * @param svrConfig any
   * @param mainForm FormGroup
   */
  postShow(svrConfig: any, mainForm: FormGroup): Observable<any>;

  /**
   * 收到服务器返回的svrConfig时做的额外处理工作
   * @param svrConfig any
   */
  postGetSvrConfig(svrConfig: any): void;

  /**
   * 提交后处理
   * @param svrConfig any
   * @param formValue any
   * @param x 提交接口返回数据
   */
  afterSubmitandGettip(svrConfig: any, formValue?: any, x?: any): Observable<any>;

  /**
   * 显示时返回流程标题的配置信息
   */
  getTitleConfig(): any;

  /**
   * 新建/提交流程之前的调用函数
   * @param svrConfig any
   * @param formValue any
   */
  preSubmit(svrConfig: any, formValue: any): Observable<any>;
}

class DefaultFlow implements IFlowCustom {
  constructor() {}

  preShow(svrConfig: any): Observable<any> {
    return of(null);
  }

  postShow(svrConfig: any): Observable<any> {
    return of(null);
  }

  postGetSvrConfig(svrConfig: any): void {}

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

/** 定义流程的个性化信息 */
export class FlowCustom {

  static build(
    name: string,
    xn: XnService,
    loading: LoadingService,
  ): IFlowCustom {

    switch (name) {
      case FlowId.GjFinancingPre:
        return new GJFinancingPre();
      case FlowId.GjFinancing:
        return new GjFinancing(xn);
      case FlowId.GjPlatformVerify:
        return new GjPlatformVerify(xn);
      case FlowId.GjSupplierSign:
        return new GjSupplierSign(xn, loading);
      case FlowId.CMNAddFirstContract:
        return new OnceContractGroupAdd(xn);
      case FlowId.CMNEditFirstContract:
        return new OnceContractGroupModify(xn);
      case FlowId.CMNDelFirstContract:
        return new OnceContractGroupDelete(xn);
      case FlowId.CMNRetreat:
        return new SubFactoringRetreat(xn);
      case FlowId.CMNStop:
        return new BookStop();
      case FlowId.CMNPreChange:
        return new BookChange(xn);
      case FlowId.CMNPlatRetreat:
        return new SubPlatformRetreat();
      case FlowId.CMNPersonMatchQrs:
        return new PersonMatchVerify(xn);
      case FlowId.CMNChangeAccount:
        return new SubChangeAccount(xn, loading);
      case 'sub_system_match_qrs':
        return new DragonSystemMatchVerify(xn);
      case 'sub_replace_qrs':
        return new DragonReplaceQrs(xn);
      case 'sub_vanke_system_hand_verify':
        return new DragonQrsDownloadManualVerify(xn);
      case 'sub_change_start':
        return new SubChangeStart(xn);
      case 'sub_change_date':
        return new SubChangeDate();
      case 'sub_supplier_add':
        return new SubSupplierAdd(xn, loading);
      case 'sub_project_add':
        return new SubProjectAdd(xn, loading);
      case 'sub_change_capital':
        return new SubChangeCapital();
      case 'sub_special_start':
        return new SubSpecialStart(xn);
      // 开票管理流程
      case 'sub_nuonuocs_blue':
        return new DragonNuonuocsBlue(xn);
      case 'sub_nuonuocs_red':
        return new DragonNuonuocsRed(xn);
      case 'sub_special_verification':
        return new SubSpecialVerfication(xn);
      case 'sub_change_verification':
        return new SubChangeVerification(xn);
      case 'sub_change_verification_short':
        return new SubChangeVerificationShort(xn);
      case 'once_contract_template_add':
        return new DragonOnceContractTemplateAdd();
      case 'sub_zhongdeng_register':
        return new ZhongdengRegister();
      case 'sub_factoring_verify_retreat':
        return new SubFactoringVerifyRetreat(xn);
      case 'sub_special_asset_sign':
        return new DragonSpecialCapitalMark(xn);
      case 'sub_special_asset_dispose':
        return new DragonDisposeSpecialCapital(xn);
      case 'sub_law_manager_survey':
        return new SubLawManagerSurvey(xn);
      // 通用签章流程-cfca
      case 'sub_cfca_sign_pre':
        return new CfcaSignPre();
      case 'sub_cfca_financing_sign':
        return new CfcaFinancingSign(xn, loading);
      default:
        return new DefaultFlow();
    }
  }
}
