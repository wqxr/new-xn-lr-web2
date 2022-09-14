/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\shared\src\lib\public\form\user-org-roles\user-org-roles.component.ts
 * @summary：user-org-roles.component.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-07-12
 ***************************************************************************/
import { AfterContentChecked, Component, OnDestroy, OnInit } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { UserOrgRole } from './user-org-roles.interface';

@Component({
  selector: 'lib-formly-field-user-org-roles',
  templateUrl: './user-org-roles.component.html',
  styleUrls: ['./user-org-roles.component.css']
})
export class UserOrgRolesComponent extends FieldType implements OnInit, AfterContentChecked, OnDestroy {
  /** 角色信息 */
  roles: UserOrgRole[] = [];
  /** 是否初始化 */
  isInit = false;

  get isLoading() {
    return this.to.loading;
  }

  ngOnInit(): void {
  }

  ngAfterContentChecked(): void {
    this.initOrgRoles();
  }

  ngOnDestroy(): void {
    console.log('user-org-roles-field destroy');
  }

  checkChange() {
    this.setValue();
  }

  /** 初始化表单项数据 */
  initOrgRoles() {
    // 未初始化 && options 是数组 && options 长度大于一
    if (!this.isInit && this.to.options instanceof Array && this.to.options.length) {
      this.roles = this.to.options.map((c) => {
        const roles = c.roles.map((d) => {
          return {
            label: d.roleName,
            value: d.roleId,
            checked: d.checked || false,
            disabled: d.disabled || false,
          };
        });

        return {
          orgName: c.orgName,
          orgType: c.orgType,
          orgTypeId: c.orgTypeId,
          roles,
        };
      });
      // 初始化完成
      this.isInit = true;
      this.setValue();
    }
  }

  /** 设置表单值 */
  setValue() {
    this.form.controls[this.to.fieldKey]?.setValue(this.formatValue());
  }

  /** 整理出表单项的值 */
  formatValue() {
    return this.roles
      .map((c) => {
        return {
          orgTypeId: c.orgTypeId,
          roleIds: c.roles.filter((d) => d.checked).map((d) => d.value)
        };
      })
      .filter((c) => c.roleIds.length);
  }
}
