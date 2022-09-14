/*************************************************************************
 * Copyright (c) 2017 - 2020 深圳市链融科技股份有限公司
 * Shenzhen Lianrong Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：xn-lr-web\apps\src\app\pages\portal\block-chain-browser\_components\finance-info-card.component.ts
 * @summary：init finance-info-card.component.ts
 * @version: 1.0
 * *************************************************************************
 * revision             author            reason             date
 * 1.0                  zigui              init             2021-12-21
 ***************************************************************************/
 import { Component, Input } from '@angular/core';

 @Component({
   selector: 'guarantee-info-card',
   template: `
     <nz-card nzTitle="保函信息" class="finance-info-card">
       <div class="item-block">
         <div>申请单编号</div>
         <div>
           <span>{{data.applyNo}}</span>
         </div>
       </div>
       <div class="item-block">
         <div>投标人</div>
         <div>
           <span>{{data.bidderAppName}}</span>
         </div>
       </div>
       <div class="item-block">
         <div>招标项目名称</div>
         <div>
           <span>{{data.biddingProjectName}}</span>
         </div>
       </div>
       <div class="item-block">
         <div>招标项目编号</div>
         <div>
           <span>{{data.biddingProjectNo}}</span>
         </div>
       </div>
       <div class="item-block">
         <div>出函日期</div>
         <div>
           <span>{{data.letterDate}}</span>
         </div>
       </div>
       <div class="item-block">
         <div>产品名称</div>
         <div>
           <span>{{data.productName}}</span>
         </div>
       </div>
       <div class="item-block">
        <div>保函文件</div>
        <div *ngIf="data.certificateFile && data.certificateFile.length">
          <span *ngFor="let item of data.certificateFile">{{item.fileName}}</span>
        </div>
      </div>
     </nz-card>
   `,
   styleUrls: ['../detail/detail.component.less'],
 })
 export class GuaranteeInfoCardComponent {
   @Input() data: any = {};
 }
 