/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\shared\src\lib\public\modal\user-manage-form-modal\user-manage-form-modal.component.ts
 * @summary：user-manage-form-modal.component.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-07-28
 ***************************************************************************/
import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalComponent, ModalSize } from '../../../common/modal/components/modal';
import { Observable, zip } from 'rxjs';
import { XnService } from '../../../services/xn.service';
import { FormGroup } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { XnUtils } from '../../../common/xn-utils';
import { EmailReg, IDCardReg, MobileReg } from '../../validator/valid.regexp';
import { FormStatus } from '../../../config/enum';
import { Auditor } from '../../../config/select-options';

@Component({
  templateUrl: './user-manage-form-modal.component.html',
  styles: [
    `
      ::ng-deep.cdk-overlay-container {
        z-index: 2000;
      }

      .ext-info {
        margin-left: 20px;
        font-size: 16px;
      }
    `,
  ]
})
export class UserManageFormModalComponent implements OnInit {
  @ViewChild('modal') modal: ModalComponent;

  private observer: any;
  params: any = {} as any;
  /** 管理员所处的独特中介机构id */
  AdminOrgTypeId = 0;
  memoTemp = '不选任何角色就是只读用户';

  /** 提示文案 */
  tipText = {
    [FormStatus.Add]: '新增',
    [FormStatus.Edit]: '编辑',
  };

  isLoading = false;
  sysRolesArr: any[] = [];

  /** 表单的状态，新增 or 编辑 */
  formStatus: string;
  form = new FormGroup({});
  model: any = {};
  options: FormlyFormOptions = {
    formState: {
      roleOptions: [],
      loading: true,
    },
  };
  fields: FormlyFieldConfig[] = [
    {
      fieldGroup: [
        {
          className: 'ant-col ant-col-md-24 ant-col-sm-24',
          wrappers: ['form-field-horizontal'],
          key: 'userName',
          type: 'input',
          templateOptions: {
            label: '用户姓名',
            labelSpan: 8,
            placeholder: '',
            required: true,
          },
          validators: {
            cnName: {
              expression: () => {
                const val = this.form.get('userName')?.value;
                if (XnUtils.isEmpty(val)) {
                  return true;
                } else {
                  return XnUtils.fullOrHalf(val);
                }
              },
              message: '请输入合法的中文名称，符号为全角'
            },
          }
        },
        {
          className: 'ant-col',
          wrappers: ['form-field-horizontal'],
          key: 'orgTypeList',
          type: 'user-org-roles-field',
          templateOptions: {
            label: '用户角色',
            labelSpan: 8,
            fieldKey: 'orgTypeList'
          },
          expressionProperties: {
            'templateOptions.options': 'formState.roleOptions',
            'templateOptions.loading': 'formState.loading',
          },
        },
        {
          className: 'ant-col ant-col-md-24 ant-col-sm-24',
          wrappers: ['form-field-horizontal'],
          key: 'cardType',
          type: 'select',
          templateOptions: {
            label: '证件类型',
            labelSpan: 8,
            nzPlaceHolder: '',
            options: [
              {label: '身份证', value: '身份证'},
              {label: '护照', value: '护照'}
            ],
            required: true,
          },
        },
        {
          className: 'ant-col ant-col-md-24 ant-col-sm-24',
          wrappers: ['form-field-horizontal'],
          key: 'cardNo',
          type: 'input',
          templateOptions: {
            label: '证件号码',
            labelSpan: 8,
            placeholder: '',
            required: true,
          },
          validators: {
            ID: {
              expression: () => {
                const cardTypeVal = this.form.get('cardType')?.value;
                const cardNoVal = this.form.get('cardNo')?.value;
                if (cardTypeVal === '身份证') {
                  return IDCardReg.test(cardNoVal);
                }
              },
              message: '请输入合法的身份证号码'
            },
          }
        },
        {
          className: 'ant-col ant-col-md-24 ant-col-sm-24',
          wrappers: ['form-field-horizontal'],
          key: 'mobile',
          type: 'input',
          templateOptions: {
            label: '手机号',
            labelSpan: 8,
            placeholder: '',
            required: true,
          },
          validators: {
            phone: {
              expression: () => {
                const val = this.form.get('mobile')?.value;

                return MobileReg.test(val);

              },
              message: '请输入合法的11位手机号'
            },
          }
        },
        {
          className: 'ant-col ant-col-md-24 ant-col-sm-24',
          wrappers: ['form-field-horizontal'],
          key: 'email',
          type: 'input',
          templateOptions: {
            label: '邮件',
            labelSpan: 8,
            placeholder: '',
            required: true,
          },
          validators: {
            email: {
              expression: () => {
                const val = this.form.get('email')?.value;

                return EmailReg.test(val);
              },
              message: '请输入合法的邮箱地址'
            },
          }
        },
      ],
    },
  ];

