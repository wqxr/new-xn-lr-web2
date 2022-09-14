import { visitAll } from '@angular/compiler';
/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\account-system\src\lib\shared\components\modal\chose-film-bank.modal.ts
 * @summary：补充开户信息-选择企业已绑定的银行账户
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                HuCongying           init           2021-12-14
 ***************************************************************************/
import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { RetCodeEnum } from 'libs/shared/src/lib/config/enum';
import { Column, TableChange, TableData } from '@lr/ngx-table';
import { BankInfo, FilmBankModalParams } from './interface';
import { Observable } from 'rxjs';
import { ShowModalService } from '../../services/show-modal.service';
import { XnAddBankModalComponent } from './add-bank-account.modal';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  template: `
    <nz-modal
      [nzWidth]="850"
      nzTitle="选择银行账户"
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
      </xn-table>
      <p style="text-align: right">未找到已有账号？<a (click)="addBankAccount()">点此新增</a></p>
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
export class XnChoseFilmBankModalComponent implements OnInit, AfterViewChecked {
  // 表格数据
  listInfo: BankInfo[];
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
      format: (item: TableData, col: Column, index: number): string =>
        (index + 1).toString(),
    },
    { title: '银行户名', index: 'accountName', width: 260 },
    { title: '银行账号', index: 'accountNo', width: 200 },
    { title: '开户行', index: 'acctBank', width: 300 },
    { title: '开户行联行号', index: 'acctBankCode', width: 200 },
  ];
  selectItems = [] as any;
  loading = false;
  observer: any;
  // params
  params: FilmBankModalParams;
  isVisible = false;

  constructor(
    private xn: XnService,
    private cdr: ChangeDetectorRef,
    public hwModeService: HwModeService,
    private showModal: ShowModalService,
    private vcr: ViewContainerRef,
    private message: NzMessageService,
  ) { }

  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
  }

  ngOnInit(): void { }

  /**
   * 打开模态框
   * @param params
   * @returns
   */
  open(params: FilmBankModalParams) {
    this.isVisible = true;
    this.params = Object.assign({}, this.params, params);
    this.getBankList();
    return new Observable((observer) => {
      this.observer = observer;
    });
  }

  /**
   * 获取绑定银行列表
   */
  getBankList() {
    this.loading = true;
    this.xn.middle
      .post2('/bank/list_by_app', { appId: this.params.appId })
      .subscribe((x) => {
        if (x.code === RetCodeEnum.OK) {
          this.loading = false;
          this.listInfo = x.data.acctBankList;
          if (this.params.accountNo) {
            this.listInfo.forEach(b => {
              if (b.accountNo === this.params.accountNo) {
                b.checked = true;
              }
            })
            this.selectItems = this.listInfo.filter((bank: BankInfo) => bank.accountNo === this.params.accountNo);
          } else {
            this.selectItems = [];
          }
        }
      });
  }

  /**
   * 新增银行账号
   */
  addBankAccount() {
    this.showModal
      .openModal(this.xn, this.vcr, XnAddBankModalComponent, {})
      .subscribe((v: any) => {
        if (v) {
          const {
            accountName,
            accountHolder,
            cardCode,
            bankName,
            bankCode,
            remark
          } = v;
          const params = {
            appId: this.params.appId,
            accountName,
            accountHolder,
            cardCode,
            bankName,
            bankCode,
            remark
          };
          this.xn.middle.post('/bank/add', params).subscribe(
            res => {
              this.getBankList();
              this.message.success('新增账号成功');
            }
          )
        }
      });
  }

  /**
   * 关闭modal框
   * @param value
   */
  private close(value: any) {
    this.isVisible = false;
    this.observer.next(value);
    this.observer.complete();
  }

  modalOK(): void {
    if (this.selectItems.length) {
      const bankInfo = this.selectItems[0];
      this.close(bankInfo);
    }
  }

  closeModal(): void {
    this.close(null);
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
