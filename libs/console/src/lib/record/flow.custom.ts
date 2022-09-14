import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { ViewContainerRef } from '@angular/core';
import { Observable, of } from 'rxjs';

import { FinancingFlow } from './custom/financing.flow';
import { FinancingFactoringFlow } from './custom/financing-factoring.flow';
import { FinancingFactoring2Flow } from './custom/financing-factoring2.flow';
import { FinancingFactoring4Flow } from './custom/financing-factoring4.flow';
import { FinancingFactoring5Flow } from './custom/financing-factoring5.flow';
import { FinancingFactoringTwo4Flow } from './custom/financing-factoring-two4.flow';
import { FinancingFactoringTwo5Flow } from './custom/financing-factoring-two5.flow';
import { FinancingWk4Flow } from './custom/financing-wk4.flow';
import { FinancingWk5Flow } from './custom/financing-wk5.flow';
import { FinancingSupplierFlow } from './custom/financing-supplier.flow';
import { PlatformEnterpriseAmountFlow } from './custom/platfrom-enterprise-amount.flow';
import { EnterpriseRegisterFlow } from './custom/enterprise-register.flow';
import { FinancingEnterpriseAmountFlow } from './custom/financing-enterprise-amount.flow';
import { FinancingEnterpriseLvFlow } from './custom/financing-enterprise-lv.flow';
import { FinancingEnterpriseLvWkFlow } from './custom/financing-enterprise-lv-wk.flow';
import { SupplierFinanceFlow } from './custom/supplier-finance.flow';
import { FinancingLoanFlow } from './custom/factoring-loan.flow';
import { SupplierEndorseFlow } from './custom/supplier-endorse.flow';
import { SupplierEndorse3Flow } from './custom/supplier-endorse3.flow';
import { FactoringLoanReal3Flow } from './custom/factoring-loan-real3.flow';
import { FactoringRepaymentFlow } from './custom/factoring-repayment.flow';
import { FactoringEndorseFlow } from './custom/factoring-endorse.flow';
import { FactoringEndorse2Flow } from './custom/factoring-endorse2.flow';
import { Financing2Flow } from './custom/financing2.flow';
import { Financing1Flow } from './custom/financing1.flow';
import { FinancingPre4Flow } from './custom/financing_pre4.flow';
import { FinancingPre5Flow } from './custom/financing_pre5.flow';
import { FinancingJd5Flow } from './custom/financing_jd5.flow';
import { FinancingProject5Flow } from './custom/financing_project5.flow';
import { FinancingFactoring1Flow } from './custom/financing-factoring1.flow';
import { FinancingSupplier1Flow } from './custom/financing-supplier1.flow';
import { FinancingSupplier2Flow } from './custom/financing-supplier2.flow';
import { FinancingLoan1Flow } from './custom/factoring-loan1.flow';
import { FinancingLoan2Flow } from './custom/factoring-loan2.flow';
import { SupplierEndorse1Flow } from './custom/supplier-endorse1.flow';
import { SupplierEndorse2Flow } from './custom/supplier-endorse2.flow';
import { FinancingFactoring3Flow } from './custom/financing-factoring3.flow';
import { Financing3Flow } from './custom/financing3.flow';
import { FinancingSupplier3Flow } from './custom/financing-supplier3.flow';
import { FinancingSupplier4Flow } from './custom/financing-supplier4.flow';
import { FinancingSupplier5Flow } from './custom/financing-supplier5.flow';
import { FinancingSupplierTwo4Flow } from './custom/financing-supplier-two4.flow';
import { FinancingSupplierTwo5Flow } from './custom/financing-supplier-two5.flow';
import { FinancingLoan3Flow } from './custom/factoring-loan3.flow';
import { FinancingLoan4Flow } from './custom/factoring-loan4.flow';
import { FinancingLoan5Flow } from './custom/factoring-loan5.flow';
import { VankeRateNewFlowComponent } from './custom/vanke-rate-new.flow';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { ServiceFeeFlow } from './custom/service_fee.flow';
import { ServiceFeePromisePayFlow } from './custom/service_fee_promise_pay.flow';


