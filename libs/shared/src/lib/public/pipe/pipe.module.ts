/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\shared\src\lib\public\pipe\pipe.module.ts
 * @summary：pipe.module.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-11-23
 ***************************************************************************/
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { XnCurrencyValue } from './xn-currency-value.pipe';
import { XnPercentagePipe } from './xn-percentage.pipe';
import { xnZhiyaPipe } from './xn-zhiya.pipe';
import { XnZichanPipe } from './xn-zichan.pipe';
import { XnStoreTypePipe } from './xn-store-type.pipe';
import { XnInputShowPipe } from './xn-input-show.pipe';
import { XnTrade3StatusPipe } from './xn-trade3-status.pipe';
import { XnPayPipe } from './xn-pay.pipe';
import { XnSelectItemPipe } from '../../../../../console/src/lib/risk-control/pipe/xn-selectItem.pipe';
import { XnOrgPipe } from './xn-org.pipe';
import { XnTypePipe } from './xn-type.pipe';
import { XnFilterTextPipe } from './xn-filter-text.pipe';
import { XnCurrencyChinese } from './xn-currency-chinese.pipe';
import { XnCardPipe } from './xn-card.pipe';
import { XnSelectDeepTransformPipe } from './xn-select-deep.pipe';
import { XnArrayPipe } from './xn-array.pipe';
import { XnTextPipe } from '../../../../../console/src/lib/risk-control/pipe/xn-text.pipe';
import { XnPushTypePipe } from './xn-push-type.pipe';
import { XntransFer } from './xn-transfer.pipes';
import { XnTrade2StatusPipe } from './xn-trade2-status.pipe';
import { XnJsonPipe } from './xn-json.pipe';
import { XnSharedModule } from '@lr/ngx-shared';
import { XnGatherTypePipe } from './xn-gather-type.pipe';
import { XnStockTypePipe } from './xn-stock-type.pipe';
import { XnLabelPipe } from './xn-label.pipe';
import { XnInvoiceStatus1Pipe } from './xn-invoice-status1.pipe';
import { XnDepositMainFlowStatusPipe } from './xn-main-flow-deposit-status.pipe';
import { XnBcDataTypePipe } from './xn-bc-data-type.pipe';
import { XnCaStepPipe } from './xn-ca-step.pipe';
import { XnRegisterStatusPipe } from './xn-register-status.pipe';
import { XnBrPipe } from './xn-br.pipe';
import { XnClassfyPipe } from './xn-classify.pipe';
import { XnInvoiceStatusPipe } from './xn-invoice-status.pipe';
import { XnCaStatusPipe } from './xn-ca-status.pipe';
import { XnSafeResourcePipe } from './xn-safe-resource.pipe';
import { XnNAPipe } from './xn-na.pipe';
import { XnTrade1StatusPipe } from './xn-trade1-status.pipe';
import { XnSignerTypePipe } from './xn-signer-type.pipe';
import { XnHtmlPipe } from './xn-html.pipe';
import { XnOrgTypesPipe } from './xn-org-type.pipe';
import { XnDselectPipe } from './xn-dselect.pipe';
import { XnFilterRowPipe } from './xn-filter-row.pipe';
import { XnMoneyCNPipe } from './xn-money-CN.pipe';
import { XnPayTypePipe } from './xn-pay-type.pipe';
import { XnMainFlowStatusPipe } from './xn-main-flow-status.pipe';
import { ArrayTruncatePipe } from './xn-array-trancat.pipe';
import { XnEnumSelectItemPipe } from '../../../../../console/src/lib/risk-control/pipe/xn-enum-selectItem.pipe';
import { XnMoneyPipe } from './xn-money.pipe';
import { XnStringToArrayPipe } from './xn-string-to-array-trancat.pipe';
import { XnJsonPrePipe } from './xn-json-pre.pipe';
import { XnDatePipe } from './xn-date.pipe';
import { XnSelectTransformPipe } from './xn-select-transform.pipe';
import { XnPercentPipe } from '../../../../../console/src/lib/risk-control/pipe/xn-percent.pipe';
import { XnContractFilterPipe } from './xn-contract-filter.pipe';
import { XnOperatorPipe } from './xn-operator.pipe';
import { XnStorageTypePipe } from './xn-storage-type.pipe';
import { XnProxyStatusPipe } from './xn-proxy-status.pipe';
import { ArrayListToStringPipe } from './xn-arraylist-tostring.pipe';
import { XnFilterDonePipe } from './xn-filter-done.pipe';
import { XnUseQuotaStatusPipe } from './xn-use-quota-status.pipe';
import { XnTradeStatusPipe } from './xn-trade-status.pipe';

