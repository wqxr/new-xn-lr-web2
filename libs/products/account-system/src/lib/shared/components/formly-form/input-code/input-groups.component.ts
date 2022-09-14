/*************************************************************************
 * Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：libs\products\account-system\src\lib\shared\components\formly-form\input-groups.type.ts
 * @summary：获取验证码输入框
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                HuCongying           init           2021-11-10
 ***************************************************************************/
import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { RetCodeEnum } from 'libs/shared/src/lib/config/enum';
import { XnService } from 'libs/shared/src/lib/services/xn.service';
import { MinUtils } from '../../../utils';

@Component({
  selector: 'xn-formly-field-input-code',
  template: `
    <nz-input-group nzSearch [nzAddOnAfter]="suffixButton">
      <input
        nz-input
        nzSearch
        nzSize="default"
        [formControl]="formControl"
        [type]="to.type || 'text'"
        [disabled]="to.readonly"
        [formlyAttributes]="field"
      />
    </nz-input-group>
    <div *ngIf="to.mobile">
      验证码将会发到手机号：{{ getHideMobile() }}上，请及时查收！
    </div>

    <ng-template #suffixButton>
      <button
        style="margin-top:-1px;"
        nz-button
        nzType="primary"
        [disabled]="to.disabledCode || to.readonly"
        nzSearch
        (click)="onAddOnAfterClick($event)"
      >
        {{ to.codeBtnText }}
      </button>
    </ng-template>
  `,
  styles: [
    `
      .suffix {
        cursor: pointer;
      }
      .suffix:hover {
        color: blue;
      }
      ::ng-deep .ant-input-group-addon {
        padding: 0;
        border: none;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputCodeComponent extends FieldType implements OnInit {
  defaultOptions = {
    templateOptions: {
      disabledCode: false,
      codeBtnText: '获取验证码',
      mobile: '',
      readonly: false
    },
  };
  timer = null;
  hideMobile = '';

  constructor(
    private xn: XnService,
    private cdr: ChangeDetectorRef) {
    super();
  }

  ngOnInit() {
    if (this.timer) {
      this.to.disabledCode = false;
      this.to.codeBtnText = '获取验证码';
      clearInterval(this.timer);
    }
  }

  getHideMobile() {
    return MinUtils.formatMobile(this.to.mobile);
  }

  onAddOnAfterClick(event: MouseEvent) {
    event.preventDefault();
    if (this.to.onAddOnAfterClick) {
      this.to.onAddOnAfterClick();
    } else {
      const mobile = this.to.mobile;
      if (mobile) {
        let codeTime = 60;
        this.timer = null;
        this.timer = setInterval(() => {
          --codeTime;
          if (codeTime < 0) {
            codeTime = 60;
            this.to.disabledCode = false;
            this.to.codeBtnText = '获取验证码';
            clearInterval(this.timer);
            this.timer = null;
          } else {
            this.to.disabledCode = true;
            this.to.codeBtnText = `${codeTime}s后可重发`;
          }
          this.cdr.markForCheck();
        }, 1000);
        this.xn.middle
          .post2('/account/sms/code', { mobile })
          .subscribe((res: any) => {
            if (res.code !== RetCodeEnum.OK) {
              this.to.disabledCode = false;
              this.to.codeBtnText = '获取验证码';
              clearInterval(this.timer);
              this.cdr.markForCheck();
            }
          });
      }
    }
  }
}
