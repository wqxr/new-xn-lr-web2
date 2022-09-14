/*************************************************************************
 * Copyright (c) 2017 - 2020 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：xn-factoring-cloud-web\apps\src\app\layout\basic-layout\components\avatar-dropdown\avatar-dropdown.component.ts
 * @summary：init avatar-dropdown.component.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  WuShenghui        init             2020-08-20
 ***************************************************************************/
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { AuditorOptions, Option } from 'libs/shared/src/lib/config/select-options';
import { UserInfo } from '../../../models/enums/user-info';
@Component({
  selector: 'avatar-dropdown',
  templateUrl: 'avatar-dropdown.component.html',
  styleUrls: ['./avatar-dropdown.less'],
})
export class AvatarDropdownComponent implements OnInit {
  @Input() className: any = 'action';
  @Input() menu = true;
  @Input() type: string;

  userInfo: UserInfo;
  roles: string[] = [];

  private _orgType = -1;

  get orgType() {
    this._orgType = this.xn.user.orgType;
    return this._orgType;
  }

  get isPlatform() {
    return (
      this.xn.user.orgType === 99
    );
  }

  get isFactoring() {
    return this.xn.user.orgType === 3;
  }

  constructor(
    private cdf: ChangeDetectorRef,
    private router: Router,
    public xn: XnService,
  ) { }

  ngOnInit() {
    this.roles = AuditorOptions.reduce((prev: string[], curr: Option) => {
      if (this.xn.user.roles && this.xn.user.roles.includes(`${curr.value}`)) {
        prev.push(curr.label);
      }
      return prev;
    }, []);
  }

  profile() {
    this.router.navigate(['console/record/info']);
  }

  logout() {
    this.xn.api.post('/user/logout', {}).subscribe();
    this.xn.user.logout();
    window.localStorage.clear();
    window.sessionStorage.clear();
  }
}
