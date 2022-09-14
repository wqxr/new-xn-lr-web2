/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\products\bank-shanghai\src\lib\share\modal\puhui\edit-account-bank-modal.component.ts
* @summary：修改绑定对公账号modal
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                 hucongying          init          2021-07-23
***************************************************************************/

import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ModalComponent, ModalSize } from 'libs/shared/src/lib/common/modal/components/modal';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { CheckersOutputModel } from 'libs/shared/src/lib/config/checkers';
import { AppApplyTypeEnum, RetCodeEnum } from 'libs/shared/src/lib/config/enum';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { SoEditShowFields, reActiveShowFields, resultShowFields } from './edit-account-bank-modal-config';




/**
 *  参数默认
 */
export class EditParamInputModel {
  /** 标题 */
  public title?: string;
  public data?: any;
  /** 输入项 */
  public checker: CheckersOutputModel[];
  /** 弹框大小配置 */
  public size?: any;
  public showReActiveFrom?: boolean;
  constructor() {
    this.size = ModalSize.Large;
    this.showReActiveFrom = false;
  }
}
@Component({
  templateUrl: './edit-account-bank-modal.component.html',
  styles: [
    `
    ::ng-deep .cdk-overlay-container {
      z-index: 2000;
    }
    ::ng-deep .ant-cascader-menus {
      z-index: 2000;
    }
    `
  ]
})
export class SoBankAccountEditModalComponent {
  @ViewChild('modal') modal: ModalComponent;
  public params: EditParamInputModel = new EditParamInputModel();
  private observer: any;
  // editForm
  public editForm: FormGroup;
  public resultForm: FormGroup;
  public reActiveFrom: FormGroup;
  // 修改对公账号
  public editShowFields: CheckersOutputModel[] = XnUtils.deepClone(SoEditShowFields);
  // 确认电子账户
  public resultShowFields: CheckersOutputModel[] = XnUtils.deepClone(resultShowFields)
  // 确认电子账户
  public reActiveShowFields: CheckersOutputModel[] = XnUtils.deepClone(reActiveShowFields)
  public showEditForm = false;
  public showResultFrom = false;
  public showReActiveFrom = false;
  public svrConfig: any = {
    editShowFields: [],
    resultShowFields: []
  };
  // 按钮文案
  public btnText: string = '获取验证码';
  public showCodeBtn: boolean = false;
  public time: number = 0;
  public timeId: any = null;
  // 打款日期
  public paymentDate: string = '';
  // 已过打款激活日期，需要申请重新激活
  public needReActive: boolean = false;
  // 开户信息详情
  public shEAccountInfo: any = {} as any;

  constructor(
    private cdr: ChangeDetectorRef,
    private xn: XnService,
  ) { }

  /**
   * open modal
   * @param params
   * @returns
   */
  open(params: EditParamInputModel): Observable<any> {
    this.params = Object.assign({}, this.params, params);
    this.showReActiveFrom = this.params.showReActiveFrom;
    this.getActInfo(this.params.data);
    if (this.showReActiveFrom) {
      this.buildFrom(this.reActiveShowFields, 'reActiveShowFields', 'reActiveFrom');
    } else {
      this.buildFrom(this.editShowFields, 'editShowFields', 'editForm');
      this.showEditForm = true;
      this.showReActiveFrom = false;
    }
    this.modal.open(this.params.size);
    this.cdr.markForCheck();
    return Observable.create(observer => {
      this.observer = observer;
    });
  }

  /**
   * 确定激活关闭弹窗
   */
  showAccount() {
    this.close({ ok: true });
  }

  /**
   * 上一步
   */
  toFrist() {
    this.saveFromValue(this.resultShowFields, this.resultForm);
    this.showResultFrom = false;
    this.showReActiveFrom = false;
    this.buildFrom(this.editShowFields, 'editShowFields', 'editForm');
    this.showEditForm = true;
    this.cdr.markForCheck();
  }

  /**
   *
   * 下一步，激活修改绑定对公账号
   * 展示打款电子账户
   */
  activeAccount() {
    this.clearTime();
    this.saveFromValue(this.editShowFields, this.editForm);
    const actInfo = this.editForm.value;
    // 已开户已激活修改绑定对公账号
    this.xn.loading.open();
    this.xn.dragon.post2('/shanghai_bank/so_bank_gateway/shPHModifyBindAccount', { appId: this.xn.user.appId, ...actInfo }).subscribe(async res => {
      this.xn.loading.close();
      if (res.ret === RetCodeEnum.OK) {
        this.xn.msgBox.open(false, '修改成功！', async () => {
          this.saveFromValue(this.editShowFields, this.editForm);
          // 获取电子账户信息
          this.shEAccountInfo = await this.fetchData();
          this.getActInfo(this.shEAccountInfo);
          this.buildFrom(this.resultShowFields, 'resultShowFields', 'resultForm');
          this.showEditForm = false;
          this.showReActiveFrom = false;
          this.showResultFrom = true;
          this.cdr.markForCheck();
        })
      }
    }, () => {
      this.xn.loading.close();
    })

  }

