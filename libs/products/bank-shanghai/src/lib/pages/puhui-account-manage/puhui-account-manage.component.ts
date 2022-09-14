/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\products\bank-shanghai\src\lib\pages\puhui-account-manage\puhui-account-manage.component.ts
* @summary：普惠通账户管理
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                 hucongying          init          2021-07-02
***************************************************************************/
import { ChangeDetectorRef } from "@angular/core";
import { ViewContainerRef } from "@angular/core";
import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { XnFormUtils } from "libs/shared/src/lib/common/xn-form-utils";
import { XnModalUtils } from "libs/shared/src/lib/common/xn-modal-utils";
import { XnUtils } from "libs/shared/src/lib/common/xn-utils";
import { CheckersOutputModel } from "libs/shared/src/lib/config/checkers";
import { AccountStatusEnum, ModifyBindStatusEnum, RetCodeEnum, TabIndexEnum } from "libs/shared/src/lib/config/enum";
import { XnService } from "libs/shared/src/lib/services/xn.service";
import { ShEditModalComponent } from "../../share/modal/edit-modal.component";
import { BankAccountEditModalComponent } from "../../share/modal/puhui/edit-account-bank-modal.component";
import { showFields } from "./puhui-account-manage-config";
declare const moment: any;


/** 审核表单信息配置接口定义 */
export interface TitleModel {
  /** checkerId */
  checkerId: string,
  /** 标题 */
  title: string,
  /** 是否需要展示审核按钮 */
  needCheck: boolean,
}

/** 审核信息分类配置 */
const titleModel: TitleModel[] = [
  { checkerId: 'orgName', title: '企业信息', needCheck: true, },
  { checkerId: 'shrhldList', title: '股东信息', needCheck: false, },
  { checkerId: 'bankAccountNo', title: '绑定对公账号信息', needCheck: false, },
  { checkerId: 'earningOwnerList', title: '受益人信息', needCheck: true, },
  { checkerId: 'appApplyType', title: '经办人信息', needCheck: true, },
  { checkerId: 'socieBankAccountNo', title: '对公账户激活', needCheck: true, },
]
@Component({
  templateUrl: './puhui-account-manage.component.html',
  styles: [
    `
      ::ng-deep .ant-modal-close-x {
        padding: 10px;
      }
      ::ng-deep ant-tabs-tab {
        padding: 10px;
      }
      .rowTitle {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        border-bottom: 1px solid #f0f0f0;
        margin-bottom: 5px;
      }
      .checkerTitle {
        width: 150px;
        display: flex;
        justify-content: space-between;
      }
    `,
  ],
})
export class PuhuiAccountManageComponent implements OnInit {
  /** 企业 appId */
  public appId: string | number = this.xn.user.appId || '';
  // 审核表单信息配置
  public titleModel: TitleModel[] = XnUtils.deepClone(titleModel);
  // showFields
  public showFields: CheckersOutputModel[] = XnUtils.deepClone(showFields);
  // 分步展示的表单
  public checkShows: CheckersOutputModel[] = [];
  // 账户详情信息
  public fetchShowData: any = {} as any;
  // mainForm
  public mainForm: FormGroup;
  // svrConfig
  public svrConfig: any = {} as any;
  // 对公账户激活状态,默认未通过状态
  public eAccountStatus: number = AccountStatusEnum.UNPASS;
  // 开户审核状态
  public checkStatus: number = AccountStatusEnum.ACTIVED;
  // 修改已激活账号绑定卡状态
  public modifyBindStatus: number = ModifyBindStatusEnum.NEED_ACTIVE;
  public loading: boolean = true;
  // 已过打款激活日期，需要申请重新激活
  public needReActive: boolean = false;
  // 打款日期
  public paymentDate: string = '';

  constructor(
    private xn: XnService,
    private cdr: ChangeDetectorRef,
    private vcr: ViewContainerRef,) { }
  async ngOnInit() {
    this.fetchShowData = await this.fetchData();
    this.loading = false;
    if (this.eAccountStatus) {
      // 审核通过需要展示开户详情
      this.buildForm();
      this.showReActiveModal();
    }
    this.cdr.markForCheck();
  }

