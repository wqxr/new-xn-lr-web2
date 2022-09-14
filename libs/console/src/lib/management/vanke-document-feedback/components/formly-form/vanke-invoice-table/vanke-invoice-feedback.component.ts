/*************************************************************************
 * Copyright (c) 2017 - 2022 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\console\src\lib\management\vanke-document-feedback\components\formly-form\vanke-invoice-table\vanke-invoice-feedback.component.ts
 * @summary：init XnFormlyFieldInvoiceFeedback
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                HuCongying           init           2022-03-14
 ***************************************************************************/
import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { Column, TableData } from '@lr/ngx-table';
import { FieldType } from '@ngx-formly/core';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';

@Component({
  templateUrl: './vanke-invoice-feedback.component.html',
  styles: [
    `
      .expand-container {
        padding: 2px;
        text-align: right;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class XnFormlyFieldInvoiceFeedback extends FieldType implements OnInit {
  defaultOptions = {
    templateOptions: {
      options: [],
    },
  };
  invoiceList: any[] = [] as any;
  // 表头
  columns: Column[] = [
    {
      title: '序号',
      index: 'no',
      width: 50,
      fixed: 'left',
      format: (item: TableData, col: Column, index: number): string =>
        (index + 1).toString(),
    },
    { title: '发票号', index: 'number', width: 100 },
    { title: '发票代码', index: 'code', width: 100 },
    { title: '含税金额', index: 'invoiceAmt', render: 'moneyTpl', width: 150 },
    {
      title: '不含税金额',
      index: 'invNoTaxAmt',
      render: 'moneyTpl',
      width: 150,
    },
    {
      title: '退回原因',
      index: 'reason',
      fixed: 'right',
      render: 'reasonTpl',
      width: 300,
    },
  ];

  // 发票退回原因
  listOfReason = [];

  constructor(private cdr: ChangeDetectorRef) {
    super();
  }

  ngOnInit() {
    this.listOfReason = XnUtils.deepClone(this.to.options);
    const value = this.formControl.value;
    if (value) {
      this.invoiceList = value.filter((invoice: any) => {
        if (invoice.reason) {
          invoice.reason = JSON.parse(invoice.reason);
        } else {
          invoice.reason = [];
        }
        return invoice;
      });
    } else {
      this.invoiceList = [];
    }
    this.toValue();
  }

  /**
   * 选中下拉项
   * @param value 选中的label
   */
  onSelectChange(value: string[], record: TableData, index: number) {
    if (value.length) {
      record.reason = value;
      this.invoiceList[index]['reason'] = value;
    } else {
      record.reason = [];
      this.invoiceList[index]['reason'] = [];
    }
    this.cdr.markForCheck();
    this.toValue();
  }

  /**
   * 赋值操作
   */
  toValue() {
    const invoiceList = XnUtils.deepClone(this.invoiceList);
    const hasReasonList = invoiceList
      .filter((invoice: any) => invoice.reason.length)
      .map((invoice: any) => {
        invoice.reason = JSON.stringify(invoice.reason);
        return invoice;
      });
    if (hasReasonList.length) {
      this.formControl.setValue(hasReasonList);
    } else {
      this.formControl.setValue(null);
    }
  }
}
