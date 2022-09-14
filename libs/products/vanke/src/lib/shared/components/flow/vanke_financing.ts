/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\vanke\src\lib\shared\components\flow\vanke_financing.ts
 * @summary：供应商提交资料
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                 hucongying          init           2021-08-24
 ***************************************************************************/

import { Observable, of } from 'rxjs';
import { IFlowCustom } from './flow-custom';
import { FormGroup } from '@angular/forms';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { XNCurrency } from 'libs/shared/src/lib/common/xncurrency';
import { EditModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/edit-modal.component';
import { IsPreTrade } from 'libs/shared/src/lib/config/enum';
import { PointService } from 'libs/shared/src/lib/services/point.service';
import { ViewButtonType } from 'libs/shared/src/lib/config/enum';
export class VankeFinancing implements IFlowCustom {
  constructor(private xn: XnService, private loading: LoadingService, private pointService: PointService) {}

  preShow(): Observable<any> {
    return of(null);
  }

  postShow(svrConfig: any, mainForm: FormGroup): Observable<any> {
    return of(null);
  }

  postGetSvrConfig(svrConfig: any): void {}

  preSubmit(svrConfig: any, formValue: any): Observable<any> {
    // console.log("上传资料==", formValue);
    if (svrConfig.procedure.procedureId === 'operate') {
      let payables = formValue.receive.toString().replace(/,/g, '');
      payables = new XNCurrency(payables).value;
      const contractFile = formValue.dealContract;
      let invoiceFile = formValue.invoice;
      const performanceFile = formValue.performanceFile;
      const certificateFile = formValue.certificateFile;
      const accountInfo = formValue.accountInfo;

      const alert = [];
      try {
        if (contractFile === '') {
          alert.push(`${alert.length + 1}、交易合同未上传`);
        }
        if (accountInfo === '') {
          alert.push(`${alert.length + 1}、账号信息不完整`);
        }
        if (performanceFile === '') {
          alert.push(`${alert.length + 1}、履约证明文件未上传`);
        }
        if (certificateFile === '') {
          alert.push(`${alert.length + 1}、资质证明文件未上传`);
        }
        if (invoiceFile === '') {
          alert.push(`${alert.length + 1}、发票未上传`);
        } else {
          invoiceFile = JSON.parse(invoiceFile);
          let invoiceAmount = new XNCurrency(0);
          invoiceFile.forEach((x) => {
            invoiceAmount = invoiceAmount.add(x.invoiceAmount);
          });
          const contractTypeBool = []; // 必须每张发票都包含发票号，金额，开票日期
          for (const file of invoiceFile) {
            contractTypeBool.push(
              !!file.invoiceAmount && !!file.invoiceNum && !!file.invoiceDate
            );
          }
          if (contractTypeBool.indexOf(false) > -1) {
            alert.push(`${alert.length + 1}、发票沒进行验证，请验证`);
          }
          const statusList = invoiceFile.filter(
            (x) =>
              x.status === 4 ||
              x.status === 6 ||
              x.status === 7 ||
              x.status === 8
          );
          if (statusList.length > 0) {
            alert.push(`${alert.length + 1}、发票状态异常`);
          }
          if (payables > invoiceAmount.value) {
            alert.push(
              `${alert.length + 1}、发票金额${
                invoiceAmount.value
              }小于应收账款金额${payables}`
            );
          }
        }
        if (alert.length > 0) {
          alert[alert.length - 1] = alert[alert.length - 1] + '，无法提交';
          this.xn.msgBox.open(false, alert);
          return of({
            action: 'vankestop',
          });
        } else {
          // return of(null);
          const isVirtual = JSON.parse(formValue.accountInfo).isVirtual;
          if (svrConfig.isPreTrade === IsPreTrade.YES && isVirtual === false) {
            return of({ action: 'isVirtualStop' });
          } else {
            return of({
              action: 'modal',
              modal: EditModalComponent,
              params: this.confirmAccountInfo(formValue),
            });
          }
        }
      } catch (e) {
        console.log('msg:', e);
      }
    } else {
      this.pointService.setPoint({itemName: ViewButtonType.UploadDataReview, mainFlowId: svrConfig.record.mainFlowId})
      return of(null);
    }
  }

  afterSubmitandGettip(svrConfig: any): Observable<any> {
    if (svrConfig.procedure.procedureId === 'operate') {
      this.xn.msgBox.open(
        false,
        '提交成功,下一步请复核人在【首页-待办任务】中完成【复核】的待办任务',
        () => {}
      );
    }
    return of(null);
  }
  getTitleConfig(): any {
    return {
      hideTitle: true,
      titleName: '流程标题',
      def: '供应商上传资料',
    };
  }

  /**
   * a）是否已有内容【合同扫描件、资质证明、履约证明】
   * b）是否已有内容【发票信息（发票列表所有信息）】
   * c）是否满足【发票含税金额总计大于等于应收账款金额】
   * 以上校验成功后，显示账号确认modal
   * @param formValue
   */
  confirmAccountInfo(formValue: any): {
    checker: any[];
    title: string;
    buttons: string[];
  } {
    const accountInfo = JSON.parse(formValue.accountInfo);
    const checkers = [
      {
        title: '收款单位户名',
        checkerId: 'accountName',
        type: 'special-text',
        options: {},
        value: accountInfo.accountName || '',
        required: 0,
      },
      {
        title: '收款单位账号',
        checkerId: 'cardCode',
        type: 'special-text',
        options: {},
        value: accountInfo.cardCode || '',
        required: 0,
      },
      {
        title: '收款单位开户行',
        checkerId: 'bankName',
        type: 'special-text',
        options: {},
        value: accountInfo.bankName || '',
        required: 0,
      },
    ];
    const params = {
      checker: checkers,
      title: '账号确认-请确认是否使用以下账号收取保理款',
      buttons: ['取消', '确定'],
    };
    return params;
  }
}
