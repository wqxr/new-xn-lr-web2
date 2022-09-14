
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
import { ResultTypeEnum, StandCheckStatuEnum } from 'libs/shared/src/lib/config/enum';
import { XnService } from 'libs/shared/src/lib/services/xn.service';

@Component({
  selector: 'xn-rule-engine-result-show',
  templateUrl: './xn-rule-engine-result-show.component.html',
  styleUrls: ['./xn-rule-engine-result-show.component.css'],
})

@DynamicForm({ type: 'xn-rule-engine-result', formModule: 'dragon-show' })
export class XnRuleEngineResultShowComponent implements OnInit {
  @Input() row: any;
  @Input() form: FormGroup;
  @Input() svrConfig: any;
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
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    if (this.row.data && JSON.parse(this.row.data)) {
      this.rule_engine_data = XnUtils.deepClone(JSON.parse(this.row.data))
      const rule_data = XnUtils.deepClone(JSON.parse(this.row.data));
      // 系统校验异常
      const errData = this.filterErrorData(rule_data.point_info, StandCheckStatuEnum.ERROR);
      // 人工校验异常
      const errDataArt = this.filterArtificialData(this.rule_engine_data.manualReview, StandCheckStatuEnum.ERROR);

      this.buildErrorFileds(errData, errDataArt);
      this.buildErrorForm();

      const rule_engine_data = XnUtils.deepClone(JSON.parse(this.row.data));
      // 系统校验成功
      const successRuleData = this.filterErrorData(rule_engine_data.point_info, StandCheckStatuEnum.SUCCESS);
      // 人工校验成功
      const successRuleDataArt = this.filterArtificialData(this.rule_engine_data.manualReview, StandCheckStatuEnum.SUCCESS);
      this.buildSuccessFileds(successRuleData, successRuleDataArt);
      this.buildSuccessForm();
    }
  }

  /**
   * 校验异常的规则集信息
   * @param point_info 规则集信息
   * @param validate_result 规则校验结果
   * @returns
   */
  filterErrorData(point_info: any[], validate_result: number) {
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
  }

  /**
   * 构建通过表单
   */
  buildSuccessForm() {
    for (const row of this.showSuccessFileds) {
      XnFormUtils.convertChecker(row);
    }
    this.ruleSuccessFrom = XnFormUtils.buildFormGroup(this.showSuccessFileds);
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
   * 当前tab激活状态
   * @param resultType 通过/异常
   * @param showFileds 表单配置
   * @returns
   */
  activeTab(resultType: string, showFileds?: CheckersOutputModel[]) {
    return showFileds ? this.resultType === resultType && showFileds.length : this.resultType === resultType
  }
}
