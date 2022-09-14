/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\abs-gj\src\lib\services\tool-kit.service.ts
 * @summary：tool-kit.service.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-12-01
 ***************************************************************************/
import { Injectable } from '@angular/core';
import { GjServicesModule } from './services.module';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
import { ProxyTypeEnum, RecordStatusEnum, ZdStatus } from 'libs/shared/src/lib/config/enum/common-enum';

@Injectable({providedIn: GjServicesModule})
export class ToolKitService {

  /**
   * ProxyTypeEnum.AVENGER ，ProxyTypeEnum.VANKE_LOGAN 与后台定义的 record.proxyType 对应
   * ProxyTypeEnum.AVENGER = 1 代表旧产品，用到旧的 check 项，及其接口
   * ProxyTypeEnum.VANKE_LOGAN = 2 代表新产品，使用新产品的路由，这里指【成都轨交】，也可以代指其他产品
   */

  editFlowMap = new Map([
    [ProxyTypeEnum.AVENGER, '/console/record/avenger/todo/edit/'],
    [ProxyTypeEnum.VANKE_LOGAN, '/abs-gj/record/todo/edit/'],
  ]);

  viewFlowMap = new Map([
    [ProxyTypeEnum.AVENGER, '/console/record/avenger/todo/view/'],
    [ProxyTypeEnum.VANKE_LOGAN, '/abs-gj/record/todo/view/'],
  ]);

  constructor(private xn: XnService) {}

  /** 查看流程 */
  viewProcess(paramMainFloId: string) {
    if (paramMainFloId.endsWith('cdr')) {
      this.xn.router.navigate([`abs-gj/main-list/detail/${paramMainFloId}`]);
    }
  }

  /** 处理流程 */
  doProcess(record: any, xn: any) {

    if (record.proxyType == null) {
      xn.router.navigate([`/console/record/todo/view/${record.recordId}`]);
      return;
    }

    // 流程不处于（草稿 && 进行中）|| 账号没有权限查看流程
    if (
      (record.status !== RecordStatusEnum.NOTDO && record.status !== RecordStatusEnum.DOING)
      || !XnUtils.getRoleExist(record.nowRoleId, xn.user.roles, record.proxyType)
    ) {

      xn.router.navigate([this.viewFlowMap.get[record.proxyType] + record.recordId]);

    } else {

      if (record.flowId === 'dragon_platform_verify' && record.zhongdengStatus === ZdStatus.REGISTER_PROGRESS) {
        xn.msgBox.open(false, '该流程中登登记处于登记中,不可处理');

      } else {
        xn.router.navigate(
          [`${this.editFlowMap.get(record.proxyType)}${record.recordId}`],
          {queryParams: {factoringAppId: record.appId}}
        );
      }
    }
  }
}
