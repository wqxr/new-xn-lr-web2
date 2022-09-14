/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\console\src\lib\management\user-manage-relate-right\user-manage-relate-right.component.ts
 * @summary：user-manage-relate-right.component.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  DengPei           init               2021-07-12
 ***************************************************************************/

import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { AdminMoveModalComponent } from 'libs/shared/src/lib/public/modal/admin-move-modal.component';
import { PowerEditModalComponent } from 'libs/shared/src/lib/public/modal/power-edit-modal.component';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { OrgType } from 'libs/shared/src/lib/config/enum';
import { UserManageFormModalComponent } from 'libs/shared/src/lib/public/modal/user-manage-form-modal/user-manage-form-modal.component';
import { FormStatus } from 'libs/shared/src/lib/config/enum';
import { RightStatus } from 'libs/shared/src/lib/config/enum';
import { Auditor } from '../../../../../shared/src/lib/config/select-options';
import { UserDeleteRelateRightModalComponent } from '../../../../../shared/src/lib/public/modal/user-delete-relate-right-modal';

@Component({
  templateUrl: './user-manage-relate-right.component.html',
  styles: [
    `.table {
      font-size: 13px;
    }`,
    `.xn-click-a {
      display: inline-block;
      padding-left: 5px;
      padding-right: 5px;
    }`,
    `
      .receive {
        padding-left: 5px;
      }

      .wrap-role {
        margin-bottom: 6px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      }

      .wrap-role:last-child {
        margin-bottom: 0;
        border: none;
      }

      .role-p {
        margin-bottom: 4px;
      }
    `
  ]
})
export class UserManageRelateRightComponent implements OnInit {
  pageTitle = '用户管理';
  pageDesc = '新版用户管理页面，部分数据来源自权限系统';

  items: any[] = [];
  readonlyMan = '只读用户';
  types: any[] = [];
  isFactoryAdmin = false;
  /** 系统列表 */
  sysOptions: { label: string, value: number }[];
  /** 当前所处系统 */
  currSysId: number;

  get registerStatus() {
    return RightStatus;
  }

  constructor(
    private xn: XnService,
    private vcr: ViewContainerRef,
    private msg: NzMessageService,
  ) {
  }

  ngOnInit() {
    this.isFactoryAdmin = this.xn.user.orgType === OrgType.Factoring && !!this.xn.user.isAdmin;
    this.fetchSysList();
  }

  /**
   * 返回到旧版用户管理页面
   */
  navToOld() {
    this.xn.router.navigate(['/console/manage/user-manage']);
  }

  /**
   * 获取企业已注册的系统列表
   */
  fetchSysList() {
    this.xn.api.post('/useroperate2/app_system', {})
      .subscribe(
        {
          next: (res) => {
            this.formatSysOptions(res.data);
          },
          error: (err) => {
            this.msg.error(err.msg || '获取系统列表失败');
          },
        }
      );
  }

  /**
   * 格式化企业列表信息
   * @param data 系统列表
   */
  formatSysOptions(data: { systemList: any[] }) {
    if (data.systemList && data.systemList.length) {
      this.sysOptions = data.systemList.map((c) => {
        return {
          label: c.name,
          value: c.systemId,
        };
      });
      // 默认查询第一个系统
      this.currSysId = data.systemList[0].systemId;
      this.onPage();
    } else {
      this.sysOptions = [];
    }
  }

  /**
   * 选择系统
   * @param ev 所选的值
   */
  selectChange(ev: number) {
    this.currSysId = ev;
    this.onPage();
  }

  /**
   * 根据所处系统查询用户列表
   */
  onPage() {
    this.xn.api.post('/useroperate2/user_list', {systemId: this.currSysId})
      .subscribe(json => {
        this.items = json.data.data;
      });
  }

  /** 是否有管理员权限 */
  isAdmin(userRoleList) {
    if (!userRoleList || userRoleList.length <= 0) {
      return false;
    }
    return !!userRoleList.find(v => v.roles.map(c => c.roleCode).includes(Auditor.Admin));
  }

