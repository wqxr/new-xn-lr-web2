/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\account-system\src\lib\pages\my-account\bind-account\active-account\active-account.component.ts
 * @summary：账号打款激活页面
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                 hucongying          init           2021-11-17
 ***************************************************************************/
import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { RetCodeEnum } from 'libs/shared/src/lib/config/enum';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  templateUrl: './active-account.component.html',
  styles: [
    `
      ::ng-deep .ant-card-head-title {
        font-weight: bold;
      }
      .head-box {
        height: 40px;
        line-height: 40px;
        background-color: #e9f0fa;
        padding: 0 20px;
      }
      .right-arrow {
        display: inline-block;
        width: 260px;
        height: 20px;
        box-shadow: 0px 0px 0px 25px #f5f5f5 inset;
        background-color: #f5f5f5;
      }
      .right-arrow::after {
        content: '';
        display: inline-block;
        position: relative;
        left: 260px;
        top: -30px;
        border-left: 40px solid #f5f5f5;
        border-top: 40px solid transparent;
        border-bottom: 40px solid transparent;
      }
      .account-info {
        background-color: #f5f5f5;
        padding: 15px 10px;
      }
      .account-item {
        color: #707880;
      }
    `,
  ],
})
export class ActiveAccountComponent implements OnInit {
  // 银行id
  bankId: string = '';
  // 打款账户信息
  accountInfo: any = {} as any;
  loading: boolean = false;

  constructor(
    private xn: XnService,
    private cdr: ChangeDetectorRef,
    public hwModeService: HwModeService,
    private router: ActivatedRoute,
    private message: NzMessageService,
    private $modal: NzModalService
  ) { }
  ngOnInit(): void {
    this.router.params.subscribe((params) => {
      this.bankId = params?.bankId ? params.bankId : null;
      this.getAccountInfo();
    });
  }

  /**
   * 获取打款激活信息
   */
  getAccountInfo() {
    this.loading = false;
    this.xn.loading.open();
    this.xn.middle
      .post('/account/bank/activate/info', { bankId: this.bankId })
      .subscribe(
        (x) => {
          this.loading = true;
          this.xn.loading.close();
          if (x.code === RetCodeEnum.OK) {
            this.accountInfo = x.data;
          }
        },
        () => {
          this.loading = false;
          this.xn.loading.close();
        }
      );
  }


  /**
   * 激活
   */
  activeAccount() {
    this.$modal.confirm(
      {
        nzTitle: '提示',
        nzOkText: '确定',
        nzCancelText: '取消',
        nzContent: '请确认已完成线下打款操作',
        nzOnOk: () => {
          this.xn.loading.open();
          this.xn.middle
            .post('/account/bank/activate', { bankId: this.bankId })
            .subscribe((v) => {
              this.xn.loading.close();
              if (v.code === RetCodeEnum.OK) {
                this.message.success('账户激活成功！');
                setTimeout(() => {
                  this.goBack();
                }, 1500);
              }
            });
        },
        nzOnCancel: () => { },
      }
    )
  }

  goBack() {
    window.history.go(-1)
  }
}