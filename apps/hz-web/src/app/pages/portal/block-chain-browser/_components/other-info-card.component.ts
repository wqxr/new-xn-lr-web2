/*************************************************************************
 * Copyright (c) 2017 - 2020 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：xn-lr-web\apps\src\app\pages\portal\block-chain-browser\_components\other-info-card.component.ts
 * @summary：init other-info-card.component.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  zigui              init             2020-11-11
 ***************************************************************************/
import { Component, Input } from '@angular/core';

@Component({
  selector: 'other-info-card',
  template: `
    <nz-card nzTitle="其他信息" class="other-info-card">
      <div class="item-block">
        <div>资质证书</div>
        <div *ngIf="data.certificateFile && data.certificateFile.length">
          <span *ngFor="let item of data.certificateFile">{{item.fileName}}</span>
        </div>
      </div>
      <div class="item-block">
        <div>履约证明</div>
        <div *ngIf="data.performanceFile && data.performanceFile.length">
          <span *ngFor="let item of data.performanceFile">{{item.fileName}}</span>
        </div>
      </div>
      <div class="item-block">
        <div>供应商其他文件</div>
        <div *ngIf="data.otherFile && data.otherFile.length">
          <span *ngFor="let item of data.otherFile">{{item.fileName}}</span>
        </div>
      </div>
      <div class="item-block">
        <div>保理商其他文件</div>
        <div *ngIf="data.factoringOtherFiles && data.factoringOtherFiles.length">
          <span *ngFor="let item of data.factoringOtherFiles">{{item.fileName}}</span>
        </div>
      </div>
    </nz-card>
  `,
  styleUrls: ['../detail/detail.component.less'],
})
export class OtherInfoCardComponent {
  @Input() data: any = {
    certificateFile: [],
    performanceFile: [],
    otherFile: [],
    factoringOtherFiles: [],
  };
}
