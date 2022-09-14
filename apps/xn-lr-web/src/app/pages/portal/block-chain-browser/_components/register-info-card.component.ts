/*************************************************************************
 * Copyright (c) 2017 - 2020 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：xn-lr-web\apps\src\app\pages\portal\block-chain-browser\_components\register-info-card.component.ts
 * @summary：init register-info-card.component.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  zigui              init             2020-11-11
 ***************************************************************************/
import { Component, Input } from '@angular/core';

@Component({
  selector: 'register-info-card',
  template: `
    <nz-card nzTitle="中登信息" class="register-info-card">
      <div class="item-block">
        <div>登记编号</div>
        <div>
          <span>{{data.registrationId}}</span>
        </div>
      </div>
      <div class="item-block">
        <div>修改密码</div>
        <div>
          <span>{{data.modificationCode}}</span>
        </div>
      </div>
      <div class="item-block">
        <div>更正登记描述</div>
        <div>
          <span>{{data.updateRegistrationDesc}}</span>
        </div>
      </div>
      <div class="item-block">
        <div>查询证明文件</div>
        <div *ngIf="data.checkCertFile && data.checkCertFile.length">
          <span *ngFor="let item of data.checkCertFile">{{item.fileName}}</span>
        </div>
      </div>
      <div class="item-block">
        <div>登记证明文件</div>
        <div *ngIf="data.registerCertFile && data.registerCertFile.length">
          <span *ngFor="let item of data.registerCertFile">{{item.fileName}}</span>
        </div>
      </div>
    </nz-card>
  `,
  styleUrls: ['../detail/detail.component.less'],
})
export class RegisterInfoCardComponent {
  @Input() data: any = {};
}
