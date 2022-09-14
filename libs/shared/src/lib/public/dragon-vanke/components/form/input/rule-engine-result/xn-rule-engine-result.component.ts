
/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\shared\src\lib\public\form\rule-engine-result\xn-rule-engine-result.component.ts
* @summary：规则引擎审核结果展示组件
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                 hucongying          init           2021-09-06
***************************************************************************/

import { Component, OnInit, ElementRef, Input, ChangeDetectorRef, } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { CheckersOutputModel } from 'libs/shared/src/lib/config/checkers';
import { ResultTypeEnum, RuleHandTypeEnum, RuleValidTypeEnum, StandCheckStatuEnum, StepRuleStatusEnum } from 'libs/shared/src/lib/config/enum';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { PublicCommunicateService } from 'libs/shared/src/lib/services/public-communicate.service';

@Component({
  selector: 'xn-rule-engine-result-input',
  templateUrl: './xn-rule-engine-result.component.html',
  styleUrls: ['./xn-rule-engine-result.component.css'],
})

@DynamicForm({ type: 'xn-rule-engine-result', formModule: 'dragon-input' })
export class XnRuleEngineResultInputComponent implements OnInit {
  @Input() row: any;
  @Input() form: FormGroup;
  @Input() svrConfig: any;
  public ctrl: AbstractControl;
  // 校验异常表单配置
  public showErrorFileds: CheckersOutputModel[] = [] as any;
  // 校验通过表单配置
  public showSuccessFileds: CheckersOutputModel[] = [] as any;
  // 异常表单
  public ruleErrorFrom: FormGroup;
  // 通过表单
  public ruleSuccessFrom: FormGroup;
  // 人工校验异常
  public artificialErrorFileds: CheckersOutputModel[] = [] as any;
  // 当前tab页 通过/异常
  public resultType: string = ResultTypeEnum.ERROR;
  // 规则引擎校验结果
  public rule_engine_data: any = {} as any;
  get readonly() {
    return this.row.options.readonly;
  }
  constructor(
    private er: ElementRef,
    private xn: XnService,
    private cdr: ChangeDetectorRef,
    private publicCommunicateService: PublicCommunicateService
  ) { }

  ngOnInit() {
    this.ctrl = this.form.get(this.row.name)
    if (this.row.value && JSON.parse(this.row.value)) {
      this.rule_engine_data = XnUtils.deepClone(JSON.parse(this.row.value))
      const rule_data = XnUtils.deepClone(JSON.parse(this.row.value));
      // 系统校验异常
      const errData = this.filterErrorData(rule_data.point_info, StepRuleStatusEnum.FAIL);
      // 人工校验异常
      const errDataArt = this.filterArtificialData(this.rule_engine_data.manualReview, StandCheckStatuEnum.ERROR);

      this.buildErrorFileds(errData, errDataArt);
      this.buildErrorForm();

      const rule_engine_data = XnUtils.deepClone(JSON.parse(this.row.value));
      // 系统校验成功
      const successRuleData = this.filterErrorData(rule_engine_data.point_info, StepRuleStatusEnum.PASS);
      // 人工校验成功
      const successRuleDataArt = this.filterArtificialData(this.rule_engine_data.manualReview, StandCheckStatuEnum.SUCCESS);
      this.buildSuccessFileds(successRuleData, successRuleDataArt);
      this.buildSuccessForm();

      this.validForm();
    }
  }
  /**
   * 规则引擎保存信息
   */
  saveFileds() {
    const value = this.bildFormValue();
    this.publicCommunicateService.change.emit({ formValue: JSON.stringify(value) });
  }

  /**
   * 校验异常的规则集信息
   * @param point_info 规则集信息
   * @param validate_result 规则校验结果
   * @returns
   */
  filterErrorData(point_info: any[], validate_result: Number) {
    const vaildData = [];
    point_info.map((point: any) => {
      // 规则集
      let rs_list = point.rs_list;
      // 过滤出校验 异常/通过的规则集
      rs_list = rs_list.map((rs: any) => {
        rs.rule_list = rs.rule_list.filter((rule: any) => {
          return rule.validate_result === validate_result
        })
        return rs
      }).filter((rs: any) => {
        return rs.rule_list.length > 0
      });
      if (rs_list.length) {
        vaildData.push({
          point_name: point.point_name,
          point_code: point.point_code,
          rs_list: rs_list
        })
      }
    })
    return vaildData
  }

