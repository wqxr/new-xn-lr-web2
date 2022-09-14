/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\shared\src\lib\public\dragon-vanke\components\form\show\dragon-new-file-show.component.ts
* @summary：nzfile-upload组件的show展示
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                 hucongying           init          2021-07-29
***************************************************************************/

import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { DragonMfilesViewModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/mfiles-view-modal.component';
import { DragonPdfSignModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/pdf-sign-modal.component';
import { XnService } from 'libs/shared/src/lib/services/xn.service';


@Component({
  template: `
    <div class="form-control xn-input-font xn-input-border-radius" style='height:auto;min-height:34px'>
      <div *ngFor="let item of items" class="label-line">
        <ng-container *ngIf="!item.secret">
          <a class="xn-click-a" (click)="onView(item)">{{item.fileName}}</a>
        </ng-container>
        <ng-container *ngIf="!!item.secret">
          <a class="xn-click-a" (click)="showContract(item)">{{item.label}}</a>
        </ng-container>
      </div>
    </div>
    `,
  styleUrls: []
})
@DynamicForm({ type: 'nzfile-upload', formModule: 'dragon-show' })
export class DragonNzFileUploadShowComponent implements OnInit {
  @Input() row: any;
  @Input() form: FormGroup;
  @Input() svrConfig: any;
  public items: any[] = [];

  constructor(
    private xn: XnService,
    private vcr: ViewContainerRef) {
  }

  ngOnInit() {
    const data = this.row.data;
    if (data !== '') {
      this.items.push(JSON.parse(data));
    }
  }

  /**
   *  查看文件
   * @param paramFile
   */
  public onView(paramFile: any): void {
    XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonMfilesViewModalComponent, [paramFile]).subscribe();
  }

  /**
   *  查看合同
   * @param paramContract
   */
  public showContract(paramContract: any) {
    const params = Object.assign({}, paramContract, { readonly: true });
    XnModalUtils.openInViewContainer(this.xn, this.vcr, DragonPdfSignModalComponent, params).subscribe();
  }
}
