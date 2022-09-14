/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\products\account-system\src\lib\pages\my-account\bind-account\add-account\add-account.component.ts
* @summary：添加绑定银行账户
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                HuCongying           init           2021-11-02
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
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@lr/ngx-formly';
import { NzModalService } from 'ng-zorro-antd/modal';
import { BankTypeEnum, RetCodeEnum } from 'libs/shared/src/lib/config/enum';
import { ShowModalService } from '../../../../shared/services/show-modal.service';
import { XnAddBankModalComponent } from '../../../../shared/components/modal/add-bank-account.modal';

@Component({
  templateUrl: './add-bind-account.component.html',
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
        margin-bottom: 20px;
      }
      .add-account {
        text-align: right;
        position: absolute;
        z-index: 20;
        bottom: -50px;
        right: 25%;
      }
    `,
  ],
})
export class AddBindAccountComponent implements OnInit, AfterViewChecked {
  /** 账户Id */
  accountId: number;
  form = new FormGroup({});
  model: any = {};
  options: FormlyFormOptions = {
    formState: {
      bankList: []
    },
  };
  appId: string;
  showFields: FormlyFieldConfig[] = [
    {
      className: 'ant-col ant-col-md-24 ant-col-sm-24',
      wrappers: ['form-field-horizontal'],
      key: 'virAcctNo',
      type: 'input',
      templateOptions: {
        label: '电子账本账号',
        placeholder: '',
        autocomplete: 'off',
        labelSpan: 7,
        controlSpan: 11,
      },
      expressionProperties: {
        'templateOptions.disabled': () => true,
        'templateOptions.required': () => true,
      },
    },
    {
      className: 'ant-col ant-col-md-24 ant-col-sm-24',
      wrappers: ['form-field-horizontal'],
      key: 'accountName',
      type: 'input',
      defaultValue: this.xn.user.orgName,
      templateOptions: {
        label: '户名',
        placeholder: '',
        autocomplete: 'off',
        labelSpan: 7,
        controlSpan: 11,
      },
      expressionProperties: {
        'templateOptions.disabled': () => true,
        'templateOptions.required': () => true,
      },
    },
    {
      className: 'ant-col ant-col-md-24 ant-col-sm-24',
      wrappers: ['form-field-horizontal'],
      key: 'bank',
      type: 'select',
      templateOptions: {
        label: '选择开户行',
        nzPlaceHolder: '请选择',
        nzShowSearch: true,
        autocomplete: 'off',
        labelSpan: 7,
        controlSpan: 11,
      },
      expressionProperties: {
        'templateOptions.disabled': () => false,
        'templateOptions.required': () => true,
        'templateOptions.options': 'formState.bankList',
      },
    },
    {
      className: 'ant-col ant-col-md-24 ant-col-sm-24',
      wrappers: ['form-field-horizontal'],
      key: 'accountNo',
      type: 'input',
      templateOptions: {
        label: '银行账号',
        placeholder: '',
        autocomplete: 'off',
        labelSpan: 7,
        controlSpan: 11,
      },
      expressionProperties: {
        'templateOptions.disabled': () => true,
        'templateOptions.required': () => true,
      },
      hooks: {
        onInit: () => {
          this.form.get('bank').valueChanges.subscribe((v) => {
            if (v) {
              this.form.get('accountNo').setValue(v);
            }
          });
        },
      },
    },
  ]
  loading: boolean = false;

  constructor(
    private xn: XnService,
    private cdr: ChangeDetectorRef,
    public hwModeService: HwModeService,
    private router: ActivatedRoute,
    private message: NzMessageService,
    private $modal: NzModalService,
    private vcr: ViewContainerRef,
    private showModal: ShowModalService,
  ) { }
  ngAfterViewChecked(): void {
    this.cdr.detectChanges()
  }
  ngOnInit(): void {
    this.router.params.subscribe((params) => {
      this.accountId = params?.accountId ? params.accountId : null;
      this.getBankList();
      this.getAccountInfo();
    });
  }

  /**
   * 获取账户详情
   */
  getAccountInfo() {
    this.loading = false;
    this.xn.middle.post2('/account/info/overview',
      { appId: this.xn.user.appId, bankType: BankTypeEnum.SH_BANK }
    ).subscribe(
      (x) => {
        if (x.code === RetCodeEnum.OK) {
          this.loading = true;
          this.model.virAcctNo = x.data.virAcctNo;
          this.cdr.markForCheck()
        }
      },
    );
  }

  /**
   * 查询银行列表
   */
  getBankList() {
    this.xn.middle
      .post('/bank/list_by_app', { appId: this.xn.user.appId })
      .subscribe(
        (x) => {
          if (x.code === RetCodeEnum.OK) {
            this.options.formState.bankList =
              x.data.acctBankList.map(t => {
                return { label: t.acctBank, value: t.accountNo }
              })
          }
        },
      );
  }

  /**
   * 提交信息
   */
  submitFrom() {
    const accountNo = this.model.accountNo;
    this.xn.loading.open();
    this.xn.middle
      .post('/account/bank/add', { accountId: this.accountId, accountNo })
      .subscribe(
        (x) => {
          this.xn.loading.close()
          if (x.code === RetCodeEnum.OK) {
            this.$modal.success(
              {
                nzTitle: '提示',
                nzContent: '添加成功',
                nzOnOk: () => {
                  this.goBack()
                },
                nzOnCancel: () => { },
              }
            )
          }
        },
      );
  }

  /**
   * 新增账号
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
            appId: this.appId,
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

  goBack() {
    window.history.go(-1);
  }
}

