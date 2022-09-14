/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：profit-table-input.component.ts
 * @summary： 账号变更
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                    wq             增加             2020-02-14
 * **********************************************************************
 */

import {
  Component,
  ElementRef,
  Input,
  OnInit,
  AfterViewChecked,
  AfterViewInit,
  ViewContainerRef,
  ChangeDetectorRef,
} from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { isNullOrUndefined } from 'util';

import { DragonChoseAccountinfoComponent } from '../../../modal/dragon-chose-accountinfo.modal';
import { DynamicForm } from '../../../../../common/dynamic-form/dynamic.decorators';
import { XnInputOptions } from '../../../../form/xn-input.options';
import { SelectOptions } from '../../../../../config/select-options';
import { XnService } from '../../../../../services/xn.service';
import { PublicCommunicateService } from '../../../../../services/public-communicate.service';
import { XnUtils } from '../../../../../common/xn-utils';
import { XnFormUtils } from '../../../../../common/xn-form-utils';
import { XnModalUtils } from '../../../../../common/xn-modal-utils';
import { IsPreTrade } from 'libs/shared/src/lib/config/enum';
@Component({
  // selector: 'vanke-compare-info-component',
  templateUrl: './vanke-compare-info.component.html',
  styles: [
    `
      .button-reset-style {
        font-size: 12px;
        padding: 5px 35px;
        color: #3c8dbc;
      }

      .tip-memo {
        color: #9a9a9a;
      }
      .tag-color {
        color: #f20000;
      }
      .noneborder td {
        width: 700px;
        padding-top: 8px;
        padding: 8px;
        line-height: 1.42857143;
        vertical-align: top;
      }
      .noneborder th {
        width: 700px;
        padding-top: 8px;
        padding: 8px;
        line-height: 1.42857143;
        vertical-align: top;
      }
      .required-star:after {
        content: '*';
        color: red;
      }
      .table-height {
        max-height: 600px;
        overflow: scroll;
      }
    `,
  ],
})
@DynamicForm({
  type: ['compare-info'],
  formModule: 'dragon-input',
})
export class VankechangeAccountComponent
  implements OnInit, AfterViewChecked, AfterViewInit
{
  @Input() row: any;
  @Input() form: FormGroup;
  @Input() svrConfig: any;
  public alert = ''; // 提示
  public alert1 = ''; // 提示
  public ctrl: AbstractControl;
  public ctrl1: AbstractControl;

  public xnOptions: XnInputOptions;
  public certificateitem: any; // 获取合同信息
  public Tabconfig: any;
  currentTab: any; // 当前标签页
  data: any[] = [];
  datavalue: any;
  selectOptions: any[] = [];
  selectValue = '';
  // 判断是否是excel格式
  isExcel = false;
  successnum: number;
  failnum: number;
  // 批量验证按钮状态
  // 全选按钮控制状态
  public unfill = false;
  headLeft = 0;
  // 记录流程ID
  flowId: string;
  constructor(
    private xn: XnService,
    private er: ElementRef,
    private vcr: ViewContainerRef,
    private cdr: ChangeDetectorRef,
    private publicCommunicateService: PublicCommunicateService
  ) {}
  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }
  ngAfterViewInit() {
    if (this.svrConfig.isPreTrade === IsPreTrade.YES) {
      this.inputChange({ target: { value: 1 } });
    }
  }
  public ngOnInit() {
    this.flowId = this.row.flowId;
    this.ctrl = this.form.get(this.row.name);
    this.ctrl1 = this.form.get('tripleAgreement');
    this.selectOptions = this.isJdFlow()
      ? SelectOptions.get('changeReasonGemdal')
      : SelectOptions.get('changeReason');
    this.datavalue = JSON.parse(this.row.value);

    this.fromValue();
  }
  private isJdFlow() {
    return (
      this.flowId === 'sub_jd_change' ||
      this.flowId === 'sub_jd_change_verification' ||
      this.flowId === 'sub_factoring_change_jd_520' ||
      this.flowId === 'sub_financing_sign_jd_520' ||
      this.flowId === 'sub_customer_verify_jd_520' ||
      this.flowId === 'sub_financing_verify_jd_520'
    );
  }
  private fromValue() {
    this.datavalue = XnUtils.parseObject(this.ctrl.value, []);

    this.toValue();
  }
  // 上传完后取回值
  private toValue() {
    const isOk = [this.datavalue.new].some(
      (val) =>
        val.receiveOrg !== '' &&
        val.receiveAccount !== '' &&
        val.receiveBank !== ''
    );
    this.alert1 = this.datavalue.changeReason !== '' ? '' : '请选择变更原因';
    if (isOk && this.datavalue.changeReason !== '') {
      this.ctrl.setValue(JSON.stringify(this.datavalue));
    } else {
      this.ctrl.setValue('');
    }
    this.ctrl.markAsTouched();
    this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
  }

  public inputChange(e) {
    console.log('执行了吗', e.target.value);
    this.datavalue.changeReason = e.target.value;
    this.publicCommunicateService.change.emit(e.target.value);
    this.toValue();
  }
  // FIXME: 废弃
  // public onBlur() {
  //   if (this.datavalue.receiveOrg === '' || this.datavalue.receiveAccount === ''
  //       || this.datavalue.receiveBank === '' || this.datavalue.receiveBankNo === '') {
  //       this.datavalue = XnUtils.parseObject(this.ctrl.value, []);
  //   } else {
  //       //this.toValue();
  //   }
  // }
  /**
   * 计算表格合并项
   * currentSubTab.headText.length + 可选择1 + 序号1 + 行操作+1
   */
  public calcAttrColspan(tabconfig): number {
    const nums: number = tabconfig.headText.length + 1;
    return nums;
  }

  // 选择收款账户
  handleAdd() {
    if (!this.datavalue.changeReason) {
      this.alert1 = '请选择变更原因';
      return;
    }
    this.alert1 = '';
    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      DragonChoseAccountinfoComponent,
      { isPreTrade: this.svrConfig.isPreTrade }
    ).subscribe((v) => {
      if (!v || v === null || !v.length) {
        return;
      } else {
        this.datavalue.new.receiveOrg = v[0].accountName;
        this.datavalue.new.receiveAccount = v[0].cardCode;
        this.datavalue.new.receiveBank = v[0].bankName;
        this.datavalue.new.receiveBankNo = v[0].bankCode;
        // this.datavalue.new.bankId = v[0].bankCode;
        this.toValue();
        this.cdr.markForCheck();
      }
    });
  }
}
