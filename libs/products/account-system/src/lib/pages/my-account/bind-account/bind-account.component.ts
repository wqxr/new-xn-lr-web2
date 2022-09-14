/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\account-system\src\lib\pages\my-account\bind-account\bind-account.component.ts
 * @summary：绑定银行账户页面
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                HuCongying           init           2021-11-01
 ***************************************************************************/
import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { InfoActiveEnum, RetCodeEnum } from 'libs/shared/src/lib/config/enum';
import { InfoActiveOptions } from 'libs/shared/src/lib/config/options';

@Component({
  templateUrl: './bind-account.component.html',
  styles: [
    `
      ::ng-deep .ant-card-head-title {
        font-weight: bold;
      }
      .bank-card {
        height: 233px;
        border: 1px solid #e9f0fa;
        border-radius: 4px;
      }
      .card-head {
        position: relative;
        height: 60px;
        background-color: #e9f0fa;
        padding: 0 10px;
        display: flex;
        align-items: center;
      }
      .bank-name {
        font-size: 17px;
        font-size: 17px;
      }
      .account-number {
        padding: 0 10px;
        margin-top: 40px;
      }
      .triangle {
        width: 0;
        height: 0;
        border: 35px solid;
        border-color: transparent transparent #707880;
        position: absolute;
        right: -35px;
        top: -36px;
        transform: rotateZ(45deg);
      }
      .active-border {
        border-color: transparent transparent #1d67c7;
      }
      .unactive-border {
        border-color: transparent transparent #707880;
      }
      .active-status {
        position: absolute;
        color: #fff;
        right: -1px;
        top: 7px;
        transform: rotateZ(45deg);
        font-size: 12px;
      }
      .btn-divider {
        background-color: #e9f0fa;
        margin-bottom: 0;
      }
      .del-account {
        height: 50px;
        line-height: 50px;
        text-align: center;
        border-right: 1px solid #e9f0fa;
      }
      .edit-account {
        height: 50px;
        line-height: 50px;
        text-align: center;
      }
      .card-type {
        width: 70px;
        height: 30px;
        line-height: 30px;
        background: #4682d1;
        text-align: center;
        color: #fff;
        border-radius: 24px;
        margin: 0 15px;
        font-size: 13px;
      }
      .operator-box {
        height: 233px;
        border: 1px solid #e9f0fa;
        border-radius: 4px;
        text-align: center;
      }
      .add-account {
        width: 65px;
        height: 65px;
        border: 1px dashed #d4d7d9;
        margin: 65px auto 20px;
        cursor: pointer;
      }
    `,
  ],
})
export class BindAccountComponent implements OnInit, AfterViewChecked {
  /** 账户Id */
  accountId: number;
  loading: boolean = false;
  // 待开户信息
  accountList: any = [] as any;

  get infoActiveOptions() {
    return InfoActiveOptions
  }

  constructor(
    private xn: XnService,
    private cdr: ChangeDetectorRef,
    public hwModeService: HwModeService,
    private router: ActivatedRoute,
    private message: NzMessageService,
    private $modal: NzModalService
  ) { }
  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
  }
  ngOnInit(): void {
    this.router.params.subscribe((params) => {
      this.accountId = params?.accountId ? params.accountId : null;
      this.getAccountList();
    });
  }

  /**
   * 获取银行账户列表
   */
  getAccountList() {
    this.loading = false;
    this.xn.loading.open();
    this.xn.middle
      .post('/account/bank/list', { accountId: this.accountId })
      .subscribe(
        (x) => {
          this.xn.loading.close();
          if (x.code === RetCodeEnum.OK) {
            this.loading = true;
            this.accountList = x.data.bankList;
          }
        },
        () => {
          this.xn.loading.close();
        }
      );
  }

  /**
   * 添加绑定银行账户
   */
  addBindAccount() {
    this.xn.router.navigate(['add', this.accountId], {
      relativeTo: this.router.parent,
    }).then();
  }

  /**
   * 修改绑定银行账户
   */
  modifyBindAccount(bank: any) {
    this.xn.router.navigate(['modify', this.accountId], {
      relativeTo: this.router.parent,
      queryParams: {
        bankInfo: JSON.stringify(bank)
      }
    }).then();
  }

  /**
   * 去激活账号
   */
  toActiveAccount(bank: any) {
    this.xn.router.navigate(['active-account', bank.bankId], {
      relativeTo: this.router.parent,
    }).then();
  }

  /**
   * 删除绑定银行账户
   */
  delBindAccount(bankId: number) {
    this.$modal.warning(
      {
        nzTitle: '提示',
        nzContent: '确定要删除该银行账户吗？',
        nzOkText: '确定',
        nzCancelText: '取消',
        nzOnOk: () => {
          this.xn.loading.open();
          this.xn.middle
            .post('/account/bank/delete', { bankId })
            .subscribe(
              (x) => {
                this.xn.loading.close();
                if (x.code === RetCodeEnum.OK) {
                  this.message.success('删除成功！');
                  this.getAccountList();
                }
              },
              () => {
                this.xn.loading.close();
              }
            );
        },
        nzOnCancel: () => { },
      }
    )
  }

  showActiveBtn(isActivate: number) {
    return isActivate === InfoActiveEnum.INACTIVATED
  }

  goBack() {
    window.history.go(-1);
  }
}
