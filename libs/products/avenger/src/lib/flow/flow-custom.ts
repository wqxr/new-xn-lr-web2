/**
 * 这里定义流程的个性化信息[采购融资]
 */
import { Observable, of } from 'rxjs';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { ViewContainerRef } from '@angular/core';
import { FinancingSupplier15 } from './factoring-apply/financing_supplier15';
import { SupplierSign } from './factoring-apply/supplier_sign_500';
import { Financing500 } from './factoring-apply/financing_500';
import { ApprovalStop } from './factoring-apply/sub_approval_stop';
import { AvengerFactoring520 } from './factoring-apply/factoring_change520';
import { AvengerApprovalhonor } from './factoring-apply/approval_honor_530';
import { AvengerApprovalpayback } from './factoring-apply/sub_approval_payback_530';
import { AvengerApprovalagain } from './factoring-apply/approval_again_530';
import { SubSupplierSign } from './factoring-apply/sub_financing_sign520';
import { Riskverfication } from './factoring-apply/avenger_riskverfication';
import { PublicCommunicateService } from 'libs/shared/src/lib/services/public-communicate.service';
import { Financing501 } from './factoring-apply/financing_501';
import { LocalStorageService } from 'libs/shared/src/lib/services/local-storage.service';
import { SupplierSign501 } from './factoring-apply/supplier_sign_501';
import { Avengersuppliersign510 } from './factoring-apply/financing_supplier_sign_510';
import { PlatformSign510 } from './factoring-apply/platform_sign_510';
import { AvengersubFactoringStop } from './factoring-apply/sub_factoring_stop_540';
import { DragonNuonuocsRed } from './invoice-manage/sub_nuonuocs_red';
import { DragonNuonuocsBlue } from './invoice-manage/sub_nuonuocs_blue';
import { AvengerFactoringUpload510 } from './factoring-apply/factoring_upload_510';
import { DragonNuonuocsOfflineInvoice } from './invoice-manage/sub_nuonuocs_offline_invoice';
import { SubSupplierSignYjl } from './factoring-apply/sub_financing_sign_yjl_520';

export interface IFlowCustom {
  /**
   * 显示界面之前的调用函数
   * @return :{ action: 'navigate-back|const-params' } or null
   */
  preShow(svrConfig: any): Observable<any>;

  /**
   * 显示完成后的调用函数
   * @param svrConfig svrConfig
   * @return :{ action: 'navigate-back|const-params' } or null
   */
  postShow(svrConfig: any): Observable<any>;

  /**
   * 收到服务器返回的svrConfig时做的额外处理工作
   * @param svrConfig svrConfig
   */
  postGetSvrConfig(svrConfig: any): void;

  /**
   * 显示时返回流程标题的配置信息
   * @return :{ hideTitle: false, def: '', titleName: '项目名称' }
   */
  getTitleConfig(): any;

  /**
   * 新建/提交流程之前的调用函数
   * @param svrConfig svrConfig
   * @param formValue formValue
   * @return :{ action: 'navigate-back|const-params' } or null
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
}

/**
 *  采购融资，定义流程的个性化信息
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
      // 供应商发起万科供应商申请
      case 'financing_supplier15':
        return new FinancingSupplier15(xn, loading);
      case 'supplier_sign_500':
        return new SupplierSign(xn, loading);
      case 'supplier_sign_501':
        return new SupplierSign501(xn, loading);
      case 'supplier_sign_510':
        return new Avengersuppliersign510(xn, loading);
      case 'platform_sign_510':
        return new PlatformSign510(xn, loading);
      case 'financing_500':
        return new Financing500(xn, loading, localservice);
      case 'sub_approval_stop':
        return new ApprovalStop(xn, loading);
      case 'sub_factoring_change_520':
        return new AvengerFactoring520(xn, loading);
      // 金地系统 保理商账号变更
      /**
       * sub_factoring_change_jd_520
       * sub_financing_sign_jd_520
       * sub_customer_verify_jd_520
       * sub_financing_verify_jd_520
       */
      case 'sub_factoring_change_jd_520':
        return new AvengerFactoring520(xn, loading);
      case 'sub_financing_sign_jd_520':
        return new SubSupplierSign(xn, loading);
      case 'sub_customer_verify_jd_520':
        return new AvengerFactoring520(xn, loading);
      case 'sub_financing_verify_jd_520':
        return new AvengerFactoring520(xn, loading);
      // sub_factoring_change_yjl_520 雅居乐-星顺 保理商账号变更
      case 'sub_factoring_change_yjl_520':
        return new AvengerFactoring520(xn, loading);
      // sub_financing_sign_yjl_520 雅居乐-星顺 保理商账号变更-供应商签署说明书
      case 'sub_financing_sign_yjl_520':
        return new SubSupplierSignYjl(xn, loading);
      case 'sub_approval_honor_530':
        return new AvengerApprovalhonor(xn, loading);
      case 'sub_approval_payback_530':
        return new AvengerApprovalpayback(xn, loading);
      case 'sub_approval_again_530':
        return new AvengerApprovalagain(xn, loading);
      case 'sub_approval_return_530':
        return new AvengerApprovalagain(xn, loading);
      case 'sub_financing_sign_520':
        return new SubSupplierSign(xn, loading);
      case 'risk_verification_500':
        return new Riskverfication(xn, loading, communicate);
      case 'financing_501':
        return new Financing501(xn, loading, localservice);
      case 'sub_factoring_stop_540':
        return new AvengersubFactoringStop(xn, loading);
      case 'sub_nuonuocs_blue':
        return new DragonNuonuocsBlue(xn, loading);
      case 'sub_nuonuocs_red':
        return new DragonNuonuocsRed(xn, loading);
      case 'sub_nuonuocs_blue_offline':
        return new DragonNuonuocsOfflineInvoice(xn, loading);
      case 'factoring_upload_510':
        return new AvengerFactoringUpload510(xn, loading);
      default:
        return new DefaultFlow(xn, loading);
    }
  }
}