  /** 当前编辑的用户是否有管理员角色 */
  get hasAdminRole() {
    return this.params.isAdmin || false;
  }

  /** 当前编辑的用户是否是自己 */
  get isSelf() {
    return this.xn.user.userId === this.params.userId;
  }

  /** 当前登录的用户是否有管理员角色 */
  get loginUserHasAdminRole() {
    return this.xn.user.isAdmin;
  }

  /** 当前状态下模态框文案 */
  get text() {
    return this.tipText[this.formStatus];
  }

  constructor(
    private xn: XnService,
    private msg: NzMessageService,
  ) {}

  ngOnInit() {}

  /** 必须存在的函数，不能删除，名字都不能改 */
  onOk() {}

  open(params: any): Observable<string> {
    this.params = params;
    this.formStatus = params.formStatus;

    this.fetchOrgRoles();
    console.log('user-manage-form-params: ', this.params);

    this.modal.open(ModalSize.XLarge);

    return Observable.create(observer => {
      this.observer = observer;
    });
  }

  /**
   * 管理员角色 option 配置
   * @param orgAndRole 当前系统下所有机构类型及角色
   */
  adminOrgType(orgAndRole: any[]) {
    const adminInfo = orgAndRole.find((c) => c.orgTypeId === this.AdminOrgTypeId);
    // 如果当前打开的是自己的信息，则管理员选项不能更改
    // 当前登录的用户没有管理员角色，不能更改管理员选项
    if (this.isSelf || !this.loginUserHasAdminRole) {
      adminInfo.disabled = true;
    }
    return adminInfo;
  }

  /** 获取所有机构角色信息 */
  fetchOrgRoles() {
    this.options.formState.loading = true;

    const orgAndRole$ = this.xn.api.post('/useroperate2/system_org_role_list', {systemId: this.params.systemId});
    const org$ = this.xn.api.post('/useroperate2/app_org_type_list', {systemId: this.params.systemId});

    zip(orgAndRole$, org$)
      .subscribe(
        res => {
          const orgAndRole = res[0].data.orgTypeList;
          const org = res[1].data.orgTypeList;
          /** 管理员选项 */
          const adminOption = this.adminOrgType(orgAndRole);
          /** 角色选项 */
          let roleOptions = this.filterOrgAndRole(orgAndRole, org);
          // 加入管理员所处的特殊机构类型
          roleOptions.unshift(adminOption);
          // roleList -> roles
          roleOptions = roleOptions.map((c) => ({...c, roles: c.roleList}));

          this.initUserRoleOptions(roleOptions);
          this.initFormValue();
          this.options.formState.loading = false;
        },
        (err) => {
          this.msg.error(err.msg || '获取角色信息失败');
          this.options.formState.loading = false;
        }
      );
  }

  /**
   * 过滤出当前企业包含的 “机构类型” 及其下属的 “角色”
   * @param orgAndRole 当前系统下所有机构类型及角色
   * @param org 当前企业在该系统下已配置的所有机构类型列表
   */
  filterOrgAndRole(orgAndRole: any[], org: any[]) {
    const orgTypeIds = org.map((c) => c.orgTypeId);
    return orgAndRole.filter((c) => orgTypeIds.includes(c.orgTypeId));
  }

  /** 初始化表单值 */
  initFormValue() {
    // 编辑状态下
    if (this.formStatus === FormStatus.Edit) {
      const {userName, cardType, email, cardNo, mobile} = this.params;
      this.model = {userName, cardType, email, cardNo, mobile};
    }
  }

