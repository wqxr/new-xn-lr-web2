import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { LoadingService } from 'libs/shared/src/lib/services/loading.service';
import { PublicCommunicateService } from 'libs/shared/src/lib/services/public-communicate.service';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import {ZDRecordStatus} from 'libs/shared/src/lib/config/enum/common-enum';
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'zd-change-info',
  templateUrl: `./zd-info-change-component.html`,
  styleUrls: ['./zd-change-new-component.less'],
})
export class ZdInfoChangeComponent implements OnInit {
  @Input() formGroups: FormGroup;
  @Input() data?: any;
  @Input() svrConfig?: any;
  @Input() registerNo?: string;
  invoiceList: ItemData[] = [];
  contractList: ItemData[] = [];
  debtorList: ItemData[] = [];
  isInvoice: boolean[] = [];
  contractListLength: number;
  isInvoiceMoney: boolean[] = [];
  changePrice: boolean[] = [];
  moneyRegExp =
    /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
  alert = '';
  formatName= {
    invoice: '发票',
    contract: '合同',
    debtor: '债务人'
  }
  constructor(
    private publicCommunicateService: PublicCommunicateService,
    private xn: XnService,
    private loadingService: LoadingService
  ) {}
  ngOnInit(): void {
    if (!this.data) {
      this.getPaddingData();
    } else if (
      !!this.data &&
      !!this.svrConfig &&
      this.svrConfig.procedure.procedureId === '@begin'
    ) {
      this.invoiceList = JSON.parse(
        this.data.filter((x) => x.checkerId === 'invoiceList')[0].value
      );
      this.contractList = JSON.parse(
        this.data.filter((x) => x.checkerId === 'contractList')[0].value
      );
      this.debtorList = JSON.parse(
        this.data.filter((x) => x.checkerId === 'debtorList')[0].value
      );
      this.invoiceList.forEach((x, index) => {
        this.isInvoice[index] = this.InvoiceMatchValidator(x.invoiceCode);
        this.isInvoiceMoney[index] = this.moneyRegExp.test(x.invoiceMoney);
        this.changePrice[index] = this.moneyRegExp.test(x.invoicechangePrice);
      });
      this.pushArrary();
    }

    this.formGroups.valueChanges.subscribe((x) => {
      this.publicCommunicateService.change.emit({
        invoiceList: this.invoiceList,
        contractList: this.contractList,
        debtorList: this.debtorList,
      });
    });
  }
  getPaddingData() {
    this.xn.api
      .post('/custom/zhongdeng/zd/get_padding_data', {
        registerNo: this.registerNo,
      })
      .subscribe((x) => {
        if (x.ret === 0) {
          const status = x.data.status;
          if (status && status === ZDRecordStatus.IN_PROCESS) {
            this.xn.msgBox.open(false, '该记录在途,暂时无法修改类别', () => {
              this.xn.user.navigateBack();
            });
            return;
          }
          x.data.debtorList.forEach((i) => {
            this.debtorList.push({ debtor: i });
          });
          if (x.data.contractNameList.length > 0) {
            x.data.contractNameList.forEach((i) => {
              this.contractList.push({ contractName: i, contractId: '' });
            });
          }
          if (
            x.data.contractNoList.length > 0 &&
            x.data.contractNoList.length >= x.data.contractNameList.length
          ) {
            x.data.contractNoList.forEach((i, index) => {
              if (this.contractList.length > index) {
                this.contractList[index].contractId = i;
              } else {
                this.contractList.push({ contractName: '', contractId: i });
              }
            });
          } else {
            x.data.contractNoList.forEach((i, index) => {
              this.contractList[index].contractId = i;
            });
          }
          if (x.data.invoiceInfoList.length > 0) {
            x.data.invoiceInfoList.forEach((i) => {
              this.invoiceList.push({
                invoiceCode: i.split('-')[0],
                invoiceMoney: i.split('-')[1],
                invoicechangePrice: i.split('-')[2],
              });
            });
          }
          this.invoiceList.forEach((i, index) => {
            this.isInvoice[index] = this.InvoiceMatchValidator(i.invoiceCode);
            this.isInvoiceMoney[index] = this.moneyRegExp.test(i.invoiceMoney);
            this.changePrice[index] = this.moneyRegExp.test(
              i.invoicechangePrice
            );
          });
          this.pushArrary();
          this.publicCommunicateService.change.emit({
            invoiceList: this.invoiceList,
            contractList: this.contractList,
            debtorList: this.debtorList,
          });
        }
      });
  }
  public isReadonly(): boolean {
    return (
      !!this.data &&
      !!this.svrConfig &&
      this.svrConfig.procedure.procedureId === 'review'
    );
  }
  OnInput(event, index) {
    this.isInvoice[index] = this.InvoiceMatchValidator(event.target.value);
  }
  inputMoney(event, index) {
    this.isInvoiceMoney[index] = this.moneyRegExp.test(event.target.value);
  }
  inputchangePrice(event, index) {
    this.changePrice[index] = this.moneyRegExp.test(event.target.value);
  }
  /**
   * 导出清单 type：类型
   */
  downExcel(types: string) {
    this.loadingService.open();
    this.xn.api
      .download(`/custom/zhongdeng/zd/down_excel`, {
        type: types,
        recordId: this.svrConfig.record.recordId,
      })
      .subscribe((v: any) => {
        this.xn.api.save(v._body, `${this.formatName[types]}.xlsx`);
        this.loadingService.close();
      });
  }
  /**
   * 下载模板
   */
  downTemplate(types: string) {
    this.loadingService.open();
    this.xn.api
      .download(`/custom/zhongdeng/zd/down_padding_excel`, {
        type: types,
        registerNo: this.registerNo,
      })
      .subscribe((v: any) => {
        this.xn.api.save(v._body, `${this.formatName[types]}.xlsx`);
        this.loadingService.close();
      });
  }
  private pushArrary() {
    for (let i = this.invoiceList.length; i < 10; i++) {
      this.invoiceList.push({
        invoiceCode: '',
        invoiceMoney: '',
        invoicechangePrice: '',
      });
    }
    for (let i = this.contractList.length; i < 10; i++) {
      this.contractList.push({
        contractName: '',
        contractId: '',
      });
    }
    for (let i = this.debtorList.length; i < 10; i++) {
      this.debtorList.push({
        debtor: '',
      });
    }
  }
  onUploadExcel(e, type: string) {
    if (e.target.files.length === 0) {
      return;
    }
    const err = this.validateExcelExt(e.target.files[0].name);
    if (!XnUtils.isEmpty(err)) {
      this.alert = err;
      $(e.target).val('');
      return;
    }

    const fd = new FormData();
    fd.append('type', type);
    fd.append('file_data', e.target.files[0], e.target.files[0].name);
    // 上传excel
    this.xn.api.upload('/custom/zhongdeng/zd/upload_excel', fd).subscribe({
      // console.log('json上传的excel', json);
      next: (json) => {
        if (json.type === 'complete') {
          if (json.data.ret === 0) {
            if (type === 'invoice') {
              this.invoiceList = json.data.data;
              this.invoiceList.forEach((x, index) => {
                this.isInvoice[index] = this.InvoiceMatchValidator(
                  x.invoiceCode
                );
                 this.isInvoiceMoney[index] = this.moneyRegExp.test(x.invoiceMoney)
                this.changePrice[index] = this.moneyRegExp.test(
                  x.invoicechangePrice
                );
              });
            }
            if (type === 'contract') {
              this.contractList = json.data.data;
            }
            if (type === 'debtor') {
              this.debtorList = json.data.data;
            }
            this.publicCommunicateService.change.emit({
              invoiceList: this.invoiceList,
              contractList: this.contractList,
              debtorList: this.debtorList,
            });
          } else {
            this.xn.msgBox.open(false, json.data.msg);
          }
        }
      },
    });
    $(e.target).val('');
  }
  private validateExcelExt(s: string): string {
    const exts = 'xls,xlsx'.replace(/,/g, '|').replace(/\s+/g, ''); // 删除所有空格
    if (s.match(new RegExp('\\.(' + exts + ')$', 'i'))) {
      return '';
    } else {
      return `只支持以下文件格式: xls,xlsx`;
    }
  }
  private InvoiceMatchValidator(value) {
    const exp = /^(\d{8}|\d{10})$/;
    return exp.test(value) ? true : false;
  }
}
interface ItemData {
  invoiceCode?: string;
  invoiceMoney?: string;
  invoicechangePrice?: string;
  contractName?: string;
  contractId?: string;
  debtor?: string;
}