const Pipes = [
  ArrayTruncatePipe,
  XnDatePipe,
  XnEnumSelectItemPipe,
  XnTextPipe,
  XnFilterRowPipe,
  XnMoneyPipe,
  XnPushTypePipe,
  XnHtmlPipe,
  XnArrayPipe,
  XnCurrencyValue,
  XnCurrencyChinese,
  XnJsonPipe,
  XnContractFilterPipe,
  XnLabelPipe,
  XnOrgPipe,
  XnInvoiceStatusPipe,
  XnDselectPipe,
  XnFilterDonePipe,
  XnGatherTypePipe,
  xnZhiyaPipe,
  XnPayTypePipe,
  XnPercentagePipe,
  XnZichanPipe,
  XnClassfyPipe,
  XnPayPipe,
  XnStoreTypePipe,
  XnSignerTypePipe,
  XnStockTypePipe,
  XnStorageTypePipe,
  XnTradeStatusPipe,
  XnTrade1StatusPipe,
  XnTrade2StatusPipe,
  XnTrade3StatusPipe,
  XnTypePipe,
  XnCardPipe,
  XnRegisterStatusPipe,
  XnSafeResourcePipe,
  XnOperatorPipe,
  XnInputShowPipe,
  XnOrgTypesPipe,
  XnStringToArrayPipe,
  XnJsonPrePipe,
  XnBcDataTypePipe,
  XnProxyStatusPipe,
  XnInvoiceStatus1Pipe,
  XnUseQuotaStatusPipe,
  XnMainFlowStatusPipe,
  XnDepositMainFlowStatusPipe,
  XnCaStepPipe,
  XnCaStatusPipe,
  XnBrPipe,
  XnFilterTextPipe,
  XnPercentPipe,
  XnSelectItemPipe,
  XnSelectTransformPipe,
  XnSelectDeepTransformPipe,
  XnMoneyCNPipe,
];

// @ts-ignore
@NgModule({
  imports: [
    CommonModule,
    XnSharedModule,
  ],
  declarations: [
    ...Pipes,
    ArrayTruncatePipe,
    XnDatePipe,
    XnEnumSelectItemPipe,
    XnTextPipe,
    XnFilterRowPipe,
    XnMoneyPipe,
    XnPushTypePipe,
    XnHtmlPipe,
    XnArrayPipe,
    ArrayListToStringPipe,
    XnJsonPipe,
    XnContractFilterPipe,
    XnLabelPipe,
    XnOrgPipe,
    XnInvoiceStatusPipe,
    XnDselectPipe,
    XnFilterDonePipe,
    XnGatherTypePipe,
    xnZhiyaPipe,
    XnPayTypePipe,
    XnZichanPipe,
    XnClassfyPipe,
    XnPayPipe,
    XnStoreTypePipe,
    XnStockTypePipe,
    XnStorageTypePipe,
    XnTradeStatusPipe,
    XnTrade1StatusPipe,
    XnTrade2StatusPipe,
    XnTypePipe,
    XntransFer,
    XnCardPipe,
    XnRegisterStatusPipe,
    XnSafeResourcePipe,
    XnOperatorPipe,
    XnInputShowPipe,
    XnOrgTypesPipe,
    XnNAPipe,
    XnStringToArrayPipe,
    XnJsonPrePipe,
    XnBcDataTypePipe,
    XnProxyStatusPipe,
    XnInvoiceStatus1Pipe,
    XnUseQuotaStatusPipe,
    XnMainFlowStatusPipe,
    XnDepositMainFlowStatusPipe,
    XnCaStepPipe,
    XnCaStatusPipe,
    XnBrPipe,
    XnFilterTextPipe,
    XnPercentPipe,
    XnSelectItemPipe,
    XnSelectTransformPipe,
    XnSelectDeepTransformPipe,
    XnMoneyCNPipe,
  ],
  entryComponents: [],
  exports: [
    ...Pipes,
    ArrayTruncatePipe,
    XnDatePipe,
    XnFilterRowPipe,
    XnMoneyPipe,
    XnJsonPipe,
    XnContractFilterPipe,
    XnLabelPipe,
    XnOrgPipe,
    XnInvoiceStatusPipe,
    XnStringToArrayPipe,
    XnJsonPrePipe,
    XnInvoiceStatus1Pipe,
    XnDselectPipe,
    XnFilterDonePipe,
    XnGatherTypePipe,
    xnZhiyaPipe,
    XnPayTypePipe,
    XnZichanPipe,
    XnClassfyPipe,
    XnPayPipe,
    XnEnumSelectItemPipe,
    XnStoreTypePipe,
    XnStockTypePipe,
    XnProxyStatusPipe,
    XnUseQuotaStatusPipe,
    XnStorageTypePipe,
    XnTradeStatusPipe,
    XnTrade1StatusPipe,
    XnTrade2StatusPipe,
    XnTypePipe,
    XntransFer,
    XnCardPipe,
    XnTextPipe,
    XnArrayPipe,
    ArrayListToStringPipe,
    XnOperatorPipe,
    XnInputShowPipe,
    XnOrgTypesPipe,
    XnNAPipe,
    XnBcDataTypePipe,
    XnMainFlowStatusPipe,
    XnDepositMainFlowStatusPipe,
    XnCaStepPipe,
    XnCaStatusPipe,
    XnBrPipe,
    XnPushTypePipe,
    XnSelectItemPipe,
    XnFilterTextPipe,
    XnRegisterStatusPipe,
    XnSelectTransformPipe,
    XnSelectDeepTransformPipe,
    XnMoneyCNPipe,
    XnPercentPipe,
    XnHtmlPipe,
  ],
})
export class PipeModule {}
