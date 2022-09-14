/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\products\account-system\src\lib\shared\services\industry.service.ts
* @summary：查询行业枚举
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                HuCongying           init           2021-11-24
***************************************************************************/
import { Injectable } from '@angular/core';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { IndustryLevelEnum, RetCodeEnum } from 'libs/shared/src/lib/config/enum';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { NzCascaderOption } from 'ng-zorro-antd/cascader';

@Injectable({ providedIn: 'root' })
export class IndustryService {

  constructor(
    private xn: XnService,
  ) { }

  /**
  * 动态加载行业枚举Cascader
  * @param node
  * @param index
  * @returns
  */
  loadIndustryData(node: NzCascaderOption, index: number): PromiseLike<void> {
    if (index < IndustryLevelEnum.UNKNOW) {
      return this.fetchIndustry(index, IndustryLevelEnum.FIRST, node);
    } else if (index === IndustryLevelEnum.UNKNOW) {
      return this.fetchIndustry(index, IndustryLevelEnum.SECOND, node);
    } else if (index === IndustryLevelEnum.FIRST) {
      return this.fetchIndustry(index, IndustryLevelEnum.THIRD, node);
    } else if (index === IndustryLevelEnum.SECOND) {
      return this.fetchIndustry(index, IndustryLevelEnum.FOURTH, node);
    } else if (index === IndustryLevelEnum.THIRD) {
      return this.fetchIndustry(index, IndustryLevelEnum.FOURTH, node);
    }
  }

  /**
   * 查新行业枚举
   * @param index 当前点击的层级
   * @param level 行业层级
   * @param node 选项
   */
  fetchIndustry(index: number, level: number, node: NzCascaderOption): PromiseLike<void> {
    return new Promise(resolve => {
      this.xn.middle.post2('/bos/enum/industry/list',
        { level, parentCode: index >= 0 ? node.value : undefined }
      ).subscribe((x) => {
        if (x.code === RetCodeEnum.OK) {
          if (XnUtils.isEmptys(x.data.industryList)) {
            node.parent.children.map((t: any) => {
              if (t.value === node.value) {
                // 最后一层了
                t.isLeaf = true
              }
            })
            resolve()
          } else {
            node.children = x.data.industryList.map((t: any) => {
              return { label: t.industryName, value: t.industryCode };
            });
            resolve()
          }
        }
      });
    })
  }
}