  /** 是否是当前登录的用户 */
  isSelf(row: any) {
    return this.xn.user.userId === row.userId;
  }

  checkLogin(event, id) {
    const checkbox = event.target;
    const checked = checkbox.checked;
    const checkedNumber = checked ? 1 : 0;

    this.goCheck(id, checkedNumber);
  }

  goCheck(id: number, checkedNumber: number) {
    this.xn.api.post('/useroperate2/set_sms', {
      userId: id,
      isSms: checkedNumber,
      systemId: this.currSysId,
    }).subscribe();
  }

  getPowerList(item: any) {
    this.xn.api.post('/power/list', {
      userId: item.userId
    }).subscribe(json => {
      const Data = json.data;
      Data.userId = item.userId;
      this.getPower(Data);
    });
  }

  /**
   * 新增用户
   */
  onViewAdd() {
    const params = {formStatus: FormStatus.Add, systemId: this.currSysId};
    XnModalUtils.openInViewContainer(this.xn, this.vcr, UserManageFormModalComponent, params)
      .subscribe(() => {
        this.onPage();
      });
  }

  /**
   * 修改用户
   * @param item 列表 row 信息
   */
  onViewEdit(item: any) {
    const params = {
      ...item,
      formStatus: FormStatus.Edit,
      systemId: this.currSysId,
      isAdmin: this.isAdmin(item.userRoleList)
    };
    return XnModalUtils.openInViewContainer(this.xn, this.vcr, UserManageFormModalComponent, params)
      .subscribe({
        next: () => {
          this.onPage();
        }
      });
  }

  onViewDelete(item: any) {
    const params = {...item, systemId: this.currSysId};
    XnModalUtils.openInViewContainer(this.xn, this.vcr, UserDeleteRelateRightModalComponent, params)
      .subscribe(v => {
        for (let i = 0; i < this.items.length; i++) {
          if (this.items[i].userId === v.userId) {
            this.items.splice(i, 1);
          }
        }
      });
  }

  onAdminMove(item: any) {
    const checker = [
      {
        title: '用户姓名', checkerId: 'orgName', options: {readonly: true}, value: item.userName
      },
      {
        title: '证件号码', checkerId: 'cardNo', options: {readonly: true}, value: item.cardNo
      },
      {
        title: '手机号', checkerId: 'mobile', options: {readonly: true}, value: item.mobile
      },
      {
        title: '邮箱', checkerId: 'email', options: {readonly: true}, value: item.email
      },
    ];
    XnModalUtils.openInViewContainer(this.xn, this.vcr, AdminMoveModalComponent, checker).subscribe(v => {
      if (v && v.action === 'ok') {
        this.xn.api.post('/useroperate2/admin_transfer', {userId: item.userId, systemId: this.currSysId})
          .subscribe(json => {
            if (json.ret === 0) {
              this.onLogout();
            }
          });
      }
    });
  }

  onLogout() {
    this.xn.user.logout();
  }

  onPower(item: any) {
    this.getPowerList(item);
  }

  getPower(item) {
    XnModalUtils.openInViewContainer(this.xn, this.vcr, PowerEditModalComponent, item).subscribe(() => {
      this.items.toString();
    });
  }

  /**
   * 企业用户注册到权限系统/同步企业用户信息到权限系统
   * @param item 行内容
   * @param apiFlag 请求api标识 right_register:企业用户注册到权限系统 right_modify: 同步企业用户信息到权限系统
   */
  rightUserOperate(item: any, apiFlag: string) {
    const {appId, userId} = item;
    this.xn.api.post(`/useroperate2/${apiFlag}`, {appId, userId, systemId: this.currSysId})
      .subscribe((x: any) => {
        this.xn.loading.close();
        if (x.ret === 0) {
          // 成功后刷新页面
          this.xn.msgBox.open(false, '操作成功!', () => {
            this.onPage();
          });
        }
      }, (err) => {
        console.error(err);
        this.xn.loading.close();
      }, () => {
        this.xn.loading.close();
      });

  }
}
