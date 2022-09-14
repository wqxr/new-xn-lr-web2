import { Pipe, PipeTransform } from '@angular/core';
enum OrgTypesEnum {
  '供应商' = 1,
  '保理商' = 3,
  '银行' = 4,
  '风控平台' = 88,
  '平台' = 99,
  '项目公司' = 201,
  '总部公司' = 202,
  '中介机构' = 102,
  '服务机构' = 6,
  /** 目前是指保函通等系统角色 */
  '其他' = 111,
}
/** 注册公司企业角色类型过滤 */
@Pipe({ name: 'xnOrgTypes' })
export class XnOrgTypesPipe implements PipeTransform {
  transform(orgTypes: string | number | string[]): string {

    let orgType = '';
    if (!orgTypes) {
      return orgType = '--';
    }
    if (typeof orgTypes === 'string') {
      orgType = OrgTypesEnum[Number(orgTypes)]
    } else if (typeof orgTypes === 'number') {
      orgType = OrgTypesEnum[orgTypes]
    } else if (typeof orgTypes === 'object') {
      // 多类型的需要拼接在一起
      orgType = orgTypes.reduce((prev, curr) => { return prev + `${OrgTypesEnum[Number(curr)]}/` }, '')
      orgType = orgType.substr(0, orgType.length - 1)
    }

    return orgType || '--';

  }
}