  /**
   * 获取电子账户信息
   */
  getActInfo(fetchData: any) {
    this.shEAccountInfo = XnUtils.deepClone(fetchData);
    const actiDeadline = this.showReActiveFrom ? fetchData.modifyBindActiDeadline : fetchData.actiDeadline;
    this.paymentDate = this.formatActiDeadline(actiDeadline);
    // checker配置项赋值
    this.getFormValue(fetchData, 'editShowFields');
    this.getFormValue(fetchData, 'resultShowFields');
    this.getFormValue(fetchData, 'reActiveShowFields');
  }

  /**
   * 打款日期过滤
   */
  formatActiDeadline(actiDeadline: string) {
    if (!actiDeadline) {
      return ''
    } else if (actiDeadline.length === 8) {
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
   * 表单赋值
   * @param fetchData 开户详情信息
   * @param fields
   */
  getFormValue(fetchData: any, fields: string) {
    Object.keys(fetchData).forEach((key) => {
      this[fields].forEach((checker: any) => {
        if (checker.checkerId === key) {
          checker.value = fetchData[key];
          // 打款日期
          if (key === 'actiDeadline') {
            checker.value = this.paymentDate;
          }
        } else if (checker.checkerId === 'account') {
          // 绑定银行对公账号
          checker.value = fetchData['bankAccountNo'];
        } else if (checker.checkerId === 'operatorName') {
          // 操作员姓名,经办类型是经办人办理取经办人姓名,法人亲办取法人姓名
          checker.value = fetchData['appApplyType'] === AppApplyTypeEnum.LEGAL_PERSON ?
            fetchData['corpName'] : fetchData['checkerName']
        }
      });
    });
  }

  /**
   * 已过打款激活日期，申请重新激活
   */
  reActiveAct() {
    // 绑定账号修改申请激活
    this.xn.loading.open();
    this.xn.dragon.post2('/shanghai_bank/so_bank_gateway/shPHAccountReActive', { appId: this.xn.user.appId }).subscribe(async res => {
      this.xn.loading.close();
      if (res.ret === RetCodeEnum.OK) {
        this.xn.msgBox.open(false, '激活成功！', async () => {
          // 需要重新获取电子账户信息
          this.shEAccountInfo = await this.fetchData();
          this.getActInfo(this.shEAccountInfo);
          this.buildFrom(this.resultShowFields, 'resultShowFields', 'resultForm');
          this.cdr.markForCheck();
        })
      }
    }, () => {
      this.xn.loading.close();
    })
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
        .post('/shanghai_bank/sh_general/shEAccountInfo', { appId: this.xn.user.appId })
        .subscribe(
          (x) => {
            this.xn.loading.close();
            if (x.ret === RetCodeEnum.OK) {
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
   * @param checkers 表单配置项
   * @param checkerName 表单类别
   * @param mainForm editForm/resultForm
   */
  buildFrom(checkers: CheckersOutputModel[], checkerName: string, mainFormType: string) {
    XnFormUtils.buildSelectOptions(checkers);
    this.buildChecker(checkers);
    this.svrConfig[checkerName] = XnUtils.deepClone(checkers);
    this[mainFormType] = XnFormUtils.buildFormGroup(checkers);
  }

  /**
   * 保存当前表单的值
   * @param checkers 表单配置项
   * @param mainForm editForm/resultForm
   */
  saveFromValue(checkers: CheckersOutputModel[], mainForm: FormGroup) {
    const fromValue = mainForm.value;
    if (fromValue) {
      Object.keys(fromValue).forEach(key => {
        checkers.forEach(ckecker => {
          if (ckecker.checkerId === key) {
            ckecker.value = fromValue[key]
          }
        })
      })
    }
  }

  /**
   *  取消
   */
  public handleCancel() {
    this.close(null);
  }

  private buildChecker(stepRows) {
    for (const row of stepRows) {
      XnFormUtils.convertChecker(row);
    }
  }

  /**
  * 获取验证码
  */
  sendCode() {
    // 修改绑定对公账号，获取操作员手机号验证码
    this.xn.dragon.post('/shanghai_bank/so_bank_gateway/shPHDynamicCode', { appId: this.xn.user.appId }).subscribe(res => { })
    // 60s倒计时
    this.time = 60;
    this.timeId = setInterval(() => {
      --this.time;
      if (this.time <= 0) {
        this.clearTime();
      } else {
        this.showCodeBtn = true;
        this.btnText = `${this.time}秒后可重发`;
      }
    }, 1000);
  }

  /**
   * 验证码重置
   */
  clearTime() {
    clearInterval(this.timeId);
    this.timeId = null;
    this.btnText = `获取验证码`;
    this.showCodeBtn = false;
  }

  private close(value) {
    this.modal.close();
    this.observer.next(value);
    this.observer.complete();
  }
}
