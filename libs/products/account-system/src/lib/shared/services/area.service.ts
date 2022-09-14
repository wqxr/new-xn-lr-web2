/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\products\account-system\src\lib\shared\services\area.service.ts
* @summary：省市区地址
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                HuCongying           init           2021-11-15
***************************************************************************/
import { Injectable } from '@angular/core';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { SelectItemsModel } from 'libs/shared/src/lib/config/checkers';
import { AreaLevelEnum } from 'libs/shared/src/lib/config/enum';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AreaService {

  constructor(
    private xn: XnService,
    private message: NzMessageService,
  ) { }

  /** 省options */
  private _provinceOptions: BehaviorSubject<SelectItemsModel[]> = new BehaviorSubject<SelectItemsModel[]>([] as SelectItemsModel[]);
  readonly provinceOptions = this._provinceOptions.asObservable();
  private _provinces: SelectItemsModel[] = [];
  /** 市options */
  private _cityOptions: BehaviorSubject<SelectItemsModel[]> = new BehaviorSubject<SelectItemsModel[]>([] as SelectItemsModel[]);
  readonly cityOptions = this._cityOptions.asObservable();
  private _citys: SelectItemsModel[] = [];
  /** 区options */
  private _regionOptions: BehaviorSubject<SelectItemsModel[]> = new BehaviorSubject<SelectItemsModel[]>([] as SelectItemsModel[]);
  readonly regionOptions = this._regionOptions.asObservable();
  private _regions: SelectItemsModel[] = [];
  /** 省市缓存 */
  pcCache: { [key: string]: SelectItemsModel[] } = {};

  fetchProvince() {
    if (!this._provinces.length) {
      this.xn.middle.post2('/bos/enum/area/list', { level: AreaLevelEnum.PROVINCE })
        .subscribe(
          res => {
            const options = res.data.areaList.map((c: any) => ({ label: c.provinceName, value: c.provinceCode }));
            this._provinces = options;
            this._provinceOptions.next(options);
          },
          err => {
            this.message.error(err.msg || '获取省份列表失败');
          }
        );
    } else {
      this._provinceOptions.next(this._provinces);
    }
  }

  fetchCity(province: string) {
    if (province) {
        this.xn.middle.post2('/bos/enum/area/list', { level: AreaLevelEnum.CITY, areaCode: province })
          .subscribe(
            res => {
              let options = [];
              if (XnUtils.isEmptys(res.data.areaList)) {
                options = this._provinces.filter(c => c.value === province);
                this._citys = this._provinces;
              } else {
                options = res.data.areaList.map((c: any) => ({ label: c.cityName, value: c.cityCode }));
                this._citys = options;
              }
              this.pcCache = { ...this.pcCache, ...{ [province]: options } };
              this._cityOptions.next(options);
            },
            err => {
              this.message.error(err.msg || '获取城市列表失败');
            }
          );
    }
  }

  fetchRegion(city: string) {
    if (city) {
        this.xn.middle.post2('/bos/enum/area/list', { level: AreaLevelEnum.AREA, area_code: city })
          .subscribe(
            res => {
              let options = [];
              if (XnUtils.isEmptys(res.data.areaList)) {
                options = this._citys.filter(c => c.value === city);
                this._regions = options;
              } else {
                options = options = res.data.areaList.map((c: any) => ({ label: c.countyName, value: c.countyCode }));
                this._regions = options;
              }
              this.pcCache = { ...this.pcCache, ...{ [city]: options } };
              this._regionOptions.next(options);
            },
            err => {
              this.message.error(err.msg || '获取县区列表失败');
            }
          );
    }
  }
}
