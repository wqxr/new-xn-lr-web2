import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { UserEditModalComponent } from 'libs/shared/src/lib/public/modal/user-edit-modal.component';
import { UserAddModalComponent } from 'libs/shared/src/lib/public/modal/user-add-modal.component';
import { UserDeleteModalComponent } from 'libs/shared/src/lib/public/modal/user-delete-modal.component';
import { AdminMoveModalComponent } from 'libs/shared/src/lib/public/modal/admin-move-modal.component';
import { PowerEditModalComponent } from 'libs/shared/src/lib/public/modal/power-edit-modal.component';
import { EnvEnum } from '../../../../../shared/src/lib/config/enum';
import { XnUtils } from 'libs/shared/src/lib/common/xn-utils';
@Component({
  templateUrl: './user-manage.component.html',
  styles: [
    `
      .table {
        font-size: 13px;
      }
    `,
    `
      .xn-click-a {
        display: inline-block;
        padding-left: 5px;
        padding-right: 5px;
      }
    `,
    `
      .receive {
        padding-left: 5px;
      }
    `,
  ],
})
export class UserManageComponent implements OnInit {
  pageTitle = '用户管理';
  pageDesc = '';
  tableTitle = '用户管理';
  cardNo = '';

  total = 0;
  pageSize = 10;
  items: any[] = [];
  readonlyMan = '只读用户';
  powerlist: any = {} as any;
  types: any[] = [];
  isFactoryAdmin = false;
  adminInfo: any[] = [];

  /** 是否生产环境 */
  get isProd() {
    return this.xn.user.env === EnvEnum.Production;
  }

  constructor(private xn: XnService, private vcr: ViewContainerRef) {}

  ngOnInit() {
    this.isFactoryAdmin = this.xn.user.orgType === 3 && !!this.xn.user.isAdmin;
    this.onPage(1);
  }

  onPage(page: number) {
    page = page || 1;
    this.xn.api
      .post('/useroperate/user_list', {
        start: (page - 1) * this.pageSize,
        length: this.pageSize,
      })
      .subscribe((json) => {
        this.total = json.data.recordsTotal;
        this.items = json.data.data.map((item) => {
          item.mobile = XnUtils.cyptPhone(item.mobile);
          return item;
        });
      });
  }

  /**
   * 跳转到新版用户管理
   */
  navToNew() {
    this.xn.router.navigate(['/console/manage/user-manage-relate-right']);
  }

  isAdmin(userRoleList) {
    if (!userRoleList || userRoleList.length <= 0) {
      return false;
    }
    return userRoleList.map((v) => v.roleId).indexOf('admin') >= 0;
  }

  checkLogin(event, id) {
    const checkbox = event.target;
    const checked = checkbox.checked;
    const checkedNumber = checked ? 1 : 0;

    this.goCheck(id, checkedNumber);
  }

  goCheck(id: number, checkedNumber: number) {
    this.xn.api
      .post('/useroperate/set_sms', {
        userId: id,
        isSms: checkedNumber,
      })
      .subscribe((json) => {});
  }

  getPowerList(item: any) {
    this.xn.api
      .post('/power/list', {
        userId: item.userId,
      })
      .subscribe((json) => {
        const Data = json.data;
        Data.userId = item.userId;
        this.getPower(Data);
      });
  }

  onViewAdd(items: any) {
    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      UserAddModalComponent,
      items
    ).subscribe((v) => {
      this.items.push(v);
      this.onPage(1);
    });
  }

  onViewEdit(item: any) {
    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      UserEditModalComponent,
      item
    ).subscribe((v) => {
      this.items.toString();
      this.onPage(1);
    });
  }

  onViewDelete(item: any) {
    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      UserDeleteModalComponent,
      item
    ).subscribe((v) => {
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
        title: '用户姓名',
        checkerId: 'orgName',
        options: { readonly: true },
        value: item.userName,
      },
      {
        title: '证件号码',
        checkerId: 'cardNo',
        options: { readonly: true },
        value: item.cardNo,
      },
      {
        title: '手机号',
        checkerId: 'mobile',
        options: { readonly: true },
        value: item.mobile,
      },
      {
        title: '邮箱',
        checkerId: 'email',
        options: { readonly: true },
        value: item.email,
      },
    ];
    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      AdminMoveModalComponent,
      checker
    ).subscribe((v) => {
      if (v && v.action === 'ok') {
        this.xn.api
          .post('/useroperate/admin_transfer', { userId: item.userId })
          .subscribe((json) => {
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
    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      PowerEditModalComponent,
      item
    ).subscribe((v) => {
      this.items.toString();
    });
  }
}