  /**
   * 获取开户详情信息
   * @param
   * @summary
   */
  public fetchData() {
    return new Promise((resolve, reject) => {
      this.xn.loading.open();
      this.xn.dragon
        .post('/shanghai_bank/sh_general/shEAccountInfo', { appId: this.appId })
        .subscribe(
          (x) => {
            this.xn.loading.close();
            if (x.ret === RetCodeEnum.OK) {
              this.eAccountStatus = x.data.eAccountStatus;
              this.checkStatus = x.data.status;
              this.modifyBindStatus = x.data.modifyBindStatus;
              resolve(x.data);
            } else {
              resolve({});
            }
          },
          (err) => {
            resolve({});
            this.xn.loading.close();
          }
        );
    });
  }

  /**
   * 修改绑定对公账号
   */
  editAccountNo() {

    if (this.eAccountStatus === AccountStatusEnum.NEED_ACTIVE) {
      // 已开户未激活修改绑定对公账号
      const params = {
        title: '修改绑定对公账号',
        checker: [
          {
            checkerId: "account",
            required: 1,
            type: "text",
            title: "绑定银行对公账号",
            value: this.fetchShowData['bankAccountNo']
          },
          {
            checkerId: "acctBank",
            required: 1,
            type: "dragon-select-search",
            title: "开户银行",
            options: { readonly: false, ref: "acctBank" },
            value: this.fetchShowData['acctBank']
          },
        ],
        buttons: ['取消', '确定'],
      };
      XnModalUtils.openInViewContainer(this.xn, this.vcr, ShEditModalComponent, params).subscribe(v => {
        if (v) {
          this.xn.loading.open();
          this.xn.dragon.post('/shanghai_bank/sh_bank_gateway/shPHModifyBindCard',
            { appId: this.xn.user.appId, ...v }
          ).subscribe(res => {
            this.xn.loading.close();
            if (res.ret === RetCodeEnum.OK) {
              this.xn.msgBox.open(false, '修改成功！', async () => {
                this.fetchShowData = await this.fetchData();
                this.buildForm();
                this.cdr.markForCheck();
              })
            }
          })
        }
      });
    } else {
      // 已开户已激活修改绑定对公账号
      XnModalUtils.openInViewContainer(this.xn, this.vcr,
        BankAccountEditModalComponent,
        { title: '修改绑定对公账号', data: this.fetchShowData }
      ).subscribe(async v => {
        this.fetchShowData = await this.fetchData();
        this.buildForm();
        this.cdr.markForCheck();
      });
    }
  }

  showReActiveModal() {
    if (this.modifyBindStatus === ModifyBindStatusEnum.NEED_ACTIVE) {
      // 修改已激活账号,展示重新激活打款信息
      XnModalUtils.openInViewContainer(this.xn, this.vcr,
        BankAccountEditModalComponent,
        { title: '温馨提示', data: this.fetchShowData, showReActiveFrom: true }
      ).subscribe(v => { });
    }
  }

  /**
   * 构建表单
   * @param
   */
  buildForm() {
    try {
      this.showFields = XnUtils.deepClone(showFields);
      // checker配置项赋值
      Object.keys(this.fetchShowData).forEach((key) => {
        this.showFields.forEach((checker) => {
          if (checker.checkerId === key) {
            checker.value = this.fetchShowData[key];
            if (checker.checkerId === 'shrhldList') {
              // 股东信息
              checker.value = JSON.stringify(this.fetchShowData[key]);
            } else if (checker.checkerId === 'earningOwnerList') {
              // 受益人信息
              checker.value = JSON.stringify(this.fetchShowData[key]);
            } else if (checker.checkerId === 'actiDeadline') {
              // 打款日期处理
              checker.value = this.formatActiDeadline(this.fetchShowData[key]);
              this.paymentDate = checker.value;
            }
          } else if (checker.checkerId === 'socieBankAccountNo') {
            // 绑定银行对公账号
            checker.value = this.fetchShowData['bankAccountNo'];
          } else if (checker.checkerId === 'socieAcctBank') {
            // 开户银行
            checker.value = this.fetchShowData['acctBank'];
          }

        });
      });
      this.checkShows = this.showFields.slice(0, 16);
    } catch (error) {
      this.checkShows = [];
    } finally {
      for (const row of this.showFields) {
        XnFormUtils.convertChecker(row);
      }
      this.mainForm = XnFormUtils.buildFormGroup(this.showFields);
    }
  }

