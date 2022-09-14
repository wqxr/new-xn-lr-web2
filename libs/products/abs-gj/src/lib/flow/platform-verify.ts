/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\abs-gj\src\lib\flow\platform_verify.ts
 * @summary：dragon-platform_verify.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-11-22
 ***************************************************************************/

import { Observable, of } from 'rxjs';
import { IFlowCustom } from './flow-custom';
import { XNCurrency } from '../../../../../shared/src/lib/common/xncurrency';
import { XnService } from '../../../../../shared/src/lib/services/xn.service';
import { ProgressStep } from 'libs/shared/src/lib/config/enum';

export class GjPlatformVerify implements IFlowCustom {
  constructor(private xn: XnService) {}

  preShow(): Observable<any> {
    return of(null);
  }

  postShow(svrConfig: any): Observable<any> {
    return of(null);
  }

  postGetSvrConfig(svrConfig: any): void {
  }

  afterSubmitandGettip(svrConfig: any): Observable<any> {
    return of(null);
  }

  preSubmit(svrConfig: any, formValue: any): Observable<any> {
    if (svrConfig.procedure.procedureId === ProgressStep.Operate) {
      const payable = formValue.receive.toString().replace(/,/g, '');
      const payables = new XNCurrency(payable).value;
      let contractFile = formValue.dealContract;
      const transferAll = JSON.parse(formValue.invoice);
      const alert = [];
      try {
        let invoiceAmount = new XNCurrency(0);
        transferAll.forEach(x => {
          invoiceAmount = invoiceAmount.add(x.transferMoney);
        });
        if (invoiceAmount.value !== payables) {
          alert.push(`${alert.length + 1}、发票转让金额总和${invoiceAmount.value}不等于应收账款金额${payables}`);
        }
        contractFile = JSON.parse(contractFile);
        const amountTotal = contractFile.filter(x => x.contractMoney !== '');
        let contractFileAmount = new XNCurrency(0);
        if (amountTotal.length > 0) {
          contractFile.forEach(x => {
            contractFileAmount = contractFileAmount.add(x.contractMoney);
          });
        }
        if (contractFile[0].contractFile === '') {
          alert.push(`${alert.length + 1}、交易合同文件未上传`);
        }

        if (payables > contractFileAmount.value) {
          alert.push(`${alert.length + 1}、合同金额${contractFileAmount.value}小于应收账款金额${payables}`);
        }
        if (alert.length) {
          alert[alert.length - 1] = alert[alert.length - 1] + '，无法提交';
          this.xn.msgBox.open(false, alert);
          return of({
            action: 'stop',
          });
        }
      } catch (e) {}

      return of(null);

    } else {
      return of(null);
    }
  }

  getTitleConfig(): any {
    return {
      hideTitle: true,
      titleName: '流程标题',
      def: '平台审核'
    };
  }

  /** 计算应收账款转让金额 */
  // public ReceiveData(item: any) {
  //   let tempValue = item.replace(/,/g, '');
  //   tempValue = parseFloat(tempValue).toFixed(2);
  //   return Number(tempValue);
  // }
}
