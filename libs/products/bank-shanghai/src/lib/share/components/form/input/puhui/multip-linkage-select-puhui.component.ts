/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\products\bank-shanghai\src\lib\share\components\form\input\puhui\multip-linkage-select-puhui.component.ts
* @summary：上海银行普惠开户-注册地址三级下拉选择框input组件
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                 hucongying           init          2021-07-12
***************************************************************************/
import { Component, OnInit, ElementRef, Input, ChangeDetectorRef } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { XnInputOptions } from 'libs/shared/src/lib/public/form/xn-input.options';
import { XnFormUtils } from 'libs/shared/src/lib/common/xn-form-utils';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnService } from 'libs/shared/src/lib/services/xn.service';

/** 省 */
export class Provice {
  provice: string;
  proviceCode: string;
  constructor(provice: string, proviceCode: string) {
    this.provice = provice
    this.proviceCode = proviceCode
  }
}
/** 市 */
export class City {
  city: string;
  cityCode: string;
  constructor(city: string, cityCode: string) {
    this.city = city
    this.cityCode = cityCode
  }
}
/** 区 */
export class Area {
  area: string;
  areaCode: string;
  constructor(area: string, areaCode: string) {
    this.area = area
    this.areaCode = areaCode
  }
}

/** 定义value值接口类型 */
export class SelectValue {
  /** 省 */
  provice: Provice;
  /** 市 */
  city: City;
  /** 区 */
  area: Area;
  constructor() {
    this.provice = new Provice('', '')
    this.city = new City('', '')
    this.area = new Area('', '')
  }
}

/** 请求省市区层级定义 */
export enum LevelValue {
  /** 省 */
  PROVICE = 1,
  /** 市 */
  CITY = 2,
  /** 区 */
  AREA = 3,
}

@Component({
  templateUrl: './multip-linkage-select-puhui.component.html',
  styles: [
    `.xn-mselect-right {
            padding-right: 2px;
        }
        .xn-mselect-left {
            padding-left: 2px;
        }`
  ]
})
@DynamicForm({ type: 'multip-linkage-select-puhui', formModule: 'default-input' })
export class PuhuiMultipLinkageSelectInputComponent implements OnInit {

  @Input() row: any;
  @Input() form: FormGroup;
  // 组件value
  public ctrlValue: SelectValue = new SelectValue();
  // 一级省下拉
  public proviceOptions: any = [];
  // 二级市下拉
  public cityOptions: any = [];
  // 三级区下拉
  public areaOptions: any = [];

  public ctrl: AbstractControl;
  public alert = '';
  public myClass = '';
  public xnOptions: XnInputOptions;

  get proviceLevel() {
    return LevelValue.PROVICE
  }
  get cityLevel() {
    return LevelValue.CITY
  }
  get areaLevel() {
    return LevelValue.AREA
  }

  constructor(private er: ElementRef,
    private xn: XnService,
    private cdr: ChangeDetectorRef) { }

  async ngOnInit() {
    this.ctrl = this.form.get(this.row.name);
    // 获取省下拉项
    this.proviceOptions = await this.getOptions({ level: this.proviceLevel, regionCode: '' })
    this.calcAlertClass();
    // 设置初始值
    if (this.ctrl.value) {
      const valObj = XnUtils.parseObject(this.ctrl.value);
      this.ctrlValue = XnUtils.deepClone(valObj);
      this.initOptions();
      this.calcAlertClass();
      this.cdr.markForCheck();
    }
    this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
  }

  /**
   * get下拉框options
   * @param params level:层级 regionCode:省市code
   * @returns
   */
  getOptions(params: { level: number, regionCode: string }) {
    return new Promise((resolve, reject) => {
      this.xn.dragon.post2('/shanghai_bank/sh_base/getRegion', params).subscribe(res => {
        if (res?.data && res?.data.length) {
          resolve(res.data)
        } else {
          resolve([])
        }
      })
    })
  }

  /**
   * 初始化options
   */
  async initOptions() {
    // 获取市一级
    this.cityOptions = await this.getOptions({ level: this.cityLevel, regionCode: this.ctrlValue.provice.proviceCode });
    // 获取区、县一级
    if (this.ctrlValue.area.areaCode) {
      this.getOptions({ level: this.areaLevel, regionCode: this.ctrlValue.city.cityCode }).then(res => {
        this.areaOptions = res
      })
    } else {
      this.areaOptions = []
    }
  }

  onBlur(event: any): void {
    this.calcAlertClass();
  }

  /**
   * onselectChange
   * @param event
   * @param type 1,2,3
   */
  async onChange(event: any, level: number) {
    const valueCode = event.target.value
    switch (level) {
      // 省
      case this.proviceLevel:
        this.cityOptions = [];
        this.areaOptions = [];
        this.ctrlValue.city = new City('', '');
        this.ctrlValue.area = new Area('', '');
        if (valueCode) {
          // 选了省
          const provice = this.proviceOptions.find((x: Provice) => x.proviceCode === valueCode);
          this.ctrlValue.provice = XnUtils.deepClone(provice);
          this.getOptions({ level: this.cityLevel, regionCode: this.ctrlValue.provice.proviceCode }).then(res => {
            this.cityOptions = res
          });
        } else {
          this.ctrlValue.provice = new Provice('', '')
        }
        break;

      // 市
      case this.cityLevel:
        this.areaOptions = [];
        this.ctrlValue.area = new Area('', '');
        if (valueCode) {
          // 选了市/区
          const city = this.cityOptions.find((x: City) => x.cityCode === valueCode)
          this.ctrlValue.city = XnUtils.deepClone(city);
          this.areaOptions = await this.getOptions({ level: this.areaLevel, regionCode: this.ctrlValue.city.cityCode });
        } else {
          this.ctrlValue.city = new City('', '');
        }
        break;

      // 区
      case this.areaLevel:
        if (valueCode) {
          const area = this.areaOptions.find((x: Area) => x.areaCode === valueCode)
          this.ctrlValue.area = XnUtils.deepClone(area);
        } else {
          this.ctrlValue.area = new Area('', '');
        }
        break;

      default:
        break;
    }
    this.toValue(level);
  }

  /**
   * 赋值操作
   * @param level 当前选择的层级
   */
  private toValue(level: number) {
    switch (level) {
      // 省
      case this.proviceLevel:
        this.ctrl.setValue('');
        break;

      // 市
      case this.cityLevel:
        if (this.areaOptions.length) {
          this.ctrl.setValue('');
        } else {
          // 没有第三级了
          this.ctrl.setValue(JSON.stringify(this.ctrlValue));
        }
        break;

      // 区
      case this.areaLevel:
        if (this.ctrlValue.area.areaCode) {
          this.ctrl.setValue(JSON.stringify(this.ctrlValue));
        } else {
          this.ctrl.setValue('');
        }
        break;

      default:
        this.ctrl.setValue('');
        break;
    }
  }

  private calcAlertClass() {
    this.myClass = XnFormUtils.getClass(this.ctrl);
    this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
  }
}