import { BankDiscountFlow } from './custom/bank_discount.flow';
import { BankFinancingFlow } from './custom/bank_financing.flow';
import { PromiseDiscountFlow } from './custom/promise_discount.flow';
import { Financing7Flow } from './custom/financing7.flow';
import { FinancingFactoring7Flow } from './custom/financing-factoring7.flow';
import { FinancingBank7Flow } from './custom/financing-bank7.flow';
import { FinancingEnterpriseDepositFlow } from './custom/financing_enterprise_deposit.flow';
import { EnterpriseSignContractFlow } from './custom/enterprise-sign-contract.flow';
import { FactoringSignContractFlow } from './custom/factoring-sign-contract.flow';
import { Financing11Flow } from './custom/Directed-payment/financing11/financing11.flow';
import { FinancingPlatform11Flow } from './custom/Directed-payment/financing11/financing-platform11.flow';
import { FinancingFactoring11Flow } from './custom/Directed-payment/financing11/financing-factoring11.flow';
import { FinancingBank11Flow } from './custom/Directed-payment/financing11/financing-bank11.flow';
import { Financing12Flow } from './custom/Directed-payment/financing12/financing12.flow';
import { FinancingFactoring12Flow } from './custom/Directed-payment/financing12/financing-factoring12.flow';
import { FinancingBank12Flow } from './custom/Directed-payment/financing12/financing-bank12.flow';
import { FinancingFactoringUploadmsg12Flow } from './custom/Directed-payment/financing12/financing-factoring-uploadmsg12.flow';
import { FinancingPre13Flow } from './custom/Directed-payment/financing13/financing-pre13.flow';
import { Financing13Flow } from './custom/Directed-payment/financing13/financing13.flow';
import { FinancingFactoring13Flow } from './custom/Directed-payment/financing13/financing-factoring13.flow';
import { FinancingFactoringLoan13Flow } from './custom/Directed-payment/financing13/financing-factoring-loan13.flow';
import { FinancingConfirmLoan13Flow } from './custom/Directed-payment/financing13/financing-confirm-loan13.flow';
import { AssignorInformationRegistration13Flow } from './custom/Directed-payment/financing13/assignor-information-registration13.flow';
import { EntryRegistrationCode13Flow } from './custom/Directed-payment/financing13/entry-registration-code13.flow';
import { FinancingFactoringAddmsg11Flow } from './custom/Directed-payment/financing11/financing-factoring-addmsg11.flow';

import { ContractRuleAddFlow } from './custom/vanke-mode/contract-rule-add.flow';
import { ContractRuleEditFlow } from './custom/vanke-mode/contract-rule-edit.flow';
import { FinanceDownLoad1 } from './custom/vanke-mode/financing_download1.flow';
import { PayConfirm6Flow } from './custom/vanke-mode/pay-confirm6.flow';
import { FinancingFactoringReplace13Flow } from './custom/Directed-payment/financing11/financingFactoringReplace13.flow';
import { FinancingFinancingReplace13Flow } from './custom/Directed-payment/financing11/financingFinancingReplace13.flow';
import { FactoringLeftChange13Flow } from './custom/Directed-payment/financing11/factoringLeftChange13.flow';
import { FactoringDeputeMoney13Flow } from './custom/Directed-payment/financing11/factoringDeputeMoney13.flow';
import { FinancingPre14Flow } from './custom/gendale-mode/financing-pre14';

import { AssignorInformationRegistration14Flow } from './custom/gendale-mode/assignor-information-registration14';
import { EntryRegistration14Flow } from './custom/gendale-mode/entry-registration-code14';
import { FinancingSupplier14Flow } from './custom/gendale-mode/financing-supplier14';
import { Financing14Flow } from './custom/gendale-mode/financing14';
import { PayPz14Flow } from './custom/gendale-mode/pay_pz14.flow';
import { FinancingPre6Flow } from './custom/vanke-mode/financing_pre6.flow';
import { Financing6Flow } from './custom/vanke-mode/financing6.flow';
import { FinancingSupplier6Flow } from './custom/vanke-mode/financing-supplier6.flow';
import { PayQrs6Flow } from './custom/vanke-mode/pay_qrs6.flow';
import { PayOver6Flow } from './custom/vanke-mode/pay_over6.flow';
import { PayPz6Flow } from './custom/vanke-mode/pay_pz6.flow';
import { AssignorInformationRegistration6Flow } from './custom/vanke-mode/assignor_information_registration6.flow';
import { EntryRegistrationCode6Flow } from './custom/vanke-mode/entry_registration_code6.flow';
import { EntryRegistration6Flow } from './custom/vanke-mode/entry_registration6.flow';
import { PayOrderUploadFlow } from './custom/gendale-mode/pay-order-upload.flow';