  /** 初始化用户角色表单项的 options */
  initUserRoleOptions(roleOptions: any[]) {
    if (this.formStatus === FormStatus.Edit && this.params.userRoleList) {
      this.options.formState.roleOptions = roleOptions
        .map((c) => {
          this.params.userRoleList.forEach((d) => {
            // 中介机构相同，对比 roles 数组
            if (c.orgTypeId === d.orgTypeId) {
              for (let i = 0; i < c.roles.length; i++) {
                for (let j = 0; j < d.roles.length; j++) {
                  // 有相同的 roleId 则标记为选中
                  if (Number(c.roles[i].roleId) === Number(d.roles[j].roleId)) {
                    c.roles[i].checked = true;
                    break;
                  }
                }
              }
            }
          });
          return c;
        });
    } else {
      this.options.formState.roleOptions = roleOptions;
    }
  }

  /** 格式化 orgTypeList 的值 */
  formatRoleList() {
    return this.form.value.orgTypeList
      .filter((c) => c.checked)
      .map((d) => {
        const item = this.sysRolesArr.find((e) => e.id === d.value);
        if (item) {
          const {id, name, code} = item;
          return Object.assign({}, {id, name, code});
        } else {
          return null;
        }
      });
  }

  /** 获取表单值 */
  getFormValue() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      if (this.form.value.mobile !== this.params.mobile && this.hasAdminRole && this.isSelf) {
        this.xn.msgBox.open(true, '系统检测到您修改了管理员手机号，确定修改手机号并重新登录？',
          () => {
            // 选择了是
            this.postEdit();
          },
          () => {
            // 选择了否
            return;
          });
      } else {
        this.postEdit();
      }
    }
  }

  /** 判断角色是否有更改 有更改 -> true，没有更改 -> false */
  judgeRolesIsChange(): boolean {
    const {orgTypeList: curr} = this.form.value;
    const {userRoleList: prev} = this.params;

    // 长度不一样 true
    if (curr.length !== prev.length) {
      return true;
    }

    // 机构不一样 true
    const currOrg = curr.map((c) => c.orgTypeId).sort().toString();
    const prevOrg = prev.map((c) => c.orgTypeId).sort().toString();
    console.log('judgeRolesIsChange 机构', currOrg, prevOrg);
    if (currOrg !== prevOrg) {
      return true;
    }

    // 角色不一样 true
    let currRole;
    curr.forEach((c) => {
      currRole = [...currRole, ...c.roleIds];
    });
    let prevRole;
    prev.forEach((c) => {
      const roleIds = c.roles.map((d) => d.roleId);
      prevRole = [...prevRole, ...roleIds];
    });
    currRole = currRole.sort().toString();
    prevRole = prevRole.sort().toString();
    console.log('judgeRolesIsChange 角色', currRole, prevRole);
    return currRole !== prevRole;
  }

  private close(value: string) {
    this.modal.close();
    this.observer.next(value);
    this.observer.complete();
  }

  onSubmit() {
    this.getFormValue();
  }

  onLogout() {
    this.xn.user.logoutNoRedirect();
  }

  postEdit() {
    this.isLoading = true;
    const postValue = {
      ...this.model,
      systemId: this.params.systemId,
    };

    // 编辑时要传 userId
    if (this.formStatus === FormStatus.Edit) {
      postValue.userId = this.params.userId;
    }
    this.xn.api.post2('/useroperate2/insert_or_update_user', postValue)
      .subscribe(
        res => {
          this.isLoading = false;
          if (res.ret === 0) {
            if (this.form.value.mobile !== this.params.mobile && this.hasAdminRole && this.isSelf) {
              this.xn.msgBox.open(false, '您的登录已经超时，请重新登录!', () => {
                this.xn.router.navigate(['/login']);
              });
            } else {
              this.close(postValue);

              if (this.hasAdminRole && this.isSelf && this.judgeRolesIsChange()) {
                this.xn.user.updateSession().subscribe(() => window.location.reload());
              }
            }
          }
        },
        () => {
          this.isLoading = false;
        }
      );
  }
}