  /**
   * 人工校验规则信息过滤
   * @param manualReview 文件分类信息
   * @param check_status 标准是否勾选
   * @returns
   */
  filterArtificialData(manualReview: any[], check_status: number) {
    const artificialData = XnUtils.deepClone(manualReview);
    if (manualReview.length) {
      let vaildData = [];
      vaildData = artificialData.map(standard => {
        standard.standardNameList = standard.standardNameList.filter(rule => {
          return rule.check_status === check_status
        })
        return standard;
      }).filter((standard: any) => {
        return standard.standardNameList.length
      });
      return vaildData
    } else {
      return []
    }
  }

  /**
   * 校验异常表单配置
   * @param errData
   */
  buildErrorFileds(errDataSys: any[], errDataArt: any[]) {
    // 系统检验异常
    errDataSys.map((point: any) => {
      const checker = {
        checkerId: point.point_code,
        required: 1,
        type: "rule-engine-error-sys",
        title: point.point_name,
        options: { readonly: this.readonly, },
        value: JSON.stringify(point),
      }
      this.showErrorFileds.push(checker)
    })
    if (errDataArt.length) {
      // 人工校验异常
      const checker = {
        checkerId: "manualReview",
        required: 1,
        type: "rule-engine-error-manager",
        title: "",
        options: { readonly: this.readonly, },
        value: JSON.stringify(errDataArt),
      }
      this.showErrorFileds.push(checker)
    }
    this.cdr.markForCheck()
  }

  /**
   * 校验通过表单配置
   * @param successRuleData  系统校验通过规则信息
   * @param successRuleDataArt 人工审核通过信息
   */
  buildSuccessFileds(successRuleData: any[], successRuleDataArt: any[]) {
    // 系统检验异常
    successRuleData.map((point: any) => {
      const checker = {
        checkerId: point.point_code,
        required: 1,
        type: "rule-engine-success-sys",
        title: point.point_name,
        options: { readonly: this.readonly, },
        value: JSON.stringify(point),
      }
      this.showSuccessFileds.push(checker)
    })
    if (successRuleDataArt.length) {
      // 人工校验异常
      const checker = {
        checkerId: "manualReview",
        required: 1,
        type: "rule-engine-success-artifical",
        title: "",
        options: { readonly: this.readonly, },
        value: JSON.stringify(successRuleDataArt),
      }
      this.showSuccessFileds.push(checker)
    }
    this.cdr.markForCheck()
  }

  /**
   * 构建异常表单
   */
  buildErrorForm() {
    for (const row of this.showErrorFileds) {
      XnFormUtils.convertChecker(row);
    }
    this.ruleErrorFrom = XnFormUtils.buildFormGroup(this.showErrorFileds);
    this.ruleErrorFrom.valueChanges.subscribe(value => {
      this.validForm()
    })
  }

  /**
   * 构建通过表单
   */
  buildSuccessForm() {
    for (const row of this.showSuccessFileds) {
      XnFormUtils.convertChecker(row);
    }
    this.ruleSuccessFrom = XnFormUtils.buildFormGroup(this.showSuccessFileds);
    this.ruleSuccessFrom.valueChanges.subscribe(value => {
      this.validForm()
    })
  }

  /**
   * 切换审核结果
   * @param resultType 通过/异常
   */
  changeTab(resultType: string) {
    this.resultType = resultType
    if (this.resultType === ResultTypeEnum.SUCCESS) {
      const errorFromValue = this.ruleErrorFrom?.value ? XnUtils.deepClone(this.ruleErrorFrom.value) : {};
      for (const key in errorFromValue) {
        this.showErrorFileds.map(show => {
          if (show.checkerId === key) {
            show.value = errorFromValue[key]
          }
        })
      }
      this.buildSuccessForm()
    } else {
      const successFromValue = this.ruleSuccessFrom?.value ? XnUtils.deepClone(this.ruleSuccessFrom.value) : {};
      for (const key in successFromValue) {
        this.showSuccessFileds.map(show => {
          if (show.checkerId === key) {
            show.value = successFromValue[key]
          }
        })
      }
      this.buildErrorForm()
    }
  }