import { FinancingEnterpriseMFlow } from './custom/risk-control/financing_enterprise_m.flow';
import { FinancingSupplierEnterpriseFlow } from './custom/risk-control/financing_supplier_enterprise.flow';
import { ProjectConfirmationFlow } from './custom/gendale-mode/project-confirmation.flow';
import { UploadBaseFlow } from './custom/base-info/upload_base.flow';
import { UploadBasePlatformFlow } from './custom/base-info/upload_base_platform.flow';

import { FinancingDeputeMoney13Flow } from './custom/Directed-payment/financing11/financingDeputeMoney13.flow';
import { YajuleAddContractFlow } from './custom/vanke-mode/yajule_add_contract.flow';
import { SupplierUploadInformationFlow } from './custom/upload-file/supplier-upload-information.flow';
import { PlatformCheckInformationFlow } from './custom/upload-file/platform-check-information.flow';
import { PlatformAdjustOrgFlow } from 'libs/products/avenger/src/lib/flow/customer-manger/platform_adjust_org';
import { Addagreement } from 'libs/products/avenger/src/lib/flow/customer-manger/add_agreement';
import { AddCheckFile } from 'libs/products/avenger/src/lib/flow/guarante-manager/add_check_file';
import { HandlewarningMsg } from 'libs/products/avenger/src/lib/flow/guarante-manager/handle-warning-msg';
import { FinancingReportUpload } from 'libs/products/avenger/src/lib/flow/guarante-manager/financing_report_upload';
import { CreditReportUpload } from 'libs/products/avenger/src/lib/flow/guarante-manager/credit_report_upload';
import { ContractAvengerAdd } from 'libs/products/avenger/src/lib/flow/contract-manage/contract_avenger_add';
import { ContractAvengeredit } from 'libs/products/avenger/src/lib/flow/contract-manage/contract_avenger_edit';

