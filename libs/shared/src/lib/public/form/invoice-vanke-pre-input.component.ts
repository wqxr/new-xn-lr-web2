/*
 * Copyright(c) 2017-2019, 深圳市链融科技股份有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：contract-input.component.ts
 * @summary：保理提单发票上传状态 XnInputComponent  type='pre-invoice' 发票指引
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 zhyuanan          添加注释         2019-04-29
 * **********************************************************************
 */

import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormGroup} from '@angular/forms';
import {XnUtils} from '../../common/xn-utils';
import {InvoiceUploadService} from '../../services/invoice-upload.service';

@Component({
    selector: 'app-invoice-vanke-pre-input',
    templateUrl: './invoice-vanke-pre-input.component.html',
    styles: [`
        table {
            table-layout: fixed;
            margin: 0;
        }

        table tr td:first-child {
            width: 300px;
        }

        .scroll-height {
            max-height: 300px;
            overflow-y: auto;
        }

        .scroll-height > table {
            border-bottom: none;
            border-top: none;
        }

        .scroll-height > table tr:first-child td {
            border-top: 0;
        }

        .scroll-height > table tr:last-child td {
            border-bottom: 0;
        }
    `]
})
export class InvoiceVankePreInputComponent implements OnInit {
    @Input() row: any;
    @Input() form: FormGroup;
    public items: any;
    private ctrl: AbstractControl;

    public constructor(private invoiceUpload: InvoiceUploadService) {
        this.invoiceUpload.change.subscribe(x => {
            this.items.list.forEach(ele => {
                if (ele.invoiceNum && ele.invoiceNum === x.value.trim()) {
                    ele.status = x.change;
                }
            });
            this.ctrl.setValue(JSON.stringify(this.items));
        });
    }

    public ngOnInit() {
        this.ctrl = this.form.get(this.row.name);
        this.items = XnUtils.parseObject(this.ctrl.value, []);
    }
}