  /**
   * tabchange事件,切换tab标签,截取展示对应步骤show信息
   * @param e
   */
  onTabChange(e: any) {
    switch (e.index) {
      // 企业信息
      case TabIndexEnum.FIRST:
        this.checkShows = this.showFields.slice(0, 16);
        break;
      // 受益人信息
      case TabIndexEnum.SECOND:
        this.checkShows = this.showFields.slice(16, 17);
        break;
      // 经办人信息
      case TabIndexEnum.THIRD:
        this.checkShows = this.showFields.slice(17, 33);
        break;
      // 对公账户信息
      case TabIndexEnum.FOURTH:
        this.checkShows = this.showFields.slice(-8);
        break;

      default:
        this.checkShows = this.showFields.slice(0, 16);
        break;
    }
  }

  /**
   * 标题样式判断
   * @param row
   * @returns
   */
  showMaxRow(row: any) {
    // shrhldList: 股东信息 earningOwnerList: 受益人信息
    return row.checkerId === 'shrhldList' ||
      row.checkerId === 'earningOwnerList'
      ? true
      : false;
  }

  /**
   * 是否是未开户状态
   * @returns
   */
  isUnOpen() {
    return XnUtils.isEmptyObject(this.fetchShowData);
  }

  /**
   * 发起普惠开户申请
   */
  newAccountFlow(): void {
    this.xn.router.navigate([`/bank-shanghai/record/new/puhui`], {
      queryParams: {
        id: 'sub_sh_prattwhitney_input',
        appId: this.appId,
      },
    });
  }

  /**
   * 打款日期过滤
   */
  formatActiDeadline(actiDeadline: string) {
    if (!actiDeadline) {
      return ''
    } else if (actiDeadline.length === 6) {
      // YYYYMMDD
      const dateStr = this.getDateStr(actiDeadline);
      return dateStr;
    } else if (actiDeadline.includes('1970')) {
      const dateStr = this.getDateStr(new Date(actiDeadline).getTime().toString());
      return dateStr;
    } else {
      const timestamp = new Date(actiDeadline).getTime();
      return moment(timestamp).format('YYYY年MM月DD日前');
    }
  }

  /**
   * YYYYMMDD转成YYYY年MM月DD日
   * @param dateStr
   * @returns
   */
  getDateStr(dateStr: string) {
    // 年
    const year = dateStr.substr(0, 4);
    // 月
    const mounth = dateStr.substr(4, 2);
    // 日
    const day = dateStr.substr(-2);
    // 转时间戳
    const paymentDate = new Date(`${year}-${mounth}-${day}`).getTime();
    const today = new Date().getTime();
    // 判断是否已过打款日期
    this.needReActive = today - paymentDate > 0 ? true : false;
    // 拼接展示打款日期
    return `${year}年${mounth}月${day}日前`;
  }

  /**
   * 打款提示
   * @returns
   */
  showPamentTip() {
    return this.eAccountStatus === AccountStatusEnum.NEED_ACTIVE;
  }

  /**
   * 已过打款激活日期，申请重新激活
   */
  reActiveAct() {
    // 绑定账号修改申请激活
    this.xn.loading.open();
    this.xn.dragon.post2('/shanghai_bank/sh_bank_gateway/shPHAccountReActive', { appId: this.xn.user.appId }).subscribe(async res => {
      this.xn.loading.close();
      if (res.ret === RetCodeEnum.OK) {
        this.xn.msgBox.open(false, '激活成功！', async () => {
          this.buildForm();
          this.cdr.markForCheck();
        })
      }
    }, () => {
      this.xn.loading.close();
    })
  }
}
