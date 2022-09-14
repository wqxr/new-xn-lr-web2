/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\account-system\src\lib\shared\components\modal\chose-bank.modal.ts
 * @summary：选择绑定银行账户
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                HuCongying           init           2021-11-26
 ***************************************************************************/
import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { RetCodeEnum } from 'libs/shared/src/lib/config/enum';
import { Column, TableChange, TableData } from '@lr/ngx-table';

@Component({
  selector: 'chose-bank-modal',
  template: `
    <nz-modal
      [nzWidth]="800"
      nzTitle="选择银行账号"
      [nzVisible]="isVisible"
      [nzFooter]="cFooter"
      [nzMaskClosable]="false"
      (nzOnCancel)="closeModal()"
    >
      <xn-table
        [data]="listInfo"
        [columns]="columns"
        [size]="'middle'"
        [loading]="loading"
        [scroll]="{ y: '400px' }"
        [page]="{ show: false }"
        [widthMode]="{
          type: 'strict',
          strictBehavior: 'truncate'
        }"
        (change)="handleTableChange($event)"
      >
      <!-- 是否主绑卡 -->
        <ng-template
          xn-table-row="isMainTpl"
          let-item
          let-index="index"
          let-column="column"
        >
          {{ item[column.index]?'是':'否' }}
        </ng-template>
      </xn-table>
      <ng-template #cFooter>
        <button nz-button nzType="default" (click)="closeModal()">取消</button>
        <button
          nz-button
          nzType="primary"
          [disabled]="!selectItems?.length"
          (click)="modalOK()"
        >
          提交
        </button>
      </ng-template>
    </nz-modal>
  `,
  styles: [
    `
      ::ng-deep .ant-card-head-title {
        font-weight: bold;
      }
      ::ng-deep .ant-modal-body {
        max-height: 500px;
        overflow-y: scroll;
      }
      ::ng-deep .ant-modal-close .ant-modal-close-x {
        padding: 15px;
      }

    `,
  ],
})
export class ChoseBankModalComponent implements OnInit, AfterViewChecked {
  @Input() isVisible = false;
  // 账户Id
  @Input() accountId = '';
  @Output() ok = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();
  // 表格数据
  listInfo: any[] = [] as any;
  // 表头
  columns: Column[] = [
    {
      title: '',
      index: 'bankId',
      width: 50,
      type: 'radio',
      fixed: 'left',
    },
    {
      title: '序号',
      index: 'no',
      width: 50,
      fixed: 'left',
      format: (item: TableData, col: Column, index: number): string =>
        (index + 1).toString(),
    },
    { title: '开户行', index: 'bankName', width: 260 },
    { title: '银行账号', index: 'accountNo', width: 260 },
    { title: '是否主绑卡', index: 'isMain', render: 'isMainTpl', width: 100 },
  ];
  selectItems: any[] = [] as any;
  loading: boolean = false;

  constructor(
    private xn: XnService,
    private cdr: ChangeDetectorRef,
    public hwModeService: HwModeService,
  ) { }

  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    this.getBankList();
  }

  /**
   * 获取绑定银行列表
   */
  getBankList() {
    this.loading = true;
    this.xn.middle
      .post2('/account/bank/list', { accountId: this.accountId })
      .subscribe((x) => {
        if (x.code === RetCodeEnum.OK) {
          this.loading = false;
          this.listInfo = x.data.bankList;
        }
      });
  }

  modalOK(): void {
    if (this.selectItems.length) {
      const bankId = this.selectItems.map(t => t.bankId)[0];
      this.ok.emit({ bankId });
    }
  }

  closeModal(): void {
    this.cancel.emit();
  }

  /**
   * 表格事件handle
   * @param e table事件
   */
  handleTableChange(e: TableChange) {
    switch (e.type) {
      case 'radio':
        this.selectItems = [e.radio] || [];
        break;
      default:
        break;
    }
  }
}
