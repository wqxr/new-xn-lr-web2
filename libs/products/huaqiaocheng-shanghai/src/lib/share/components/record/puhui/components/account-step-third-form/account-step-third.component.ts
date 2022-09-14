/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\products\bank-shanghai\src\lib\share\components\record\puhui\components\account-step-third-form\account-step-third-form.component.ts
* @summary：发起普惠开户流程第三步
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                 hucongying          init          2021-07-09
***************************************************************************/
import { Component, OnInit, Input, AfterViewChecked } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PublicCommunicateService } from 'libs/shared/src/lib/services/public-communicate.service';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { CheckersOutputModel } from 'libs/shared/src/lib/config/checkers';
import { StepValueEnum } from '../../new-puhui.component';
import { applyFactoringTtype } from 'libs/shared/src/lib/config/select-options';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import XnFlowUtils from 'libs/shared/src/lib/common/xn-flow-utils';
import { ChangeDetectorRef } from '@angular/core';
import { ApplyTypeEnum, ProcduresIdEnum, RetCodeEnum, ShPuhuiFlowIdEnum } from 'libs/shared/src/lib/config/enum';
import { NzModalService } from 'ng-zorro-antd/modal';

// 授权经办人信息相关字段
export const manegerCheckersConfig = [
  /** 经办人姓名 */
  { checkerId: 'checkerName', value: '' },
  /** 经办人手机号码 */
  { checkerId: 'checkerMobile', value: '' },
  /** 验证码 */
  { checkerId: 'checkerCFCACode', value: '' },
  /** 经办人证件号码  */
  { checkerId: 'checkerIdCard', value: '' },
  /** 经办人证件到期日 */
  { checkerId: 'checkerIdLimitDate', value: '' },
  /** 经办人证件正面图片 */
  { checkerId: 'checkerIdFrontImg', value: '' },
  /** 经办人证件反面图片 */
  { checkerId: 'checkerIdBackImg', value: '' },
  /** 企业授权书 */
  { checkerId: 'delegationImg', value: '' }
];

@Component({
  selector: 'oct-account-step-third',
  templateUrl: './account-step-third.component.html',
  styles: [
    `
    .checkerTitle {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0px 50px;
    }
    .checkerHead{
      padding-bottom: 10px;
      border-bottom: 1px solid #aaa;
    }
    `
  ]
})
export class OctAccountStepThirdComponent implements OnInit, AfterViewChecked {
  public formModule = 'dragon-input';
  /** mainForm */
  public mainForm: FormGroup;
  /** rows checker项 */
  @Input() svrConfig: any;
  // true：新发起流程 false：资料补正编辑流程
  @Input() newFlow: boolean = true;
  @Input() readonly: boolean = false;
  // 表单配置
  public thirdRows: CheckersOutputModel[] = [];

  constructor(
    private xn: XnService,
    private cdr: ChangeDetectorRef,
    private NzModal: NzModalService,
    private publicCommunicateService: PublicCommunicateService) { }

  ngOnInit() {
    this.buildRows();
  }

  ngAfterViewChecked(): void {
    this.cdr.detectChanges()
  }

  // 下载模板
  downloadTp() {
    const evt = document.createEvent('MouseEvents');
    evt.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    const link = document.createElement('a');
    link.download = '上海银行-链融平台普惠记账簿开户指引.pdf';
    link.href = '/assets/lr/doc/bank-sh/上海银行-链融平台普惠记账簿开户指引【1.0】.pdf';
    link.dispatchEvent(evt);
  }

  /**
   * 构建表单
   */
  private buildRows(): void {
    this.thirdRows = XnUtils.deepClone(this.svrConfig.checkers.slice(17, 34));
    this.thirdRows.forEach(show => {
      if (show.checkerId === 'appApplyType') {
        delete show.options.readonly;
      } else {
        show.options.readonly = this.readonly;
      }
    });
    this.mainForm = XnFormUtils.buildFormGroup(this.thirdRows);
    // 切换办理类型
    this.mainForm.get('appApplyType').valueChanges.subscribe(v => {
      // 法人亲办,清空经办人信息
      if (Number(v) === Number(ApplyTypeEnum.LEGAL_PERSON)) {
        this.applyTypeChange()
      }
    })
  }

  /**
   * 切换办理类型相关判断
   */
  applyTypeChange() {
    const formValue = XnUtils.deepClone(this.mainForm.value);
    if (!formValue) {
      return
    }
    // 授权经办人信息相关字段
    const manegerCheckers = XnUtils.deepClone(manegerCheckersConfig);
    // 缓存经办人信息
    for (const key in formValue) {
      manegerCheckers.map(t => {
        if (t.checkerId === key) {
          t.value = formValue[key]
        }
      })
    }
    const haveManegerValue = manegerCheckers.some(x => x.value);
    // 如果有填写经办人信息，需要提示
    if (haveManegerValue) {
      let that = this;
      this.NzModal.confirm({
        nzTitle: '<i>确定要将办理类型切换为法人亲办吗?</i>',
        nzContent: '<b>切换后会将已填写的授权经办人信息清空</b>',
        nzOnOk: () => {
          // 清空经办人信息
          for (const item of manegerCheckers) {
            that.mainForm.get(item.checkerId).setValue('');
            that.svrConfig.checkers.forEach(show => {
              if (show.checkerId === item.checkerId) {
                show.value = '';
              }
            });
          }
        },
        nzOnCancel: () => {
          that.mainForm.get('appApplyType').setValue(ApplyTypeEnum.MANAGER);
          // 将已填写的经办人信息回显展示
          manegerCheckers.map(z => {
            if (z.value) {
              that.mainForm.get(z.checkerId).setValue(z.value);
            }
          })
          this.cdr.markForCheck();

        }
      })
    }

  }

