/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\shared\src\lib\public\form\user-org-roles\user-org-roles.interface.ts
 * @summary：user-org-roles.interface.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-07-12
 ***************************************************************************/

export interface UserOrgRole {
  orgName: string;
  orgTypeId: number;
  orgType: number;
  roles: { value: number, label: string, checked: boolean }[];
}
