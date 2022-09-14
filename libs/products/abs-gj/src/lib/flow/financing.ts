/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\abs-gj\src\lib\flow\dragon_financing.ts
 * @summary：dragon_financing.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-11-22
 ***************************************************************************/

import { Observable, of } from 'rxjs';
import { IFlowCustom } from './flow-custom';
import { FormGroup } from '@angular/forms';
import { XnService } from '../../../../../shared/src/lib/services/xn.service';
import { XNCurrency } from '../../../../../shared/src/lib/common/xncurrency';
import { InvoiceStatus, ProgressStep } from '../../../../../shared/src/lib/config/enum';

export class GjFinancing implements IFlowCustom {
  constructor(private xn: XnService) {}

  preShow(): Observable<any> {
    return of(null);
  }

  postShow(svrConfig: any, mainForm: FormGroup): Observable<any> {
    return of(null);
  }

  postGetSvrConfig(svrConfig: any): void {
  }

  preSubmit(svrConfig: any, formValue: any): Observable<any> {
    if (svrConfig.procedure.procedureId === ProgressStep.Operate) {
      let payables = formValue.receive.toString().replace(/,/g, '');
      const contractFile = formValue.dealContract;
      let invoiceFile = formValue.invoice;
      const certificateFile = formValue.certificateFile;
      payables = new XNCurrency(payables).value;
      const alert = [];

      try {
        if (contractFile === '') {
          alert.push(`${alert.length + 1}、交易合同没上传`);
        } else {

        }
        if (certificateFile === '') {
          alert.push(`${alert.length + 1}、资质证明文件没上传`);
        } else {

        }

        if (invoiceFile === '') {
          alert.push(`${alert.length + 1}、发票没上传`);
        }
        invoiceFile = JSON.parse(invoiceFile);
        let invoiceAmount = new XNCurrency(0);

        invoiceFile.forEach(x => {
          invoiceAmount = invoiceAmount.add(x.invoiceAmount);
        });

        // 必须每张发票都包含发票号，金额，开票日期
        if (!invoiceFile.every(c => !!(c.invoiceAmount) && !!(c.invoiceNum) && !!c.invoiceDate)) {
          alert.push(`${alert.length + 1}、发票沒进行验证，请验证`);
        }

        if (invoiceFile.some(
          x => x.status === InvoiceStatus.Abolished
            || x.status === InvoiceStatus.NoControl
            || x.status === InvoiceStatus.RedPunch
            || x.status === InvoiceStatus.Abnormal
        )) {
          alert.push(`${alert.length + 1}、发票状态异常`);
        }

        if (payables > invoiceAmount.value) {
          alert.push(`${alert.length + 1}、发票金额${invoiceAmount.value}小于应收账款金额${payables}`);
        }
        if (alert.length) {
          alert[alert.length - 1] = alert[alert.length - 1] + '，无法提交';
          this.xn.msgBox.open(false, alert);
          return of({
            action: 'stop',
          });
        }
        // 只有在填了合同金额时，比较合同金额和应收账款金额大小
      } catch (e) {
        console.log('msg:', e);
      }
      // 不做操作
      return of(null);
    } else {
      return of(null);
    }

  }

  getTitleConfig(): any {
    return {
      hideTitle: true,
      titleName: '流程标题',
      def: `供应商提交资料`
    };
  }

  afterSubmitandGettip(svrConfig: any): Observable<any> {
    return of(null);
  }

  /** 计算应收账款转让金额 */
  // public ReceiveData(item: any) {
  //   let tempValue = item.replace(/,/g, '');
  //   tempValue = parseFloat(tempValue).toFixed(2);
  //   return Number(tempValue);
  // }
}