  /**
   * 保存当前表单的值
   */
  saveForm() {
    const formValue = XnUtils.deepClone(this.mainForm.value);
    /** 表单内容赋值到svrConfig */
    for (const checker of this.svrConfig.checkers) {
      Object.keys(formValue).forEach(key => {
        if (checker.checkerId === key) {
          checker.value = formValue[key]
        }
      })
    }
  }

  /**
   * 提交处理
   */
  submitForm() {
    // 先保存当前步骤表单值
    this.saveForm()
    if (this.newFlow) {
      // 新流程
      this.newSubmit()
    } else {
      // 补正资料
      this.editSubmit()
    }
  }

  /**
   * 新发起流程提交数据
   */
  async newSubmit() {
    // 验证法人短信验证码
    const CFCACodeVaild = await this.verifySmsCode(this.svrConfig.checkers);
    if (CFCACodeVaild) {
      // 组装数据
      const checkersValue = {} as any;
      const checkers: CheckersOutputModel[] = XnUtils.deepClone(this.svrConfig.checkers);
      checkers.forEach(item => {
        checkersValue[item.checkerId] = item.value
      })

      // 构建参数
      const params: any = {
        flowId: ShPuhuiFlowIdEnum.SUB_SO_PRATTWHITNEY_INPUT,
        procedureId: this.svrConfig.procedure.procedureId,
        title: '普惠记账簿开户申请',
        memo: '',
        checkers: checkersValue,
        recordId: this.svrConfig?.record && this.svrConfig.record?.recordId || '',
      };
      // 多保理-添加保理商
      params['factoringAppId'] = applyFactoringTtype['上海银行'];
      // 加上loading
      this.xn.loading.open();
      console.log('puhui----------------', params);
      this.xn.api.dragon.post(`/flow/new`, params).subscribe(res => {
        this.xn.loading.close()
        if (res.ret === RetCodeEnum.OK) {
          // 调用复核接口，跳过复核阶段
          this.reviewSubmit(res.data.recordId);
        } else {
          this.xn.msgBox.open(false, '提交申请失败！')
        }
      });
    }

  }

  /**
   * 资料补正提交数据
   */
  async editSubmit() {
    if (this.readonly) {
      this.flowSubmit();
    } else {
      // 验证法人短信验证码
      const CFCACodeVaild = await this.verifySmsCode(this.svrConfig.checkers);
      if (CFCACodeVaild) {
        this.flowSubmit()
      }
    }
  }

  /**
   * 提交补正资料信息
   */
  flowSubmit() {
    // 组装数据
    const checkersValue = {} as any;
    const checkers: CheckersOutputModel[] = XnUtils.deepClone(this.svrConfig.checkers);
    checkers.forEach(item => {
      checkersValue[item.checkerId] = item.value
    })
    const params: any = {
      recordId: this.svrConfig.record.recordId,
      procedureId: this.svrConfig.procedure.procedureId,
      memo: '',
      checkers: checkersValue,
      contracts: this.svrConfig.contracts,
    };
    this.xn.loading.open()
    this.xn.api.dragon.post(`/flow/submit`, params).subscribe((x) => {
      this.xn.loading.close();
      if (x.ret === RetCodeEnum.OK) {
        // 调用复核接口，跳过复核阶段
        this.reviewSubmit(this.svrConfig.record.recordId);
      } else {
        this.xn.msgBox.open(false, '提交申请失败！')
      }
    });
  }

  /**
   * 复核数据
   * @param recordId
   */
  reviewSubmit(recordId: string) {
    const params: any = {
      recordId,
      procedureId: ProcduresIdEnum.REVIEW,
      memo: '',
      checkers: {},
    };
    this.xn.loading.open()
    this.xn.api.dragon.post(`/flow/submit`, params).subscribe((x) => {
      this.xn.loading.close();
      if (x.ret === RetCodeEnum.OK) {
        this.xn.msgBox.open(false, ['提交申请成功。', `审核时间为1-2个工作日，通过会有短信通知，即可登录平台激活账户`],
          () => {
            window.history.go(-1)
          }
        );
      } else {
        this.xn.msgBox.open(false, '提交申请失败！')
      }
    });
  }

  /**
   * 验证法人短信验证码
   * @param checkers
   * @returns
   */
  verifySmsCode(checkers: CheckersOutputModel[]) {
    const mobile = checkers.filter(x => x.checkerId === 'corpMobile').map(x => x.value)[0];
    const code = checkers.filter(x => x.checkerId === 'CFCACode').map(x => x.value)[0];
    return new Promise((resolve, reject) => {
      this.xn.dragon.post2('/shanghai_bank/sh_general/verifySmsCode', { mobile, code }).subscribe(
        res => {
          if (res.ret === RetCodeEnum.OK) {
            resolve(true)
          } else {
            resolve(false)
          }
        }, error => {
          resolve(false)
        })
    })
  }

  /**
   * 返回第二步
   */
  toSecond() {
    if (!this.readonly) {
      this.saveForm();
    }
    /** 把第三步表单值发射出去 */
    this.publicCommunicateService.change.emit({ svrConfig: this.svrConfig, step: StepValueEnum.SECOND });
  }

  /**
  * 返回
  */
  goBack() {
    window.history.go(-1)
  }

}


