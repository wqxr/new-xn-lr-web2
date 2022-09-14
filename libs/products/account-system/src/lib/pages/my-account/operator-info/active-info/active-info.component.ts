/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\products\account-system\src\lib\pages\my-account\operator-info\active-info\active-info.component.ts
* @summary：激活经办人信息
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                HuCongying           init           2021-11-18
***************************************************************************/
import {
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { HwModeService } from 'libs/shared/src/lib/services/hw-mode.service';
import { InfoActiveEnum, RetCodeEnum } from 'libs/shared/src/lib/config/enum';
import { NzModalService } from 'ng-zorro-antd/modal';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { formatDate } from '@angular/common';
import { Html2PdfService } from '../../../../shared/services/html2pdf.service';

@Component({
  templateUrl: './active-info.component.html',
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
      width: 80%;
      height: 20px;
      box-shadow: 0px 0px 0px 25px #f5f5f5 inset;
      background-color: #f5f5f5;
    }
    .right-arrow::after {
      content: '';
      display: inline-block;
      position: relative;
      left: 100%;
      top: -30px;
      border-left: 40px solid #f5f5f5;
      border-top: 40px solid transparent;
      border-bottom: 40px solid transparent;
    }
    .account-info {
      background-color: #f5f5f5;
      padding: 10px;
      display: flex;
      align-items: center;
    }
    .account-item {
      color: #707880;
    }
    `,
  ],
})
export class ActiveOperatorInfoComponent implements OnInit {
  // 账户id
  accountId: string = '';
  // 打款账户信息
  accountInfo: any = {} as any;
  loading: boolean = false;
  element: HTMLElement;
  // 待激活银行列表
  bankInfoList: any = [] as any;

  constructor(
    private xn: XnService,
    public hwModeService: HwModeService,
    private router: ActivatedRoute,
    private message: NzMessageService,
    private $modal: NzModalService,
    private html2pdfService: Html2PdfService,
  ) { }
  ngOnInit(): void {
    this.router.params.subscribe((params) => {
      this.accountId = params?.accountId ? params.accountId : null;
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
      .post2('/account/info/operator/activate', { accountId: this.accountId })
      .subscribe(
        (x) => {
          this.xn.loading.close();
          if (x.code === RetCodeEnum.OK) {
            if (XnUtils.isEmptys(x.data) || x.data.isActivate === InfoActiveEnum.ACTIVATED) {
              // 已激活调用、用户打款后未点击激活按钮，再次进入激活页面相当于激活了
              this.$modal.success({
                nzTitle: '提示',
                nzContent: '账户信息已激活成功',
                nzOkText: '确定',
                nzOnOk: () => {
                  this.xn.router
                    .navigate(['index'], {
                      relativeTo: this.router.parent,
                    })
                    .then();
                },
              });
            } else {
              this.loading = true;
              this.accountInfo = x.data;
              this.bankInfoList = x.data.bankInfoList;
            }
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
            .post2('/account/info/operator/activate', { accountId: this.accountId })
            .subscribe(
              (v: any) => {
                this.xn.loading.close();
                if (v.code === RetCodeEnum.OK) {
                  if (XnUtils.isEmptys(v.data) || v.data.isActivate === InfoActiveEnum.ACTIVATED) {
                    // 已激活状态
                    this.message.success('经办人信息激活成功！');
                    setTimeout(() => {
                      this.goBack();
                    }, 1500);
                  } else {
                    // 还未打款
                    this.message.error('暂未查到款项信息,请稍后再试.如已超过1小时,可联系平台客服！');
                    this.accountInfo = v.data;
                  }
                }
              },
              (err) => {
                console.log(err);
                this.xn.loading.close();
              });
        },
        nzOnCancel: () => { },
      }
    )
  }

  /**
   * 下载单款提示单
   * 导出为pdf---html2canvas+jspdf
   */
  async downLoadList() {
    this.xn.loading.open();
    const fileName = `打款提示单_${formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss', 'en')}.pdf`;
    const pdf = await this.html2pdfService.html2pdf('html2save', fileName);
    this.xn.loading.close();
    if (!pdf) {
      this.message.error('文件下载失败');
    }
  }

  goBack() {
    this.xn.router.navigate(['index'], {
      relativeTo: this.router.parent,
    }).then();
  }
}