  /**
   * 异常表单校验
   */
  validForm() {
    let flag = true;
    const formValue = XnUtils.deepClone(this.ruleErrorFrom.value)
    for (const key in formValue) {
      // 人工校验异常的
      if (key === 'manualReview') {
        const manualReview = JSON.parse(formValue[key])
        manualReview.map((item: any) => {
          item.standardNameList.map(stand => {
            if (!stand.check_status) {
              flag = (stand.file || stand.user_remark) ? flag : false;
            }
          })
        })
      } else {
        // 系统异常
        const point_info = JSON.parse(formValue[key])
        const rs_list = point_info['rs_list']
        rs_list.map((rs: { [x: string]: any[]; }) => {
          rs['rule_list'].map(rule => {
            if (!rule.validate_result) {
              // 非硬控的规则需要上传文件
              if (rule.validate_type === RuleValidTypeEnum.HARD_CONTROL) {
                /** 硬控 */
                flag = rule.file ? flag : false;
              } else if (rule.validate_type === RuleValidTypeEnum.STRONG_REMINDER) {
                const validate_type = rule['handle_type'].split(',');
                flag = (rule.user_remark || rule.file) ? flag : false;
                // /** 强提醒需要添加备注 */
                // flag = validate_type.includes(RuleHandTypeEnum.ADD_REMARK) ? rule.user_remark ? flag : false : flag;
                // /** 强提醒需要补充文件 */
                // flag = validate_type.includes(RuleHandTypeEnum.ADD_FILE) ? rule.file ? flag : false : flag;
              }
            }
          })
        })
      }
    }
    const value = this.bildFormValue();
    if (flag) {
      this.ctrl.setValue(JSON.stringify(value))
    } else {
      this.ctrl.setValue('')
    }
  }

  /**
   * 构建表单值
   * @returns
   */
  bildFormValue() {
    // 规则校验信息
    let ruleData = XnUtils.deepClone(this.rule_engine_data);
    // 校验异常信息
    const errorFormValue = XnUtils.deepClone(this.ruleErrorFrom.value);
    ruleData = this.filterRuleValue(ruleData, errorFormValue);
    // 校验通过
    const succssFormValue = XnUtils.deepClone(this.ruleSuccessFrom.value);
    ruleData = this.filterRuleValue(ruleData, succssFormValue);
    return ruleData
  }

  /**
   * 过滤处理表单的值，更新文件
   * @param ruleDataInfo
   * @param formValue
   * @returns
   */
  filterRuleValue(ruleDataInfo: any, formValue: any) {
    const ruleData = XnUtils.deepClone(ruleDataInfo)
    // 校验文件赋值给规则校验信息
    for (const key in formValue) {
      // 人工校验
      if (key === 'manualReview') {
        const new_manualReview = JSON.parse(formValue[key]);

        ruleData.manualReview.map(rule => {
          new_manualReview.map(new_rule => {
            if (rule.id === new_rule.id) {
              rule.standardNameList.map(stand => {
                new_rule.standardNameList.map(new_stand => {
                  if (stand.standard_name === new_stand.standard_name && stand.check_status === new_stand.check_status) {
                    stand.file = new_stand.file;
                    stand.user_remark = new_stand.user_remark
                  }
                })
              })
            }
          })
        })
      } else {
        // 系统校验
        ruleData.point_info.map((point: any) => {
          if (point.point_code === key) {
            // 节点信息
            const rs_list = point.rs_list;
            const new_point_info = JSON.parse(formValue[key]);
            const new_re_list = new_point_info.rs_list;
            new_re_list.map(new_rs => {
              // 规则集信息
              rs_list.map((rs: any) => {
                if (rs.rs_code === new_rs.rs_code) {
                  // 规则信息
                  rs.rule_list.map(rule => {
                    new_rs.rule_list.map(new_rule => {
                      rule.file = rule.rule_code === new_rule.rule_code ? new_rule.file : rule.file;
                      rule.user_remark = rule.rule_code === new_rule.rule_code ? new_rule.user_remark : rule.user_remark;
                    })
                  })
                }
              })
            })
          }
        })
      }
    }
    return ruleData;
  }

  /**
   * 当前tab激活状态
   * @param resultType 通过/异常
   * @param showFileds 表单配置
   * @returns
   */
  activeTab(resultType: string, showFileds?: CheckersOutputModel[]) {
    return showFileds ? this.resultType === resultType && showFileds.length : this.resultType === resultType
  }
}
