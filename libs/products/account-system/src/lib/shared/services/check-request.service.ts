/*************************************************************************
* Copyright (c) 2017 - 2022 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\products\account-system\src\lib\shared\services\check-request.service.ts
* @summary：注册企业列表
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                HuCongying           init           2022-01-11
***************************************************************************/
import { Injectable } from '@angular/core';
import { RetCodeEnum } from 'libs/shared/src/lib/config/enum';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ProcessRecordModalParams } from '../components/modal/interface';
import { CheckParams, RecordTypeParams } from '../interface';

@Injectable({ providedIn: 'root' })
export class CheckRequestService {

  constructor(
    private xn: XnService,
    private message: NzMessageService,
  ) { }

  /**
   * 提交审核信息
   * @param checkParams 审核流程参数配置
   */
  submitCheckForm(checkParams: CheckParams) {
    const { accountId, flowType, auditResult, remark } = checkParams;
    this.xn.loading.open();
    this.xn.middle.post2(`${checkParams.postUrl}`, { accountId, flowType, auditResult, remark }).subscribe({
      next: (res) => {
        this.xn.loading.close();
        if (res.code === RetCodeEnum.OK) {
          this.message.success('审核成功！');
          window.history.go(-1);
        }
      },
      error: () => {
        this.xn.loading.close();
      }
    })
  }

  /**
   * 查询操作记录
   * @param recordTypeParams 查询操作记录参数
   */
  viewRecord(recordTypeParams: RecordTypeParams) {
    return new Promise((resolve) => {
      const { accountId, recordType } = recordTypeParams;
      this.xn.middle.post2('/account/record_by_type', { accountId, recordType })
        .subscribe({
          next: (res: any) => {
            if (res.code === RetCodeEnum.OK) {
              const params: ProcessRecordModalParams = {
                recordList: res.data.operatorRecordList
              }
              resolve(params);
            }
          }
        });
    })
  }
}
