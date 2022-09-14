/*************************************************************************
* Copyright (c) 2017 - 2021 深圳市链融科技股份有限公司
* Shenzhen Lianrong Technology Co., Ltd.
* All rights reserved.
*
* @file：libs\products\bank-shanghai\src\lib\share\components\form\show\puhui\video-upload-show.component.ts
* @summary：上传视频组件的show展示
* @version: 1.0
* *************************************************************************
* revision             author            reason             date
* 1.0                 hucongying           init          2021-07-14
***************************************************************************/

import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from 'libs/shared/src/lib/common/dynamic-form/dynamic.decorators';
import { XnModalUtils } from 'libs/shared/src/lib/common/xn-modal-utils';
import { DragonMfilesViewModalComponent } from 'libs/shared/src/lib/public/dragon-vanke/modal/mfiles-view-modal.component';
import { XnService } from 'libs/shared/src/lib/services/xn.service';


@Component({
  template: `
    <div class="form-control xn-input-font xn-input-border-radius" style='height:auto;min-height:34px'>
      <div *ngFor="let item of items" class="label-line">
        <ng-container>
          <a class="xn-click-a" (click)="onView(item)">{{item.fileName}}</a>
        </ng-container>
      </div>
    </div>
    `,
  styleUrls: []
})
@DynamicForm({ type: 'video-file-input', formModule: 'dragon-show' })
export class DragonVideoFileShowComponent implements OnInit {
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
      this.items = JSON.parse(data);
    }
  }

  /**
   *  查看文件
   * @param paramFile
   */
  public onView(paramFile: any): void {
    XnModalUtils.openInViewContainer(
      this.xn,
      this.vcr,
      DragonMfilesViewModalComponent,
      [paramFile]
    ).subscribe(() => { });
  }
}
