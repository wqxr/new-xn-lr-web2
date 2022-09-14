/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\products\huaqiaocheng-shanghai\src\lib\pages\puhui-company-list\account-detail\account-detail.component.ts
* @summary：普惠开户账户详情页面
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                 hucongying          init           2021-07-21
***************************************************************************/

import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { AccountStatusEnum, RetCodeEnum, TabIndexEnum } from 'libs/shared/src/lib/config/enum';
import { showFields } from './account-detail-config'
import { CheckersOutputModel } from 'libs/shared/src/lib/config/checkers';
import { FormGroup } from '@angular/forms';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
declare const $: any;
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
  { checkerId: 'socieBankAccountNo', title: '对公账户信息', needCheck: true, },
]

@Component({
  selector: 'oct-account-detail',
  templateUrl: `./account-detail.component.html`,
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
        padding: 10px 50px;
        border-bottom: 1px solid #f0f0f0;
        margin-bottom: 5px;
      }
    `,
  ],
})
export class OctPuhuiAccountDetailComponent implements OnInit {
  // appId
  public appId: string = '';
  // 审核表单信息配置
  public titleModel: TitleModel[] = XnUtils.deepClone(titleModel);
  // showFields
  public showFields: CheckersOutputModel[] = XnUtils.deepClone(showFields);
  // 分步展示的表单
  public checkShows: CheckersOutputModel[] = [];
  // fetchShowData
  public fetchShowData: any = {} as any;
  // mainForm
  public mainForm: FormGroup;
  // svrConfig
  public svrConfig: any = {} as any;
  // 对公账户激活状态,默认未通过状态
  public eAccountStatus: number = AccountStatusEnum.UNPASS;
  // 打款日期
  public paymentDate: string = '';
  // 已过打款激活日期，需要申请重新激活
  public needReActive: boolean = false;
  constructor(
    private cdr: ChangeDetectorRef,
    private xn: XnService,
    private router: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.router.queryParams.subscribe((v) => {
      this.appId = v.appId;
    });
    this.buildForm();
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
        .post('/shanghai_bank/so_general/shEAccountInfo', { appId: this.appId })
        .subscribe(
          (x) => {
            this.xn.loading.close();
            if (x.ret === RetCodeEnum.OK) {
              this.eAccountStatus = x.data.eAccountStatus;
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
   * 构建表单
   * @param
   */
  async buildForm() {
    this.fetchShowData = await this.fetchData();
    try {
      // checker配置项赋值
      Object.keys(this.fetchShowData).forEach((key) => {
        this.showFields.forEach((checker) => {
          if (checker.checkerId === key) {
            checker.value = this.fetchShowData[key];
            if (checker.checkerId === 'shrhldList') {
              checker.value = JSON.stringify(this.fetchShowData[key]);
            }
            if (checker.checkerId === 'earningOwnerList') {
              checker.value = JSON.stringify(this.fetchShowData[key]);
            }
            if (checker.checkerId === 'actiDeadline') {
              checker.value = this.formatActiDeadline(this.fetchShowData[key]);
              this.paymentDate = checker.value;
            }
          } else if (checker.checkerId === 'socieBankAccountNo') {
            checker.value = this.fetchShowData['bankAccountNo'];
          } else if (checker.checkerId === 'socieAcctBank') {
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
      // 拼接展示打款日期
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
    // 拼接展示打款日期
    return `${year}年${mounth}年${day}日前`;
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

  goBack() {
    window.history.go(-1);
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
}



