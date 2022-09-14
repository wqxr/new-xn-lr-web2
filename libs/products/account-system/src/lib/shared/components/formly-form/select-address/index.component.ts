/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\products\account-system\src\lib\shared\components\formly-form\select-address\index.component.ts
* @summary：SelectAddressComponent
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                HuCongying           init           2021-11-15
***************************************************************************/
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FieldType } from "@ngx-formly/core";
import { filter } from "rxjs/operators";
import { Subscription } from "rxjs";
import { AreaService } from '../../../services/area.service';
import { SelectItemsModel } from 'libs/shared/src/lib/config/checkers';

@Component({
  selector: 'xn-formly-field-select-address',
  templateUrl: './index.component.html',
  styleUrls: ['index.component.less']
})
export class SelectAddressComponent extends FieldType implements OnInit, OnDestroy {
  province$: Subscription;
  provinceOptions: SelectItemsModel[] = [];
  province = '';

  city$: Subscription;
  cityOptions: SelectItemsModel[] = [];
  city = '';

  region$: Subscription;
  regionOptions: SelectItemsModel[] = [];
  region = '';
  /** 具体地址 */
  detail = '';

  get provinceError() {
    return !this.province;
  }

  get cityError() {
    return !this.city;
  }

  get regionError() {
    return this.formControl.touched && !this.region;
  }

  get detailError() {
    return !this.detail;
  }

  constructor(
    private area: AreaService
  ) {
    super();
  }

  ngOnInit(): void {
    this.setDefaultValue();
    this.getProvince();
    this.getCity();
    this.getRegion();
    this.setFieldValue();
  }

  setDefaultValue() {
    const { value } = this.formControl;

    if (value) {
      this.province = value.province;
      this.city = value.city;
      this.region = value.region;
      this.detail = value.detail;
    }
  }

  getProvince() {
    this.area.fetchProvince();
    this.province$ = this.area.provinceOptions
      .pipe(
        filter(value => !!(value && Array.isArray(value) && value.length)),
      )
      .subscribe(
        res => {
          this.provinceOptions = res;
        }
      );
  }

  getCity() {
    this.area.fetchCity(this.province);
    this.city$ = this.area.cityOptions
      .pipe(
        filter(value => !!(value && Array.isArray(value) && value.length)),
      )
      .subscribe(
        res => {
          this.cityOptions = res;
        }
      );
  }

  getRegion() {
    this.area.fetchRegion(this.city);
    this.region$ = this.area.regionOptions
      .pipe(
        filter(value => !!(value && Array.isArray(value) && value.length)),
      )
      .subscribe(
        res => {
          this.regionOptions = res;
        }
      );
  }

  provinceChange(ev: any) {
    this.province = ev;
    this.city = '';
    this.cityOptions = [];
    this.region = '';
    this.regionOptions = [];
    this.getCity();
    this.setFieldValue();
  }

  cityChange(ev: any) {
    this.city = ev;
    this.region = '';
    this.regionOptions = [];
    this.getRegion()
    this.setFieldValue();
  }

  areaChange(ev: any) {
    this.region = ev;
    this.setFieldValue();
  }

  detailChange(ev: string) {
    this.detail = ev;
    this.setFieldValue()
  }

  setFieldValue() {
    if (this.province && this.city && this.detail) {
      this.formControl.setValue({
        province: this.province,
        city: this.city,
        region: this.region,
        detail: this.detail
      })
    } else {
      this.formControl.setValue(null);
    }
  }

  ngOnDestroy(): void {
    this.province$ ? this.province$.unsubscribe() : void 0;
    this.city$ ? this.city$.unsubscribe() : void 0;
    this.region$ ? this.region$.unsubscribe() : void 0;
  }
}
