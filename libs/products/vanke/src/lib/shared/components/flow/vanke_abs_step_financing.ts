/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：SupplierUploadInformationFlow
 * @summary：分布提交万科ABS提单预录入
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                wangqing        供应商上传资料         2021-08-18
 * **********************************************************************
 */
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { IFlowCustom, buttonListType } from './flow-custom';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import * as _ from 'lodash';
import { XNCurrency } from 'libs/shared/src/lib/common/xncurrency';
import { EditModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/edit-modal.component';
import { xnInvoiceStatus } from 'libs/shared/src/lib/config/enum/common-enum';
import { IsPreTrade } from 'libs/shared/src/lib/config/enum';
import { ConsoleComponents } from 'libs/products/new-agile/src/lib/pages/console';
import { PointService } from 'libs/shared/src/lib/services/point.service';
import { ViewButtonType } from 'libs/shared/src/lib/config/enum';
interface modalPramas {
  checker: any;
  title: string;
  buttons: Array<string>;
}
export class VankeFinancingStep implements IFlowCustom {
  public buttonList: buttonListType = _.cloneDeep(buttonList);

  constructor(private xn: XnService, private loading: LoadingService, private pointService: PointService) {}

  preShow(svrConfig): Observable<any> {
    return of(null);
  }
  afterSubmitandGettip(svrConfig: any): Observable<any> {
    this.pointService.setPoint({itemName: ViewButtonType.UploadDataReview, mainFlowId: svrConfig.record.mainFlowId})
    return of(null);
  }
  postShow(svrConfig: any, form: FormGroup): Observable<any> {
    if (svrConfig.rejectType === 0) {
      this.buttonList[svrConfig.procedure.procedureId].rightButtons.push({
        label: '中止流程',
        operate: 'suspension',
        danger: false,
        color: 'default',
        click: (mainForm, svrConfig, xn, vcr) => {},
      });
    }
    return of({ buttonList: this.buttonList[svrConfig.procedure.procedureId] });
  }

  postGetSvrConfig(svrConfig: any, rows: any): void {
    if (svrConfig.actions && svrConfig.actions.length > 0) {
      svrConfig.actions.forEach((x, index) => {
        if (x.checkers.length) {
          x.stepList.forEach((y) => {
            y.checkerIdList = x.checkers.filter((z) => z.stepId === y.stepId);
          });
        }
      });
    }
    if (svrConfig.stepList && svrConfig.stepList.length > 0) {
      svrConfig.stepList.forEach((x) => {
        x.checkerIdList = svrConfig.checkers.filter(
          (y) => y.stepId === x.stepId
        );
      });
    }
  }
  preSubmit(svrConfig: any, formValue: any): Observable<any> {
    if (svrConfig.procedure.procedureId === 'operate') {
      let payables = formValue.receive.toString().replace(/,/g, '');
      payables = new XNCurrency(payables).value;
      const contractFile = formValue.contractFile;
      let invoiceFile = formValue.invoice;
      const performanceFile = formValue.performanceFiles;
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
              x.status === xnInvoiceStatus.CHECK_QUIT ||
              x.status === xnInvoiceStatus.OUT_CONTROL ||
              x.status === xnInvoiceStatus.HONG_CHONG ||
              x.status === xnInvoiceStatus.ABNOMAL_STATUS
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
          const isVirtual = JSON.parse(formValue.accountInfo).isVirtual;
          const isPreTrade = svrConfig.isPreTrade;
          // console.log(isPreTrade, isVirtual, formValue);
          if (isPreTrade === IsPreTrade.YES && isVirtual === false) {
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
      return of(null);
    }
  }

  getTitleConfig(): any {
    return {
      hideTitle: true,
      titleName: '流程标题',
      def: '保理商预录入',
    };
  }

  /**
   * a）是否已有内容【合同扫描件、资质证明、履约证明】
   * b）是否已有内容【发票信息（发票列表所有信息）】
   * c）是否满足【发票含税金额总计大于等于应收账款金额】
   * 以上校验成功后，显示账号确认modal
   * @param formValue
   */
  confirmAccountInfo(formValue: any, svrConfig?: any): modalPramas {
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
const buttonList: buttonListType = {
  '@begin': {
    leftButtons: [],
    rightButtons: [],
  },
  operate: {
    leftButtons: [],
    rightButtons: [
      {
        label: '保存',
        danger: false,
        color: 'default',
        operate: 'save',
        click: () => {},
      },
    ],
  },
  review: {
    leftButtons: [],
    rightButtons: [
      {
        label: '拒绝',
        danger: false,
        color: 'default',
        operate: 'reject',
        click: () => {},
      },
    ],
  },
};
