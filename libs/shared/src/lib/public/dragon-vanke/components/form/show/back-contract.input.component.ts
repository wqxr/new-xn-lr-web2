/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：profit-table-input.component.ts
 * @summary：龙光供应商上传资料复核交易合同控件
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 wangqing            增加             2019-08-29
 * **********************************************************************
 */

import { Component, OnInit, Input, ElementRef, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicForm } from '../../../../../common/dynamic-form/dynamic.decorators';
import { XnService } from '../../../../../services/xn.service';




@Component({
    selector: 'dragon-contract-show',
    template: `
  <table class="table table-bordered text-center" style='float:left'>
  <thead>
    <tr class="table-head" *ngFor='let item of items;let i=index'>

      <th>{{item.label}}</th>
      <th>
      <app-dynamic-show [row]="item" [form]="form" [svrConfig]="svrConfig" [formModule]="fromModule">
      </app-dynamic-show></th>

  </thead>

  <tbody>
  </tbody>
</table>
    `,
    styles: [
        `
            .button-reset-style {
                font-size: 12px;
                padding: 5px 35px;
                color: #3c8dbc;
            }

            .tip-memo {
                color: #9A9A9A;
            }
            .tag-color {
                color: #f20000;;
            }
        `
    ]
})
@DynamicForm({ type: 'contractList', formModule: 'dragon-show' })
export class VankeContractbackUploadshowComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;
    @Input() svrConfig: any;
    public items: any[] = [];
    fromModule = 'dragon-show';

    // public amountAll: number;// 合同总金额
    constructor(private xn: XnService,
                private vcr: ViewContainerRef,
                private cdr: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.items = JSON.parse(this.row.data);
        this.items.forEach((x, index) => {
            x.checkerId = 'file' + index;
            x.name = x.name;
            x.type = 'mfile-info';
            x.title = x.name;
            x.data = x.file;
            x.label = x.name;
            x.options = '{"filename": "交易合同","fileext": "jpg, jpeg, png, pdf", "picSize": "500"}';
            // XnFormUtils.convertChecker(x);
        },
        );
        // console.info('file==>', this.items);
    }
}
