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

import { Component, OnInit, Input, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { DynamicForm } from '../../../../../common/dynamic-form/dynamic.decorators';
import { XnFormUtils } from '../../../../../common/xn-form-utils';




@Component({
    selector: 'dragon-contract-show',
    template: `
  <table class="table table-bordered text-center" style='float:left'>
  <thead>
    <tr class="table-head" *ngFor='let item of items;let i=index'>

      <th>{{item.label}}</th>
      <th>
      <app-dynamic-input [row]="item" [form]="mainForm" [svrConfig]="svrConfig" [formModule]="fromModule">
      </app-dynamic-input></th>

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
@DynamicForm({ type: 'contractList', formModule: 'dragon-input' })
export class VankeContractbackUploadComponent implements OnInit {

    @Input() row: any;
    @Input() form: FormGroup;
    @Input() svrConfig: any;
    public ctrl: AbstractControl;
    mainForm: FormGroup;
    public items: any[] = [];
    public newtiems: any[] = [];
    public Tabconfig: any;
    fromModule = 'default-input';

    // public amountAll: number;// 合同总金额
    constructor() {
    }

    ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        //  XnFormUtils.convertChecker(this.fileUpload[0]);
        this.items = JSON.parse(this.row.value);
        this.newtiems = JSON.parse(this.row.value);
        this.validFile(this.newtiems)
        this.items.forEach((x, index) => {
            x.checkerId = 'file' + index;
            x.name = x.name;
            x.type = 'dragonMfile';
            x.title = x.name;
            x.value = x.file;
            x.label = x.name;
            x.options = '{"filename": "交易合同","fileext": "jpg, jpeg, png, pdf", "picSize": "500"}';
            // XnFormUtils.convertChecker(x);
        },
        );
        XnFormUtils.buildSelectOptions(this.items);
        this.buildChecker(this.items);
        this.mainForm = XnFormUtils.buildFormGroup(this.items);
        this.mainForm.valueChanges.subscribe(x => {

            this.newtiems.forEach((y, index) => {
                y.file = x['file' + index];
            });
            this.validFile(this.newtiems)

        });
    }

    private buildChecker(stepRows) {
        for (const row of stepRows) {
            XnFormUtils.convertChecker(row);
        }
    }

    // 校验文件是否已上传
    private validFile(fileList: any[]) {
        if (fileList.some(x => x.file === '')) {
            this.ctrl.setValue('')
        } else {
            this.ctrl.setValue(JSON.stringify(this.newtiems));
        }
    }

}
