/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\abs-gj\src\lib\flow\dragon_book_change.ts
 * @summary：dragon_book_change.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-11-22
 ***************************************************************************/
import { FormGroup } from '@angular/forms';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { Observable, of } from 'rxjs';
import { IFlowCustom } from './flow-custom';
import { XNCurrency } from 'libs/shared/src/lib/common/xncurrency';
import { ProgressStep } from 'libs/shared/src/lib/config/enum';

export class BookChange implements IFlowCustom {
  constructor(
    private xn: XnService
  ) {}

  preShow(): Observable<any> {
    return of(null);
  }

  postShow(svrConfig: any, form: FormGroup): Observable<any> {
    return of(null);
  }

  afterSubmitandGettip(svrConfig: any): Observable<any> {
    return of(null);
  }

  postGetSvrConfig(svrConfig: any): void {
  }

  preSubmit(svrConfig: any, formValue: any): Observable<any> {
    if (svrConfig.procedure.procedureId === ProgressStep.Begin) {
      if (!!formValue.receive && !!formValue.changePrice) {
        let payables = formValue.receive.toString().replace(/,/g, '');
        let changePrice = formValue.changePrice.toString().replace(/,/g, '');
        payables = new XNCurrency(payables).value;
        changePrice = new XNCurrency(changePrice).value;
        if (changePrice <= payables) {
          return of(null);
        } else {
          this.xn.msgBox.open(false, '转让价款大于应收账款金额，无法提交');
          return of({
            action: 'stop',
          });
        }
      } else if (!!formValue.receive) {
        const bookInfo = JSON.parse(formValue.dragon_book_info);
        let payables = formValue.receive.toString().replace(/,/g, '');
        let changePrice = bookInfo.changePrice.toString().replace(/,/g, '');
        payables = new XNCurrency(payables).value;
        changePrice = new XNCurrency(changePrice).value;
        if (changePrice <= payables) {
          return of(null);
        } else {
          this.xn.msgBox.open(false, '转让价款大于应收账款金额，无法提交');
          return of({
            action: 'stop',
          });
        }
      } else if (!!formValue.changePrice) {
        const bookInfo = JSON.parse(formValue.dragon_book_info);
        let changePrice = formValue.changePrice.toString().replace(/,/g, '');
        let payables = bookInfo.receive.toString().replace(/,/g, '');
        payables = new XNCurrency(payables).value;
        changePrice = new XNCurrency(changePrice).value;
        if (changePrice <= payables) {
          return of(null);
        } else {
          this.xn.msgBox.open(false, '转让价款大于应收账款金额，无法提交');
          return of({
            action: 'stop',
          });
        }

      } else {
        return of(null);
      }
    } else {
      return of(null);
    }
  }

  getTitleConfig(): any {
    return {
      hideTitle: true,
      titleName: '流程标题',
      def: '台账修改预录入'
    };
  }

  /** 计算应收账款转让金额 */
  // public ReceiveData(item: any) {
  //   let tempValue = item.replace(/,/g, '');
  //   tempValue = parseFloat(tempValue).toFixed(2);
  //   return Number(tempValue);
  // }
}