import { CreatAuthCfcaFlow } from './custom/create_auth_cfca.flow'
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
      case 'financing':
        return new FinancingFlow(xn);

      case 'financing_factoring':
        return new FinancingFactoringFlow(xn);

      case 'financing_factoring2':
        return new FinancingFactoring2Flow(xn);

      case 'financing_factoring4':
        return new FinancingFactoring4Flow(xn);

      case 'financing_factoring5':
        return new FinancingFactoring5Flow(xn);

      case 'financing_factoring_two4':
        return new FinancingFactoringTwo4Flow(xn);

      case 'financing_factoring_two5':
        return new FinancingFactoringTwo5Flow(xn);

      case 'financing_wk4':
        return new FinancingWk4Flow(xn);

      case 'financing_wk5':
        return new FinancingWk5Flow(xn);

      case 'financing_supplier':
        return new FinancingSupplierFlow(xn);

      case 'platfrom_enterprise_amount':
        return new PlatformEnterpriseAmountFlow(xn);

      case 'enterprise_register':
        return new EnterpriseRegisterFlow(xn);

      case 'financing_enterprise_amount':
        return new FinancingEnterpriseAmountFlow(xn);

      case 'financing_enterprise_lv':
        return new FinancingEnterpriseLvFlow(xn);

      case 'financing_enterprise_lv_wk':
        return new FinancingEnterpriseLvWkFlow(xn);

      case 'supplier_finance':
        return new SupplierFinanceFlow(xn);

      case 'factoring_loan':
        return new FinancingLoanFlow(xn);

      case 'supplier_endorse':
        return new SupplierEndorseFlow(xn);

      case 'factoring_repayment':
        return new FactoringRepaymentFlow(xn, vcr);

      case 'factoring_endorse':
        return new FactoringEndorseFlow(xn);

      case 'factoring_endorse2':
        return new FactoringEndorse2Flow(xn);

      case 'financing2':
        return new Financing2Flow(xn);

      case 'financing1':
        return new Financing1Flow(xn);

      case 'financing_pre4':
        return new FinancingPre4Flow(xn);

      case 'financing_pre5':
        return new FinancingPre5Flow(xn);


      case 'financing_jd5':
        return new FinancingJd5Flow(xn);

      case 'financing_project5':
        return new FinancingProject5Flow(xn);

      case 'financing_factoring1':
        return new FinancingFactoring1Flow(xn);

      case 'financing_supplier1':
        return new FinancingSupplier1Flow(xn);

      case 'financing_supplier2':
        return new FinancingSupplier2Flow(xn);

      case 'factoring_loan1':
        return new FinancingLoan1Flow(xn);

      case 'factoring_loan2':
        return new FinancingLoan2Flow(xn);

      case 'supplier_endorse1':
        return new SupplierEndorse1Flow(xn);

      case 'supplier_endorse2':
        return new SupplierEndorse2Flow(xn);

      case 'financing3':
        return new Financing3Flow(xn);

      case 'financing7':
        return new Financing7Flow(xn, loading);

      case 'financing_factoring7':
        return new FinancingFactoring7Flow(xn, loading);

      case 'financing_bank7':
        return new FinancingBank7Flow(xn, loading);

      case 'financing_factoring3':
        return new FinancingFactoring3Flow(xn);

      case 'financing_supplier3':
        return new FinancingSupplier3Flow(xn);

      case 'financing_supplier4':
        return new FinancingSupplier4Flow(xn);

      case 'financing_supplier5':
        return new FinancingSupplier5Flow(xn);


      case 'financing_supplier_two4':
        return new FinancingSupplierTwo4Flow(xn);

      case 'financing_supplier_two5':
        return new FinancingSupplierTwo5Flow(xn);

      case 'factoring_loan3':
        return new FinancingLoan3Flow(xn);

      case 'financing_loan4':
        return new FinancingLoan4Flow(xn);

      case 'financing_loan5':
        return new FinancingLoan5Flow(xn);

      case 'supplier_endorse3':
        return new SupplierEndorse3Flow(xn);

      case 'factoring_loan_real3':
        return new FactoringLoanReal3Flow(xn);

      case 'financing_enterprise_lv_wk_edit': // 万科利率修改
        return new VankeRateNewFlowComponent(xn);

      case 'financing_enterprise_lv_wk_add': // 万科利率新增
        return new VankeRateNewFlowComponent(xn);

      case 'financing_enterprise_lv_wk1_edit': // 万科利率修改
        return new VankeRateNewFlowComponent(xn);

      case 'financing_enterprise_lv_wk1_add': // 万科利率新增
        return new VankeRateNewFlowComponent(xn);

      case 'financing_enterprise_lv_wk2_edit': // 万科利率修改
        return new VankeRateNewFlowComponent(xn);

      case 'financing_enterprise_lv_wk2_add': // 万科利率新增
        return new VankeRateNewFlowComponent(xn);

      // 万科abs3.0
      case 'financing_pre6':
        return new FinancingPre6Flow(xn);

      case 'financing6':
        return new Financing6Flow(xn, loading);

      case 'financing_supplier6':
        return new FinancingSupplier6Flow(xn, loading);

      case 'pay_qrs6':
        return new PayQrs6Flow(xn);

      case 'pay_qrs_real6':
        return new PayQrs6Flow(xn);

      case 'pay_over6':
        return new PayOver6Flow(xn);

      case 'pay_pz6':
        return new PayPz6Flow(xn);

      case 'entry_registration6':
        return new EntryRegistration6Flow(xn);

      case 'assignor_information_registration6':
        return new AssignorInformationRegistration6Flow(xn);

      case 'entry_registration_code6':
        return new EntryRegistrationCode6Flow(xn);
      // 万科模式，上传付款确认书
      case 'pay_confirm6':
        return new PayConfirm6Flow(xn);
      /**
       *  万科优化
       */

      case 'contract_rule_add':  // 合同模板添加
        return new ContractRuleAddFlow(xn);

      case 'contract_avenger_add':  // 合同管理万科编辑
        return new ContractAvengerAdd(xn, loading);

      case 'contract_rule_edit':  // 合同模板地产编辑
        return new ContractRuleEditFlow(xn);

      case 'contract_avenger_edit':  // 合同模板万科编辑
        return new ContractAvengeredit(xn, loading);

      case 'financing_download':
        return new FinanceDownLoad1(xn);   // 财务下载初审

      // 平台服务
      case 'platform_payment_service':
        return new ServiceFeeFlow(xn);

      case 'financing_payment_service':
        return new ServiceFeePromisePayFlow(xn);

      case 'discount_management_service': // 银行保理保证管理
        return new BankDiscountFlow(xn);

      case 'financing_management_service': // 银行保理融资管理
        return new BankFinancingFlow(xn);

      case 'promise_discount':
        return new PromiseDiscountFlow(xn);

      case 'financing_enterprise_deposit': // 保证金流程
        return new FinancingEnterpriseDepositFlow(xn);

      case 'enterprise_sign_contract': // 核心企业签署合同
        return new EnterpriseSignContractFlow(xn, loading);
      case 'factoring_sign_contract': // 保理商签署合同
        return new FactoringSignContractFlow(xn, loading);

      // 定向收款模式 - 协议签署
      case 'financing11':
        return new Financing11Flow(xn, loading);

      case 'financing_platform11':
        return new FinancingPlatform11Flow(xn, loading);

      case 'financing_factoring11':
        return new FinancingFactoring11Flow(xn, loading);

      case 'financing_bank11':
        return new FinancingBank11Flow(xn, loading);

      case 'financing_factoring_addmsg11':
        return new FinancingFactoringAddmsg11Flow(xn, loading);
      // 定向收款模式 - 协议变更
      case 'financing12':
        return new Financing12Flow(xn, loading);

      case 'financing_factoring12':
        return new FinancingFactoring12Flow(xn, loading);

      case 'financing_bank12':
        return new FinancingBank12Flow(xn, loading);

      case 'financing_factoring_uploadmsg12':
        return new FinancingFactoringUploadmsg12Flow(xn, loading);
      // 定向收款模式 - 保理商提单
      case 'financing_pre13':
        return new FinancingPre13Flow(xn, loading);

      // 定向收款模式 - 替换发票 -- 保理商
      case 'factoring_invoice_replace13':
        return new FinancingFactoringReplace13Flow(xn, loading);

      // 定向收款模式 - 替换发票 -- 供应商
      case 'financing_invoice_replace13':
        return new FinancingFinancingReplace13Flow(xn, loading);

      // 定向收款模式 - 余额转款 -- 保理商
      case 'factoring_left_change13':
        return new FactoringLeftChange13Flow(xn, loading);

      // 定向收款模式 - 委托付款 -- 保理商
      case 'factoring_depute_money13':
        return new FactoringDeputeMoney13Flow(xn, loading);

      // 定向收款模式 - 委托付款 -- 供应商
      case 'financing_depute_money13':
        return new FinancingDeputeMoney13Flow(xn, loading);

      case 'assignor_information_registration13':
        return new AssignorInformationRegistration13Flow(xn, loading);

      case 'entry_registration_code13':
        return new EntryRegistrationCode13Flow(xn, loading);

      case 'financing13':
        return new Financing13Flow(xn, loading);

      case 'financing_factoring13':
        return new FinancingFactoring13Flow(xn, loading);

      case 'financing_factoring_loan13':
        return new FinancingFactoringLoan13Flow(xn, loading);

      case 'financing_confirm_loan13':
        return new FinancingConfirmLoan13Flow(xn, vcr, loading);
      // 金地模式abs-3.0
      case 'financing_download14':
        return new FinanceDownLoad1(xn);   // 财务下载初审
      case 'financing_pre14':
        return new FinancingPre14Flow(xn);
      case 'assignor_information_registration14':
        return new AssignorInformationRegistration14Flow(xn);
      case 'entry_registration_code14':
        return new EntryRegistration14Flow(xn);
      case 'financing_supplier14':
        return new FinancingSupplier14Flow(xn);
      case 'financing14':
        return new Financing14Flow(xn, loading);
      case 'pay_order_upload':
        return new PayOrderUploadFlow(xn); // 上传付款清单
      case 'pay_pz14':
        return new PayPz14Flow(xn);

      case 'pay_over14':
        return new PayOver6Flow(xn);
      // 保理商修改核心企业额度
      case 'financing_enterprise_m':
        return new FinancingEnterpriseMFlow(xn);
      // 保理商修改供应商额度
      case 'financing_supplier_enterprise':
        return new FinancingSupplierEnterpriseFlow(xn);
      // 金地abs 项目公司确认应收账款
      case 'project_confirmation':
        return new ProjectConfirmationFlow(xn);
      case 'upload_base':
        return new UploadBaseFlow(xn);
      case 'upload_base_platform':
        return new UploadBasePlatformFlow(xn);
      // 雅居乐补充协议
      case 'yajule_add_contract':
        return new YajuleAddContractFlow(xn);
      // 企业资料上传
      case 'supplier_upload_information':
        return new SupplierUploadInformationFlow(xn, loading);
      // 平台审核
      case 'platform_check_information':
        return new PlatformCheckInformationFlow(xn, loading);
      case 'platform_adjust_org':
        return new PlatformAdjustOrgFlow(xn, loading);
      case 'add_agreement': // 客户管理添加协议
        return new Addagreement(xn, loading);
      case 'add_check_file':
        return new AddCheckFile(xn, loading);
      case 'handle_warning_msg':
        return new HandlewarningMsg(xn, loading);
      case 'financing_report_upload':
        return new FinancingReportUpload(xn, loading);
      case 'credit_report_upload':
        return new CreditReportUpload(xn, loading);
      case 'create_auth_cfca':
        return new CreatAuthCfcaFlow(xn, loading)
      default:
        return new DefaultFlow(xn, loading);
    }
  }
}
